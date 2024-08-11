import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./index/index.component').then(m => m.IndexComponent),
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user.routes').then(m => m.routes),
  },
  {
    path: 'credential',
    loadComponent: () => import('./credential/credential.component').then(m => m.CredentialComponent),
  },
];
