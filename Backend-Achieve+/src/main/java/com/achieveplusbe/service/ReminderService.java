package com.achieveplusbe.service;

import com.achieveplusbe.model.Reminder;
import com.achieveplusbe.model.User;
import com.achieveplusbe.repository.ReminderRepository;
import com.achieveplusbe.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReminderService {
    private final ReminderRepository reminderRepository;
    private final UserRepository userRepository;

    @Transactional
    public Reminder createReminder(String text, java.time.LocalDateTime reminderTime) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        
        Reminder reminder = new Reminder();
        reminder.setUser(user);
        reminder.setText(text);
        reminder.setReminderTime(reminderTime);
        return reminderRepository.save(reminder);
    }

    public List<Reminder> getMyReminders() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        return reminderRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    @Transactional
    public void deleteReminder(Long id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        
        Reminder reminder = reminderRepository.findById(id).orElseThrow();
        if(!reminder.getUser().getId().equals(user.getId())) {
             throw new RuntimeException("Unauthorized");
        }
        reminderRepository.delete(reminder);
    }

    @Transactional
    public Reminder updateReminder(Long id, String text, java.time.LocalDateTime reminderTime) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        
        Reminder reminder = reminderRepository.findById(id).orElseThrow();
        if(!reminder.getUser().getId().equals(user.getId())) {
             throw new RuntimeException("Unauthorized");
        }
        reminder.setText(text);
        reminder.setReminderTime(reminderTime);
        return reminderRepository.save(reminder);
    }
}
