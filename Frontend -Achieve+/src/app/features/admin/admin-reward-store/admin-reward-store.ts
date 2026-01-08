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
    { id: 1, name: '$25 Amazon Gift Card', cost: 500, stock: 10, icon: 'bi-gift' },
    { id: 2, name: 'Extra Day Off', cost: 2000, stock: 5, icon: 'bi-brightness-high' },
    { id: 3, name: 'Company Swag Pack', cost: 800, stock: 20, icon: 'bi-bag-heart' },
    { id: 4, name: 'Lunch on the House', cost: 300, stock: 50, icon: 'bi-cup-hot' },
  ];

  updateStock(item: any, change: number) {
    item.stock += change;
    if (item.stock < 0) item.stock = 0;
  }
}
