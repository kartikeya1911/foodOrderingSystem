package com.swiftsavor.restaurantservice.service;

import com.swiftsavor.restaurantservice.dto.FoodItemRequest;
import com.swiftsavor.restaurantservice.dto.FoodItemResponse;
import com.swiftsavor.restaurantservice.entity.FoodItem;
import com.swiftsavor.restaurantservice.entity.Restaurant;
import com.swiftsavor.restaurantservice.exception.ResourceNotFoundException;
import com.swiftsavor.restaurantservice.repository.FoodItemRepository;
import com.swiftsavor.restaurantservice.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FoodItemService {

    @Autowired
    private FoodItemRepository foodItemRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    public FoodItemResponse addFoodItem(Long restaurantId, FoodItemRequest request, String ownerUsername) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + restaurantId));
        
        if (!restaurant.getOwnerUsername().equals(ownerUsername)) {
            throw new RuntimeException("You don't have permission to add food items to this restaurant");
        }
        
        FoodItem foodItem = new FoodItem();
        foodItem.setName(request.getName());
        foodItem.setDescription(request.getDescription());
        foodItem.setPrice(request.getPrice());
        foodItem.setCategory(request.getCategory());
        foodItem.setImageUrl(request.getImageUrl());
        foodItem.setIsVegetarian(request.getIsVegetarian());
        foodItem.setIsAvailable(request.getIsAvailable());
        foodItem.setRestaurant(restaurant);
        
        FoodItem savedFoodItem = foodItemRepository.save(foodItem);
        return mapToResponse(savedFoodItem);
    }

    public FoodItemResponse updateFoodItem(Long id, FoodItemRequest request, String ownerUsername) {
        FoodItem foodItem = foodItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Food item not found with id: " + id));
        
        if (!foodItem.getRestaurant().getOwnerUsername().equals(ownerUsername)) {
            throw new RuntimeException("You don't have permission to update this food item");
        }
        
        foodItem.setName(request.getName());
        foodItem.setDescription(request.getDescription());
        foodItem.setPrice(request.getPrice());
        foodItem.setCategory(request.getCategory());
        foodItem.setImageUrl(request.getImageUrl());
        foodItem.setIsVegetarian(request.getIsVegetarian());
        foodItem.setIsAvailable(request.getIsAvailable());
        
        FoodItem updatedFoodItem = foodItemRepository.save(foodItem);
        return mapToResponse(updatedFoodItem);
    }

    public FoodItemResponse getFoodItemById(Long id) {
        FoodItem foodItem = foodItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Food item not found with id: " + id));
        return mapToResponse(foodItem);
    }

    public List<FoodItemResponse> getFoodItemsByRestaurant(Long restaurantId) {
        return foodItemRepository.findByRestaurantId(restaurantId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public void deleteFoodItem(Long id, String ownerUsername) {
        FoodItem foodItem = foodItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Food item not found with id: " + id));
        
        if (!foodItem.getRestaurant().getOwnerUsername().equals(ownerUsername)) {
            throw new RuntimeException("You don't have permission to delete this food item");
        }
        
        foodItemRepository.delete(foodItem);
    }

    private FoodItemResponse mapToResponse(FoodItem foodItem) {
        return new FoodItemResponse(
                foodItem.getId(),
                foodItem.getName(),
                foodItem.getDescription(),
                foodItem.getPrice(),
                foodItem.getCategory(),
                foodItem.getImageUrl(),
                foodItem.getIsVegetarian(),
                foodItem.getIsAvailable(),
                foodItem.getRestaurant().getId(),
                foodItem.getRestaurant().getName(),
                foodItem.getCreatedAt(),
                foodItem.getUpdatedAt()
        );
    }
}
