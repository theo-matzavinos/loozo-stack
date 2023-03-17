import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { PushModule } from '@rx-angular/template/push';
import { map } from 'rxjs';
import { ACCOUNT_QUERY } from '../account-query';

@Component({
  selector: 'loozo-stack-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, NgIf, PushModule],
  template: `
    <h1 class="text-xl font-bold">ToDos Home</h1>
    <a *ngIf="isLoggedIn$ | push" [routerLink]="['/', 'todos']">ToDos</a>
  `,
})
export default class HomeComponent {
  isLoggedIn$ = inject(ACCOUNT_QUERY).result$.pipe(
    map((result) => result.isSuccess),
  );
}
