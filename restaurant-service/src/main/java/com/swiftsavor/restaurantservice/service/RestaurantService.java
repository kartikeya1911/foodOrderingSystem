package com.swiftsavor.restaurantservice.service;

import com.swiftsavor.restaurantservice.dto.RestaurantRequest;
import com.swiftsavor.restaurantservice.dto.RestaurantResponse;
import com.swiftsavor.restaurantservice.entity.Restaurant;
import com.swiftsavor.restaurantservice.exception.ResourceNotFoundException;
import com.swiftsavor.restaurantservice.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RestaurantService {

    @Autowired
    private RestaurantRepository restaurantRepository;

    public RestaurantResponse createRestaurant(RestaurantRequest request, String ownerUsername) {
        Restaurant restaurant = new Restaurant();
        restaurant.setName(request.getName());
        restaurant.setDescription(request.getDescription());
        restaurant.setAddress(request.getAddress());
        restaurant.setPhone(request.getPhone());
        restaurant.setEmail(request.getEmail());
        restaurant.setImageUrl(request.getImageUrl());
        restaurant.setCuisine(request.getCuisine());
        restaurant.setOpeningHours(request.getOpeningHours());
        restaurant.setOpeningTime(request.getOpeningTime());
        restaurant.setClosingTime(request.getClosingTime());
        restaurant.setOwnerUsername(ownerUsername);
        restaurant.setIsActive(true);
        restaurant.setRating(0.0);
        restaurant.setRatingCount(0);
        
        Restaurant savedRestaurant = restaurantRepository.save(restaurant);
        return mapToResponse(savedRestaurant);
    }

    public RestaurantResponse updateRestaurant(Long id, RestaurantRequest request, String ownerUsername) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + id));
        
        if (!restaurant.getOwnerUsername().equals(ownerUsername)) {
            throw new RuntimeException("You don't have permission to update this restaurant");
        }
        
        restaurant.setName(request.getName());
        restaurant.setDescription(request.getDescription());
        restaurant.setAddress(request.getAddress());
        restaurant.setPhone(request.getPhone());
        restaurant.setEmail(request.getEmail());
        restaurant.setImageUrl(request.getImageUrl());
        restaurant.setCuisine(request.getCuisine());
        restaurant.setOpeningHours(request.getOpeningHours());
        restaurant.setOpeningTime(request.getOpeningTime());
        restaurant.setClosingTime(request.getClosingTime());
        
        Restaurant updatedRestaurant = restaurantRepository.save(restaurant);
        return mapToResponse(updatedRestaurant);
    }

    public RestaurantResponse getRestaurantById(Long id) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + id));
        return mapToResponse(restaurant);
    }

    public List<RestaurantResponse> getAllRestaurants() {
        return restaurantRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<RestaurantResponse> getActiveRestaurants() {
        return restaurantRepository.findByIsActive(true).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<RestaurantResponse> getMyRestaurants(String ownerUsername) {
        return restaurantRepository.findByOwnerUsername(ownerUsername).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public void deleteRestaurant(Long id, String ownerUsername) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + id));
        
        if (!restaurant.getOwnerUsername().equals(ownerUsername)) {
            throw new RuntimeException("You don't have permission to delete this restaurant");
        }
        
        restaurantRepository.delete(restaurant);
    }

    public RestaurantResponse rateRestaurant(Long id, Integer rating) {
        if (rating == null || rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }
        
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + id));
        
        // Calculate new average rating
        int currentCount = restaurant.getRatingCount() != null ? restaurant.getRatingCount() : 0;
        double currentRating = restaurant.getRating() != null ? restaurant.getRating() : 0.0;
        double totalRating = currentRating * currentCount;
        int newCount = currentCount + 1;
        double newRating = (totalRating + rating) / newCount;
        
        restaurant.setRating(Math.round(newRating * 10.0) / 10.0); // Round to 1 decimal
        restaurant.setRatingCount(newCount);
        
        Restaurant updatedRestaurant = restaurantRepository.save(restaurant);
        return mapToResponse(updatedRestaurant);
    }

    private RestaurantResponse mapToResponse(Restaurant restaurant) {
        return new RestaurantResponse(
                restaurant.getId(),
                restaurant.getName(),
                restaurant.getDescription(),
                restaurant.getAddress(),
                restaurant.getPhone(),
                restaurant.getEmail(),
                restaurant.getImageUrl(),
                restaurant.getOwnerUsername(),
                restaurant.getIsActive(),
                restaurant.getRating(),
                restaurant.getRatingCount(),
                restaurant.getCuisine(),
                restaurant.getOpeningHours(),
                restaurant.getOpeningTime(),
                restaurant.getClosingTime(),
                restaurant.getCreatedAt(),
                restaurant.getUpdatedAt()
        );
    }
}
