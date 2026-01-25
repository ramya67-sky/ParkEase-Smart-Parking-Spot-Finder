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
        // Calls AuthService.registerUser() which handles password encoding, email check, etc.
        return ResponseEntity.ok(authService.registerUser(user));
    }

    // ---------------- LOGIN USER ----------------
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        if (loginRequest.getEmail() == null || loginRequest.getPassword() == null) {
            return ResponseEntity.badRequest().body(
                    java.util.Map.of(
                            "success", false,
                            "message", "Email and password must be provided"
                    )
            );
        }

        // Call AuthService.loginUser(email, password)
        return ResponseEntity.ok(
                authService.loginUser(loginRequest.getEmail(), loginRequest.getPassword())
        );
    }

    // ---------------- GET USER BY ID ----------------
    @GetMapping("/user/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(authService.getUserById(id));
    }

    // ---------------- LOGIN DTO ----------------
    public static class LoginRequest {
        private String email;
        private String password;

        // ✅ Getters and Setters
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}