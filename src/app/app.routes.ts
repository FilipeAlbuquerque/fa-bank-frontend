import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./features/dashboard/overview/overview.component').then((m) => m.OverviewComponent),
      },
      {
        path: 'accounts',
        loadComponent: () =>
          import('./features/dashboard/accounts/accounts.component').then((m) => m.AccountsComponent),
      },
      {
        path: 'accounts/:accountNumber',
        loadComponent: () =>
          import('./features/dashboard/accounts/detail/account-detail.component').then((m) => m.AccountDetailComponent),
      },
      {
        path: 'admin',
        canActivate: [roleGuard(['ROLE_ADMIN'])],
        loadComponent: () =>
          import('./features/dashboard/admin/admin.component').then((m) => m.AdminComponent),
      },
      {
        path: 'transfer',
        loadComponent: () =>
          import('./features/dashboard/transfer/transfer.component').then((m) => m.TransferComponent),
      },
      // Future child routes:
      // { path: 'profile', ... }
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
