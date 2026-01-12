import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RewardDTO {
  id: number;
  name: string;
  description: string;
  pointsCost: number;
  quantity: number;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class RewardService {
  private apiUrl = 'http://localhost:8080/api/rewards';

  constructor(private http: HttpClient) {}

  getAllRewards(): Observable<RewardDTO[]> {
    return this.http.get<RewardDTO[]>(this.apiUrl);
  }

  getAvailableRewards(): Observable<RewardDTO[]> {
    return this.http.get<RewardDTO[]>(`${this.apiUrl}/available`);
  }

  createReward(reward: Partial<RewardDTO>): Observable<RewardDTO> {
    return this.http.post<RewardDTO>(this.apiUrl, reward);
  }

  updateReward(id: number, reward: Partial<RewardDTO>): Observable<RewardDTO> {
    return this.http.put<RewardDTO>(`${this.apiUrl}/${id}`, reward);
  }

  deleteReward(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  purchaseReward(rewardId: number, userId: number): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/${rewardId}/purchase`, {}, {
      params: { userId: userId.toString() }
    });
  }
}
