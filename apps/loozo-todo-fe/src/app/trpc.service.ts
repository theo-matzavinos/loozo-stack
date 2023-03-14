import { InjectionToken } from '@angular/core';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';

export const TRPC_SERVICE = new InjectionToken('TRPC Service', {
  providedIn: 'root',
  factory() {
    return createTRPCProxyClient<import('be').AppRouter>({
      links: [
        httpBatchLink({
          url: 'http://localhost:3000/trpc',
          fetch(url, options) {
            return fetch(url, {
              ...options,
              credentials: 'include',
            });
          },
        }),
      ],
    });
  },
});
