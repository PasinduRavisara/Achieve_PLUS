import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval, switchMap, tap } from 'rxjs';

export interface Notification {
  id: number;
  message: string;
  type: string;
  relatedId: number; // taskId or rewardId
  read: boolean;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/notifications';

  notifications = signal<Notification[]>([]);
  unreadCount = signal(0);

  constructor() {
    // Poll every 30s
    interval(30000).pipe(
      switchMap(() => this.http.get<Notification[]>(this.apiUrl))
    ).subscribe(data => this.updateState(data));
    
    // Initial fetch
    this.refresh();
  }

  refresh() {
    return this.http.get<Notification[]>(this.apiUrl).subscribe(data => this.updateState(data));
  }

  private updateState(data: Notification[]) {
    this.notifications.set(data);
    this.unreadCount.set(data.filter(n => !n.read).length);
  }

  markAsRead(id: number) {
    return this.http.put(`${this.apiUrl}/${id}/read`, {}).subscribe(() => {
        this.updateLocalRead(id);
    });
  }

  markAllAsRead() {
    return this.http.put(`${this.apiUrl}/read-all`, {}).subscribe(() => {
        this.notifications.update(list => list.map(n => ({ ...n, read: true })));
        this.unreadCount.set(0);
    });
  }
  
  private updateLocalRead(id: number) {
      this.notifications.update(list => list.map(n => n.id === id ? { ...n, read: true } : n));
      this.unreadCount.set(this.notifications().filter(n => !n.read).length);
  }
}
