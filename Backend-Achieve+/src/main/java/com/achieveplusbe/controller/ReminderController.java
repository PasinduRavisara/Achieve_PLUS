package com.achieveplusbe.controller;

import com.achieveplusbe.model.Reminder;
import org.springframework.lang.NonNull;
import com.achieveplusbe.service.ReminderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/reminders")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:4200"})
public class ReminderController {
    
    private final ReminderService reminderService;

    @GetMapping
    public ResponseEntity<List<Reminder>> getMyReminders() {
        return ResponseEntity.ok(reminderService.getMyReminders());
    }

    @PostMapping
    public ResponseEntity<Reminder> createReminder(@RequestBody Map<String, String> payload) {
        String text = payload.get("text");
        String timeStr = payload.get("reminderTime");
        java.time.LocalDateTime reminderTime = null;
        if(timeStr != null && !timeStr.isEmpty()) {
             reminderTime = java.time.LocalDateTime.parse(timeStr);
        }
        return ResponseEntity.ok(reminderService.createReminder(text, reminderTime));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReminder(@PathVariable @NonNull Long id) {
        reminderService.deleteReminder(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Reminder> updateReminder(@PathVariable @NonNull Long id, @RequestBody Map<String, String> payload) {
        String text = payload.get("text");
        String timeStr = payload.get("reminderTime");
        java.time.LocalDateTime reminderTime = null;
        if(timeStr != null && !timeStr.isEmpty()) {
             reminderTime = java.time.LocalDateTime.parse(timeStr);
        }
        return ResponseEntity.ok(reminderService.updateReminder(id, text, reminderTime));
    }
}
