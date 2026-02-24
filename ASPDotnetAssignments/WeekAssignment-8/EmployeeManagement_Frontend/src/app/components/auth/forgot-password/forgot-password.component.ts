import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-indigo-700 via-indigo-600 to-purple-700 flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl">🔑</span>
          </div>
          <h1 class="text-2xl font-bold text-white">Reset Password</h1>
        </div>
        <div class="bg-white rounded-2xl shadow-2xl p-8">
          @if (!done) {
            <form [formGroup]="form" (ngSubmit)="submit()">
              <div class="mb-4">
                <label class="input-label">Email *</label>
                <input formControlName="email" type="email" class="input-field" placeholder="your@email.com">
              </div>
              <div class="mb-4">
                <label class="input-label">Reset Token *</label>
                <input formControlName="token" type="text" class="input-field" placeholder="Token from email or backend logs">
              </div>
              <div class="mb-5">
                <label class="input-label">New Password *</label>
                <input formControlName="newPassword" type="password" class="input-field" placeholder="Min 8 characters">
              </div>
              <button type="submit" [disabled]="loading" class="btn-primary w-full justify-center py-3">
                @if (loading) { <span class="spinner"></span> Resetting... } @else { Reset Password }
              </button>
            </form>
          } @else {
            <div class="text-center py-4">
              <div class="text-5xl mb-4">✅</div>
              <h3 class="text-lg font-bold text-gray-900 mb-2">Password Reset!</h3>
              <p class="text-gray-500 text-sm mb-6">Your password has been updated successfully.</p>
              <a routerLink="/login" class="btn-primary inline-flex justify-center px-8 py-3">Back to Login</a>
            </div>
          }
          <p class="text-center mt-4 text-sm text-gray-500">
            <a routerLink="/login" class="text-indigo-600 font-semibold hover:underline">← Back to Login</a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class ForgotPasswordComponent {
  private fb    = inject(FormBuilder);
  private auth  = inject(AuthService);
  private toast = inject(ToastService);
  loading = false; done = false;

  form = this.fb.group({
    email:       ['', [Validators.required, Validators.email]],
    token:       ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(8)]]
  });

  get f() { return this.form.controls; }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.auth.resetPassword({
      email: this.f['email'].value!, token: this.f['token'].value!, newPassword: this.f['newPassword'].value!
    }).subscribe({
      next: res => { this.loading = false; if (res.success) this.done = true; else this.toast.error(res.message); },
      error: err => { this.loading = false; this.toast.error(err.error?.message ?? 'Reset failed'); }
    });
  }
}
