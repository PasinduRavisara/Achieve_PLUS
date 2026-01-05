package com.achieveplusbe.service;

import com.achieveplusbe.dto.RewardDTO;
import com.achieveplusbe.model.Reward;
import com.achieveplusbe.model.User;
import com.achieveplusbe.model.Task;
import com.achieveplusbe.repository.RewardRepository;
import com.achieveplusbe.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RewardService {

    @Autowired
    private RewardRepository rewardRepository;

    @Autowired
    private UserRepository userRepository;

    public List<RewardDTO> getAllRewards() {
        return rewardRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<RewardDTO> getAvailableRewards() {
        return rewardRepository.findByQuantityGreaterThan(0).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public RewardDTO getRewardById(Long id) {
        return rewardRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new EntityNotFoundException("Reward not found with id: " + id));
    }

    @Transactional
    public RewardDTO createReward(RewardDTO rewardDTO) {
        Reward reward = convertToEntity(rewardDTO);
        Reward savedReward = rewardRepository.save(reward);
        return convertToDTO(savedReward);
    }

    @Transactional
    public RewardDTO updateReward(Long id, RewardDTO rewardDTO) {
        Reward existingReward = rewardRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Reward not found with id: " + id));
        
        existingReward.setName(rewardDTO.getName());
        existingReward.setDescription(rewardDTO.getDescription());
        existingReward.setPointsCost(rewardDTO.getPointsCost());
        existingReward.setQuantity(rewardDTO.getQuantity());
        existingReward.setImageUrl(rewardDTO.getImageUrl());

        Reward updatedReward = rewardRepository.save(existingReward);
        return convertToDTO(updatedReward);
    }

    @Transactional
    public void deleteReward(Long id) {
        if (!rewardRepository.existsById(id)) {
            throw new EntityNotFoundException("Reward not found with id: " + id);
        }
        rewardRepository.deleteById(id);
    }

    @Transactional
    public boolean purchaseReward(Long userId, Long rewardId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));
        
        Reward reward = rewardRepository.findById(rewardId)
                .orElseThrow(() -> new EntityNotFoundException("Reward not found with id: " + rewardId));

        if (reward.getQuantity() <= 0) {
            return false;
        }

        // Get user's current points from their achievements
        int userPoints = user.getAssignedTasks().stream()
                .filter(task -> task.getStatus() == Task.TaskStatus.COMPLETED)
                .mapToInt(Task::getPoints)
                .sum();

        // Check if user has enough points
        if (userPoints < reward.getPointsCost()) {
            return false;
        }

        // Deduct points from user's completed tasks
        // This is a simplified version - in a real application, you might want to
        // track points separately or implement a more sophisticated points system
        reward.setQuantity(reward.getQuantity() - 1);
        rewardRepository.save(reward);

        // TODO: Implement a proper points deduction system
        // For now, we'll just return true as the points are already earned from completed tasks
        
        return true;
    }

    private RewardDTO convertToDTO(Reward reward) {
        return RewardDTO.builder()
                .id(reward.getId())
                .name(reward.getName())
                .description(reward.getDescription())
                .pointsCost(reward.getPointsCost())
                .quantity(reward.getQuantity())
                .imageUrl(reward.getImageUrl())
                .build();
    }

    private Reward convertToEntity(RewardDTO rewardDTO) {
        return Reward.builder()
                .id(rewardDTO.getId())
                .name(rewardDTO.getName())
                .description(rewardDTO.getDescription())
                .pointsCost(rewardDTO.getPointsCost())
                .quantity(rewardDTO.getQuantity())
                .imageUrl(rewardDTO.getImageUrl())
                .build();
    }
} 