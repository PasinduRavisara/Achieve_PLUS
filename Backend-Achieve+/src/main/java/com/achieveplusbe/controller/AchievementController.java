package com.achieveplusbe.controller;

import com.achieveplusbe.dto.AchievementDTO;
import com.achieveplusbe.dto.AchievementStatsDTO;
import com.achieveplusbe.service.AchievementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/achievements")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
@RequiredArgsConstructor
public class AchievementController {

    private final AchievementService achievementService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AchievementDTO>> getUserAchievements(@PathVariable Long userId) {
        return ResponseEntity.ok(achievementService.getUserAchievements(userId));
    }

    @GetMapping("/user/{userId}/stats")
    public ResponseEntity<AchievementStatsDTO> getUserAchievementStats(@PathVariable Long userId) {
        return ResponseEntity.ok(achievementService.getUserAchievementStats(userId));
    }
}



