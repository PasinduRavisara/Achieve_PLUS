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
        this.posts = data.map(post => ({
          ...post,
          formattedContent: this.formatContent(post.content),
          relativeTime: this.getTimeAgo(post.createdAt)
        }));
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

  selectMention(user: { userName: string, fullName: string }) {
      const textarea = document.querySelector('.input-area textarea') as HTMLTextAreaElement;
      if (!textarea) return;

      const cursorPosition = textarea.selectionStart;
      const textBeforeCursor = this.newPostContent.substring(0, cursorPosition);
      const textAfterCursor = this.newPostContent.substring(cursorPosition);
      
      const lastAtPos = textBeforeCursor.lastIndexOf('@');
      const newTextBefore = textBeforeCursor.substring(0, lastAtPos);
      
      const mentionName = user.userName === 'everyone' ? 'everyone' : user.fullName;
      // Remove the '@' symbol by just appending the name directly to newTextBefore
      this.newPostContent = `${newTextBefore}${mentionName} ${textAfterCursor}`;
      this.showMentions = false;
      
      // Restore focus and cursor
      setTimeout(() => {
          textarea.focus();
          // Position is length of before text + length of name + 1 for space. NO +2 for @ symbol.
          const newCursorPos = newTextBefore.length + mentionName.length + 1; 
          textarea.setSelectionRange(newCursorPos, newCursorPos);
      });
  }

  createPost() {
    if (!this.newPostContent.trim()) return;
    this.communityService.createPost(this.newPostContent).subscribe({
      next: (post) => {
        // Pre-calculate display values for the new post
        post.formattedContent = this.formatContent(post.content);
        post.relativeTime = this.getTimeAgo(post.createdAt);
        
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
    // Optimistic update
    const originalLiked = post.likedByCurrentUser;
    const originalCount = post.likeCount;

    post.likedByCurrentUser = !post.likedByCurrentUser;
    post.likeCount += post.likedByCurrentUser ? 1 : -1;

    this.communityService.toggleLike(post.id).subscribe({
      next: (updatedPost) => {
        // Sync with server response if needed, but we mostly trust the toggle
        // To be safe, we can update with server data except for formatted content which we want to keep
        post.likeCount = updatedPost.likeCount;
        post.likedByCurrentUser = updatedPost.likedByCurrentUser;
        this.cdr.detectChanges();
      },
      error: (err) => {
        // Revert on error
        console.error("Failed to toggle like", err);
        post.likedByCurrentUser = originalLiked;
        post.likeCount = originalCount;
        this.cdr.detectChanges();
      }
    });
  }

  trackByPostId(index: number, post: CommunityPost): number {
    return post.id;
  }



  formatContent(content: string): SafeHtml {
    let escaped = this.escapeHtml(content);

    // Sort users by length descending to match longest valid names first (e.g. "John Doe" before "John")
    const sortedUsers = [...this.users].sort((a, b) => b.fullName.length - a.fullName.length);
    
    // Store replacements to apply later to avoid nested replacement issues
    const replacements: { placeholder: string, html: string }[] = [];

    // Handle @everyone
    const everyonePlaceholder = `__MENTION_EVERYONE__`;
    if (escaped.includes('@everyone')) {
         replacements.push({
             placeholder: everyonePlaceholder,
             html: `<a class="mention-everyone" href="javascript:void(0)">@everyone</a>`
         });
         escaped = escaped.replace(/@everyone/gi, everyonePlaceholder);
    }

    sortedUsers.forEach((u, index) => {
        const placeholder = `__MENTION_USER_${index}__`;
        let matched = false;

        // Match FullName (case insensitive, whole word) - Optional '@' prefix to consume it if present
        const nameRegex = new RegExp(`(@?)\\b${this.escapeRegExp(u.fullName)}\\b`, 'gi');
        if (nameRegex.test(escaped)) {
            escaped = escaped.replace(nameRegex, placeholder);
            matched = true;
        }

        // Match @UserName (backward compatibility)
        if (!matched && u.userName) {
            const userRegex = new RegExp(`@${this.escapeRegExp(u.userName)}\\b`, 'gi'); 
            if (userRegex.test(escaped)) {
                 escaped = escaped.replace(userRegex, placeholder);
                 matched = true;
            }
        }

        if (matched) {
            replacements.push({
                placeholder: placeholder,
                html: `<span class="mention-link" data-username="${u.userName}" title="@${u.userName}">${u.fullName}</span>`
            });
        }
    });

    // Restore text content (already escaped) to check for matches, but actually we replaced in 'escaped' directly.
    // Now replace placeholders with HTML
    replacements.forEach(rep => {
        // Use split/join for faster global string replacement without regex issues
        escaped = escaped.split(rep.placeholder).join(rep.html);
    });

    return this.sanitizer.bypassSecurityTrustHtml(escaped);
  }

  handleFeedClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('mention-link')) {
        const userName = target.getAttribute('data-username');
        if (userName) {
            const user = this.users.find(u => u.userName === userName);
            if (user) {
                this.selectedUser = user;
            }
        }
    }
  }

  selectedUser: UserDTO | null = null;
  
  closeUserModal() {
      this.selectedUser = null;
  }

  private escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private escapeHtml(text: string): string {
    if (!text) return "";
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
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
