import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reward-store',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reward-store.html',
  styleUrl: './reward-store.css',
})
export class RewardStore {
  userPoints = 1250;
  
  rewards = [
    { id: 1, name: '$25 Amazon Gift Card', cost: 500, icon: 'bi-gift' },
    { id: 2, name: 'Extra Day Off', cost: 2000, icon: 'bi-brightness-high' },
    { id: 3, name: 'Company Swag Pack', cost: 800, icon: 'bi-bag-heart' },
    { id: 4, name: 'Lunch on the House', cost: 300, icon: 'bi-cup-hot' },
    { id: 5, name: 'Premium Spotify Sub', cost: 600, icon: 'bi-music-note-beamed' },
    { id: 6, name: 'Gym Membership (1mo)', cost: 1000, icon: 'bi-activity' },
  ];

  redeem(item: any) {
    if (this.userPoints >= item.cost) {
      this.userPoints -= item.cost;
      alert(`Redeemed ${item.name}!`);
    } else {
      alert("Not enough points!");
    }
  }
}
