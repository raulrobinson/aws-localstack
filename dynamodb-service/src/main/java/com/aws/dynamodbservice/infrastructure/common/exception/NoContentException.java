package com.aws.dynamodbservice.infrastructure.common.exception;

import com.aws.dynamodbservice.domain.exception.TechnicalMessage;

public class NoContentException extends TechnicalException {

    public NoContentException(TechnicalMessage message) {
        super(message);
    }
}
