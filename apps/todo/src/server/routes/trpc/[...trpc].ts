import { defineEventHandler } from 'h3';
import { inferAsyncReturnType, initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { createHTTPHandler } from '@trpc/server/adapters/standalone';
import { getSession } from '../../src/auth-handler';
import { IncomingMessage, ServerResponse } from 'http';
import { createRequest } from '../../src/fetch';

export async function createContext({
  req,
  res,
}: {
  req: IncomingMessage;
  res: ServerResponse;
}) {
  const session = await getSession(createRequest(req));
  console.log(session);
  if (!session?.user?.email) {
    return { req, res, session };
  }

  const user =
    (await prisma.user.findFirst({
      where: { email: session.user?.email },
    })) || undefined;

  return { req, res, session, user };
}

export type Context = inferAsyncReturnType<typeof createContext>;

const prisma = new PrismaClient();

export const t = initTRPC.context<Context>().create();

const publicProcedure = t.procedure;
const protectedProcedure = t.procedure.use(
  t.middleware(({ ctx, next }) => {
    if (!ctx.user) {
      throw new TRPCError({
        message: 'You shall not pass.',
        code: 'UNAUTHORIZED',
      });
    }

    return next({ ctx });
  }),
);

const appRouter = t.router({
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(5),
        name: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      return await prisma.user.create({ data: input });
    }),
  getAccount: protectedProcedure.query(({ ctx }) => ctx.user),
  getTodos: protectedProcedure.query(({ ctx }) =>
    prisma.toDo.findMany({ where: { userId: ctx.user?.id } }),
  ),
  addTodo: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        isDone: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await prisma.toDo.create({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        data: { ...input, userId: ctx.user!.id },
      });
    }),
  deleteTodo: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const { count } = await prisma.toDo.deleteMany({
        where: { id: input, userId: ctx.user?.id },
      });

      if (!count) {
        throw new TRPCError({
          message: 'Maybe it was deleted already?',
          code: 'NOT_FOUND',
        });
      }

      return;
    }),
  toggleTodo: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const todo = await prisma.toDo.findFirst({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        where: { id: input, userId: ctx.user!.id },
      });

      if (!todo) {
        throw new TRPCError({
          message: `This is not the ToDo you're looking for.`,
          code: 'NOT_FOUND',
        });
      }

      todo.isDone = !todo.isDone;

      return await prisma.toDo.update({ where: { id: todo.id }, data: todo });
    }),
});

const httpHandler = createHTTPHandler({
  router: appRouter,
  createContext,
});

export default defineEventHandler((e) => {
  e.node.req.url = e.node.req.url?.replace('trpc/', '');

  return httpHandler(e.node.req, e.node.res);
});

// export type definition of API
export type AppRouter = typeof appRouter;
