import { Component, inject, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

export interface NavItem { label: string; icon: string; route: string; }

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <!-- Overlay for mobile -->
    <div class="lg:hidden fixed inset-0 bg-black/30 z-20 hidden" id="sidebar-overlay" (click)="close()"></div>

    <aside id="app-sidebar"
           class="fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-30 flex flex-col
                  transform transition-transform duration-300
                  -translate-x-full lg:translate-x-0">

      <!-- Brand -->
      <div class="h-16 flex items-center gap-3 px-5 border-b border-gray-200 shrink-0">
        <div class="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-sm shrink-0">
          <span class="text-white font-bold text-base">E</span>
        </div>
        <div>
          <p class="font-bold text-gray-900 text-sm leading-none">EMS</p>
          <p class="text-xs text-gray-400 mt-0.5">Employee Management</p>
        </div>
        <!-- Close on mobile -->
        <button class="lg:hidden ml-auto text-gray-400 hover:text-gray-600" (click)="close()">✕</button>
      </div>

      <!-- User card -->
      <div class="p-4 border-b border-gray-100 shrink-0">
        <div class="flex items-center gap-3 p-3 rounded-xl"
             [ngClass]="{
               'bg-red-50':     auth.isAdmin(),
               'bg-emerald-50': auth.isManager(),
               'bg-blue-50':    auth.isEmployee()
             }">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base shrink-0"
               [ngClass]="{
                 'bg-red-100 text-red-700':     auth.isAdmin(),
                 'bg-emerald-100 text-emerald-700': auth.isManager(),
                 'bg-blue-100 text-blue-700':    auth.isEmployee()
               }">
            {{ auth.currentUser()?.fullName?.charAt(0)?.toUpperCase() ?? '?' }}
          </div>
          <div class="min-w-0">
            <p class="text-sm font-semibold text-gray-900 truncate leading-tight">{{ auth.currentUser()?.fullName }}</p>
            <span [ngClass]="{
              'badge-admin':    auth.isAdmin(),
              'badge-manager':  auth.isManager(),
              'badge-employee': auth.isEmployee()
            }" class="mt-1">{{ auth.getRole() }}</span>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto p-3">
        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">Navigation</p>
        @for (item of navItems(); track item.route) {
          <a [routerLink]="item.route"
             routerLinkActive="active"
             (click)="close()"
             class="nav-item mb-0.5">
            <span class="w-5 text-center text-base">{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </a>
        }
      </nav>

      <!-- Logout -->
      <div class="p-3 border-t border-gray-200 shrink-0">
        <button (click)="auth.logout()" class="nav-item text-red-500 hover:bg-red-50 hover:text-red-600">
          <span class="w-5 text-center">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  `
})
export class SidebarComponent {
  auth     = inject(AuthService);
  navItems = input<NavItem[]>([]);

  close(): void {
    document.getElementById('app-sidebar')?.classList.add('-translate-x-full');
  }
}
