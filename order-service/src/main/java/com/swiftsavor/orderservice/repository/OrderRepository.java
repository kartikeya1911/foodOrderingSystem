package com.swiftsavor.orderservice.repository;

import com.swiftsavor.orderservice.entity.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> findByUsername(String username);
    List<Order> findByRestaurantId(Long restaurantId);
    List<Order> findByStatus(Order.OrderStatus status);
}
