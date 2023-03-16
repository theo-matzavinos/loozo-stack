import { InjectionToken } from '@angular/core';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';

export const TRPC_SERVICE = new InjectionToken('TRPC Service', {
  providedIn: 'root',
  factory() {
    return createTRPCProxyClient<import('../server').AppRouter>({
      links: [
        httpBatchLink({
          url: '/api/trpc',
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
