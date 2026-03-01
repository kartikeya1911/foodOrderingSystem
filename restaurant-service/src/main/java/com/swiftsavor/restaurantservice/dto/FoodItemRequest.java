package com.swiftsavor.restaurantservice.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class FoodItemRequest {
    
    @NotBlank(message = "Food name is required")
    private String name;
    
    private String description;
    
    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal price;
    
    @NotBlank(message = "Category is required")
    private String category;
    
    private String imageUrl;
    
    @NotNull(message = "Vegetarian field is required")
    private Boolean isVegetarian;
    
    @NotNull(message = "Availability field is required")
    private Boolean isAvailable;
}
