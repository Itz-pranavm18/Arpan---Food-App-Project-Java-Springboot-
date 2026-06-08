package com.foodapp.backend.controller;

import com.foodapp.backend.entity.MenuItem;
import com.foodapp.backend.entity.Order;
import com.foodapp.backend.entity.Restaurant;
import com.foodapp.backend.service.MenuItemService;
import com.foodapp.backend.service.OrderService;
import com.foodapp.backend.service.RestaurantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired private RestaurantService restaurantService;
    @Autowired private MenuItemService menuItemService;
    @Autowired private OrderService orderService;

    // --- Restaurant Management ---
    @PostMapping("/restaurants")
    public ResponseEntity<Restaurant> addRestaurant(@RequestBody Restaurant restaurant) {
        return ResponseEntity.ok(restaurantService.save(restaurant));
    }

    @PutMapping("/restaurants/{id}")
    public ResponseEntity<Restaurant> updateRestaurant(@PathVariable Long id, @RequestBody Restaurant restaurant) {
        return ResponseEntity.ok(restaurantService.update(id, restaurant));
    }

    @DeleteMapping("/restaurants/{id}")
    public ResponseEntity<Void> deleteRestaurant(@PathVariable Long id) {
        restaurantService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // --- Menu Item Management ---
    @PostMapping("/restaurants/{restaurantId}/menu")
    public ResponseEntity<MenuItem> addMenuItem(@PathVariable Long restaurantId, @RequestBody MenuItem menuItem) {
        return ResponseEntity.ok(menuItemService.save(restaurantId, menuItem));
    }

    @PutMapping("/menu/{id}")
    public ResponseEntity<MenuItem> updateMenuItem(@PathVariable Long id, @RequestBody MenuItem menuItem) {
        return ResponseEntity.ok(menuItemService.update(id, menuItem));
    }

    @DeleteMapping("/menu/{id}")
    public ResponseEntity<Void> deleteMenuItem(@PathVariable Long id) {
        menuItemService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // --- Order Management ---
    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(orderService.updateStatus(id, body.get("status")));
    }
}
