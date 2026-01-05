package com.achieveplusbe.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AchievementDTO {
    private Long id;
    private Long userId;
    private String userName;
    private Long taskId;
    private String taskTitle;
    private String type;
    private String badge;
    private String description;
    private String earnedAt;
} 