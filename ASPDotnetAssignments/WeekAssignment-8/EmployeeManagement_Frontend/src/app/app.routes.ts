import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login',           loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'register',        loadComponent: () => import('./components/auth/register/register.component').then(m => m.RegisterComponent) },
  { path: 'forgot-password', loadComponent: () => import('./components/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent) },
  { path: 'admin', canActivate: [roleGuard(['Admin'])], children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./components/admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'employees',  loadComponent: () => import('./components/admin/employees/admin-employees.component').then(m => m.AdminEmployeesComponent) },
      { path: 'users',      loadComponent: () => import('./components/admin/users/admin-users.component').then(m => m.AdminUsersComponent) }
  ]},
  { path: 'manager', canActivate: [roleGuard(['Admin','Manager'])], children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./components/manager/dashboard/manager-dashboard.component').then(m => m.ManagerDashboardComponent) },
      { path: 'employees',  loadComponent: () => import('./components/manager/employees/manager-employees.component').then(m => m.ManagerEmployeesComponent) }
  ]},
  { path: 'employee', canActivate: [authGuard], children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./components/employee/dashboard/employee-dashboard.component').then(m => m.EmployeeDashboardComponent) }
  ]},
  { path: 'access-denied', loadComponent: () => import('./components/shared/access-denied/access-denied.component').then(m => m.AccessDeniedComponent) },
  { path: '**',             loadComponent: () => import('./components/shared/not-found/not-found.component').then(m => m.NotFoundComponent) }
];
