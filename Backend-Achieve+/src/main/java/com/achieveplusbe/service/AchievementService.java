package com.achieveplusbe.service;

import com.achieveplusbe.dto.AchievementDTO;
import com.achieveplusbe.dto.AchievementStatsDTO;
import com.achieveplusbe.model.Achievement;
import com.achieveplusbe.model.Task;
import com.achieveplusbe.model.User;
import com.achieveplusbe.repository.AchievementRepository;
import com.achieveplusbe.repository.TaskRepository;
import com.achieveplusbe.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AchievementService {

    private final AchievementRepository achievementRepository;
    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    @Transactional
    public AchievementDTO createAchievement(Task task, User user) {
        Achievement achievement = Achievement.builder()
                .user(user)
                .task(task)
                .type("EARLY_COMPLETION")
                .badge("SPEED_STAR")
                .description("Completed task '" + task.getTitle() + "' before the due date!")
                .build();

        Achievement savedAchievement = achievementRepository.save(achievement);
        return convertToDTO(savedAchievement);
    }

    public List<AchievementDTO> getUserAchievements(Long userId) {
        return achievementRepository.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public AchievementStatsDTO getUserAchievementStats(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Achievement> achievements = achievementRepository.findByUserId(userId);

        // Calculate total badges (achievements earned)
        long totalBadges = achievements.size();

        // Calculate total points only from tasks that earned achievements
        long totalPoints = achievements.stream()
                .map(Achievement::getTask)
                .mapToInt(Task::getPoints)
                .sum();

        // Calculate tasks completed with achievements
        long tasksCompleted = achievements.size();

        // Calculate current streak (consecutive days with completed tasks)
        long currentStreak = calculateCurrentStreak(user);

        AchievementStatsDTO stats = new AchievementStatsDTO();
        stats.setTotalBadges(totalBadges);
        stats.setTasksCompleted(tasksCompleted);
        stats.setTotalPoints(totalPoints);
        stats.setCurrentStreak(currentStreak);

        return stats;
    }

    private long calculateCurrentStreak(User user) {
        // Get completed tasks ordered by completion date
        List<Task> completedTasks = taskRepository.findByAssignedUserAndStatus(user, Task.TaskStatus.COMPLETED);
        if (completedTasks.isEmpty()) {
            return 0;
        }

        // Sort tasks by updated_at date (completion date) in descending order
        completedTasks.sort((t1, t2) -> t2.getUpdatedAt().compareTo(t1.getUpdatedAt()));

        // Calculate streak
        long streak = 1;
        LocalDateTime lastDate = completedTasks.get(0).getUpdatedAt().toLocalDate().atStartOfDay();

        for (int i = 1; i < completedTasks.size(); i++) {
            LocalDateTime currentDate = completedTasks.get(i).getUpdatedAt().toLocalDate().atStartOfDay();
            if (lastDate.minusDays(1).equals(currentDate)) {
                streak++;
                lastDate = currentDate;
            } else {
                break;
            }
        }

        return streak;
    }

    private AchievementDTO convertToDTO(Achievement achievement) {
        return AchievementDTO.builder()
                .id(achievement.getId())
                .userId(achievement.getUser().getId())
                .userName(achievement.getUser().getFullName())
                .taskId(achievement.getTask().getId())
                .taskTitle(achievement.getTask().getTitle())
                .type(achievement.getType())
                .badge(achievement.getBadge())
                .description(achievement.getDescription())
                .earnedAt(achievement.getEarnedAt().format(DATE_FORMATTER))
                .build();
    }
}