package com.achieveplusbe.service;

import com.achieveplusbe.dto.RewardDTO;
import com.achieveplusbe.model.Reward;
import com.achieveplusbe.model.User;
import com.achieveplusbe.repository.RewardRepository;
import com.achieveplusbe.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import org.springframework.web.multipart.MultipartFile;

@Service
@SuppressWarnings("null")
public class RewardService {

    @Autowired
    private RewardRepository rewardRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

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
    public RewardDTO createReward(RewardDTO rewardDTO, MultipartFile file) {
        if (file != null && !file.isEmpty()) {
            String imageUrl = saveImage(file);
            rewardDTO.setImageUrl(imageUrl);
        }
        
        Reward reward = convertToEntity(rewardDTO);
        Reward savedReward = rewardRepository.save(reward);

        // Notify Employees
        notificationService.notifyAllEmployees("New Reward Available: " + savedReward.getName(), "SUCCESS", savedReward.getId());

        return convertToDTO(savedReward);
    }

    @Transactional
    public RewardDTO updateReward(Long id, RewardDTO rewardDTO, MultipartFile file) {
        Reward existingReward = rewardRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Reward not found with id: " + id));
        
        if (file != null && !file.isEmpty()) {
            String imageUrl = saveImage(file);
            existingReward.setImageUrl(imageUrl);
        } else if (rewardDTO.getImageUrl() != null) {
            existingReward.setImageUrl(rewardDTO.getImageUrl());
        }

        existingReward.setName(rewardDTO.getName());
        existingReward.setDescription(rewardDTO.getDescription());
        existingReward.setPointsCost(rewardDTO.getPointsCost());
        existingReward.setQuantity(rewardDTO.getQuantity());
        // imageUrl is handled above

        Reward updatedReward = rewardRepository.save(existingReward);
        return convertToDTO(updatedReward);
    }

    private String saveImage(MultipartFile file) {
        try {
            Path uploadPath = Paths.get("src/main/resources/static/uploads/rewards");
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            // Return the URL path (relative to context path /api)
            // Since we mapped /uploads/** to the file system, we return that path.
            // But wait, the context path is /api.
            // If the frontend accesses /api/uploads/rewards/..., then we should return /uploads/rewards/...
            // But if the frontend uses a full URL, it might be simpler.
            // Let's assume the frontend appends the base URL or uses it as is.
            // However, RewardDTO usually stores the full URL or a relative path correctly.
            // Let's store a relative path that works with the resource handler.
            // Resource handler maps /uploads/**.
            // So we need to return http://localhost:8080/api/uploads/rewards/filename
            // Or just /api/uploads/rewards/filename
            
            return "/api/uploads/rewards/" + filename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file " + file.getOriginalFilename(), e);
        }
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

        // Check if user has enough points (using persisted balance)
        if (user.getPoints() < reward.getPointsCost()) {
            return false;
        }

        // Deduct points from user's balance
        user.setPoints(user.getPoints() - reward.getPointsCost());
        userRepository.save(user);

        reward.setQuantity(reward.getQuantity() - 1);
        rewardRepository.save(reward);

        // Notify Admin/System about purchase if needed (optional)
        
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