package com.parkease.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.parkease.backend.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // ---------------- AUTH ----------------

    // Login / JWT generation
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    // ---------------- ROLE BASED ----------------

    // Fetch users by role (ADMIN / USER)
    List<User> findByUserType(String userType);

    // Same but explicit naming (Admin dashboards)
    List<User> findAllByUserType(String userType);

    // ---------------- PROFILE / FUTURE ----------------

    // Useful if username becomes unique later
    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);
}