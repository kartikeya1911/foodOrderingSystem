package com.swiftsavor.restaurantservice.controller;

import com.swiftsavor.restaurantservice.dto.RestaurantRequest;
import com.swiftsavor.restaurantservice.dto.RestaurantResponse;
import com.swiftsavor.restaurantservice.service.RestaurantService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/restaurants")
public class RestaurantController {

    @Autowired
    private RestaurantService restaurantService;

    @PostMapping
    public ResponseEntity<RestaurantResponse> createRestaurant(
            @Valid @RequestBody RestaurantRequest request,
            @RequestHeader("X-User-Username") String username) {
        RestaurantResponse response = restaurantService.createRestaurant(request, username);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RestaurantResponse> updateRestaurant(
            @PathVariable Long id,
            @Valid @RequestBody RestaurantRequest request,
            @RequestHeader("X-User-Username") String username) {
        RestaurantResponse response = restaurantService.updateRestaurant(id, request, username);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RestaurantResponse> getRestaurantById(@PathVariable Long id) {
        RestaurantResponse response = restaurantService.getRestaurantById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<RestaurantResponse>> getAllRestaurants() {
        List<RestaurantResponse> restaurants = restaurantService.getAllRestaurants();
        return ResponseEntity.ok(restaurants);
    }

    @GetMapping("/active")
    public ResponseEntity<List<RestaurantResponse>> getActiveRestaurants() {
        List<RestaurantResponse> restaurants = restaurantService.getActiveRestaurants();
        return ResponseEntity.ok(restaurants);
    }

    @GetMapping("/my-restaurants")
    public ResponseEntity<List<RestaurantResponse>> getMyRestaurants(
            @RequestHeader("X-User-Username") String username) {
        List<RestaurantResponse> restaurants = restaurantService.getMyRestaurants(username);
        return ResponseEntity.ok(restaurants);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRestaurant(
            @PathVariable Long id,
            @RequestHeader("X-User-Username") String username) {
        restaurantService.deleteRestaurant(id, username);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/rate")
    public ResponseEntity<RestaurantResponse> rateRestaurant(
            @PathVariable Long id,
            @RequestParam Integer rating,
            @RequestHeader("X-User-Username") String username) {
        RestaurantResponse response = restaurantService.rateRestaurant(id, rating);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Restaurant Service is running");
    }
}
