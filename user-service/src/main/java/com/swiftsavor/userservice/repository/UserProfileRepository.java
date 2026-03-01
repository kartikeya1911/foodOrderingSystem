package com.swiftsavor.userservice.repository;

import com.swiftsavor.userservice.entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    Optional<UserProfile> findByUsername(String username);
    List<UserProfile> findByIsActive(Boolean isActive);
    List<UserProfile> findByRole(UserProfile.Role role);
}
