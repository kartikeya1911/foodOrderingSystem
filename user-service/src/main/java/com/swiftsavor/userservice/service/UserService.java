package com.swiftsavor.userservice.service;

import com.swiftsavor.userservice.dto.UserProfileResponse;
import com.swiftsavor.userservice.entity.UserProfile;
import com.swiftsavor.userservice.exception.UserNotFoundException;
import com.swiftsavor.userservice.repository.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserProfileRepository userProfileRepository;

    public UserProfileResponse getUserProfile(String username) {
        UserProfile profile = userProfileRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found with username: " + username));
        
        return mapToResponse(profile);
    }

    public List<UserProfileResponse> getAllUsers() {
        return userProfileRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public UserProfileResponse toggleUserStatus(Long userId) {
        UserProfile profile = userProfileRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));
        
        profile.setIsActive(!profile.getIsActive());
        UserProfile updatedProfile = userProfileRepository.save(profile);
        return mapToResponse(updatedProfile);
    }

    public void createOrUpdateUserProfile(String username, String email, String fullName, String role) {
        UserProfile profile = userProfileRepository.findByUsername(username)
                .orElse(new UserProfile());
        
        profile.setUsername(username);
        profile.setEmail(email);
        profile.setFullName(fullName);
        profile.setRole(UserProfile.Role.valueOf(role));
        
        if (profile.getId() == null) {
            profile.setIsActive(true);
        }
        
        userProfileRepository.save(profile);
    }

    private UserProfileResponse mapToResponse(UserProfile profile) {
        return new UserProfileResponse(
                profile.getId(),
                profile.getUsername(),
                profile.getEmail(),
                profile.getFullName(),
                profile.getPhone(),
                profile.getAddress(),
                profile.getRole(),
                profile.getIsActive(),
                profile.getCreatedAt(),
                profile.getUpdatedAt()
        );
    }
}
