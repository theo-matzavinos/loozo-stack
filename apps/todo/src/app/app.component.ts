import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LetModule } from '@rx-angular/template/let';
import { ACCOUNT_QUERY } from './account-query';

@Component({
  standalone: true,
  selector: 'loozo-stack-root',
  imports: [RouterOutlet, LetModule, NgIf],
  template: `
    <div class="flex h-screen w-screen flex-col overflow-hidden">
      <div class="flex h-12 items-center bg-slate-900 p-4 text-white">
        <div class="ml-auto">
          <ng-container *rxLet="accountQuery.result$ as accountQueryResult">
            <ng-container
              *ngIf="
                accountQueryResult.isSuccess;
                then usernameTemplate;
                else loginTemplate
              "
            ></ng-container>
            <ng-template #usernameTemplate>
              {{ accountQueryResult.data?.name }}
            </ng-template>
            <ng-template #loginTemplate>
              <a href="/api/auth/signin">Login</a>
            </ng-template>
          </ng-container>
        </div>
      </div>
      <div class="flex flex-grow overflow-hidden p-4">
        <router-outlet />
      </div>
    </div>
  `,
})
export class AppComponent {
  accountQuery = inject(ACCOUNT_QUERY);
}
