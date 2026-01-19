package com.achieveplusbe.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommunityPostDTO {
    private Long id;
    private String content;
    private Long authorId;
    private String authorName;
    private String authorAvatar; // If we have avatar logic, otherwise maybe use placeholder in frontend
    private LocalDateTime createdAt;
    private int likeCount;
    private boolean isLikedByCurrentUser;
}
