import { Injectable, signal } from '@angular/core';
import { Toast } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts = signal<Toast[]>([]);
  private nextId = 0;

  show(message: string, type: Toast['type'] = 'info', ms = 4000): void {
    const id = ++this.nextId;
    this.toasts.update(list => [...list, { id, message, type }]);
    setTimeout(() => this.remove(id), ms);
  }

  success(msg: string) { this.show(msg, 'success'); }
  error(msg: string)   { this.show(msg, 'error'); }
  info(msg: string)    { this.show(msg, 'info'); }
  warning(msg: string) { this.show(msg, 'warning'); }
  remove(id: number)   { this.toasts.update(list => list.filter(t => t.id !== id)); }
}
