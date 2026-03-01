package com.swiftsavor.orderservice.service;

import com.swiftsavor.orderservice.dto.AddToCartRequest;
import com.swiftsavor.orderservice.dto.CartResponse;
import com.swiftsavor.orderservice.dto.PlaceOrderRequest;
import com.swiftsavor.orderservice.dto.OrderResponse;
import com.swiftsavor.orderservice.dto.PaymentRequest;
import com.swiftsavor.orderservice.dto.PaymentResponse;
import com.swiftsavor.orderservice.entity.Cart;
import com.swiftsavor.orderservice.entity.Order;
import com.swiftsavor.orderservice.client.PaymentClient;
import com.swiftsavor.orderservice.exception.ResourceNotFoundException;
import com.swiftsavor.orderservice.repository.CartRepository;
import com.swiftsavor.orderservice.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private PaymentClient paymentClient;

    public CartResponse addToCart(String username, AddToCartRequest request) {
        Optional<Cart> existingCart = cartRepository.findByUsername(username);
        
        Cart cart;
        if (existingCart.isPresent()) {
            cart = existingCart.get();
            
            // Check if cart belongs to same restaurant
            if (!cart.getRestaurantId().equals(request.getRestaurantId())) {
                throw new RuntimeException("You can only order from one restaurant at a time. Please clear your cart first.");
            }
        } else {
            cart = new Cart();
            cart.setUsername(username);
            cart.setRestaurantId(request.getRestaurantId());
            cart.setRestaurantName(request.getRestaurantName());
            cart.setItems(new ArrayList<>());
        }
        
        // Check if item already exists in cart
        Optional<Cart.CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getFoodItemId().equals(request.getFoodItemId()))
                .findFirst();
        
        if (existingItem.isPresent()) {
            // Update quantity
            Cart.CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
            item.setSubtotal(item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
        } else {
            // Add new item
            Cart.CartItem newItem = new Cart.CartItem();
            newItem.setFoodItemId(request.getFoodItemId());
            newItem.setFoodItemName(request.getFoodItemName());
            newItem.setQuantity(request.getQuantity());
            newItem.setPrice(request.getPrice());
            newItem.setSubtotal(request.getPrice().multiply(BigDecimal.valueOf(request.getQuantity())));
            cart.getItems().add(newItem);
        }
        
        // Calculate total
        BigDecimal total = cart.getItems().stream()
                .map(Cart.CartItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        cart.setTotalAmount(total);
        cart.setUpdatedAt(LocalDateTime.now());
        
        Cart savedCart = cartRepository.save(cart);
        return mapToCartResponse(savedCart);
    }

    public CartResponse getCart(String username) {
        Cart cart = cartRepository.findByUsername(username)
                .orElse(new Cart(null, username, null, null, new ArrayList<>(), BigDecimal.ZERO, LocalDateTime.now(), LocalDateTime.now()));
        return mapToCartResponse(cart);
    }

    public void removeFromCart(String username, Long foodItemId) {
        Cart cart = cartRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
        
        cart.getItems().removeIf(item -> item.getFoodItemId().equals(foodItemId));
        
        // Recalculate total
        BigDecimal total = cart.getItems().stream()
                .map(Cart.CartItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        cart.setTotalAmount(total);
        cart.setUpdatedAt(LocalDateTime.now());
        
        if (cart.getItems().isEmpty()) {
            cartRepository.delete(cart);
        } else {
            cartRepository.save(cart);
        }
    }

    public void clearCart(String username) {
        cartRepository.deleteByUsername(username);
    }

    public OrderResponse placeOrder(String username, PlaceOrderRequest request) {
        Cart cart = cartRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Cart is empty"));
        
        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }
        
        // Create order from cart
        Order order = new Order();
        order.setUsername(username);
        order.setRestaurantId(cart.getRestaurantId());
        order.setRestaurantName(cart.getRestaurantName());
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setPhone(request.getPhone());
        order.setStatus(Order.OrderStatus.PENDING);
        order.setTotalAmount(cart.getTotalAmount());
        
        // Convert cart items to order items
        List<Order.OrderItem> orderItems = cart.getItems().stream()
                .map(cartItem -> new Order.OrderItem(
                        cartItem.getFoodItemId(),
                        cartItem.getFoodItemName(),
                        cartItem.getQuantity(),
                        cartItem.getPrice(),
                        cartItem.getSubtotal()
                ))
                .collect(Collectors.toList());
        order.setItems(orderItems);
        
        Order savedOrder = orderRepository.save(order);
        
        // Process payment
        try {
            PaymentRequest paymentRequest = new PaymentRequest(
                    savedOrder.getId(),
                    savedOrder.getTotalAmount(),
                    username
            );
            PaymentResponse paymentResponse = paymentClient.processPayment(paymentRequest);
            
            if ("SUCCESS".equals(paymentResponse.getStatus())) {
                savedOrder.setPaymentId(paymentResponse.getPaymentId());
                savedOrder.setStatus(Order.OrderStatus.CONFIRMED);
                savedOrder = orderRepository.save(savedOrder);
                
                // Clear cart after successful order
                cartRepository.deleteByUsername(username);
            } else {
                savedOrder.setStatus(Order.OrderStatus.CANCELLED);
                orderRepository.save(savedOrder);
                throw new RuntimeException("Payment failed: " + paymentResponse.getMessage());
            }
        } catch (Exception e) {
            savedOrder.setStatus(Order.OrderStatus.CANCELLED);
            orderRepository.save(savedOrder);
            throw new RuntimeException("Payment processing failed: " + e.getMessage());
        }
        
        return mapToOrderResponse(savedOrder);
    }

    public OrderResponse updateOrderStatus(String orderId, Order.OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
        
        order.setStatus(status);
        order.setUpdatedAt(LocalDateTime.now());
        Order updatedOrder = orderRepository.save(order);
        
        return mapToOrderResponse(updatedOrder);
    }

    public OrderResponse getOrderById(String orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
        return mapToOrderResponse(order);
    }

    public List<OrderResponse> getMyOrders(String username) {
        return orderRepository.findByUsername(username).stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());
    }

    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());
    }

    public List<OrderResponse> getOrdersByRestaurant(Long restaurantId) {
        return orderRepository.findByRestaurantId(restaurantId).stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());
    }

    private CartResponse mapToCartResponse(Cart cart) {
        return new CartResponse(
                cart.getId(),
                cart.getUsername(),
                cart.getRestaurantId(),
                cart.getRestaurantName(),
                cart.getItems(),
                cart.getTotalAmount()
        );
    }

    private OrderResponse mapToOrderResponse(Order order) {
        return new OrderResponse(
                order.getId(),
                order.getUsername(),
                order.getRestaurantId(),
                order.getRestaurantName(),
                order.getItems(),
                order.getTotalAmount(),
                order.getStatus(),
                order.getDeliveryAddress(),
                order.getPhone(),
                order.getPaymentId(),
                order.getCreatedAt(),
                order.getUpdatedAt()
        );
    }
}
