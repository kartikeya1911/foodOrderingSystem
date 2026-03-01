package com.swiftsavor.orderservice.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AddToCartRequest {
    
    @NotNull(message = "Food item ID is required")
    private Long foodItemId;
    
    @NotNull(message = "Restaurant ID is required")
    private Long restaurantId;
    
    private String restaurantName;
    
    private String foodItemName;
    
    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;
    
    @NotNull(message = "Price is required")
    private java.math.BigDecimal price;
}
