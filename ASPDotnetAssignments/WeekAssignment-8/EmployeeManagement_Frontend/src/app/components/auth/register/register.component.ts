import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-indigo-700 via-indigo-600 to-purple-700 flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center mx-auto mb-4">
            <span class="text-indigo-600 text-3xl font-black">E</span>
          </div>
          <h1 class="text-2xl font-bold text-white">Create Account</h1>
          <p class="text-indigo-200 text-sm mt-1">You'll be registered as an Employee by default</p>
        </div>
        <div class="bg-white rounded-2xl shadow-2xl p-8">
          <form [formGroup]="form" (ngSubmit)="submit()">

            <div class="mb-4">
              <label class="input-label">Username *</label>
              <input formControlName="username" type="text" class="input-field" placeholder="Choose a username">
              @if (f['username'].invalid && f['username'].touched) {
                <p class="text-red-500 text-xs mt-1">Minimum 3 characters</p>
              }
            </div>

            <div class="mb-4">
              <label class="input-label">Full Name *</label>
              <input formControlName="fullName" type="text" class="input-field" placeholder="John Doe">
              @if (f['fullName'].invalid && f['fullName'].touched) {
                <p class="text-red-500 text-xs mt-1">Full name is required</p>
              }
            </div>

            <div class="mb-4">
              <label class="input-label">Email *</label>
              <input formControlName="email" type="email" class="input-field" placeholder="john@company.com">
              @if (f['email'].invalid && f['email'].touched) {
                <p class="text-red-500 text-xs mt-1">Valid email is required</p>
              }
            </div>

            <div class="mb-4">
              <label class="input-label">Password *</label>
              <input formControlName="password" type="password" class="input-field" placeholder="Min 8 chars + uppercase + symbol">
              @if (f['password'].invalid && f['password'].touched) {
                <p class="text-red-500 text-xs mt-1">Minimum 8 characters</p>
              }
            </div>

            <div class="mb-5">
              <label class="input-label">Confirm Password *</label>
              <input formControlName="confirmPassword" type="password" class="input-field" placeholder="Repeat password">
              @if (form.errors?.['mismatch'] && f['confirmPassword'].touched) {
                <p class="text-red-500 text-xs mt-1">Passwords do not match</p>
              }
            </div>

            <!-- Role info notice -->
            <div class="mb-5 flex items-start gap-2.5 bg-blue-50 border border-blue-100 rounded-xl p-3.5 text-sm text-blue-700">
              <span class="text-base shrink-0 mt-0.5">ℹ️</span>
              <span>New accounts are registered as <strong>Employee</strong> by default. An Admin can promote you to Manager later.</span>
            </div>

            <button type="submit" [disabled]="loading" class="btn-primary w-full justify-center py-3">
              @if (loading) { <span class="spinner"></span> Creating account... }
              @else { Create Account }
            </button>

            <p class="text-center mt-4 text-sm text-gray-500">
              Already have an account?
              <a routerLink="/login" class="text-indigo-600 font-semibold hover:underline">Sign in</a>
            </p>

          </form>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private fb    = inject(FormBuilder);
  private auth  = inject(AuthService);
  private toast = inject(ToastService);
  loading = false;

  form = this.fb.group({
    username:        ['', [Validators.required, Validators.minLength(3)]],
    fullName:        ['', Validators.required],
    email:           ['', [Validators.required, Validators.email]],
    password:        ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required]
  }, { validators: (g: AbstractControl) =>
    g.get('password')?.value === g.get('confirmPassword')?.value ? null : { mismatch: true }
  });

  get f() { return this.form.controls; }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    // Always register as Employee — Admin assigns roles later
    this.auth.register({
      username: this.f['username'].value!,
      fullName: this.f['fullName'].value!,
      email:    this.f['email'].value!,
      password: this.f['password'].value!,
      role:     'Employee'
    }).subscribe({
      next: res => {
        this.loading = false;
        if (res.success) { this.toast.success('Account created! You are registered as Employee.'); this.auth.redirectToDashboard(); }
        else this.toast.error(res.message);
      },
      error: err => { this.loading = false; this.toast.error(err.error?.message ?? 'Registration failed'); }
    });
  }
}
