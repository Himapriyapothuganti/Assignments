import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastService } from './services/toast.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `
    <router-outlet />
    <div class="fixed top-5 right-5 z-[999] flex flex-col gap-2 w-80 pointer-events-none">
      @for (t of toast.toasts(); track t.id) {
        <div class="toast-in pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white"
             [ngClass]="{'bg-green-600':t.type==='success','bg-red-600':t.type==='error','bg-blue-600':t.type==='info','bg-amber-500':t.type==='warning'}">
          <span class="mt-0.5 text-base shrink-0">{{ t.type==='success'?'✓':t.type==='error'?'✕':t.type==='warning'?'⚠':'ℹ' }}</span>
          <span class="flex-1 leading-snug">{{ t.message }}</span>
          <button (click)="toast.remove(t.id)" class="opacity-60 hover:opacity-100 shrink-0">✕</button>
        </div>
      }
    </div>
  `
})
export class AppComponent { toast = inject(ToastService); }
