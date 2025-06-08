package com.aws.dynamodbservice.infrastructure.common.handler;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ErrorDTO {
    private String message;
    private String parameter;

    public static ErrorDTO of(String message, String parameter) {
        return ErrorDTO.builder()
                .message(message)
                .parameter(parameter)
                .build();
    }
}
