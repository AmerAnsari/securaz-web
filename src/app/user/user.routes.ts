import { Routes } from '@angular/router';
import { UserComponent } from '@app/user/user.component';

export const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      {
        path: 'sign-in',
        loadComponent: () => import('./sign-in/sign-in.component').then(m => m.SignInComponent),
      },
      {
        path: 'sign-up',
        loadComponent: () => import('./sign-up/sign-up.component').then(m => m.SignUpComponent),
      },
      {
        path: '**',
        pathMatch: 'full',
        redirectTo: 'sign-in',
      },
    ],
  },
];
