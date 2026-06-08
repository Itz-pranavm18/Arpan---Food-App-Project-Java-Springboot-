package com.foodapp.backend.service;

import com.foodapp.backend.entity.Restaurant;
import com.foodapp.backend.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class RestaurantService {

    @Autowired private RestaurantRepository restaurantRepository;

    public List<Restaurant> getAll() {
        return restaurantRepository.findAll();
    }

    public Restaurant getById(Long id) {
        return restaurantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));
    }

    public Restaurant save(Restaurant restaurant) {
        return restaurantRepository.save(restaurant);
    }

    public Restaurant update(Long id, Restaurant updated) {
        Restaurant existing = getById(id);
        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setAddress(updated.getAddress());
        existing.setImageUrl(updated.getImageUrl());
        return restaurantRepository.save(existing);
    }

    public void delete(Long id) {
        restaurantRepository.deleteById(id);
    }
}
