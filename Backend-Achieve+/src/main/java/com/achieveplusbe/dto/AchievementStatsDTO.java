package com.achieveplusbe.dto;

import lombok.Data;



@Data
public class AchievementStatsDTO {
    private long totalBadges;
    private long tasksCompleted;
    private long totalPoints;
    private long currentStreak;
    private long goldBadges;
    private long silverBadges;
    private long bronzeBadges;
} 