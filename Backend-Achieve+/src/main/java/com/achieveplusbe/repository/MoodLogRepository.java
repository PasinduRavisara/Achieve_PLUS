package com.achieveplusbe.repository;

import com.achieveplusbe.model.MoodLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MoodLogRepository extends JpaRepository<MoodLog, Long> {
    List<MoodLog> findByUserIdOrderByCreatedAtDesc(Long userId);
}
