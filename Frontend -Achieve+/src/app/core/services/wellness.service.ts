import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WellnessService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/wellness';

  logMood(mood: string, note: string = '') {
    return this.http.post(`${this.apiUrl}/mood`, { mood, note });
  }

  getMoodHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/mood`);
  }

  getStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`);
  }
}
