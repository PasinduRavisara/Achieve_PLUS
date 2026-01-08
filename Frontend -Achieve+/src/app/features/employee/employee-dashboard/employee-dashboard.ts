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
  showDailyBonus = false;

  ngOnInit() {
    this.checkDailyBonus();
  }

  checkDailyBonus() {
    const lastLogin = localStorage.getItem('achieve_last_login');
    const todayStr = new Date().toDateString();

    if (lastLogin !== todayStr) {
      // Simulate delay for effect
      setTimeout(() => {
        this.showDailyBonus = true;
      }, 1000);
    }
  }

  claimBonus() {
    localStorage.setItem('achieve_last_login', new Date().toDateString());
    this.showDailyBonus = false;
    // Sound effect could go here
    alert("claimed +50 XP!");
  }
}
