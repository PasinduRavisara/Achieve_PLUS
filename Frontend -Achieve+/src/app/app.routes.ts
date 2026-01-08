import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { Login } from './features/auth/login/login';
import { Signup } from './features/auth/signup/signup';
import { MainLayout } from './core/layout/main-layout/main-layout';

import { Dashboard as EmployeeDashboard } from './features/employee/dashboard/dashboard';
import { Tasks as EmployeeTasks } from './features/employee/tasks/tasks';
import { Rewards as EmployeeRewards } from './features/employee/rewards/rewards';
import { Store as EmployeeStore } from './features/employee/store/store';
import { Wellness as EmployeeWellness } from './features/employee/wellness/wellness';
import { ProgressAnalysis as EmployeeProgressAnalysis } from './features/employee/progress-analysis/progress-analysis';

import { AdminDashboard } from './features/admin/admin-dashboard/admin-dashboard';
import { Tasks as AdminTasks } from './features/admin/tasks/tasks';
import { Progress as AdminProgress } from './features/admin/progress/progress';
import { Store as AdminStore } from './features/admin/store/store';
import { Employees as AdminEmployees } from './features/admin/employees/employees';

import { Profile } from './features/common/profile/profile';
import { Settings } from './features/common/settings/settings';
import { Leaderboard } from './features/common/leaderboard/leaderboard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
        { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        { path: 'dashboard', component: EmployeeDashboard }, // Employee Home
        { path: 'employee-tasks', component: EmployeeTasks },
        { path: 'progress-analysis', component: EmployeeProgressAnalysis },
        { path: 'employee-rewards', component: EmployeeRewards },
        { path: 'employee-store', component: EmployeeStore },
        { path: 'employee-wellness', component: EmployeeWellness },

        { path: 'admin-dashboard', component: AdminDashboard }, // Admin Home
        { path: 'admin-tasks', component: AdminTasks },
        { path: 'admin-progress', component: AdminProgress },
        { path: 'admin-reward-store', component: AdminStore },
        { path: 'admin-employees', component: AdminEmployees },

        { path: 'profile', component: Profile },
        { path: 'settings', component: Settings },
        { path: 'leaderboard', component: Leaderboard },
    ]
  },
  { path: '**', redirectTo: 'login' }
];
