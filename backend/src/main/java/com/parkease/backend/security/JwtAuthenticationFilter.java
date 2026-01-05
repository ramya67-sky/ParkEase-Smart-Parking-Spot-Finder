package com.parkease.backend.security;

import com.parkease.backend.model.User;
import com.parkease.backend.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        try {
            String authHeader = request.getHeader("Authorization");

            String token = null;
            String email = null;

            // 1️⃣ Extract token from header
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
                email = jwtUtil.extractUsername(token);
            }

            // 2️⃣ Only if no authentication is present yet
            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                User user = userRepository.findByEmail(email).orElse(null);

                if (user != null && jwtUtil.validateToken(token, email)) {

                    // ✅ FORCE ADMIN ROLE FOR EVERY USER
                    String authority = "ROLE_ADMIN";

                    List<SimpleGrantedAuthority> authorities =
                            List.of(new SimpleGrantedAuthority(authority));

                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    user,
                                    null,
                                    authorities
                            );

                    authToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request)
                    );

                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }

        } catch (Exception e) {
            System.out.println("⚠️ JWT Filter Error: " + e.getMessage());
        }

        // 3️⃣ Continue filter chain
        filterChain.doFilter(request, response);
    }
}