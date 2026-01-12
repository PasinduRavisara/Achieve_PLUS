package com.achieveplusbe.controller;

import com.achieveplusbe.model.MoodLog;
import com.achieveplusbe.service.WellnessService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/wellness")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:4200"})
public class WellnessController {
    
    private final WellnessService wellnessService;

    @PostMapping("/mood")
    public ResponseEntity<Void> logMood(@RequestBody Map<String, String> payload, Authentication authentication) {
        String mood = payload.get("mood");
        String note = payload.getOrDefault("note", "");
        wellnessService.logMood(authentication.getName(), mood, note);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/mood")
    public ResponseEntity<List<MoodLog>> getMoodHistory(Authentication authentication) {
        return ResponseEntity.ok(wellnessService.getUserMoodHistory(authentication.getName()));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats(Authentication authentication) {
        return ResponseEntity.ok(wellnessService.getWorkloadStats(authentication.getName()));
    }
}
