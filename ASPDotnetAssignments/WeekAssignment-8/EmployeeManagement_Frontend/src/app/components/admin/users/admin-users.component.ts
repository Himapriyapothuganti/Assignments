import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { SidebarComponent, NavItem } from '../../shared/sidebar/sidebar.component';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

const ADMIN_NAV: NavItem[] = [
  { label: 'Dashboard', icon: '🏠', route: '/admin/dashboard' },
  { label: 'Employees', icon: '👥', route: '/admin/employees' },
  { label: 'Users',     icon: '🔐', route: '/admin/users' }
];

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, SidebarComponent],
  template: `
    <div class="flex min-h-screen bg-gray-100">
      <app-sidebar [navItems]="nav" />

      <div class="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <app-navbar title="User Management" />

        <main class="flex-1 p-6">

          <div class="flex items-center justify-between mb-5">
            <div>
              <h2 class="text-xl font-bold text-gray-900">All Users</h2>
              <p class="text-sm text-gray-500 mt-0.5">{{ filtered().length }} accounts</p>
            </div>
          </div>

          <!-- Info banner -->
          <div class="mb-5 flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
            <span class="text-base shrink-0">💡</span>
            <span>All new users are registered as <strong>Employee</strong>. Use the <strong>Promote to Manager</strong> button to upgrade a user's role. Only Admins can change roles.</span>
          </div>

          <!-- Search + filter -->
          <div class="card mb-5 p-4 flex flex-col sm:flex-row gap-3">
            <div class="relative flex-1">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
              <input [(ngModel)]="search" (ngModelChange)="filter()"
                     type="text" class="input-field pl-9" placeholder="Search by name, email or username...">
            </div>
            <select [(ngModel)]="roleFilter" (ngModelChange)="filter()" class="input-field sm:w-44">
              <option value="">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Employee">Employee</option>
            </select>
          </div>

          <!-- Table -->
          <div class="card p-0 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full min-w-[680px]">
                <thead class="border-b border-gray-100 bg-gray-50">
                  <tr>
                    <th class="th">User</th>
                    <th class="th">Current Role</th>
                    <th class="th">Status</th>
                    <th class="th">Joined</th>
                    <th class="th">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                  @for (u of filtered(); track u.id) {
                    <tr class="hover:bg-gray-50 transition-colors">

                      <!-- User info -->
                      <td class="td">
                        <div class="flex items-center gap-3">
                          <div class="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                               [ngClass]="{
                                 'bg-red-100 text-red-700':         u.role === 'Admin',
                                 'bg-emerald-100 text-emerald-700': u.role === 'Manager',
                                 'bg-blue-100 text-blue-700':       u.role === 'Employee'
                               }">
                            {{ u.fullName.charAt(0) }}
                          </div>
                          <div>
                            <p class="font-semibold text-gray-900 leading-tight">{{ u.fullName }}</p>
                            <p class="text-xs text-gray-400">{{ u.username }} · {{ u.email }}</p>
                          </div>
                        </div>
                      </td>

                      <!-- Role badge -->
                      <td class="td">
                        <span [ngClass]="{
                          'badge-admin':    u.role === 'Admin',
                          'badge-manager':  u.role === 'Manager',
                          'badge-employee': u.role === 'Employee'
                        }">{{ u.role }}</span>
                      </td>

                      <!-- Status -->
                      <td class="td">
                        <span [class]="u.isActive ? 'badge-active' : 'badge-inactive'">
                          {{ u.isActive ? 'Active' : 'Inactive' }}
                        </span>
                      </td>

                      <!-- Joined date -->
                      <td class="td text-gray-500 text-xs whitespace-nowrap">
                        {{ u.createdAt | date:'mediumDate' }}
                      </td>

                      <!-- Actions -->
                      <td class="td">
                        <div class="flex items-center gap-2 flex-wrap">

                          <!-- Promote to Manager (only show if Employee) -->
                          @if (u.role === 'Employee') {
                            <button (click)="promoteToManager(u)"
                                    class="text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1">
                              ⬆️ Promote to Manager
                            </button>
                          }

                          <!-- Demote to Employee (only show if Manager) -->
                          @if (u.role === 'Manager') {
                            <button (click)="demoteToEmployee(u)"
                                    class="text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1">
                              ⬇️ Demote to Employee
                            </button>
                          }

                          <!-- Admin badge — no role change for admins -->
                          @if (u.role === 'Admin') {
                            <span class="text-xs text-gray-400 italic">Admin role locked</span>
                          }

                          <!-- Deactivate -->
                          <button (click)="deactivate(u)"
                                  class="text-xs font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-2.5 py-1.5 rounded-lg transition-colors">
                            {{ u.isActive ? 'Deactivate' : 'Activate' }}
                          </button>

                          <!-- Delete -->
                          <button (click)="confirmDelete(u)"
                                  class="text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 px-2.5 py-1.5 rounded-lg transition-colors">
                            Delete
                          </button>

                        </div>
                      </td>
                    </tr>
                  } @empty {
                    <tr><td colspan="5" class="td text-center py-12 text-gray-400">No users found</td></tr>
                  }
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>

    <!-- Promote confirmation modal -->
    @if (promoteTarget) {
      <div class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
          <div class="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">⬆️</div>
          <h3 class="text-lg font-bold text-gray-900 mb-2">Promote to Manager?</h3>
          <p class="text-gray-500 text-sm mb-5">
            Promote <strong class="text-gray-800">{{ promoteTarget.fullName }}</strong> from
            <span class="badge-employee">Employee</span> to <span class="badge-manager">Manager</span>?
            They'll get access to employee management.
          </p>
          <div class="flex gap-3">
            <button (click)="promoteTarget = null" class="btn-secondary flex-1 justify-center">Cancel</button>
            <button (click)="doPromote()"
                    class="flex-1 justify-center bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors">
              ✓ Promote
            </button>
          </div>
        </div>
      </div>
    }

    <!-- Demote confirmation modal -->
    @if (demoteTarget) {
      <div class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
          <div class="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">⬇️</div>
          <h3 class="text-lg font-bold text-gray-900 mb-2">Demote to Employee?</h3>
          <p class="text-gray-500 text-sm mb-5">
            Demote <strong class="text-gray-800">{{ demoteTarget.fullName }}</strong> from
            <span class="badge-manager">Manager</span> to <span class="badge-employee">Employee</span>?
            They'll lose access to management features.
          </p>
          <div class="flex gap-3">
            <button (click)="demoteTarget = null" class="btn-secondary flex-1 justify-center">Cancel</button>
            <button (click)="doDemote()"
                    class="flex-1 justify-center bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors">
              ⬇️ Demote
            </button>
          </div>
        </div>
      </div>
    }

    <!-- Delete modal -->
    @if (deleteTarget) {
      <div class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
          <div class="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">⚠️</div>
          <h3 class="text-lg font-bold text-gray-900 mb-2">Delete User?</h3>
          <p class="text-gray-500 text-sm mb-5">
            Permanently delete <strong class="text-gray-800">{{ deleteTarget.fullName }}</strong>?
            This cannot be undone.
          </p>
          <div class="flex gap-3">
            <button (click)="deleteTarget = null" class="btn-secondary flex-1 justify-center">Cancel</button>
            <button (click)="doDelete()"          class="btn-danger    flex-1 justify-center">Delete</button>
          </div>
        </div>
      </div>
    }
  `
})
export class AdminUsersComponent implements OnInit {
  private auth  = inject(AuthService);
  private toast = inject(ToastService);

