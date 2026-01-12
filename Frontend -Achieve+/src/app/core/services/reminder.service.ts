import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReminderService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:8080/api/reminders';

    getReminders(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}`);
    }

    createReminder(text: string, reminderTime: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}`, { text, reminderTime });
    }

    deleteReminder(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    updateReminder(id: number, text: string, reminderTime: string): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, { text, reminderTime });
    }
}
