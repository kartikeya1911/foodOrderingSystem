package com.swiftsavor.restaurantservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantResponse {
    private Long id;
    private String name;
    private String description;
    private String address;
    private String phone;
    private String email;
    private String imageUrl;
    private String ownerUsername;
    private Boolean isActive;
    private Double rating;
    private Integer ratingCount;
    private String cuisine;
    private String openingHours;
    private String openingTime;
    private String closingTime;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
