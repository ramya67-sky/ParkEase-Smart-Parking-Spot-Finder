package com.parkease.backend.security;

import com.parkease.backend.model.User;
import com.parkease.backend.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Spring Security calls this method automatically during:
     * 1. Login
     * 2. JWT token validation
     */
    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "User not found with email: " + email
                        )
                );

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),          // username
                user.getPassword(),       // encrypted password
                getAuthorities(user)      // roles
        );
    }

    /**
     * Convert USER / ADMIN string into Spring Security Authority
     */
    private Collection<? extends GrantedAuthority> getAuthorities(User user) {

        return List.of(
                new SimpleGrantedAuthority(user.getUserType())
        );
    }
}