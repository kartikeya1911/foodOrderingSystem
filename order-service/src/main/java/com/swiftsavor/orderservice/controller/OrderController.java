package com.swiftsavor.orderservice.controller;

import com.swiftsavor.orderservice.dto.AddToCartRequest;
import com.swiftsavor.orderservice.dto.CartResponse;
import com.swiftsavor.orderservice.dto.PlaceOrderRequest;
import com.swiftsavor.orderservice.dto.OrderResponse;
import com.swiftsavor.orderservice.entity.Order;
import com.swiftsavor.orderservice.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/cart")
    public ResponseEntity<CartResponse> addToCart(
            @RequestHeader("X-User-Username") String username,
            @Valid @RequestBody AddToCartRequest request) {
        CartResponse response = orderService.addToCart(username, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/cart")
    public ResponseEntity<CartResponse> getCart(@RequestHeader("X-User-Username") String username) {
        CartResponse response = orderService.getCart(username);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/cart/items/{foodItemId}")
    public ResponseEntity<Void> removeFromCart(
            @RequestHeader("X-User-Username") String username,
            @PathVariable Long foodItemId) {
        orderService.removeFromCart(username, foodItemId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/cart")
    public ResponseEntity<Void> clearCart(@RequestHeader("X-User-Username") String username) {
        orderService.clearCart(username);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<OrderResponse> placeOrder(
            @RequestHeader("X-User-Username") String username,
            @Valid @RequestBody PlaceOrderRequest request) {
        OrderResponse response = orderService.placeOrder(username, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable String orderId) {
        OrderResponse response = orderService.getOrderById(orderId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-orders")
    public ResponseEntity<List<OrderResponse>> getMyOrders(@RequestHeader("X-User-Username") String username) {
        List<OrderResponse> orders = orderService.getMyOrders(username);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/all")
    public ResponseEntity<List<OrderResponse>> getAllOrders(@RequestHeader("X-User-Role") String role) {
        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(403).build();
        }
        List<OrderResponse> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<OrderResponse>> getOrdersByRestaurant(
            @PathVariable Long restaurantId,
            @RequestHeader("X-User-Role") String role) {
        if (!"ADMIN".equals(role) && !"RESTAURANT_OWNER".equals(role)) {
            return ResponseEntity.status(403).build();
        }
        List<OrderResponse> orders = orderService.getOrdersByRestaurant(restaurantId);
        return ResponseEntity.ok(orders);
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable String orderId,
            @RequestParam Order.OrderStatus status,
            @RequestHeader("X-User-Role") String role) {
        if (!"ADMIN".equals(role) && !"RESTAURANT_OWNER".equals(role)) {
            return ResponseEntity.status(403).build();
        }
        OrderResponse response = orderService.updateOrderStatus(orderId, status);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Order Service is running");
    }
}
