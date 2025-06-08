package com.aws.dynamodbservice.infrastructure.common.exception;

import com.aws.dynamodbservice.domain.exception.TechnicalMessage;

public class TechnicalException extends RuntimeException {

    public TechnicalException(TechnicalMessage message) {
        super(message.getMessage());
    }

    public TechnicalException(TechnicalMessage message, Throwable cause) {
        super(message.getMessage(), cause);
    }
}
