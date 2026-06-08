package com.foodapp.backend.controller;

import com.foodapp.backend.dto.OrderRequest;
import com.foodapp.backend.entity.Order;
import com.foodapp.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    public ResponseEntity<Order> placeOrder(@RequestBody OrderRequest request, Principal principal) {
        return ResponseEntity.ok(orderService.placeOrder(principal.getName(), request));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Order>> getMyOrders(Principal principal) {
        return ResponseEntity.ok(orderService.getOrdersByUser(principal.getName()));
    }
}
