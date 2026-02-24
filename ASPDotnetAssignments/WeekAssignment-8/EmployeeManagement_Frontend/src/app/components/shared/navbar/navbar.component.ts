import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
      <!-- Left -->
      <div class="flex items-center gap-3">
        <!-- Mobile hamburger -->
        <button class="lg:hidden text-gray-500 hover:text-gray-700 p-1" (click)="toggleSidebar()">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
        <span class="text-base font-semibold text-gray-700">{{ title() }}</span>
      </div>

      <!-- Right: user info + logout -->
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-2.5">
          <!-- Avatar -->
          <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
               [ngClass]="{
                 'bg-red-100 text-red-700':     auth.isAdmin(),
                 'bg-emerald-100 text-emerald-700': auth.isManager(),
                 'bg-blue-100 text-blue-700':    auth.isEmployee()
               }">
            {{ auth.currentUser()?.fullName?.charAt(0)?.toUpperCase() ?? '?' }}
          </div>
          <div class="hidden sm:block text-right">
            <p class="text-sm font-semibold text-gray-800 leading-tight">{{ auth.currentUser()?.fullName }}</p>
            <span [ngClass]="{
              'badge-admin':    auth.isAdmin(),
              'badge-manager':  auth.isManager(),
              'badge-employee': auth.isEmployee()
            }">{{ auth.getRole() }}</span>
          </div>
        </div>

        <div class="w-px h-6 bg-gray-200"></div>

        <button (click)="auth.logout()"
                class="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors font-medium">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          <span class="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  `
})
export class NavbarComponent {
  auth  = inject(AuthService);
  title = input('Dashboard');

  toggleSidebar(): void {
    document.getElementById('app-sidebar')?.classList.toggle('-translate-x-full');
  }
}
