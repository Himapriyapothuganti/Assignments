import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { SidebarComponent, NavItem } from '../../shared/sidebar/sidebar.component';
import { AuthService } from '../../../services/auth.service';

const MANAGER_NAV: NavItem[] = [
  { label: 'Dashboard', icon: '🏠', route: '/manager/dashboard' },
  { label: 'Employees', icon: '👥', route: '/manager/employees' }
];

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent, SidebarComponent],
  template: `
    <div class="flex min-h-screen bg-gray-100">
      <app-sidebar [navItems]="nav" />

      <div class="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <app-navbar title="Dashboard" />

        <main class="flex-1 p-6">

          <!-- Welcome banner -->
          <div class="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 mb-6 text-white">
            <p class="text-emerald-100 text-sm font-medium mb-1">Welcome back,</p>
            <h2 class="text-2xl font-bold">{{ auth.currentUser()?.fullName }}</h2>
            <p class="text-emerald-100 text-sm mt-2">You have access to view and edit employee records.</p>
          </div>

          @if (loading) {
            <div class="flex justify-center items-center h-40">
              <div class="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
            </div>
          }

          @if (!loading) {

            <!-- Stats row -->
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              <div class="stat-card">
                <div class="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-xl shrink-0">👥</div>
                <div><p class="text-xl font-bold text-gray-900">{{ stats.total }}</p><p class="text-xs text-gray-500">Total Employees</p></div>
              </div>
              <div class="stat-card">
                <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-xl shrink-0">✅</div>
                <div><p class="text-xl font-bold text-gray-900">{{ stats.active }}</p><p class="text-xs text-gray-500">Active</p></div>
              </div>
              <div class="stat-card col-span-2 sm:col-span-1">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-xl shrink-0">🏢</div>
                <div><p class="text-xl font-bold text-gray-900">{{ stats.depts }}</p><p class="text-xs text-gray-500">Departments</p></div>
              </div>
            </div>

            <!-- Employee list with search -->
            <div class="card">
              <div class="flex items-center justify-between mb-4">
                <h3 class="font-bold text-gray-900">Employee List</h3>
                <a routerLink="/manager/employees" class="btn-primary text-sm">
                  <span>✏️</span> Manage
                </a>
              </div>

              <!-- Search -->
              <div class="relative mb-4">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
                <input [(ngModel)]="search" (ngModelChange)="filterList()"
                       type="text" class="input-field pl-9" placeholder="Search employees...">
              </div>

              <!-- Table -->
              <div class="overflow-x-auto -mx-6 px-6">
                <table class="w-full min-w-[500px]">
                  <thead>
                    <tr class="border-b border-gray-100">
                      <th class="th">Name</th>
                      <th class="th">Department</th>
                      <th class="th">Position</th>
                      <th class="th">Status</th>
                      <th class="th">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (e of filteredList(); track e.id) {
                      <tr class="hover:bg-gray-50 transition-colors">
                        <td class="td">
                          <div class="flex items-center gap-2.5">
                            <div class="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                              {{ e.fullName.charAt(0) }}
                            </div>
                            <span class="font-medium text-gray-900">{{ e.fullName }}</span>
                          </div>
                        </td>
                        <td class="td text-gray-600 text-sm">{{ e.department }}</td>
                        <td class="td text-gray-600 text-sm">{{ e.position }}</td>
                        <td class="td">
                          <span [class]="e.isActive ? 'badge-active' : 'badge-inactive'">
                            {{ e.isActive ? 'Active' : 'Inactive' }}
                          </span>
                        </td>
                        <td class="td">
                          <a routerLink="/manager/employees"
                             class="text-xs font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors">
                            Edit
                          </a>
                        </td>
                      </tr>
                    } @empty {
                      <tr><td colspan="5" class="td text-center py-8 text-gray-400">No employees found</td></tr>
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
export class ManagerDashboardComponent implements OnInit {
  auth  = inject(AuthService);
  nav   = MANAGER_NAV;

  loading = true;
  search  = '';
  stats = { total: 0, active: 0, depts: 0 };

  employees    = signal<any[]>([]);
  filteredList = signal<any[]>([]);

  ngOnInit(): void {
    this.auth.getEmployees().subscribe({
      next: res => {
        const list = res.data ?? [];
        this.employees.set(list);
        this.filteredList.set(list);
        this.stats = {
          total:  list.length,
          active: list.filter((e: any) => e.isActive).length,
          depts:  new Set(list.map((e: any) => e.department)).size
        };
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  filterList(): void {
    const q = this.search.toLowerCase();
    this.filteredList.set(
      q ? this.employees().filter((e: any) => e.fullName.toLowerCase().includes(q) || e.department.toLowerCase().includes(q)) : this.employees()
    );
  }
}
