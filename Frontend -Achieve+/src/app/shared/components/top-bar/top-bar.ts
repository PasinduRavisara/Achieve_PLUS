import { AuthService } from '../../../core/services/auth';
import { Component, inject, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './top-bar.html',
  styleUrl: './top-bar.css',
})
export class TopBar {
  private authService = inject(AuthService);
  private elementRef = inject(ElementRef);
  
  currentRouteName = 'Dashboard';
  showSearch = false;

  notifications = [
    { id: 1, text: 'New task assigned: Q4 Review', read: false },
    { id: 2, text: 'Meeting with Dev Team in 15m', read: false },
    { id: 3, text: 'System update scheduled', read: true },
  ];
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
    // Search visible only in: tasks, store, employees
    this.showSearch = url.includes('tasks') || url.includes('store') || url.includes('employees');
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    if(this.showNotifications) this.showProfileMenu = false;
  }

  showProfileMenu = false;

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
    if(this.showProfileMenu) this.showNotifications = false;
  }

  logout() {
    this.authService.logout();
  }

  get unreadCount() {
    return this.notifications.filter(n => !n.read).length;
  }
}
