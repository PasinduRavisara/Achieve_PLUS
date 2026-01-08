import { Component } from '@angular/core';
import { GlassCard } from '../../../shared/components/glass-card/glass-card';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [GlassCard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {}
