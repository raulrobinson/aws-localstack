package com.aws.s3service.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import software.amazon.awssdk.services.s3.model.NoSuchKeyException;

import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class HandlerException {

    public static final String DATE_TIME_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX";

    @ExceptionHandler(NoSuchKeyException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, Object> handleNoSuchKeyException(NoSuchKeyException e) {
        log.error("Error al acceder al archivo en S3: {}", e.getMessage());
        return Map.of(
                "timestamp", TimestampToFormat(),
                "error", "File Not Found",
                "message", e.getMessage(),
                "status", 404
        );
    }

    @ExceptionHandler(NotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, Object> handleNotFoundException(NotFoundException e) {
        log.error("Error: {}", e.getMessage());
        return Map.of(
                "timestamp", TimestampToFormat(),
                "error", "Resource Not Found",
                "message", e.getMessage(),
                "status", 404
        );
    }

    public static String TimestampToFormat() {
        return ZonedDateTime.now().format(DateTimeFormatter.ofPattern(DATE_TIME_FORMAT));
    }
}
