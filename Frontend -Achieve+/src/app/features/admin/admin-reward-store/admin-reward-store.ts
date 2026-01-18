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
  uploadMode: 'url' | 'file' = 'url';

  openModal(reward?: any) {
    this.errorMessage = ''; // Reset error
    this.imagePreviewError = false; // Reset preview error
    this.uploadMode = 'url'; // Default to URL
    if (reward) {
      this.isEditing = true;
      // Deep copy to avoid binding issues with table
      this.currentReward = { ...reward, pointsCost: reward.pointsCost || reward.cost };
      
      // Check if it's a local upload
      if (this.currentReward.imageUrl && this.currentReward.imageUrl.includes('/api/uploads/')) {
        this.uploadMode = 'file';
      }

      // Ensure relative paths are displayed correctly
      if (this.currentReward.imageUrl && this.currentReward.imageUrl.startsWith('/api/')) {
        this.currentReward.imageUrl = 'http://localhost:8080' + this.currentReward.imageUrl;
      }
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
    this.selectedFile = null;
  }

  imagePreviewError = false;
  selectedFile: File | null = null;

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        this.errorMessage = 'Please upload a valid image file';
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        this.errorMessage = 'Image size must be less than 5MB';
        return;
      }
      
      this.selectedFile = file; // Store file for submission

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.currentReward.imageUrl = e.target.result;
        this.errorMessage = '';
        this.imagePreviewError = false;
        this.cdr.detectChanges(); // Force update
      };
      reader.readAsDataURL(file);
    }
  }

  handleImageError() {
    this.imagePreviewError = true;
  }

  resetImageError() {
    this.imagePreviewError = false;
    this.errorMessage = '';
  }

  toggleUploadMode(mode: 'url' | 'file') {
    this.uploadMode = mode;
    this.currentReward.imageUrl = ''; 
    this.imagePreviewError = false;
    this.errorMessage = '';
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
    if (this.currentReward.imageUrl && 
        this.currentReward.imageUrl.trim() && 
        !this.currentReward.imageUrl.startsWith('data:')) {
      try {
        new URL(this.currentReward.imageUrl);
      } catch (_) {
        this.errorMessage = 'Please enter a valid URL';
        return;
      }
    }

    // Prepare DTO
    const rewardToSave = { ...this.currentReward };

    // Strip localhost domain from internal URLs to keep DB relative
    if (rewardToSave.imageUrl && rewardToSave.imageUrl.startsWith('http://localhost:8080/api/')) {
      rewardToSave.imageUrl = rewardToSave.imageUrl.replace('http://localhost:8080', '');
    }
    
    // If uploading a file, clear the imageUrl in JSON to avoid sending Base64 string
    // The backend will generate the new URL from the file.
    if (this.uploadMode === 'file' && this.selectedFile) {
      rewardToSave.imageUrl = ''; 
    }

    if (this.isEditing) {
      // Pass the selected file (if any) to the update method
      const fileToUpload = (this.uploadMode === 'file' && this.selectedFile) ? this.selectedFile : undefined;

      this.rewardService.updateReward(this.currentReward.id, rewardToSave, fileToUpload).subscribe({
        next: () => {
          this.refreshRewards();
          this.closeModal();
        },
        error: (err) => {
          console.error('Failed to update reward', err);
          this.errorMessage = err.error?.message || 'Failed to update reward. Please try again.';
        }
      });
    } else {
       // Pass the selected file (if any) to the create method
       const fileToUpload = (this.uploadMode === 'file' && this.selectedFile) ? this.selectedFile : undefined;

      this.rewardService.createReward(rewardToSave, fileToUpload).subscribe({
        next: () => {
          this.refreshRewards();
          this.closeModal();
        },
        error: (err) => {
          console.error('Failed to create reward', err);
          this.errorMessage = err.error?.message || 'Failed to create reward. Please try again.';
        }
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
