package com.foodapp.backend.controller;

import com.foodapp.backend.entity.MenuItem;
import com.foodapp.backend.service.MenuItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
public class MenuItemController {

    @Autowired
    private MenuItemService menuItemService;

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<MenuItem>> getByRestaurant(@PathVariable Long restaurantId) {
        return ResponseEntity.ok(menuItemService.getByRestaurant(restaurantId));
    }

    @GetMapping
    public ResponseEntity<List<MenuItem>> getAll() {
        return ResponseEntity.ok(menuItemService.getAll());
    }
}
