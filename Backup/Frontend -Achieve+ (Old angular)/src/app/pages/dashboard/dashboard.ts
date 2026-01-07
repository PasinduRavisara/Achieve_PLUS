import { Component } from '@angular/core';
import { GlassCardComponent } from '../../shared/components/glass-card';
import { TooltipDirective } from '../../shared/directives/tooltip';
import { StreakTrackerComponent } from '../../features/streak-tracker';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [GlassCardComponent, TooltipDirective, StreakTrackerComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent {

}
