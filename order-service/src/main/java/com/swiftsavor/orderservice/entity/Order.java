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

@Document(collection = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    
    @Id
    private String id;
    
    private String username;
    
    private Long restaurantId;
    
    private String restaurantName;
    
    private List<OrderItem> items = new ArrayList<>();
    
    private BigDecimal totalAmount;
    
    private OrderStatus status = OrderStatus.PENDING;
    
    private String deliveryAddress;
    
    private String phone;
    
    private String paymentId;
    
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    public enum OrderStatus {
        PENDING,
        CONFIRMED,
        PREPARING,
        OUT_FOR_DELIVERY,
        DELIVERED,
        CANCELLED
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItem {
        private Long foodItemId;
        private String foodItemName;
        private Integer quantity;
        private BigDecimal price;
        private BigDecimal subtotal;
    }
}
