package com.swiftsavor.restaurantservice.repository;

import com.swiftsavor.restaurantservice.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    List<Restaurant> findByIsActive(Boolean isActive);
    List<Restaurant> findByOwnerUsername(String ownerUsername);
    List<Restaurant> findByCuisineContainingIgnoreCase(String cuisine);
    List<Restaurant> findByNameContainingIgnoreCase(String name);
}
