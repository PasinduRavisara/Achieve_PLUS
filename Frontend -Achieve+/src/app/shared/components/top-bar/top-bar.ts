import { AuthService } from '../../../core/services/auth';
import { NotificationService } from '../../../core/services/notification.service';
import { Component, inject, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';

import { filter } from 'rxjs/operators';
import { SearchService } from '../../../core/services/search.service';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './top-bar.html',
  styleUrl: './top-bar.css',
})
export class TopBar {
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private searchService = inject(SearchService);
  private elementRef = inject(ElementRef);
  
  currentRouteName = 'Dashboard';
  showSearch = false;
  showNotifications = false;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.updateState(event.url);
    });
    // Initial call
    this.updateState(this.router.url);
  }

  onSearch(event: any) {
    this.searchService.setSearchQuery(event.target.value);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showProfileMenu = false;
      this.showNotifications = false;
    }
  }

  get user() {
    return this.authService.currentUser();
  }
  
  get userAvatar() {
    return this.user?.role === 'admin' 
      ? 'https://api.dicebear.com/7.x/avataaars/svg?seed=AdminUser' 
      : 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix';
  }

  updateState(url: string) {
    // Update Title
    if (url.includes('tasks')) this.currentRouteName = 'Task Management';
    else if (url.includes('progress')) this.currentRouteName = 'Progress Analysis';
    else if (url.includes('employees')) this.currentRouteName = 'Employee Management';
    else if (url.includes('store')) this.currentRouteName = 'Reward Store';
    else if (url.includes('wellness')) this.currentRouteName = 'Wellness Hub';
    else if (url.includes('leaderboard')) this.currentRouteName = 'Leaderboard';
    else if (url.includes('community')) this.currentRouteName = 'Community';
    else if (url.includes('profile')) this.currentRouteName = 'My Profile';
    else if (url.includes('settings')) this.currentRouteName = 'Settings';
    else this.currentRouteName = 'Dashboard';

    // Update Search Visibility
    this.showSearch = false; 
  }

  get notifications() {
    return this.notificationService.notifications();
  }

  get unreadCount() {
    return this.notificationService.unreadCount();
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    if(this.showNotifications) this.showProfileMenu = false;
  }

  markAllRead() {
    this.notificationService.markAllAsRead();
  }

  showProfileMenu = false;

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
    if(this.showProfileMenu) this.showNotifications = false;
  }

  logout() {
    this.authService.logout();
  }
}
