package com.swiftsavor.userservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateProfileRequest {
    
    @NotBlank(message = "Full name is required")
    private String fullName;
    
    @Email(message = "Email should be valid")
    private String email;
    
    private String phone;
    
    private String address;
}
