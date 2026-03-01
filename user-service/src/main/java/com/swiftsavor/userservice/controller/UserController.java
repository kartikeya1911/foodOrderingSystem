package com.swiftsavor.userservice.controller;

import com.swiftsavor.userservice.dto.CreateUserRequest;
import com.swiftsavor.userservice.dto.UserProfileResponse;
import com.swiftsavor.userservice.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<UserProfileResponse> createUser(@Valid @RequestBody CreateUserRequest request) {
        userService.createOrUpdateUserProfile(
                request.getUsername(),
                request.getEmail(),
                request.getFullName(),
                request.getRole()
        );
        UserProfileResponse profile = userService.getUserProfile(request.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(profile);
    }

    @GetMapping("/all")
    public ResponseEntity<List<UserProfileResponse>> getAllUsers(
            @RequestHeader("X-User-Role") String role) {
        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(403).build();
        }
        List<UserProfileResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PutMapping("/{userId}/toggle-status")
    public ResponseEntity<UserProfileResponse> toggleUserStatus(
            @PathVariable Long userId,
            @RequestHeader("X-User-Role") String role) {
        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(403).build();
        }
        UserProfileResponse user = userService.toggleUserStatus(userId);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("User Service is running");
    }
}
