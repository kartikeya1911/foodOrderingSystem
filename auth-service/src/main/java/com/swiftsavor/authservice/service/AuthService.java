package com.swiftsavor.authservice.service;

import com.swiftsavor.authservice.dto.AuthResponse;
import com.swiftsavor.authservice.dto.LoginRequest;
import com.swiftsavor.authservice.dto.RegisterRequest;
import com.swiftsavor.authservice.entity.User;
import com.swiftsavor.authservice.exception.UserAlreadyExistsException;
import com.swiftsavor.authservice.repository.UserRepository;
import com.swiftsavor.authservice.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private RestTemplate restTemplate;

    public AuthResponse register(RegisterRequest request) {
        // Check if username exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new UserAlreadyExistsException("Username already exists");
        }

        // Check if email exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("Email already exists");
        }

        // Create new user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        user.setRole(request.getRole());
        user.setIsActive(true);

        User savedUser = userRepository.save(user);

        // Create user profile in user-service
        try {
            createUserProfile(savedUser);
        } catch (Exception e) {
            // Log error but don't fail registration
            System.err.println("Failed to create user profile in user-service: " + e.getMessage());
        }

        // Generate JWT token
        String token = jwtUtil.generateToken(savedUser);

        return new AuthResponse(
                token,
                savedUser.getUsername(),
                savedUser.getEmail(),
                savedUser.getFullName(),
                savedUser.getRole(),
                "User registered successfully"
        );
    }

    private void createUserProfile(User user) {
        String url = "http://user-service/users";
        
        Map<String, String> profileData = new HashMap<>();
        profileData.put("username", user.getUsername());
        profileData.put("email", user.getEmail());
        profileData.put("fullName", user.getFullName());
        profileData.put("role", user.getRole().toString());
        profileData.put("phone", user.getPhone());
        profileData.put("address", user.getAddress());
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        HttpEntity<Map<String, String>> request = new HttpEntity<>(profileData, headers);
        
        restTemplate.postForObject(url, request, Object.class);
    }

    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Invalid username or password");
        }

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BadCredentialsException("User not found"));

        if (!user.getIsActive()) {
            throw new BadCredentialsException("User account is inactive");
        }

        // Ensure user profile exists in user-service
        try {
            createUserProfile(user);
        } catch (Exception e) {
            // Log error but don't fail login
            System.err.println("Failed to sync user profile in user-service: " + e.getMessage());
        }

        // Generate JWT token
        String token = jwtUtil.generateToken(user);

        return new AuthResponse(
                token,
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getRole(),
                "Login successful"
        );
    }
}
