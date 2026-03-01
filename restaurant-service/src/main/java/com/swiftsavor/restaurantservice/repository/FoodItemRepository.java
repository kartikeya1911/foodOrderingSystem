package com.swiftsavor.restaurantservice.repository;

import com.swiftsavor.restaurantservice.entity.FoodItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodItemRepository extends JpaRepository<FoodItem, Long> {
    List<FoodItem> findByRestaurantId(Long restaurantId);
    List<FoodItem> findByCategory(String category);
    List<FoodItem> findByIsVegetarian(Boolean isVegetarian);
    List<FoodItem> findByRestaurantIdAndIsAvailable(Long restaurantId, Boolean isAvailable);
}
