package com.parkease.backend.controller;

import com.parkease.backend.model.Payment;
import com.parkease.backend.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentRepository paymentRepository;

    /**
     * 🔹 Initiate Payment
     * Save payment as PENDING
     */
    @PostMapping("/initiate")
    public Map<String, Object> initiatePayment(@RequestBody Payment payment) {
        // Set initial status
        payment.setStatus("PENDING");
        payment.setPaidAt(null);
        payment.setTransactionId(null);

        Payment savedPayment = paymentRepository.save(payment);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("payment", savedPayment);
        return response;
    }

    /**
     * 🔹 Verify Payment
     * Mark payment as SUCCESS
     */
    @PostMapping("/verify")
    public Map<String, Object> verifyPayment(@RequestBody Map<String, Object> request) {
        Long bookingId = Long.valueOf(request.get("bookingId").toString());
        String transactionId = request.get("transactionId").toString();
        double amount = Double.parseDouble(request.get("amount").toString());

        Payment payment = paymentRepository.findByBookingId(bookingId);

        Map<String, Object> resp = new HashMap<>();
        if (payment == null) {
            resp.put("success", false);
            resp.put("message", "Payment not found for this booking");
            return resp;
        }

        // Update payment
        payment.setStatus("SUCCESS");
        payment.setTransactionId(transactionId);
        payment.setPaidAt(LocalDateTime.now());
        payment.setAmount(amount); // optional: update amount
        paymentRepository.save(payment);

        resp.put("success", true);
        resp.put("payment", payment);
        return resp;
    }
}