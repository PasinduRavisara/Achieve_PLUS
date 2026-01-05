package com.achieveplusbe.repository;

import com.achieveplusbe.model.Reward;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RewardRepository extends JpaRepository<Reward, Long> {
    List<Reward> findByQuantityGreaterThan(Integer quantity);
} 