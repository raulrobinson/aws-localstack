package com.aws.dynamodbservice.domain.exception;

import lombok.Getter;

@Getter
public class DuplicateResourceException extends RuntimeException {

    private final String code;
    private final String parameter;

    public DuplicateResourceException(TechnicalMessage message, String code, String parameter) {
        super(message.getMessage());
        this.code = code;
        this.parameter = parameter;
    }
}
