package com.parkease.backend.service;

import com.parkease.backend.model.User;
import com.parkease.backend.repository.UserRepository;
import com.parkease.backend.security.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // ----------------- REGISTER -----------------
    public Map<String, Object> registerUser(User user) {
        Map<String, Object> response = new HashMap<>();

        try {
            // Email check
            if (userRepository.existsByEmail(user.getEmail())) {
                response.put("success", false);
                response.put("message", "Email already exists!");
                return response;
            }

            // Defaults
            if (user.getUserType() == null) {
                user.setUserType("USER");
            }

            if (user.getUsername() == null || user.getUsername().isEmpty()) {
                user.setUsername(user.getFullName());
            }

            // Encrypt password
            user.setPassword(passwordEncoder.encode(user.getPassword()));

            User savedUser = userRepository.save(user);
            savedUser.setPassword(null);

            response.put("success", true);
            response.put("message", "Registration successful!");
            response.put("user", savedUser);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Registration failed");
        }

        return response;
    }

    // ----------------- LOGIN -----------------
    public Map<String, Object> loginUser(String email, String password) {
        Map<String, Object> response = new HashMap<>();

        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty() ||
            !passwordEncoder.matches(password, userOpt.get().getPassword())) {

            response.put("success", false);
            response.put("message", "Invalid email or password!");
            return response;
        }

        User user = userOpt.get();
        String token = jwtUtil.generateToken(user.getEmail(), user.getUserType());
        user.setPassword(null);

        response.put("success", true);
        response.put("token", token);
        response.put("user", user);

        return response;
    }

    // ----------------- GET ALL USERS -----------------
    public Map<String, Object> getAllUsers() {
        Map<String, Object> response = new HashMap<>();

        List<User> users = userRepository.findAll();
        users.forEach(u -> u.setPassword(null));

        response.put("success", true);
        response.put("users", users);
        return response;
    }

    // ----------------- GET USER BY ID -----------------
    public Map<String, Object> getUserById(Long id) {
        Map<String, Object> response = new HashMap<>();

        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "User not found!");
            return response;
        }

        User user = userOpt.get();
        user.setPassword(null);

        response.put("success", true);
        response.put("user", user);
        return response;
    }

    // ----------------- UPDATE USER -----------------
    public Map<String, Object> updateUser(Long id, User updatedUser) {
        Map<String, Object> response = new HashMap<>();

        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "User not found!");
            return response;
        }

        User user = userOpt.get();
        user.setFullName(updatedUser.getFullName());
        user.setUsername(updatedUser.getUsername());
        user.setEmail(updatedUser.getEmail());
        user.setPhoneNumber(updatedUser.getPhoneNumber());
        user.setUserType(updatedUser.getUserType());

        userRepository.save(user);
        user.setPassword(null);

        response.put("success", true);
        response.put("message", "User updated successfully!");
        response.put("user", user);
        return response;
    }

    // ----------------- DELETE USER -----------------
    public Map<String, Object> deleteUser(Long id) {
        Map<String, Object> response = new HashMap<>();

        if (!userRepository.existsById(id)) {
            response.put("success", false);
            response.put("message", "User not found!");
            return response;
        }

        userRepository.deleteById(id);

        response.put("success", true);
        response.put("message", "User deleted successfully!");
        return response;
    }
}