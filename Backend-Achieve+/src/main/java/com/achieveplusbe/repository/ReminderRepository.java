package com.achieveplusbe.repository;

import com.achieveplusbe.model.Reminder;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReminderRepository extends JpaRepository<Reminder, Long> {
    List<Reminder> findByUserIdOrderByCreatedAtDesc(Long userId);
}
