import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlassCard } from '../../../shared/components/glass-card/glass-card';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
}

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [CommonModule, GlassCard],
  templateUrl: './store.html',
  styleUrl: './store.css'
})
export class Store {
  userPoints = 2450;

  products: Product[] = [
    { id: 1, title: 'Amazon Gift Card $50', price: 500, image: '🎁', category: 'Voucher' },
    { id: 2, title: 'Half Day Off', price: 1000, image: '🏖️', category: 'Time Off' },
    { id: 3, title: 'Company Swag Pack', price: 300, image: '👕', category: 'Merch' },
    { id: 4, title: 'Gym Membership (1 Mo)', price: 800, image: '💪', category: 'Wellness' },
    { id: 5, title: 'Lunch with CEO', price: 5000, image: '🍽️', category: 'Experience' },
    { id: 6, title: 'Premium Headset', price: 1500, image: '🎧', category: 'Electronics' },
  ];
}
