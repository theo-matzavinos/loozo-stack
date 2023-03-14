import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter([
      {
        path: 'auth',
        children: [
          {
            path: 'login',
            loadComponent: () => import('./app/login.component'),
          },
          {
            path: 'registration',
            loadComponent: () => import('./app/registration.component'),
          },
        ],
      },
      {
        path: 'todos',
        loadComponent: () => import('./app/todos.component'),
      },
      {
        path: '**',
        redirectTo: 'auth/login',
      },
    ]),
  ],
}).catch((err) => console.error(err));
