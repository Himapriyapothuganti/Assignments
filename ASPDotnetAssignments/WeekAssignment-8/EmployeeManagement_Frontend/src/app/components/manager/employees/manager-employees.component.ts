import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { SidebarComponent, NavItem } from '../../shared/sidebar/sidebar.component';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

const MANAGER_NAV: NavItem[] = [
  { label: 'Dashboard', icon: '🏠', route: '/manager/dashboard' },
  { label: 'Employees', icon: '👥', route: '/manager/employees' }
];

@Component({
  selector: 'app-manager-employees',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NavbarComponent, SidebarComponent],
  template: `
    <div class="flex min-h-screen bg-gray-100">
      <app-sidebar [navItems]="nav" />

      <div class="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <app-navbar title="Employees" />

        <main class="flex-1 p-6">

          <div class="flex items-center justify-between mb-5">
            <div>
              <h2 class="text-xl font-bold text-gray-900">Employees</h2>
              <p class="text-sm text-gray-500 mt-0.5">{{ filtered().length }} records — view & edit only</p>
            </div>
            <!-- Manager cannot add employees — no button here -->
            <span class="badge-manager px-3 py-1.5 text-sm">Manager Access</span>
          </div>

          <!-- Search + filter -->
          <div class="card mb-5 p-4 flex flex-col sm:flex-row gap-3">
            <div class="relative flex-1">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
              <input [(ngModel)]="search" (ngModelChange)="filter()"
                     type="text" class="input-field pl-9" placeholder="Search employees...">
            </div>
            <select [(ngModel)]="deptFilter" (ngModelChange)="filter()" class="input-field sm:w-48">
              <option value="">All Departments</option>
              @for (d of depts; track d) { <option [value]="d">{{ d }}</option> }
            </select>
          </div>

          <!-- Table -->
          <div class="card p-0 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full min-w-[600px]">
                <thead class="border-b border-gray-100">
                  <tr>
                    <th class="th">Employee</th>
                    <th class="th">Department</th>
                    <th class="th">Position</th>
                    <th class="th">Phone</th>
                    <th class="th">Status</th>
                    <th class="th">Action</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                  @for (e of filtered(); track e.id) {
                    <tr class="hover:bg-gray-50 transition-colors">
                      <td class="td">
                        <div class="flex items-center gap-3">
                          <div class="w-9 h-9 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                            {{ e.fullName.charAt(0) }}
                          </div>
                          <div>
                            <p class="font-semibold text-gray-900 leading-tight">{{ e.fullName }}</p>
                            <p class="text-xs text-gray-400">{{ e.email }}</p>
                          </div>
                        </div>
                      </td>
                      <td class="td text-gray-600">{{ e.department }}</td>
                      <td class="td text-gray-600">{{ e.position }}</td>
                      <td class="td text-gray-600">{{ e.phone || '—' }}</td>
                      <td class="td">
                        <span [class]="e.isActive ? 'badge-active' : 'badge-inactive'">
                          {{ e.isActive ? 'Active' : 'Inactive' }}
                        </span>
                      </td>
                      <td class="td">
                        <!-- Edit only — NO delete button for Manager -->
                        <button (click)="openEdit(e)"
                                class="text-xs font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors">
                          Edit
                        </button>
                      </td>
                    </tr>
                  } @empty {
                    <tr><td colspan="6" class="td text-center py-12 text-gray-400">No employees found</td></tr>
                  }
                </tbody>
              </table>
            </div>
          </div>

          <!-- Notice -->
          <div class="mt-4 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
            <span class="text-base shrink-0">⚠️</span>
            <span>Managers can view and edit employee details only. To add or delete employees, contact an Admin.</span>
          </div>

        </main>
      </div>
    </div>

    <!-- Edit Modal -->
    @if (showModal && editTarget) {
      <div class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
          <div class="flex items-center justify-between p-5 border-b border-gray-100">
            <h3 class="text-lg font-bold text-gray-900">Edit Employee</h3>
            <button (click)="closeModal()" class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">✕</button>
          </div>
          <form [formGroup]="form" (ngSubmit)="submitEdit()" class="p-5 space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="input-label">Full Name *</label>
                <input formControlName="fullName" type="text" class="input-field">
              </div>
              <div>
                <label class="input-label">Phone</label>
                <input formControlName="phone" type="text" class="input-field">
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="input-label">Department</label>
                <input formControlName="department" type="text" class="input-field">
              </div>
              <div>
                <label class="input-label">Position</label>
                <input formControlName="position" type="text" class="input-field">
              </div>
            </div>
            <div>
              <label class="input-label">Salary (₹)</label>
              <input formControlName="salary" type="number" class="input-field">
            </div>
            <div class="flex gap-3 pt-2">
              <button type="button" (click)="closeModal()" class="btn-secondary flex-1 justify-center">Cancel</button>
              <button type="submit" [disabled]="saving"
                      class="flex-1 justify-center bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors">
                @if (saving) { <span class="spinner"></span> Saving... } @else { Save Changes }
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `
})
export class ManagerEmployeesComponent implements OnInit {
  private auth  = inject(AuthService);
  private toast = inject(ToastService);
  private fb    = inject(FormBuilder);

  nav = MANAGER_NAV;

  all      = signal<any[]>([]);
  filtered = signal<any[]>([]);
  depts: string[] = [];

  search = ''; deptFilter = '';
  showModal = false; editTarget: any = null; saving = false;

  form = this.fb.group({
    fullName:   ['', Validators.required],
    phone:      [''],
    department: [''],
    position:   [''],
    salary:     [0]
  });

  ngOnInit(): void { this.load(); }

  load(): void {
    this.auth.getEmployees().subscribe(r => {
      const list = r.data ?? [];
      this.all.set(list);
      this.depts = [...new Set(list.map((e: any) => e.department))] as string[];
      this.filter();
    });
  }

  filter(): void {
    let list = this.all();
    if (this.search)     list = list.filter((e: any) => e.fullName.toLowerCase().includes(this.search.toLowerCase()));
    if (this.deptFilter) list = list.filter((e: any) => e.department === this.deptFilter);
    this.filtered.set(list);
  }

  openEdit(e: any): void { this.editTarget = e; this.form.patchValue(e); this.showModal = true; }
  closeModal(): void { this.showModal = false; this.editTarget = null; }

  submitEdit(): void {
    if (!this.editTarget || this.form.invalid) return;
    this.saving = true;
    const v = this.form.value;
    this.auth.updateEmployee(this.editTarget.id, {
      fullName: v.fullName, phone: v.phone, department: v.department,
      position: v.position, salary: Number(v.salary)
    }).subscribe({
      next: () => { this.toast.success('Employee updated!'); this.saving = false; this.closeModal(); this.load(); },
      error: err => { this.toast.error(err.error?.message ?? 'Update failed'); this.saving = false; }
    });
  }
}
