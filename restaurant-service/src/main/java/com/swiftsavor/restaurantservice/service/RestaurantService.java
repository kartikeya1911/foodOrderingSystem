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
        restaurant.setOwnerUsername(ownerUsername);
        restaurant.setIsActive(true);
        
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
                restaurant.getCuisine(),
                restaurant.getOpeningHours(),
                restaurant.getCreatedAt(),
                restaurant.getUpdatedAt()
        );
    }
}
