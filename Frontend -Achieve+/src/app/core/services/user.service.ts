import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface UserDTO {
  id: number;
  fullName: string;
  userName: string;
  email: string;
  role: string;
  points: number;
  joinDate?: string; // Optional if not always sent
  status?: string;   // Optional
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Use a default API_URL if environment is not set up, assuming proxy or same host
  private apiUrl = 'http://localhost:8080/api/user';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(this.apiUrl);
  }

  getLeaderboard(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(`${this.apiUrl}/leaderboard`);
  }

  getUserById(id: number): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.apiUrl}/${id}`);
  }

  updateUser(id: number, user: Partial<UserDTO>): Observable<UserDTO> {
    return this.http.put<UserDTO>(`${this.apiUrl}/${id}`, user);
  }
  
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
