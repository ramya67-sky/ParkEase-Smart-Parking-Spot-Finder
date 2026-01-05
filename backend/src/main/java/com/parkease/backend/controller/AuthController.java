package com.parkease.backend.controller;

import com.parkease.backend.model.User;
import com.parkease.backend.service.AuthService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    // ---------------- REGISTER USER ----------------
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        return ResponseEntity.ok(authService.registerUser(user));
    }

    // ---------------- LOGIN USER ----------------
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {
        if (user.getEmail() == null || user.getPassword() == null) {
            return ResponseEntity.badRequest().body(
                    java.util.Map.of("success", false, "message", "Email and password must be provided")
            );
        }
        return ResponseEntity.ok(authService.loginUser(user.getEmail(), user.getPassword()));
    }

    // ---------------- GET USER BY ID ----------------
    @GetMapping("/user/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(authService.getUserById(id));
    }
}