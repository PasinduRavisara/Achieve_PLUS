import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RewardService, RewardDTO } from '../../../core/services/reward.service';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-reward-store',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reward-store.html',
  styleUrl: './reward-store.css',
})
export class RewardStore {
  userPoints = 0;
  rewards: any[] = []; // Using any to map icon if needed, or RewardDTO

  constructor(
    private rewardService: RewardService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.refreshData();
  }

  refreshData() {
    const user = this.authService.getCurrentUser();
    if (user && user.id) {
       // Get Points
       this.userService.getUserById(user.id).subscribe({
         next: (u) => this.userPoints = u.points,
         error: (err) => console.error('Failed to load user points', err)
       });

       // Get Rewards
       this.rewardService.getAvailableRewards().subscribe({
         next: (data) => {
           // Map DTO to view model with icons (DTO has imageUrl, we might mapped icons or just use imageUrl)
           // If DTO has icon field that would be great. But DTO has imageUrl.
           // I'll assume imageUrl is sufficient or map based on name for now to match screenshot if needed.
           // Or just leave existing mock objects if backend is empty? No, user said real data.
           // I'll map data.
           this.rewards = data.map(r => ({
             ...r,
             cost: r.pointsCost,
             icon: this.getIconForReward(r.name) 
           }));
         },
         error: (err) => console.error('Failed to load rewards', err)
       });
    }
  }

  getIconForReward(name: string): string {
    const lower = name.toLowerCase();
    if (lower.includes('gift')) return 'bi-gift';
    if (lower.includes('off')) return 'bi-brightness-high';
    if (lower.includes('swag') || lower.includes('bag')) return 'bi-bag-heart';
    if (lower.includes('lunch') || lower.includes('food')) return 'bi-cup-hot';
    if (lower.includes('spotify') || lower.includes('music')) return 'bi-music-note-beamed';
    if (lower.includes('gym')) return 'bi-activity';
    return 'bi-star';
  }

  redeem(item: any) {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    if (this.userPoints >= item.cost) {
      this.rewardService.purchaseReward(item.id, user.id).subscribe({
        next: (success) => {
          if (success) {
            alert(`Redeemed ${item.name} successfully!`);
            this.refreshData(); // Refresh points and quantity
          } else {
            alert('Purchase failed. Please try again.');
          }
        },
        error: (err) => alert('Error redeeming reward: ' + err.message)
      });
    } else {
      alert("Not enough points!");
    }
  }
}
