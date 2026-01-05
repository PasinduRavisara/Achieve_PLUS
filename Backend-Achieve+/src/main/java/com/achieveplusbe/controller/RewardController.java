package com.achieveplusbe.controller;

import com.achieveplusbe.dto.RewardDTO;
import com.achieveplusbe.service.RewardService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rewards")
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class RewardController {

    @Autowired
    private RewardService rewardService;

    @GetMapping
    public ResponseEntity<List<RewardDTO>> getAllRewards() {
        return ResponseEntity.ok(rewardService.getAllRewards());
    }

    @GetMapping("/available")
    public ResponseEntity<List<RewardDTO>> getAvailableRewards() {
        return ResponseEntity.ok(rewardService.getAvailableRewards());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RewardDTO> getRewardById(@PathVariable Long id) {
        return ResponseEntity.ok(rewardService.getRewardById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RewardDTO> createReward(@Valid @RequestBody RewardDTO rewardDTO) {
        return ResponseEntity.ok(rewardService.createReward(rewardDTO));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RewardDTO> updateReward(@PathVariable Long id, @Valid @RequestBody RewardDTO rewardDTO) {
        return ResponseEntity.ok(rewardService.updateReward(id, rewardDTO));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteReward(@PathVariable Long id) {
        rewardService.deleteReward(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/purchase")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<Boolean> purchaseReward(@PathVariable Long id, @RequestParam Long userId) {
        return ResponseEntity.ok(rewardService.purchaseReward(userId, id));
    }
} 