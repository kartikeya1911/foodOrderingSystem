package com.swiftsavor.orderservice.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "carts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cart {
    
    @Id
    private String id;
    
    private String username;
    
    private Long restaurantId;
    
    private String restaurantName;
    
    private List<CartItem> items = new ArrayList<>();
    
    private BigDecimal totalAmount = BigDecimal.ZERO;
    
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CartItem {
        private Long foodItemId;
        private String foodItemName;
        private Integer quantity;
        private BigDecimal price;
        private BigDecimal subtotal;
    }
}
