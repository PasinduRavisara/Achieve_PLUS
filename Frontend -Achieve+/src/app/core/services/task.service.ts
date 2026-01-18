import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TaskDTO {
  id: number;
  title: string;
  description: string;
  status: string; // 'Pending', 'In Progress', 'Completed', 'Overdue'
  priority?: string; // High, Medium, Low
  dueDate: string;
  points: number;
  assignedTo?: number;
  assignedToName?: string;
  createdBy?: number;
  createdByName?: string;
  createdAt?: string;
  completedAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:8080/api/tasks';

  constructor(private http: HttpClient) {}

  // Employee Methods
  getMyTasks(): Observable<TaskDTO[]> {
    return this.http.get<TaskDTO[]>(`${this.apiUrl}/my-tasks`);
  }

  updateTaskStatus(id: number, status: string): Observable<TaskDTO> {
    return this.http.put<TaskDTO>(`${this.apiUrl}/${id}/status`, { status });
  }

  getMyStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/my-stats`);
  }

  // Admin Methods
  getAllTasks(): Observable<TaskDTO[]> {
    return this.http.get<TaskDTO[]>(`${this.apiUrl}/admin/all`);
  }

  createTask(task: Partial<TaskDTO>): Observable<TaskDTO> {
    return this.http.post<TaskDTO>(`${this.apiUrl}/admin`, task);
  }

  updateTask(id: number, task: Partial<TaskDTO>): Observable<TaskDTO> {
    return this.http.put<TaskDTO>(`${this.apiUrl}/admin/${id}`, task);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/${id}`);
  }
  
  getAdminStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/stats`);
  }
}
