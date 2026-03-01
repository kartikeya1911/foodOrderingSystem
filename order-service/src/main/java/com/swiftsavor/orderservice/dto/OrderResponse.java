package com.swiftsavor.orderservice.dto;

import com.swiftsavor.orderservice.entity.Order;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private String id;
    private String username;
    private Long restaurantId;
    private String restaurantName;
    private List<Order.OrderItem> items;
    private BigDecimal totalAmount;
    private Order.OrderStatus status;
    private String deliveryAddress;
    private String phone;
    private String paymentId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
