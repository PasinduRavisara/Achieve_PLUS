package com.achieveplusbe.repository;

import com.achieveplusbe.model.SystemLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SystemLogRepository extends JpaRepository<SystemLog, Long> {
    List<SystemLog> findByTimestampAfter(LocalDateTime timestamp);
    List<SystemLog> findByActionAndTimestampAfter(String action, LocalDateTime timestamp);
}
