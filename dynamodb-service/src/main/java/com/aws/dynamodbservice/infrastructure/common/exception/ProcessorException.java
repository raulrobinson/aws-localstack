package com.aws.dynamodbservice.infrastructure.common.exception;

import com.aws.dynamodbservice.domain.exception.TechnicalMessage;

public class ProcessorException extends TechnicalException {

    public ProcessorException(TechnicalMessage message) {
        super(message);
    }

    public ProcessorException(TechnicalMessage message, Throwable cause) {
        super(message, cause);
    }
}
