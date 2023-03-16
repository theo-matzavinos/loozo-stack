import { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

export const routeMeta: RouteMeta = {
  canActivate: [
    async () => {
      const sessionResponse = await fetch('/api/auth/session');

      if (sessionResponse.ok) {
        const session = await sessionResponse.json();

        if (Object.keys(session).length) {
          return true;
        }
      }

      location.href = '/api/auth/signin';

      return false;
    },
  ],
};

@Component({
  selector: 'loozo-stack-todos',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <h2>ToDos</h2>

    <router-outlet />
  `,
})
export default class ToDosComponent {}
