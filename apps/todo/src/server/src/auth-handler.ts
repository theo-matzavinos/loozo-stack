import { Auth } from '@auth/core';
import CredentialsProvider from '@auth/core/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { Adapter } from '@auth/core/adapters';
import * as z from 'zod';
import { prisma } from './prisma-client';
import { Session } from '@auth/core/types';
import { Response } from 'undici';

const credentialsValidator = z.object({
  username: z.string().email(),
  password: z.string(),
});

export async function handleAuthRequest(request: Request) {
  return (await Auth(request, {
    trustHost: true,
    secret: process.env['AUTH_SECRET'],
    adapter: PrismaAdapter(prisma) as Adapter,
    session: {
      strategy: 'jwt',
    },
    providers: [
      CredentialsProvider({
        name: 'Credentials',
        credentials: {
          username: { label: 'Username', type: 'text', placeholder: 'email' },
          password: { label: 'Password', type: 'password' },
        },
        async authorize(credentials) {
          try {
            const parsedCredentials = credentialsValidator.parse(credentials);
            const user = await prisma.user.findFirst({
              where: {
                email: parsedCredentials.username,
                password: parsedCredentials.password,
              },
            });

            if (!user) {
              return null;
            }

            return user;
          } catch {
            return null;
          }
        },
      }),
    ],
  })) as Response;
}

export type GetSessionResult = Promise<Session | null>;

export async function getSession(req: Request): GetSessionResult {
  const url = new URL('/api/auth/session', req.url);
  const response = await handleAuthRequest(
    new Request(url, { headers: req.headers }),
  );

  const { status = 200 } = response;

  const data = (await response.json()) as Session | Error | null;

  if (!data || !Object.keys(data).length) {
    return null;
  }

  if (status === 200) {
    return data as Session | null;
  }

  throw new Error((data as Error).message);
}
