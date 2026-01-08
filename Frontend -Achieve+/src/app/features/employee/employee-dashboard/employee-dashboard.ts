import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-dashboard.html',
  styleUrl: './employee-dashboard.css',
})
export class EmployeeDashboard {
  today = new Date();
  currentTime = new Date();
  showDailyBonus = false;
  
  // Mock Stats
  stats = {
    completed: 12,
    badges: 3,
    rank: 12
  };

  performance = {
    weekly: 5,
    rate: 85,
    goal: 1200
  };

  upcomingDeadlines: any[] = [];
  recentTasks: any[] = [];

  ngOnInit() {
    this.checkDailyBonus();
    setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  }

  checkDailyBonus() {
    const lastLogin = localStorage.getItem('achieve_last_login');
    const todayStr = new Date().toDateString();

    if (lastLogin !== todayStr) {
      setTimeout(() => {
        this.showDailyBonus = true;
      }, 1000);
    }
  }

  claimBonus() {
    localStorage.setItem('achieve_last_login', new Date().toDateString());
    this.showDailyBonus = false;
    alert("claimed +50 XP!");
  }
}
