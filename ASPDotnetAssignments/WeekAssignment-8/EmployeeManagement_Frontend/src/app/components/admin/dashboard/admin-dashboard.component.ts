import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { SidebarComponent, NavItem } from '../../shared/sidebar/sidebar.component';
import { AuthService } from '../../../services/auth.service';

const ADMIN_NAV: NavItem[] = [
  { label: 'Dashboard', icon: '🏠', route: '/admin/dashboard' },
  { label: 'Employees', icon: '👥', route: '/admin/employees' },
  { label: 'Users',     icon: '🔐', route: '/admin/users' }
];

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, SidebarComponent],
  template: `
    <div class="flex min-h-screen bg-gray-100">
      <app-sidebar [navItems]="nav" />

      <!-- Main content — pushed right by sidebar on lg+ -->
      <div class="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <app-navbar title="Dashboard" />

        <main class="flex-1 p-6">

          @if (loading) {
            <div class="flex justify-center items-center h-64">
              <div class="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
          }

          @if (!loading) {

            <!-- Stat cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">

              <div class="stat-card">
                <div class="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-2xl shrink-0">👥</div>
                <div>
                  <p class="text-2xl font-bold text-gray-900">{{ stats.totalEmployees }}</p>
                  <p class="text-sm text-gray-500 mt-0.5">Total Employees</p>
                </div>
              </div>

              <div class="stat-card">
                <div class="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-2xl shrink-0">🔐</div>
                <div>
                  <p class="text-2xl font-bold text-gray-900">{{ stats.totalUsers }}</p>
                  <p class="text-sm text-gray-500 mt-0.5">Total Users</p>
                </div>
              </div>

              <div class="stat-card">
                <div class="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-2xl shrink-0">👔</div>
                <div>
                  <p class="text-2xl font-bold text-gray-900">{{ stats.managers }}</p>
                  <p class="text-sm text-gray-500 mt-0.5">Managers</p>
                </div>
              </div>

              <div class="stat-card">
                <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl shrink-0">💻</div>
                <div>
                  <p class="text-2xl font-bold text-gray-900">{{ stats.employees }}</p>
                  <p class="text-sm text-gray-500 mt-0.5">Employees</p>
                </div>
              </div>

            </div>

            <!-- Quick actions -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">

              <a routerLink="/admin/employees"
                 class="card flex items-center gap-4 hover:shadow-md transition-shadow group cursor-pointer border-2 border-transparent hover:border-indigo-200">
                <div class="w-12 h-12 bg-indigo-600 group-hover:bg-indigo-700 rounded-xl flex items-center justify-center text-white text-xl transition-colors">＋</div>
                <div>
                  <p class="font-semibold text-gray-900">Manage Employees</p>
                  <p class="text-sm text-gray-500">Add, edit and delete employees</p>
                </div>
                <svg class="w-5 h-5 text-gray-300 group-hover:text-indigo-400 ml-auto transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </a>

              <a routerLink="/admin/users"
                 class="card flex items-center gap-4 hover:shadow-md transition-shadow group cursor-pointer border-2 border-transparent hover:border-amber-200">
                <div class="w-12 h-12 bg-amber-500 group-hover:bg-amber-600 rounded-xl flex items-center justify-center text-white text-xl transition-colors">👤</div>
                <div>
                  <p class="font-semibold text-gray-900">Manage Users</p>
                  <p class="text-sm text-gray-500">Assign roles and manage accounts</p>
                </div>
                <svg class="w-5 h-5 text-gray-300 group-hover:text-amber-400 ml-auto transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </a>

            </div>

            <!-- Recent employees table -->
            <div class="card">
              <div class="flex items-center justify-between mb-4">
                <h3 class="font-bold text-gray-900">Recent Employees</h3>
                <a routerLink="/admin/employees" class="text-sm text-indigo-600 hover:underline font-medium">View all →</a>
              </div>
              <div class="overflow-x-auto -mx-6 px-6">
                <table class="w-full min-w-[500px]">
                  <thead>
                    <tr class="border-b border-gray-100">
                      <th class="th">Name</th>
                      <th class="th">Department</th>
                      <th class="th">Position</th>
                      <th class="th">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (e of recentEmployees; track e.id) {
                      <tr class="hover:bg-gray-50 transition-colors">
                        <td class="td">
                          <div class="flex items-center gap-2.5">
                            <div class="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                              {{ e.fullName.charAt(0) }}
                            </div>
                            <div>
                              <p class="font-medium text-gray-900 leading-tight">{{ e.fullName }}</p>
                              <p class="text-xs text-gray-400">{{ e.email }}</p>
                            </div>
                          </div>
                        </td>
                        <td class="td text-gray-600">{{ e.department }}</td>
                        <td class="td text-gray-600">{{ e.position }}</td>
                        <td class="td">
                          <span [class]="e.isActive ? 'badge-active' : 'badge-inactive'">
                            {{ e.isActive ? 'Active' : 'Inactive' }}
                          </span>
                        </td>
                      </tr>
                    } @empty {
                      <tr><td colspan="4" class="td text-center text-gray-400 py-8">No employees yet</td></tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>

          }
        </main>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  private authService = inject(AuthService);

  nav = ADMIN_NAV;
  loading = true;
  stats = { totalEmployees: 0, totalUsers: 0, managers: 0, employees: 0 };
  recentEmployees: any[] = [];

  ngOnInit(): void {
    this.authService.getAdminDashboard().subscribe({
      next: res => {
        if (res.success) {
          const d = res.data;
          this.stats = {
            totalEmployees: d.totalEmployees ?? 0,
            totalUsers:     d.totalUsers     ?? 0,
            managers:       d.usersByRole?.managers  ?? 0,
            employees:      d.usersByRole?.employees ?? 0
          };
          this.recentEmployees = (d.recentEmployees ?? d.allEmployees ?? []).slice(0, 5);
        }
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }
}
