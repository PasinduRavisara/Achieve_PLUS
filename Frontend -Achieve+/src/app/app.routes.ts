import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

// Layouts
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { EmployeeLayout } from './layouts/employee-layout/employee-layout';

// Admin Features
import { AdminDashboard } from './features/admin/admin-dashboard/admin-dashboard';
import { AdminTaskDashboard } from './features/admin/admin-task-dashboard/admin-task-dashboard';
import { AdminProgressAnalysis } from './features/admin/admin-progress-analysis/admin-progress-analysis';
import { AdminRewardStore } from './features/admin/admin-reward-store/admin-reward-store';
import { AdminEmployeesDetails } from './features/admin/admin-employees-details/admin-employees-details';

// Employee Features
import { EmployeeDashboard } from './features/employee/employee-dashboard/employee-dashboard';
import { EmployeeTaskDashboard } from './features/employee/employee-task-dashboard/employee-task-dashboard';
import { ProgressAnalysis } from './features/employee/progress-analysis/progress-analysis';
import { RewardsAchievements } from './features/employee/rewards-achievements/rewards-achievements';
import { RewardStore } from './features/employee/reward-store/reward-store';
import { EmployeeWellness } from './features/employee/employee-wellness/employee-wellness';

// Auth
import { Login } from './features/auth/login/login';
import { Signup } from './features/auth/signup/signup';

// Shared
import { Profile } from './features/common/profile/profile';
import { Settings } from './features/common/settings/settings';
import { Leaderboard } from './features/common/leaderboard/leaderboard';
import { KudosWall } from './features/common/kudos-wall/kudos-wall';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  
  // Admin Routes
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [authGuard],
    data: { role: 'admin' },
    children: [
      { path: 'dashboard', component: AdminDashboard },
      { path: 'tasks', component: AdminTaskDashboard },
      { path: 'progress-analysis', component: AdminProgressAnalysis },
      { path: 'reward-store', component: AdminRewardStore },
      { path: 'employees', component: AdminEmployeesDetails },
      { path: 'community', component: KudosWall },
      { path: 'profile', component: Profile },
      { path: 'settings', component: Settings },
      { path: 'leaderboard', component: Leaderboard },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // Employee Routes
  {
    path: 'dashboard',
    component: EmployeeLayout,
    canActivate: [authGuard],
    data: { role: 'employee' },
    children: [
      { path: '', component: EmployeeDashboard },
      { path: 'tasks', component: EmployeeTaskDashboard },
      { path: 'progress', component: ProgressAnalysis },
      { path: 'rewards', component: RewardsAchievements },
      { path: 'store', component: RewardStore },
      { path: 'wellness', component: EmployeeWellness },
      { path: 'community', component: KudosWall },
      { path: 'profile', component: Profile },
      { path: 'settings', component: Settings },
      { path: 'leaderboard', component: Leaderboard },
    ]
  },
  
  { path: '**', redirectTo: 'login' }
];
