import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonDirective } from '@loozo-stack/shared/button';
import { injectTrpcClient } from '../trpc-client';

@Component({
  selector: 'loozo-stack-registration',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form class="flex flex-col gap-y-4" (ngSubmit)="onSubmit()">
      <label class="flex gap-x-2"
        >email<input type="email" name="email" [(ngModel)]="email"
      /></label>
      <label class="flex gap-x-2"
        >password<input type="password" name="password" [(ngModel)]="password"
      /></label>
      <button class="mr-auto border border-black px-2">Register</button>
    </form>
  `,
})
export default class RegistrationComponent {
  email = '';
  password = '';

  private trpcService = injectTrpcClient();

  async onSubmit() {
    await this.trpcService.register.mutate({
      email: this.email,
      name: 'whatever',
      password: this.password,
    });
    window.location.href = '/api/auth/signin';
  }
}
