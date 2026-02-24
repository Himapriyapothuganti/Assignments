import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-indigo-700 via-indigo-600 to-purple-700 flex items-center justify-center p-4">
      <div class="w-full max-w-md">

        <!-- Brand header -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center mx-auto mb-4">
            <span class="text-indigo-600 text-3xl font-black">E</span>
          </div>
          <h1 class="text-2xl font-bold text-white">Employee Management</h1>
          <p class="text-indigo-200 text-sm mt-1">Sign in to continue</p>
        </div>

        <!-- Login card -->
        <div class="bg-white rounded-2xl shadow-2xl p-8">

          <form [formGroup]="form" (ngSubmit)="submit()">

            <!-- Username -->
            <div class="mb-4">
              <label class="input-label">Username</label>
              <input formControlName="username" type="text" class="input-field" placeholder="Enter your username" autocomplete="username">
              @if (f['username'].invalid && f['username'].touched) {
                <p class="text-red-500 text-xs mt-1">Username is required</p>
              }
            </div>

            <!-- Password -->
            <div class="mb-4">
              <label class="input-label">Password</label>
              <div class="relative">
                <input formControlName="password" [type]="showPwd ? 'text' : 'password'"
                       class="input-field pr-11" placeholder="Enter your password" autocomplete="current-password">
                <button type="button" (click)="showPwd = !showPwd"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm">
                  {{ showPwd ? '🙈' : '👁️' }}
                </button>
              </div>
              @if (f['password'].invalid && f['password'].touched) {
                <p class="text-red-500 text-xs mt-1">Password is required</p>
              }
            </div>

            <!-- Math CAPTCHA -->
            <div class="mb-6">
              <label class="input-label">Security Check</label>
              <div class="flex items-center gap-3">
                <div class="flex-1 bg-indigo-50 border-2 border-indigo-200 rounded-lg py-3 text-center">
                  <span class="text-indigo-700 font-bold text-lg">{{ a }} + {{ b }} = ?</span>
                </div>
                <input formControlName="captcha" type="number" class="input-field !w-24 text-center font-bold text-lg" placeholder="?">
              </div>
              @if (captchaErr) {
                <p class="text-red-500 text-xs mt-1.5">❌ Wrong answer — new question generated</p>
              }
            </div>

            <!-- Submit -->
            <button type="submit" [disabled]="loading"
                    class="btn-primary w-full justify-center py-3 text-base">
              @if (loading) { <span class="spinner"></span><span>Signing in...</span> }
              @else { <span>Sign In</span> }
            </button>

            <div class="flex justify-between mt-4 text-sm">
              <a routerLink="/forgot-password" class="text-indigo-600 hover:underline font-medium">Forgot password?</a>
              <a routerLink="/register"        class="text-indigo-600 hover:underline font-medium">Create account</a>
            </div>

          </form>
        </div>

        <!-- Demo credentials -->
        <div class="mt-4 bg-white/10 backdrop-blur rounded-xl p-4">
          <p class="text-white/80 text-xs font-semibold mb-3 uppercase tracking-wide">Quick Login</p>
          <div class="grid grid-cols-3 gap-2">
            @for (d of demos; track d.role) {
              <button type="button" (click)="fill(d)"
                      class="p-2.5 bg-white/15 hover:bg-white/25 rounded-lg transition-colors text-left border border-white/10 hover:border-white/30">
                <p class="text-white text-xs font-semibold">{{ d.role }}</p>
                <p class="text-white/60 text-xs font-mono truncate">{{ d.username }}</p>
              </button>
            }
          </div>
        </div>

      </div>
    </div>
  `
})
export class LoginComponent implements OnInit {
  private fb    = inject(FormBuilder);
  private auth  = inject(AuthService);
  private toast = inject(ToastService);

  loading = false; showPwd = false; captchaErr = false;
  a = 0; b = 0;

  demos = [
    { role: 'Admin',    username: 'admin',     password: 'Admin@123456' },
    { role: 'Manager',  username: 'manager',   password: 'Manager@123456' },
    { role: 'Employee', username: 'employee1', password: 'Employee@123456' }
  ];

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    captcha:  [null as number | null, Validators.required]
  });

  get f() { return this.form.controls; }

  ngOnInit(): void {
    this.newCaptcha();
    if (this.auth.isLoggedIn()) this.auth.redirectToDashboard();
  }

  newCaptcha(): void {
    this.a = Math.floor(Math.random() * 9) + 1;
    this.b = Math.floor(Math.random() * 9) + 1;
    this.form.patchValue({ captcha: null });
    this.captchaErr = false;
  }

  fill(d: any): void { this.form.patchValue({ username: d.username, password: d.password }); }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    if (Number(this.f['captcha'].value) !== this.a + this.b) { this.captchaErr = true; this.newCaptcha(); return; }
    this.loading = true;
    this.auth.login({ username: this.f['username'].value!, password: this.f['password'].value! }).subscribe({
      next: res => {
        this.loading = false;
        if (res.success) { this.toast.success(`Welcome back, ${res.data.fullName}!`); this.auth.redirectToDashboard(); }
        else { this.toast.error(res.message || 'Login failed'); this.newCaptcha(); }
      },
      error: err => { this.loading = false; this.toast.error(err.error?.message ?? 'Login failed'); this.newCaptcha(); }
    });
  }
}
