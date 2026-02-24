import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  template: `
    <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div class="text-center max-w-sm">
        <div class="text-7xl mb-4">🔍</div>
        <h1 class="text-5xl font-black text-indigo-600 mb-2">404</h1>
        <h2 class="text-xl font-bold text-gray-900 mb-3">Page Not Found</h2>
        <p class="text-gray-500 text-sm mb-6">The page you're looking for doesn't exist.</p>
        <button (click)="router.navigate(['/login'])"
                class="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-indigo-700 transition-colors">
          Back to Login
        </button>
      </div>
    </div>
  `
})
export class NotFoundComponent { router = inject(Router); }
