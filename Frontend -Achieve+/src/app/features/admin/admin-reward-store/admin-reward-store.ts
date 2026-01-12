import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RewardService } from '../../../core/services/reward.service';

@Component({
  selector: 'app-admin-reward-store',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-reward-store.html',
  styleUrl: './admin-reward-store.css',
})
export class AdminRewardStore {
  rewards: any[] = [];

  constructor(private rewardService: RewardService) {}

  ngOnInit() {
    this.refreshRewards();
  }

  refreshRewards() {
    this.rewardService.getAllRewards().subscribe({
      next: (data) => {
        // Map pointsCost to cost for template compatibility
        this.rewards = data.map(r => ({ ...r, cost: r.pointsCost }));
      },
      error: (err) => console.error('Failed to load rewards', err)
    });
  }

  deleteReward(id: number) {
    if(confirm('Are you sure you want to delete this reward?')) {
      this.rewardService.deleteReward(id).subscribe({
        next: () => this.refreshRewards(),
        error: (err) => console.error('Failed to delete reward', err)
      });
    }
  }
}
