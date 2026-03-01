package com.swiftsavor.gateway.config;

import com.swiftsavor.gateway.filter.AuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;

@Configuration
public class GatewayConfig {

    @Autowired
    private AuthenticationFilter filter;

    @Bean
    public RouteLocator routes(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("auth-service", r -> r.path("/api/auth/**")
                        .filters(f -> f.stripPrefix(1).filter(filter.apply(new AuthenticationFilter.Config())))
                        .uri("lb://auth-service"))
                
                .route("user-service", r -> r.path("/api/users/**")
                        .filters(f -> f.stripPrefix(1).filter(filter.apply(new AuthenticationFilter.Config())))
                        .uri("lb://user-service"))
                
                .route("restaurant-service", r -> r.path("/api/restaurants/**")
                        .filters(f -> f.stripPrefix(1).filter(filter.apply(new AuthenticationFilter.Config())))
                        .uri("lb://restaurant-service"))
                
                .route("order-service", r -> r.path("/api/orders/**")
                        .filters(f -> f.stripPrefix(1).filter(filter.apply(new AuthenticationFilter.Config())))
                        .uri("lb://order-service"))
                
                .route("payment-service", r -> r.path("/api/payments/**")
                        .filters(f -> f.stripPrefix(1).filter(filter.apply(new AuthenticationFilter.Config())))
                        .uri("lb://payment-service"))
                
                .build();
    }

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        corsConfig.setAllowedOrigins(Collections.singletonList("http://localhost:5173"));
        corsConfig.setMaxAge(3600L);
        corsConfig.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        corsConfig.setAllowedHeaders(Arrays.asList("*"));
        corsConfig.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);

        return new CorsWebFilter(source);
    }
}
