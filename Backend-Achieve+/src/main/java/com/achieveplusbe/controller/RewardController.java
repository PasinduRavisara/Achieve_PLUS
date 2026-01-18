package com.achieveplusbe.controller;

import com.achieveplusbe.dto.RewardDTO;
import com.achieveplusbe.service.RewardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/rewards")
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

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAuthority('Admin')")
    public ResponseEntity<RewardDTO> createReward(
            @RequestPart("reward") String rewardDTOStr,
            @RequestPart(value = "file", required = false) MultipartFile file) throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        RewardDTO rewardDTO = mapper.readValue(rewardDTOStr, RewardDTO.class);
        return ResponseEntity.ok(rewardService.createReward(rewardDTO, file));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAuthority('Admin')")
    public ResponseEntity<RewardDTO> updateReward(
            @PathVariable Long id, 
            @RequestPart("reward") String rewardDTOStr,
            @RequestPart(value = "file", required = false) MultipartFile file) throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        RewardDTO rewardDTO = mapper.readValue(rewardDTOStr, RewardDTO.class);
        return ResponseEntity.ok(rewardService.updateReward(id, rewardDTO, file));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('Admin')")
    public ResponseEntity<Void> deleteReward(@PathVariable Long id) {
        rewardService.deleteReward(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/purchase")
    @PreAuthorize("hasAuthority('Employee')")
    public ResponseEntity<Boolean> purchaseReward(@PathVariable Long id, @RequestParam Long userId) {
        return ResponseEntity.ok(rewardService.purchaseReward(userId, id));
    }
} 