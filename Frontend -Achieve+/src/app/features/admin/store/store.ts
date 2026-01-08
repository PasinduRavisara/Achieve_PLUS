import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlassCard } from '../../../shared/components/glass-card/glass-card';

@Component({
  selector: 'app-admin-store',
  standalone: true,
  imports: [CommonModule, GlassCard],
  templateUrl: './store.html',
  styleUrl: './store.css'
})
export class Store {
  inventory = [
    { id: 1, title: 'Amazon Gift Card $50', stock: 50, cost: 500, active: true },
    { id: 2, title: 'Half Day Off', stock: 999, cost: 1000, active: true },
    { id: 3, title: 'Company Swag Pack', stock: 12, cost: 300, active: false }, // Low stock hidden? No, just inactive maybe
    { id: 4, title: 'Gym Membership', stock: 100, cost: 800, active: true },
  ];
}
