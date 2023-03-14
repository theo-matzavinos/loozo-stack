// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../../node_modules/@fastify/cookie/types/plugin.d.ts" />

import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const t = initTRPC.context<import('./context').Context>().create();

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

export const appRouter = t.router({
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = await prisma.user.findFirst({
        where: { email: input.email, password: input.password },
      });

      if (!user) {
        throw new TRPCError({
          message: `Identify yourself!`,
          code: 'UNAUTHORIZED',
        });
      }

      ctx.res.setCookie('auth', `${user.id}`, {
        expires: new Date(new Date().setFullYear(2050)),
        path: '/',
        domain: 'localhost',
        sameSite: 'lax',
        httpOnly: true,
      });

      return user;
    }),
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
  getTodos: protectedProcedure.query(({ ctx }) =>
    prisma.toDo.findMany({ where: { userId: ctx.user.id } }),
  ),
  addTodo: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        isDone: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await prisma.toDo.create({
        data: { ...input, userId: ctx.user.id },
      });
    }),
  toggleTodo: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      const todo = await prisma.toDo.findFirst({
        where: { id: input, userId: ctx.user.id },
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

// export type definition of API
export type AppRouter = typeof appRouter;
