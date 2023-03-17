import { inject, InjectionToken } from '@angular/core';
import { UseQuery } from '@ngneat/query';
import { from } from 'rxjs';
import { TRPC_SERVICE } from './trpc.service';

export const ACCOUNT_QUERY = new InjectionToken('Account Query', {
  providedIn: 'root',
  factory() {
    const useQuery = inject(UseQuery);
    const trpcService = inject(TRPC_SERVICE);

    return useQuery(
      ['account'],
      () => {
        return from(trpcService.getAccount.query());
      },
      { refetchOnWindowFocus: false },
    );
  },
});
