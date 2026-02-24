import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-access-denied',
  standalone: true,
  template: `
    <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div class="text-center max-w-sm">
        <div class="text-7xl mb-4">🚫</div>
        <h1 class="text-5xl font-black text-red-500 mb-2">403</h1>
        <h2 class="text-xl font-bold text-gray-900 mb-3">Access Denied</h2>
        <p class="text-gray-500 text-sm mb-6">You don't have permission to view this page.</p>
        <button (click)="auth.redirectToDashboard()"
                class="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-indigo-700 transition-colors">
          Go to My Dashboard
        </button>
      </div>
    </div>
  `
})
export class AccessDeniedComponent { auth = inject(AuthService); }
