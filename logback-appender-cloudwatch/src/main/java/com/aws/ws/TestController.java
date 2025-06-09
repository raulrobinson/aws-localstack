package com.aws.ws;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping
public class TestController {

    @GetMapping("/hello")
    public ResponseEntity<String> hello() {
        log.info("Procesando solicitud");
        return ResponseEntity.ok("Hello");
    }
}
