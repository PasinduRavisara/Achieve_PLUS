import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SafeHtml } from '@angular/platform-browser';

export interface CommunityPost {
  id: number;
  content: string;
  authorId: number;
  authorName: string;
  authorAvatar?: string;
  createdAt: string;
  formattedContent?: SafeHtml;
  relativeTime?: string;
  likeCount: number;
  likedByCurrentUser: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CommunityService {
  private apiUrl = 'http://localhost:8080/api/community';

  constructor(private http: HttpClient) {}

  getAllPosts(): Observable<CommunityPost[]> {
    return this.http.get<CommunityPost[]>(this.apiUrl);
  }

  createPost(content: string): Observable<CommunityPost> {
    return this.http.post<CommunityPost>(this.apiUrl, { content });
  }

  toggleLike(postId: number): Observable<CommunityPost> {
    return this.http.post<CommunityPost>(`${this.apiUrl}/${postId}/like`, {});
  }
}
