package com.achieveplusbe.service;

import com.achieveplusbe.model.MoodLog;
import com.achieveplusbe.model.User;
import com.achieveplusbe.model.Task;
import com.achieveplusbe.repository.MoodLogRepository;
import com.achieveplusbe.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class WellnessService {
    private final MoodLogRepository moodLogRepository;
    private final UserRepository userRepository;

    @Transactional
    public void logMood(String email, String mood, String note) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        MoodLog log = new MoodLog();
        log.setUser(user);
        log.setMood(mood);
        log.setNote(note);
        moodLogRepository.save(log);
    }

    @Transactional(readOnly = true)
    public List<MoodLog> getUserMoodHistory(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        return moodLogRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getWorkloadStats(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        List<Task> tasks = user.getAssignedTasks();
        
        long completed = tasks.stream().filter(t -> t.getStatus() == Task.TaskStatus.COMPLETED).count();
        long inProgress = tasks.stream().filter(t -> t.getStatus() == Task.TaskStatus.IN_PROGRESS).count();
        long pending = tasks.stream().filter(t -> t.getStatus() == Task.TaskStatus.PENDING).count();

        return Map.of(
            "completed", completed,
            "inProgress", inProgress,
            "pending", pending,
            "total", (long) tasks.size()
        );
    }
}
