import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommunityService, CommunityPost } from '../../../core/services/community.service';
import { UserService, UserDTO } from '../../../core/services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './community.html',
  styleUrls: ['./community.css']
})
export class Community implements OnInit {
  private communityService = inject(CommunityService);
  private userService = inject(UserService);
  private sanitizer = inject(DomSanitizer);
  private cdr = inject(ChangeDetectorRef);

  posts: CommunityPost[] = [];
  newPostContent: string = '';
  loading = false;
  errorMessage: string | null = null;
  userMap = new Map<string, string>(); // username -> fullname

  users: UserDTO[] = [];
  mentionList: (UserDTO | { fullName: string, userName: string })[] = [];
  showMentions = false;
  mentionQuery = '';
  
  // Fake "Everyone" user for the list
  everyoneUser = { fullName: 'Everyone', userName: 'everyone' };

  ngOnInit() {
    this.loadUsers();
    this.loadPosts();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        users.forEach(u => {
          if (u.userName) {
             this.userMap.set(u.userName.toLowerCase(), u.fullName);
          }
        });
        this.cdr.detectChanges();
      }
    });
  }

  loadPosts() {
    this.loading = true;
    this.errorMessage = null;
    this.communityService.getAllPosts().subscribe({
      next: (data) => {
        console.log('Posts loaded:', data);
        this.posts = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading posts:', err);
        this.errorMessage = 'Failed to load community posts. Please try logging in again.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onInput(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    const cursorPosition = textarea.selectionStart;
    const textBeforeCursor = this.newPostContent.substring(0, cursorPosition);
    
    // Check for @mention trigger
    const match = textBeforeCursor.match(/@(\w*)$/);
    
    if (match) {
        this.mentionQuery = match[1].toLowerCase();
        this.showMentions = true;
        this.filterMentions();
    } else {
        this.showMentions = false;
    }
  }

  filterMentions() {
      const allUsers = [this.everyoneUser, ...this.users];
      if (!this.mentionQuery) {
          this.mentionList = allUsers;
      } else {
          this.mentionList = allUsers.filter(u => 
              u.userName.toLowerCase().includes(this.mentionQuery) || 
              u.fullName.toLowerCase().includes(this.mentionQuery)
          );
      }
  }

  selectMention(user: { userName: string }) {
      const textarea = document.querySelector('.input-area textarea') as HTMLTextAreaElement;
      if (!textarea) return;

      const cursorPosition = textarea.selectionStart;
      const textBeforeCursor = this.newPostContent.substring(0, cursorPosition);
      const textAfterCursor = this.newPostContent.substring(cursorPosition);
      
      const lastAtPos = textBeforeCursor.lastIndexOf('@');
      const newTextBefore = textBeforeCursor.substring(0, lastAtPos);
      
      this.newPostContent = `${newTextBefore}@${user.userName} ${textAfterCursor}`;
      this.showMentions = false;
      
      // Restore focus and cursor
      setTimeout(() => {
          textarea.focus();
          const newCursorPos = lastAtPos + user.userName.length + 2; // @ + name + space
          textarea.setSelectionRange(newCursorPos, newCursorPos);
      });
  }

  createPost() {
    if (!this.newPostContent.trim()) return;
    this.communityService.createPost(this.newPostContent).subscribe({
      next: (post) => {
        this.posts.unshift(post);
        this.newPostContent = '';
        this.cdr.detectChanges();
      },
      error: (err) => {
          console.error(err);
          alert("Failed to create post. " + (err.error?.message || ""));
      }
    });
  }

  toggleLike(post: CommunityPost) {
    const originalLiked = post.isLikedByCurrentUser;
    const originalCount = post.likeCount;
    
    post.isLikedByCurrentUser = !post.isLikedByCurrentUser;
    post.likeCount += post.isLikedByCurrentUser ? 1 : -1;

    this.communityService.toggleLike(post.id).subscribe({
      next: (updatedPost) => {
        post.likeCount = updatedPost.likeCount;
        post.isLikedByCurrentUser = updatedPost.isLikedByCurrentUser;
      },
      error: () => {
        post.isLikedByCurrentUser = originalLiked;
        post.likeCount = originalCount;
      }
    });
  }

  formatContent(content: string): SafeHtml {
    let escaped = this.escapeHtml(content);

    // Replace @username with span using regex
    escaped = escaped.replace(/@(\w+)/g, (match, username) => {
        if (username.toLowerCase() === 'everyone') {
             return `<span class="mention-everyone">@everyone</span>`;
        }
        const fullName = this.userMap.get(username.toLowerCase());
        if (fullName) {
             return `<span class="mention" title="@${username}">${fullName}</span>`;
        }
        return `<span class="mention-unknown">${match}</span>`;
    });

    return this.sanitizer.bypassSecurityTrustHtml(escaped);
  }

  private escapeHtml(text: string): string {
    if (!text) return "";
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/'/g, "&#039;"); // Quote not replaced to avoid breaking attributes if any, though plain text shouldn't have them. 
        // Actually for pure text safety, &quot; is good.
  }

  getTimeAgo(dateStr: string): string {
      const date = new Date(dateStr);
      const now = new Date();
      const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
      
      let interval = seconds / 31536000;
      if (interval > 1) return Math.floor(interval) + "y";
      interval = seconds / 2592000;
      if (interval > 1) return Math.floor(interval) + "mo";
      interval = seconds / 86400;
      if (interval > 1) return Math.floor(interval) + "d";
      interval = seconds / 3600;
      if (interval > 1) return Math.floor(interval) + "h";
      interval = seconds / 60;
      if (interval > 1) return Math.floor(interval) + "m";
      return Math.floor(seconds) + "s";
  }
}
