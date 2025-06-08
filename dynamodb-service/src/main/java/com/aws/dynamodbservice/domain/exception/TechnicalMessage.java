package com.aws.dynamodbservice.domain.exception;

import lombok.Getter;

@Getter
public enum TechnicalMessage {

    INTERNAL_SERVER_ERROR("500", "Internal server error", ""),
    INTERNAL_ERROR_IN_ADAPTERS("503", "Internal error in adapters", ""),
    MINIMUM_OR_MAXIMUM_CAPACITY("400", "A capability must have 3 to 20 unique technologies.", ""),
    BAD_REQUEST("400", "Bad request", ""),
    NOT_FOUND("404", "Not found", ""),
    NO_CONTENT("204", "No content", ""),
    INVALID_REQUEST("400", "Request null or incomplete", ""),
    ALREADY_EXISTS("409", "Already exists", ""),
    NOT_ONLY_NUMBERS("400", "The field must contain only numbers", ""),
    NAME_CHARACTER_LIMIT("400", "Name must be between 3 and 50 characters", ""),
    DESCRIPTION_CHARACTER_LIMIT("400", "Description must be between 3 and 100 characters", ""),
    TECHNOLOGY_NOT_FOUND("404", "Technology not found", ""),
    TECHNOLOGY_DELETION_FAILED("500", "Technology deletion failed", ""),
    TECHNOLOGY_ALREADY_EXISTS("409", "Technology already exists", ""),
    TECHNOLOGY_CREATION_FAILED("500", "Technology creation failed", ""),
    UNKNOWN_ERROR("500", "Unknown error occurred", ""),
    TECHNOLOGY_CREATED("201", "Technology created successfully", ""),
    INVALID_PARAMETERS("400", "Invalid parameters provided", ""),
    INTERNAL_ERROR("500", "An internal error occurred", ""),
    TECHNOLOGY_ERROR("500", "An error occurred while processing the technology", ""),
    DATABASE_ERROR("500", "Database error occurred", ""),
    X_MESSAGE_ID("X-Message-ID", "Unique identifier for the message", "");


    private final String code;
    private final String message;
    private final String parameter;

    TechnicalMessage(String code, String message, String parameter) {
        this.code = code;
        this.message = message;
        this.parameter = parameter;
    }
}
