package com.achieveplusbe.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "notifications")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_id", nullable = false)
    private User recipient;

    private String message;
    
    private String type; // INFO, SUCCESS, WARNING, ERROR

    private Long relatedId; // taskId or rewardId

    private boolean isRead = false;

    private LocalDateTime createdAt = LocalDateTime.now();
}
