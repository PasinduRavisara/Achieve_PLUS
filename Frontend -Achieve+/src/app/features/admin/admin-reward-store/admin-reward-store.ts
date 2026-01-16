import { Component, ChangeDetectorRef } from '@angular/core';
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

  showModal = false;
  isEditing = false;
  currentReward: any = {
    name: '',
    description: '',
    pointsCost: 0,
    quantity: 0,
    imageUrl: ''
  };

  constructor(private rewardService: RewardService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.refreshRewards();
  }

  refreshRewards() {
    this.rewardService.getAllRewards().subscribe({
      next: (data) => {
        // Map pointsCost to cost for template compatibility
        this.rewards = data.map(r => ({ ...r, cost: r.pointsCost }));
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load rewards', err)
    });
  }

  errorMessage = '';

  openModal(reward?: any) {
    this.errorMessage = ''; // Reset error
    if (reward) {
      this.isEditing = true;
      // Deep copy to avoid binding issues with table
      this.currentReward = { ...reward, pointsCost: reward.pointsCost || reward.cost };
    } else {
      this.isEditing = false;
      this.currentReward = {
        name: '',
        description: '',
        pointsCost: null,
        quantity: null,
        imageUrl: ''
      };
    }
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.errorMessage = '';
  }

  saveReward() {
    // Validation
    if (!this.currentReward.name || !this.currentReward.name.trim()) {
      this.errorMessage = 'Reward name is required';
      return;
    }
    if (this.currentReward.pointsCost === null || this.currentReward.pointsCost < 0) {
      this.errorMessage = 'Valid points cost is required';
      return;
    }
    if (this.currentReward.quantity === null || this.currentReward.quantity < 0) {
      this.errorMessage = 'Valid quantity is required';
      return;
    }

    // Optional URL Validation
    if (this.currentReward.imageUrl && this.currentReward.imageUrl.trim()) {
      try {
        new URL(this.currentReward.imageUrl);
      } catch (_) {
        this.errorMessage = 'Please enter a valid URL';
        return;
      }
    }

    if (this.isEditing) {
      this.rewardService.updateReward(this.currentReward.id, this.currentReward).subscribe({
        next: () => {
          this.refreshRewards();
          this.closeModal();
        },
        error: (err) => console.error('Failed to update reward', err)
      });
    } else {
      this.rewardService.createReward(this.currentReward).subscribe({
        next: () => {
          this.refreshRewards();
          this.closeModal();
        },
        error: (err) => console.error('Failed to create reward', err)
      });
    }
  }

  // Delete Modal Logic
  showDeleteModal = false;
  rewardToDelete: number | null = null;

  openDeleteModal(id: number) {
    this.rewardToDelete = id;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.rewardToDelete = null;
  }

  confirmDelete() {
    if (this.rewardToDelete) {
      this.rewardService.deleteReward(this.rewardToDelete).subscribe({
        next: () => {
          this.refreshRewards();
          this.closeDeleteModal();
        },
        error: (err) => console.error('Failed to delete reward', err)
      });
    }
  }
}
