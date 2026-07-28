package com.ayogame;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class AyoApplication {

    public static void main(String[] args) {
        SpringApplication.run(AyoApplication.class, args);
    }
}
