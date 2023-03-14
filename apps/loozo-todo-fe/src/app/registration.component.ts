import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TRPC_SERVICE } from './trpc.service';
import { Router } from '@angular/router';

@Component({
  selector: 'loozo-stack-registration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `<form class="flex flex-col gap-y-4" (ngSubmit)="onSubmit()">
    <label class="flex gap-x-2"
      >email<input type="email" name="email" [(ngModel)]="email"
    /></label>
    <label class="flex gap-x-2"
      >password<input type="password" name="password" [(ngModel)]="password"
    /></label>
    <button class="border border-black px-2 mr-auto">Register</button>
  </form>`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RegistrationComponent {
  email = '';
  password = '';

  private readonly trpcService = inject(TRPC_SERVICE);
  private readonly router = inject(Router);

  async onSubmit() {
    await this.trpcService.register.mutate({
      email: this.email,
      name: 'whatever',
      password: this.password,
    });
    this.router.navigate(['/', 'login']);
  }
}
