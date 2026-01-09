import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-reward-store',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-reward-store.html',
  styleUrl: './admin-reward-store.css',
})
export class AdminRewardStore {
  rewards = [
    { id: 1, name: '$25 Amazon Gift Card', description: 'Digital gift card for Amazon.com', cost: 500, quantity: 10, imageUrl: 'assets/rewards/amazon.png' },
    { id: 2, name: 'Extra Day Off', description: 'One full day of paid leave', cost: 2000, quantity: 5, imageUrl: 'assets/rewards/dayoff.png' },
    { id: 3, name: 'Company Swag Pack', description: 'T-shirt, mug, and sticker pack', cost: 800, quantity: 20, imageUrl: 'assets/rewards/swag.png' },
    { id: 4, name: 'Lunch on the House', description: 'Reimbursed lunch up to $30', cost: 300, quantity: 50, imageUrl: 'assets/rewards/lunch.png' },
  ];

  deleteReward(id: number) {
    this.rewards = this.rewards.filter(r => r.id !== id);
  }
}
