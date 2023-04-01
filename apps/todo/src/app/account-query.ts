import { inject, InjectionToken } from '@angular/core';
import { UseQuery } from '@ngneat/query';
import { from } from 'rxjs';
import { injectTrpcClient } from './trpc-client';

export const ACCOUNT_QUERY = new InjectionToken('Account Query', {
  providedIn: 'root',
  factory() {
    const useQuery = inject(UseQuery);
    const trpcService = injectTrpcClient();

    return useQuery(
      ['account'],
      () => {
        return from(trpcService.getAccount.query());
      },
      { refetchOnWindowFocus: false },
    );
  },
});
