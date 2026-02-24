import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { SidebarComponent, NavItem } from '../../shared/sidebar/sidebar.component';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

const ADMIN_NAV: NavItem[] = [
  { label: 'Dashboard', icon: '🏠', route: '/admin/dashboard' },
  { label: 'Employees', icon: '👥', route: '/admin/employees' },
  { label: 'Users',     icon: '🔐', route: '/admin/users' }
];

const DEPARTMENTS = ['IT', 'HR', 'Finance', 'Operations', 'Marketing', 'Sales', 'Legal', 'Support'];

@Component({
  selector: 'app-admin-employees',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NavbarComponent, SidebarComponent],
  template: `
    <div class="flex min-h-screen bg-gray-100">
      <app-sidebar [navItems]="nav" />

      <div class="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <app-navbar title="Employees" />

        <main class="flex-1 p-6">

          <!-- Header row -->
          <div class="flex items-center justify-between mb-5">
            <div>
              <h2 class="text-xl font-bold text-gray-900">All Employees</h2>
              <p class="text-sm text-gray-500 mt-0.5">{{ filtered().length }} records</p>
            </div>
            <button (click)="openCreate()" class="btn-primary">
              <span>＋</span> Add Employee
            </button>
          </div>

          <!-- Search + filter bar -->
          <div class="card mb-5 flex flex-col sm:flex-row gap-3 p-4">
            <div class="relative flex-1">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
              <input [(ngModel)]="search" (ngModelChange)="filter()"
                     type="text" class="input-field pl-9" placeholder="Search by name or email...">
            </div>
            <select [(ngModel)]="deptFilter" (ngModelChange)="filter()" class="input-field sm:w-48">
              <option value="">All Departments</option>
              @for (d of DEPTS; track d) { <option [value]="d">{{ d }}</option> }
            </select>
            <select [(ngModel)]="statusFilter" (ngModelChange)="filter()" class="input-field sm:w-36">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <!-- Table -->
          <div class="card p-0 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full min-w-[700px]">
                <thead class="border-b border-gray-100">
                  <tr>
                    <th class="th">Employee</th>
                    <th class="th">Department</th>
                    <th class="th">Position</th>
                    <th class="th">Salary</th>
                    <th class="th">Status</th>
                    <th class="th">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                  @for (e of filtered(); track e.id) {
                    <tr class="hover:bg-gray-50 transition-colors">
                      <td class="td">
                        <div class="flex items-center gap-3">
                          <div class="w-9 h-9 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
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
                      <td class="td font-semibold text-gray-800">₹{{ e.salary | number }}</td>
                      <td class="td">
                        <span [class]="e.isActive ? 'badge-active' : 'badge-inactive'">
                          {{ e.isActive ? 'Active' : 'Inactive' }}
                        </span>
                      </td>
                      <td class="td">
                        <div class="flex items-center gap-2">
                          <button (click)="openEdit(e)"
                                  class="text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors">
                            Edit
                          </button>
                          <button (click)="confirmDelete(e)"
                                  class="text-xs font-semibold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  } @empty {
                    <tr>
                      <td colspan="6" class="td text-center py-12 text-gray-400">
                        No employees found. Click "Add Employee" to create one.
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>

    <!-- ─── Add / Edit Modal ─────────────────────────────────────────── -->
    @if (showModal) {
      <div class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">

          <!-- Header -->
          <div class="flex items-center justify-between p-5 border-b border-gray-100">
            <h3 class="text-lg font-bold text-gray-900">{{ editId ? 'Edit Employee' : 'Add New Employee' }}</h3>
            <button (click)="closeModal()" class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">✕</button>
          </div>

          <!-- Body -->
          <div class="overflow-y-auto flex-1">
            <form [formGroup]="empForm" (ngSubmit)="submitForm()" class="p-5 space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="input-label">Full Name *</label>
                  <input formControlName="fullName" type="text" class="input-field" placeholder="John Doe">
                  @if (ef['fullName'].invalid && ef['fullName'].touched) {
                    <p class="text-red-500 text-xs mt-1">Required</p>
                  }
                </div>
                <div>
                  <label class="input-label">Phone</label>
                  <input formControlName="phone" type="text" class="input-field" placeholder="9876543210">
                </div>
              </div>

              @if (!editId) {
                <div>
                  <label class="input-label">Email *</label>
                  <input formControlName="email" type="email" class="input-field" placeholder="john@company.com">
                </div>
              }

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="input-label">Department *</label>
                  <select formControlName="department" class="input-field">
                    <option value="">Select...</option>
                    @for (d of DEPTS; track d) { <option [value]="d">{{ d }}</option> }
                  </select>
                </div>
                <div>
                  <label class="input-label">Position *</label>
                  <input formControlName="position" type="text" class="input-field" placeholder="e.g. Developer">
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="input-label">Salary (₹) *</label>
                  <input formControlName="salary" type="number" class="input-field" placeholder="50000">
                </div>
                @if (!editId) {
                  <div>
                    <label class="input-label">Link User Account</label>
                    <select formControlName="userId" class="input-field">
                      <option value="">Select user (optional)</option>
                      @for (u of users; track u.id) { <option [value]="u.id">{{ u.username }} ({{ u.role }})</option> }
                    </select>
                  </div>
                }
              </div>

              @if (editId) {
                <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <input formControlName="isActive" type="checkbox" id="activeChk" class="w-4 h-4 accent-indigo-600 cursor-pointer">
                  <label for="activeChk" class="text-sm font-medium text-gray-700 cursor-pointer">Active Employee</label>
                </div>
              }

              <!-- Footer buttons inside form -->
              <div class="flex gap-3 pt-2">
                <button type="button" (click)="closeModal()" class="btn-secondary flex-1 justify-center">Cancel</button>
                <button type="submit" [disabled]="saving" class="btn-primary flex-1 justify-center">
                  @if (saving) { <span class="spinner"></span> Saving... }
                  @else { {{ editId ? 'Save Changes' : 'Add Employee' }} }
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    }

    <!-- ─── Delete Confirm Modal ─────────────────────────────────────── -->
    @if (deleteTarget) {
      <div class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
          <div class="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🗑️</div>
          <h3 class="text-lg font-bold text-gray-900 mb-2">Delete Employee?</h3>
          <p class="text-gray-500 text-sm mb-5">
            You're about to permanently delete <strong class="text-gray-800">{{ deleteTarget.fullName }}</strong>.
            This action cannot be undone.
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
export class AdminEmployeesComponent implements OnInit {
  private auth  = inject(AuthService);
  private toast = inject(ToastService);
  private fb    = inject(FormBuilder);

  nav    = ADMIN_NAV;
  DEPTS  = DEPARTMENTS;

  all      = signal<any[]>([]);
  filtered = signal<any[]>([]);
  users: any[] = [];

  search       = ''; deptFilter = ''; statusFilter = '';
  showModal    = false;
  editId: number | null = null;
  deleteTarget: any     = null;
  saving       = false;

  empForm = this.fb.group({
    fullName:   ['', Validators.required],
    email:      [''],
    phone:      [''],
    department: ['', Validators.required],
    position:   ['', Validators.required],
    salary:     [0,  [Validators.required, Validators.min(1)]],
    userId:     [''],
    isActive:   [true]
  });

  get ef() { return this.empForm.controls; }

  ngOnInit(): void {
    this.load();
    this.auth.getUsers().subscribe(r => { this.users = r.data ?? []; });
  }

  load(): void {
    this.auth.getEmployees().subscribe(r => {
      this.all.set(r.data ?? []);
      this.filter();
    });
  }

  filter(): void {
    let list = this.all();
    if (this.search)       list = list.filter((e: any) => e.fullName.toLowerCase().includes(this.search.toLowerCase()) || e.email?.toLowerCase().includes(this.search.toLowerCase()));
    if (this.deptFilter)   list = list.filter((e: any) => e.department === this.deptFilter);
    if (this.statusFilter) list = list.filter((e: any) => this.statusFilter === 'active' ? e.isActive : !e.isActive);
    this.filtered.set(list);
  }

  openCreate(): void {
    this.editId = null;
    this.empForm.reset({ isActive: true, salary: 0 });
    this.showModal = true;
  }

  openEdit(e: any): void {
    this.editId = e.id;
    this.empForm.patchValue({ ...e });
    this.showModal = true;
  }

  closeModal(): void { this.showModal = false; this.editId = null; }

  submitForm(): void {
    if (this.empForm.invalid) { this.empForm.markAllAsTouched(); return; }
    this.saving = true;
    const v = this.empForm.value;

    const req$ = this.editId
      ? this.auth.updateEmployee(this.editId, { fullName: v.fullName, phone: v.phone, department: v.department, position: v.position, salary: Number(v.salary), isActive: v.isActive })
      : this.auth.addEmployee({ fullName: v.fullName, email: v.email, phone: v.phone, department: v.department, position: v.position, salary: Number(v.salary), hireDate: new Date().toISOString(), userId: v.userId });

    req$.subscribe({
      next: () => {
        this.toast.success(this.editId ? 'Employee updated!' : 'Employee created!');
        this.saving = false; this.closeModal(); this.load();
      },
      error: err => { this.toast.error(err.error?.message ?? 'Operation failed'); this.saving = false; }
    });
  }

  confirmDelete(e: any): void { this.deleteTarget = e; }

  doDelete(): void {
    if (!this.deleteTarget) return;
    this.auth.deleteEmployee(this.deleteTarget.id).subscribe({
      next: () => { this.toast.success('Employee deleted!'); this.deleteTarget = null; this.load(); },
      error: err => { this.toast.error(err.error?.message ?? 'Delete failed'); this.deleteTarget = null; }
    });
  }
}
