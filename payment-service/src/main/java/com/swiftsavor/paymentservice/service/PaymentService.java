package com.swiftsavor.paymentservice.service;

import com.swiftsavor.paymentservice.dto.PaymentRequest;
import com.swiftsavor.paymentservice.dto.PaymentResponse;
import com.swiftsavor.paymentservice.entity.Payment;
import com.swiftsavor.paymentservice.exception.ResourceNotFoundException;
import com.swiftsavor.paymentservice.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    public PaymentResponse processPayment(PaymentRequest request) {
        // Simulated payment processing
        Payment payment = new Payment();
        payment.setPaymentId("PAY-" + UUID.randomUUID().toString());
        payment.setOrderId(request.getOrderId());
        payment.setUsername(request.getUsername());
        payment.setAmount(request.getAmount());
        
        // Simulate payment success (90% success rate for demo)
        double random = Math.random();
        if (random < 0.9) {
            payment.setStatus(Payment.PaymentStatus.SUCCESS);
            payment.setMessage("Payment processed successfully");
        } else {
            payment.setStatus(Payment.PaymentStatus.FAILED);
            payment.setMessage("Payment failed. Please try again.");
        }
        
        Payment savedPayment = paymentRepository.save(payment);
        return mapToResponse(savedPayment);
    }

    public PaymentResponse getPaymentById(String paymentId) {
        Payment payment = paymentRepository.findByPaymentId(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + paymentId));
        return mapToResponse(payment);
    }

    public PaymentResponse getPaymentByOrderId(String orderId) {
        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for order: " + orderId));
        return mapToResponse(payment);
    }

    public List<PaymentResponse> getPaymentHistory(String username) {
        return paymentRepository.findByUsername(username).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<PaymentResponse> getAllPayments() {
        return paymentRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private PaymentResponse mapToResponse(Payment payment) {
        return new PaymentResponse(
                payment.getPaymentId(),
                payment.getOrderId(),
                payment.getUsername(),
                payment.getAmount(),
                payment.getStatus().name(),
                payment.getMessage(),
                payment.getCreatedAt()
        );
    }
}
