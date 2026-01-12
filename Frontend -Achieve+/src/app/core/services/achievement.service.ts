import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AchievementStatsDTO {
  totalBadges: number;
  tasksCompleted: number;
  totalPoints: number;
  currentStreak: number;
}

export interface AchievementDTO {
  id: number;
  userId: number;
  badge: string; // The icon class or name
  description: string;
  earnedAt: string;
  type: string;
}

@Injectable({
  providedIn: 'root'
})
export class AchievementService {
  private apiUrl = 'http://localhost:8080/api/achievements';

  constructor(private http: HttpClient) {}

  getUserAchievements(userId: number): Observable<AchievementDTO[]> {
    return this.http.get<AchievementDTO[]>(`${this.apiUrl}/user/${userId}`);
  }

  getUserStats(userId: number): Observable<AchievementStatsDTO> {
    return this.http.get<AchievementStatsDTO>(`${this.apiUrl}/user/${userId}/stats`);
  }
}
