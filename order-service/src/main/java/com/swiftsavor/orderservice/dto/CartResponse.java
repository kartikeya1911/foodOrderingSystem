package com.swiftsavor.orderservice.dto;

import com.swiftsavor.orderservice.entity.Cart;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartResponse {
    private String id;
    private String username;
    private Long restaurantId;
    private String restaurantName;
    private List<Cart.CartItem> items;
    private BigDecimal totalAmount;
}
