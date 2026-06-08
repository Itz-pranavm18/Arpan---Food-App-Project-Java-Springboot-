package com.foodapp.backend.service;

import com.foodapp.backend.entity.MenuItem;
import com.foodapp.backend.entity.Restaurant;
import com.foodapp.backend.repository.MenuItemRepository;
import com.foodapp.backend.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MenuItemService {

    @Autowired private MenuItemRepository menuItemRepository;
    @Autowired private RestaurantRepository restaurantRepository;

    public List<MenuItem> getByRestaurant(Long restaurantId) {
        return menuItemRepository.findByRestaurantId(restaurantId);
    }

    public List<MenuItem> getAll() {
        return menuItemRepository.findAll();
    }

    public MenuItem save(Long restaurantId, MenuItem menuItem) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));
        menuItem.setRestaurant(restaurant);
        return menuItemRepository.save(menuItem);
    }

    public MenuItem update(Long id, MenuItem updated) {
        MenuItem existing = menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("MenuItem not found"));
        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setPrice(updated.getPrice());
        existing.setImageUrl(updated.getImageUrl());
        return menuItemRepository.save(existing);
    }

    public void delete(Long id) {
        menuItemRepository.deleteById(id);
    }
}
