import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TRPC_SERVICE } from './trpc.service';
import { Router } from '@angular/router';

@Component({
  selector: 'loozo-stack-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `<form class="flex flex-col gap-y-4" (ngSubmit)="onSubmit()">
    <label class="flex gap-x-2"
      >email<input type="email" name="email" [(ngModel)]="email"
    /></label>
    <label class="flex gap-x-2"
      >password<input type="password" name="password" [(ngModel)]="password"
    /></label>
    <button class="border border-black px-2 mr-auto">Login</button>
  </form>`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LoginComponent {
  email = '';
  password = '';

  private readonly trpcService = inject(TRPC_SERVICE);
  private readonly router = inject(Router);

  async onSubmit() {
    await this.trpcService.login.mutate({
      email: this.email,
      password: this.password,
    });
    this.router.navigate(['/', 'todos']);
  }
}