  nav = ADMIN_NAV;

  all      = signal<any[]>([]);
  filtered = signal<any[]>([]);

  search     = '';
  roleFilter = '';

  promoteTarget: any = null;
  demoteTarget:  any = null;
  deleteTarget:  any = null;

  ngOnInit(): void { this.load(); }

  load(): void {
    this.auth.getUsers().subscribe(r => { this.all.set(r.data ?? []); this.filter(); });
  }

  filter(): void {
    let list = this.all();
    if (this.search)     list = list.filter((u: any) =>
      u.fullName.toLowerCase().includes(this.search.toLowerCase()) ||
      u.email.toLowerCase().includes(this.search.toLowerCase()) ||
      u.username.toLowerCase().includes(this.search.toLowerCase()));
    if (this.roleFilter) list = list.filter((u: any) => u.role === this.roleFilter);
    this.filtered.set(list);
  }

  // ── Promote Employee → Manager ──────────────────────────────────────────────
  promoteToManager(user: any): void { this.promoteTarget = user; }

  doPromote(): void {
    if (!this.promoteTarget) return;
    this.auth.assignRole({ userId: this.promoteTarget.id, role: 'Manager' }).subscribe({
      next: () => {
        this.toast.success(`${this.promoteTarget.fullName} promoted to Manager! 🎉`);
        this.promoteTarget = null;
        this.load();
      },
      error: err => { this.toast.error(err.error?.message ?? 'Failed to promote'); this.promoteTarget = null; }
    });
  }

  // ── Demote Manager → Employee ──────────────────────────────────────────────
  demoteToEmployee(user: any): void { this.demoteTarget = user; }

  doDemote(): void {
    if (!this.demoteTarget) return;
    this.auth.assignRole({ userId: this.demoteTarget.id, role: 'Employee' }).subscribe({
      next: () => {
        this.toast.success(`${this.demoteTarget.fullName} demoted to Employee`);
        this.demoteTarget = null;
        this.load();
      },
      error: err => { this.toast.error(err.error?.message ?? 'Failed to demote'); this.demoteTarget = null; }
    });
  }

  // ── Deactivate ──────────────────────────────────────────────────────────────
  deactivate(user: any): void {
    this.auth.deactivateUser(user.id).subscribe({
      next: () => { this.toast.success(`${user.fullName} status updated`); this.load(); },
      error: err => this.toast.error(err.error?.message ?? 'Failed')
    });
  }

  // ── Delete ──────────────────────────────────────────────────────────────────
  confirmDelete(user: any): void { this.deleteTarget = user; }

  doDelete(): void {
    if (!this.deleteTarget) return;
    this.auth.deleteUser(this.deleteTarget.id).subscribe({
      next: () => { this.toast.success('User deleted'); this.deleteTarget = null; this.load(); },
      error: err => { this.toast.error(err.error?.message ?? 'Delete failed'); this.deleteTarget = null; }
    });
  }
}
