import { injectTrpcClient as genericInjectTrpcClient } from './trpc-angular';

export const injectTrpcClient = genericInjectTrpcClient<
  import('../server').AppRouter
>;
