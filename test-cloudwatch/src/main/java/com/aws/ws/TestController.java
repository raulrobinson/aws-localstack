package com.aws.ws;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

@RestController
public class TestController {

    private static final Logger logger = LoggerFactory.getLogger(TestController.class);
    private final CloudWatchService cloudWatchService;

    public TestController(CloudWatchService cloudWatchService) {
        this.cloudWatchService = cloudWatchService;
    }

    @GetMapping("/ping")
    public String ping() {
        logger.info("Received ping request");
        cloudWatchService.sendMetric();
        return "pong";
    }
}

