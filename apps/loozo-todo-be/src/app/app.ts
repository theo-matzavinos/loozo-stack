import fastify from 'fastify';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import { createContext } from './context';
import { appRouter } from './router';

const server = fastify({
  maxParamLength: 5000,
});

await server.register(cors, {
  credentials: true,
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST'],
});

await server.register(cookie, {
  secret: 'my-secret',
  hook: 'onRequest',
  parseOptions: {},
});

server.register(fastifyTRPCPlugin, {
  prefix: '/trpc',
  trpcOptions: { router: appRouter, createContext },
});

export default server;
