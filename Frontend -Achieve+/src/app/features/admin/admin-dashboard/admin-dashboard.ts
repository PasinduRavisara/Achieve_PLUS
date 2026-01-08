import { Component } from '@angular/core';
import { GlassCard } from '../../../shared/components/glass-card/glass-card';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [GlassCard],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard {}
