package com.achieveplusbe.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "mood_logs")
public class MoodLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String mood; // HAPPY, NEUTRAL, STRESSED, TIRED
    
    private String note;

    private LocalDateTime createdAt = LocalDateTime.now();
}
