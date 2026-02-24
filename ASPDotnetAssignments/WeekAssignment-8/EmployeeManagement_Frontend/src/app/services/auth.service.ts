import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthUser } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private baseUrl = 'https://localhost:50090/api';

  currentUser = signal<AuthUser | null>(this.loadUser());

  constructor(private http: HttpClient, private router: Router) {}

  // =========================
  // AUTH APIs
  // =========================

  login(data: { username: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/Auth/login`, data).pipe(
      tap(res => {
        if (res.success) {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('user', JSON.stringify(res.data));
          this.currentUser.set(res.data);
        }
      })
    );
  }

  register(data: { username: string; email: string; fullName: string; password: string; role: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/Auth/register`, data).pipe(
      tap(res => {
        if (res.success) {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('user', JSON.stringify(res.data));
          this.currentUser.set(res.data);
        }
      })
    );
  }

  forgotPassword(data: { email: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/Auth/forgot-password`, data);
  }

  resetPassword(data: { token: string; email: string; newPassword: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/Auth/reset-password`, data);
  }

  signOut(): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/Auth/signout`, {});
  }

  // =========================
  // EMPLOYEE APIs
  // =========================

  getEmployees(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Employees`);
  }

  getEmployeeById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Employees/${id}`);
  }

  getMyProfile(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Employees/my-profile`);
  }

  addEmployee(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/Employees`, data);
  }

  updateEmployee(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/Employees/${id}`, data);
  }

  deleteEmployee(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/Employees/${id}`);
  }

  // =========================
  // USER APIs
  // =========================

  getUsers(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Users`);
  }

  getUserById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Users/${id}`);
  }

  assignRole(data: { userId: string; role: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/Users/assign-role`, data);
  }

  deactivateUser(id: string): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/Users/${id}/deactivate`, {});
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/Users/${id}`);
  }

  // =========================
  // DASHBOARD APIs
  // =========================

  getAdminDashboard(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Dashboard/admin`);
  }

  getManagerDashboard(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Dashboard/manager`);
  }

  getEmployeeDashboard(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Dashboard/employee`);
  }

  // =========================
  // TOKEN HELPERS
  // =========================

  logout(): void {
    this.signOut().subscribe();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null  { return localStorage.getItem('token'); }
  isLoggedIn(): boolean      { return !!this.getToken(); }
  getRole(): string          { return this.currentUser()?.role ?? ''; }
  isAdmin(): boolean         { return this.getRole() === 'Admin'; }
  isManager(): boolean       { return this.getRole() === 'Manager'; }
  isEmployee(): boolean      { return this.getRole() === 'Employee'; }

  redirectToDashboard(): void {
    const r = this.getRole();
    if (r === 'Admin')        this.router.navigate(['/admin/dashboard']);
    else if (r === 'Manager') this.router.navigate(['/manager/dashboard']);
    else                      this.router.navigate(['/employee/dashboard']);
  }

  private loadUser(): AuthUser | null {
    try { const s = localStorage.getItem('user'); return s ? JSON.parse(s) : null; }
    catch { return null; }
  }
}
