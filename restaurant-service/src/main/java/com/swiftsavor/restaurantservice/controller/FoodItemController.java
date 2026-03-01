package com.swiftsavor.restaurantservice.controller;

import com.swiftsavor.restaurantservice.dto.FoodItemRequest;
import com.swiftsavor.restaurantservice.dto.FoodItemResponse;
import com.swiftsavor.restaurantservice.service.FoodItemService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/restaurants")
public class FoodItemController {

    @Autowired
    private FoodItemService foodItemService;

    @PostMapping("/{restaurantId}/food-items")
    public ResponseEntity<FoodItemResponse> addFoodItem(
            @PathVariable Long restaurantId,
            @Valid @RequestBody FoodItemRequest request,
            @RequestHeader("X-User-Username") String username) {
        FoodItemResponse response = foodItemService.addFoodItem(restaurantId, request, username);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/food-items/{id}")
    public ResponseEntity<FoodItemResponse> updateFoodItem(
            @PathVariable Long id,
            @Valid @RequestBody FoodItemRequest request,
            @RequestHeader("X-User-Username") String username) {
        FoodItemResponse response = foodItemService.updateFoodItem(id, request, username);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/food-items/{id}")
    public ResponseEntity<FoodItemResponse> getFoodItemById(@PathVariable Long id) {
        FoodItemResponse response = foodItemService.getFoodItemById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{restaurantId}/food-items")
    public ResponseEntity<List<FoodItemResponse>> getFoodItemsByRestaurant(@PathVariable Long restaurantId) {
        List<FoodItemResponse> items = foodItemService.getFoodItemsByRestaurant(restaurantId);
        return ResponseEntity.ok(items);
    }

    @DeleteMapping("/food-items/{id}")
    public ResponseEntity<Void> deleteFoodItem(
            @PathVariable Long id,
            @RequestHeader("X-User-Username") String username) {
        foodItemService.deleteFoodItem(id, username);
        return ResponseEntity.noContent().build();
    }
}
