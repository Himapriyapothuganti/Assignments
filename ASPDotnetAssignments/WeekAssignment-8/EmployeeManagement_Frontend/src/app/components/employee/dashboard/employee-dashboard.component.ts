import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <div class="min-h-screen bg-gray-100 flex flex-col">
      <app-navbar title="My Dashboard" />

      <main class="flex-1 p-6 max-w-5xl mx-auto w-full">

        @if (loading) {
          <div class="flex justify-center items-center h-64">
            <div class="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        }

        @if (!loading) {

          <!-- Welcome banner -->
          <div class="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 mb-6 text-white flex items-center justify-between">
            <div>
              <p class="text-indigo-200 text-sm font-medium">Good {{ timeOfDay }},</p>
              <h2 class="text-2xl font-bold mt-0.5">{{ auth.currentUser()?.fullName }} 👋</h2>
              <p class="text-indigo-200 text-sm mt-1">{{ today }}</p>
            </div>
            <div class="hidden sm:flex w-16 h-16 bg-white/20 rounded-2xl items-center justify-center text-4xl">
              {{ timeEmoji }}
            </div>
          </div>

          <!-- Stat cards -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div class="stat-card flex-col items-start gap-1">
              <div class="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center text-lg mb-1">📋</div>
              <p class="text-2xl font-bold text-gray-900">{{ tasks().length }}</p>
              <p class="text-xs text-gray-500">Total Tasks</p>
            </div>
            <div class="stat-card flex-col items-start gap-1">
              <div class="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center text-lg mb-1">⏳</div>
              <p class="text-2xl font-bold text-gray-900">{{ pendingCount }}</p>
              <p class="text-xs text-gray-500">Pending</p>
            </div>
            <div class="stat-card flex-col items-start gap-1">
              <div class="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center text-lg mb-1">✅</div>
              <p class="text-2xl font-bold text-gray-900">{{ doneCount }}</p>
              <p class="text-xs text-gray-500">Completed</p>
            </div>
            <div class="stat-card flex-col items-start gap-1">
              <div class="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center text-lg mb-1">🔥</div>
              <p class="text-2xl font-bold text-gray-900">{{ urgentCount }}</p>
              <p class="text-xs text-gray-500">Urgent</p>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <!-- Tasks panel (2/3 width) -->
            <div class="lg:col-span-2 space-y-5">

              <!-- My Tasks -->
              <div class="card">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="font-bold text-gray-900">📋 My Tasks</h3>
                  <div class="flex gap-2">
                    @for (f of ['All','Pending','Done']; track f) {
                      <button (click)="taskFilter = f" class="text-xs px-2.5 py-1 rounded-lg font-medium transition-colors"
                              [class]="taskFilter === f ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'">
                        {{ f }}
                      </button>
                    }
                  </div>
                </div>
                <div class="space-y-2">
                  @for (t of filteredTasks; track t.id) {
                    <div class="flex items-start gap-3 p-3 rounded-xl border transition-all"
                         [class]="t.done ? 'bg-gray-50 border-gray-100 opacity-60' : 'bg-white border-gray-200 hover:border-indigo-200 hover:shadow-sm'">
                      <!-- Checkbox -->
                      <button (click)="toggleTask(t)"
                              class="mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
                              [class]="t.done ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 hover:border-indigo-400'">
                        @if (t.done) { <span class="text-xs">✓</span> }
                      </button>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-800 leading-tight" [class.line-through]="t.done">{{ t.title }}</p>
                        <p class="text-xs text-gray-400 mt-0.5">{{ t.due }}</p>
                      </div>
                      <span class="text-xs px-2 py-0.5 rounded-full font-semibold shrink-0"
                            [ngClass]="{
                              'bg-red-100 text-red-700':    t.priority === 'High',
                              'bg-amber-100 text-amber-700': t.priority === 'Medium',
                              'bg-blue-100 text-blue-700':   t.priority === 'Low'
                            }">{{ t.priority }}</span>
                    </div>
                  } @empty {
                    <div class="text-center py-8 text-gray-400">
                      <div class="text-4xl mb-2">🎉</div>
                      <p class="text-sm">All tasks done!</p>
                    </div>
                  }
                </div>
              </div>

              <!-- Profile summary card -->
              @if (profile) {
                <div class="card">
                  <h3 class="font-bold text-gray-900 mb-4">👤 My Profile</h3>
                  <div class="flex items-center gap-4 pb-4 mb-4 border-b border-gray-100">
                    <div class="w-14 h-14 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-md shrink-0">
                      {{ profile.fullName.charAt(0) }}
                    </div>
                    <div>
                      <p class="font-bold text-gray-900">{{ profile.fullName }}</p>
                      <p class="text-sm text-gray-500">{{ profile.position }}</p>
                      <span class="badge-employee mt-1 inline-block">Employee</span>
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <div class="bg-gray-50 rounded-lg p-3">
                      <p class="text-xs text-gray-400 font-semibold uppercase tracking-wide">Department</p>
                      <p class="text-sm font-semibold text-gray-800 mt-0.5">{{ profile.department }}</p>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-3">
                      <p class="text-xs text-gray-400 font-semibold uppercase tracking-wide">Salary</p>
                      <p class="text-sm font-bold text-emerald-700 mt-0.5">₹{{ profile.salary | number }}</p>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-3">
                      <p class="text-xs text-gray-400 font-semibold uppercase tracking-wide">Email</p>
                      <p class="text-xs font-medium text-gray-700 mt-0.5 truncate">{{ profile.email }}</p>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-3">
                      <p class="text-xs text-gray-400 font-semibold uppercase tracking-wide">Hire Date</p>
                      <p class="text-xs font-medium text-gray-700 mt-0.5">{{ profile.hireDate | date:'mediumDate' }}</p>
                    </div>
                  </div>
                </div>
              }

            </div>

            <!-- Right column (1/3 width) -->
            <div class="space-y-5">

              <!-- Announcements -->
              <div class="card">
                <h3 class="font-bold text-gray-900 mb-4">📢 Announcements</h3>
                <div class="space-y-3">
                  @for (a of announcements; track a.id) {
                    <div class="p-3 rounded-xl border-l-4 bg-gray-50"
                         [ngClass]="{
                           'border-l-blue-500':   a.type === 'info',
                           'border-l-green-500':  a.type === 'success',
                           'border-l-amber-500':  a.type === 'warning',
                           'border-l-red-500':    a.type === 'urgent'
                         }">
                      <div class="flex items-start gap-2">
                        <span class="text-base shrink-0">{{ a.icon }}</span>
                        <div>
                          <p class="text-sm font-semibold text-gray-800 leading-tight">{{ a.title }}</p>
                          <p class="text-xs text-gray-500 mt-0.5">{{ a.body }}</p>
                          <p class="text-xs text-gray-400 mt-1">{{ a.date }}</p>
                        </div>
                      </div>
                    </div>
                  }
                </div>
              </div>

              <!-- Quick links -->
              <div class="card">
                <h3 class="font-bold text-gray-900 mb-4">⚡ Quick Links</h3>
                <div class="space-y-2">
                  @for (link of quickLinks; track link.label) {
                    <a [href]="link.href"
                       class="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-indigo-50 hover:text-indigo-700 transition-colors group">
                      <span class="text-lg">{{ link.icon }}</span>
                      <span class="text-sm font-medium text-gray-700 group-hover:text-indigo-700">{{ link.label }}</span>
                      <svg class="w-4 h-4 text-gray-300 group-hover:text-indigo-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                      </svg>
                    </a>
                  }
                </div>
              </div>

              <!-- Work schedule -->
              <div class="card">
                <h3 class="font-bold text-gray-900 mb-4">📅 This Week</h3>
                <div class="space-y-2">
                  @for (day of schedule; track day.day) {
                    <div class="flex items-center gap-3 text-sm">
                      <span class="w-8 text-xs font-bold text-gray-400 shrink-0">{{ day.day }}</span>
                      <div class="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div class="h-2 rounded-full transition-all"
                             [style.width.%]="day.pct"
                             [ngClass]="{
                               'bg-green-400':  day.pct >= 80,
                               'bg-amber-400':  day.pct >= 50 && day.pct < 80,
                               'bg-red-400':    day.pct < 50
                             }"></div>
                      </div>
                      <span class="text-xs font-medium text-gray-500 shrink-0 w-10 text-right">{{ day.hours }}h</span>
                    </div>
                  }
                </div>
              </div>

            </div>
          </div>
        }
      </main>
    </div>
  `
})
export class EmployeeDashboardComponent implements OnInit {
  auth    = inject(AuthService);
  loading = true;
  profile: any = null;
  taskFilter = 'All';

  today     = new Date().toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
  timeOfDay = (() => { const h = new Date().getHours(); return h < 12 ? 'Morning' : h < 17 ? 'Afternoon' : 'Evening'; })();
  timeEmoji = (() => { const h = new Date().getHours(); return h < 12 ? '☀️' : h < 17 ? '🌤️' : '🌙'; })();

  tasks = signal([
    { id: 1, title: 'Submit monthly attendance report',   due: 'Due today',      priority: 'High',   done: false },
    { id: 2, title: 'Complete onboarding documentation',  due: 'Due tomorrow',   priority: 'High',   done: false },
    { id: 3, title: 'Review company policy updates',      due: 'Due this week',  priority: 'Medium', done: false },
    { id: 4, title: 'Update profile photo in system',     due: 'Due this week',  priority: 'Low',    done: true  },
    { id: 5, title: 'Team standup meeting notes',         due: 'Due Friday',     priority: 'Medium', done: false },
    { id: 6, title: 'Complete skill assessment form',     due: 'Due next week',  priority: 'Low',    done: false },
  ]);

  get pendingCount() { return this.tasks().filter(t => !t.done).length; }
  get doneCount()    { return this.tasks().filter(t =>  t.done).length; }
  get urgentCount()  { return this.tasks().filter(t => !t.done && t.priority === 'High').length; }

  get filteredTasks() {
    if (this.taskFilter === 'Pending') return this.tasks().filter(t => !t.done);
    if (this.taskFilter === 'Done')    return this.tasks().filter(t =>  t.done);
    return this.tasks();
  }

  toggleTask(task: any): void {
    this.tasks.update(list => list.map(t => t.id === task.id ? { ...t, done: !t.done } : t));
  }

  announcements = [
    { id:1, type:'urgent',  icon:'🚨', title:'Payroll Deadline',        body:'Submit timesheets by 5pm Friday.',         date:'Today' },
    { id:2, type:'info',    icon:'📋', title:'Policy Update',           body:'New WFH policy effective March 1st.',       date:'Yesterday' },
    { id:3, type:'success', icon:'🎉', title:'Team Achievement',        body:'Q4 targets exceeded by 12%. Great work!',  date:'2 days ago' },
    { id:4, type:'warning', icon:'⚠️', title:'System Maintenance',      body:'EMS offline Sunday 2-4am for updates.',    date:'3 days ago' },
  ];

  quickLinks = [
    { icon:'📄', label:'HR Policies',        href:'#' },
    { icon:'🏖️', label:'Apply for Leave',    href:'#' },
    { icon:'💰', label:'View Payslips',       href:'#' },
    { icon:'📊', label:'Performance Review',  href:'#' },
    { icon:'🆘', label:'Raise a Support Ticket', href:'#' },
  ];

  schedule = [
    { day:'Mon', hours: 8,   pct: 100 },
    { day:'Tue', hours: 7.5, pct: 94  },
    { day:'Wed', hours: 8,   pct: 100 },
    { day:'Thu', hours: 6,   pct: 75  },
    { day:'Fri', hours: 0,   pct: 0   },
  ];

  ngOnInit(): void {
    this.auth.getEmployeeDashboard().subscribe({
      next: res => { this.profile = res.data?.myProfile ?? null; this.loading = false; },
      error: () => {
        this.auth.getMyProfile().subscribe({
          next: r => { this.profile = r.data ?? null; this.loading = false; },
          error: () => { this.loading = false; }
        });
      }
    });
  }
}
