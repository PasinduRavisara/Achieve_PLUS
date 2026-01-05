package com.achieveplusbe.repository;

import com.achieveplusbe.model.Achievement;
import com.achieveplusbe.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AchievementRepository extends JpaRepository<Achievement, Long> {
    List<Achievement> findByUser(User user);
    List<Achievement> findByUserId(Long userId);
} 