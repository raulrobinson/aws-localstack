package com.aws.dynamodbservice.infrastructure.common.exception;

public class DatabaseResourceException extends RuntimeException {

    public DatabaseResourceException(String message, Throwable cause) {
        super(message, cause);
    }

    public DatabaseResourceException(String message) {
        super(message);
    }
}

