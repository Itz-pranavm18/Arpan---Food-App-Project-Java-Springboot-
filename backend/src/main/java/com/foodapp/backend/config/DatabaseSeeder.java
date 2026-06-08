package com.foodapp.backend.config;

import com.foodapp.backend.entity.MenuItem;
import com.foodapp.backend.entity.Restaurant;
import com.foodapp.backend.entity.User;
import com.foodapp.backend.repository.MenuItemRepository;
import com.foodapp.backend.repository.RestaurantRepository;
import com.foodapp.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired private UserRepository userRepository;
    @Autowired private RestaurantRepository restaurantRepository;
    @Autowired private MenuItemRepository menuItemRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // 1. Create Default Admin
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin"));
            admin.setRole("ADMIN");
            userRepository.save(admin);
        }

        // 2. Seed Restaurants and 15 Menu Items if empty
        if (restaurantRepository.count() == 0) {
            Restaurant r1 = new Restaurant();
            r1.setName("Burger Bistro");
            r1.setDescription("The best gourmet burgers in town.");
            r1.setAddress("123 Food Street, NY");
            r1.setImageUrl("https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&q=80");
            r1 = restaurantRepository.save(r1);

            Restaurant r2 = new Restaurant();
            r2.setName("Pizza Paradise");
            r2.setDescription("Authentic Italian wood-fired pizzas.");
            r2.setAddress("456 Olive Way, NY");
            r2.setImageUrl("https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80");
            r2 = restaurantRepository.save(r2);

            Restaurant r3 = new Restaurant();
            r3.setName("Sushi Master");
            r3.setDescription("Fresh sushi and Japanese cuisine.");
            r3.setAddress("789 Sakura Blvd, NY");
            r3.setImageUrl("https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&q=80");
            r3 = restaurantRepository.save(r3);

            // 15 Demo Products
            List<MenuItem> items = Arrays.asList(
                    createMenuItem("Classic Cheeseburger", "Juicy beef patty with melted cheddar", 9.99, "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80", r1),
                    createMenuItem("Bacon Double Burger", "Two beef patties, crispy bacon, house sauce", 13.99, "https://images.unsplash.com/photo-1594212686762-cb8969b83777?w=500&q=80", r1),
                    createMenuItem("Spicy Chicken Sandwich", "Crispy chicken breast with spicy mayo", 10.99, "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=500&q=80", r1),
                    createMenuItem("French Fries", "Crispy golden fries with sea salt", 3.99, "https://images.unsplash.com/photo-1576107232684-1279f3908594?w=500&q=80", r1),
                    createMenuItem("Onion Rings", "Thick-cut onion rings with ranch", 4.99, "https://images.unsplash.com/photo-1639024471283-03518883512d?w=500&q=80", r1),

                    createMenuItem("Margherita Pizza", "Fresh mozzarella, tomatoes, and basil", 14.99, "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&q=80", r2),
                    createMenuItem("Pepperoni Pizza", "Classic pepperoni with lots of cheese", 16.99, "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&q=80", r2),
                    createMenuItem("BBQ Chicken Pizza", "Grilled chicken, red onions, BBQ sauce", 18.99, "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80", r2),
                    createMenuItem("Garlic Bread", "Toasted bread with garlic butter and herbs", 5.99, "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=500&q=80", r2),
                    createMenuItem("Caesar Salad", "Crisp romaine, parmesan, croutons", 8.99, "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500&q=80", r2),

                    createMenuItem("Spicy Tuna Roll", "Fresh tuna with spicy mayo and cucumber", 11.99, "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500&q=80", r3),
                    createMenuItem("Dragon Roll", "Eel, cucumber, topped with avocado", 14.99, "https://images.unsplash.com/photo-1615361200141-f45040f367be?w=500&q=80", r3),
                    createMenuItem("Salmon Sashimi", "5 pieces of fresh Atlantic salmon", 12.99, "https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=500&q=80", r3),
                    createMenuItem("Miso Soup", "Traditional Japanese soup with tofu", 3.99, "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&q=80", r3),
                    createMenuItem("Edamame", "Steamed soybeans with sea salt", 4.99, "https://images.unsplash.com/photo-1599813955639-65239e2dc11d?w=500&q=80", r3)
            );
            menuItemRepository.saveAll(items);
        }
    }

    private MenuItem createMenuItem(String name, String desc, double price, String imgUrl, Restaurant restaurant) {
        MenuItem item = new MenuItem();
        item.setName(name);
        item.setDescription(desc);
        item.setPrice(price);
        item.setImageUrl(imgUrl);
        item.setRestaurant(restaurant);
        return item;
    }
}
