package com.swiftsavor.restaurantservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RestaurantRequest {
    
    @NotBlank(message = "Restaurant name is required")
    private String name;
    
    private String description;
    
    @NotBlank(message = "Address is required")
    private String address;
    
    private String phone;
    
    private String email;
    
    private String imageUrl;
    
    @NotBlank(message = "Cuisine is required")
    private String cuisine;
    
    private String openingHours;
}
