package com.aws.dynamodbservice.infrastructure.common.handler;

import com.aws.dynamodbservice.domain.exception.BusinessException;
import com.aws.dynamodbservice.domain.exception.DuplicateResourceException;
import com.aws.dynamodbservice.domain.exception.TechnicalMessage;
import com.aws.dynamodbservice.infrastructure.common.exception.DatabaseResourceException;
import com.aws.dynamodbservice.infrastructure.common.exception.NoContentException;
import com.aws.dynamodbservice.infrastructure.common.exception.ProcessorException;
import com.aws.dynamodbservice.infrastructure.common.exception.TechnicalException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.List;

@Component
@Slf4j
@Order(-2)
public class GlobalErrorHandler {

    public Mono<ServerResponse> handle(Throwable throwable, String messageId) {
        log.error("Exception captured globally: {}", throwable.toString());

        return switch (throwable) {
            case BusinessException ex -> buildErrorResponse(
                    HttpStatus.BAD_REQUEST,
                    messageId,
                    TechnicalMessage.BAD_REQUEST,
                    List.of(ErrorDTO.of(
                            ex.getMessage(),
                            ex.getParameter()
                    ))
            );

            case DuplicateResourceException ex -> buildErrorResponse(
                    HttpStatus.CONFLICT,
                    messageId,
                    TechnicalMessage.ALREADY_EXISTS,
                    List.of(ErrorDTO.of(
                            ex.getMessage(),
                            ex.getParameter()
                    ))
            );

            case NoContentException ex -> buildErrorResponse(
                    HttpStatus.BAD_REQUEST,
                    messageId,
                    TechnicalMessage.NO_CONTENT,
                    List.of(ErrorDTO.of(
                            ex.getMessage(),
                            TechnicalMessage.NO_CONTENT.getParameter()
                    ))
            );

            case ProcessorException ex -> buildErrorResponse(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    messageId,
                    TechnicalMessage.INTERNAL_SERVER_ERROR,
                    List.of(ErrorDTO.of(
                            ex.getMessage(),
                            TechnicalMessage.INTERNAL_SERVER_ERROR.getParameter()
                    ))
            );

            case TechnicalException ex -> buildErrorResponse(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    messageId,
                    TechnicalMessage.INTERNAL_ERROR_IN_ADAPTERS,
                    List.of(ErrorDTO.of(
                            ex.getMessage(),
                            TechnicalMessage.INTERNAL_ERROR_IN_ADAPTERS.getParameter()
                    ))
            );

            case DatabaseResourceException ex -> buildErrorResponse(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    messageId,
                    TechnicalMessage.DATABASE_ERROR,
                    List.of(ErrorDTO.of(
                            ex.getMessage(),
                            TechnicalMessage.DATABASE_ERROR.getParameter()
                    ))
            );

            default -> buildErrorResponse(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    messageId,
                    TechnicalMessage.INTERNAL_SERVER_ERROR,
                    List.of(ErrorDTO.of(
                            throwable.getMessage(),
                            TechnicalMessage.INTERNAL_SERVER_ERROR.getParameter()
                    ))
            );
        };
    }

    private Mono<ServerResponse> buildErrorResponse(HttpStatus httpStatus,
                                                    String messageId,
                                                    TechnicalMessage technicalMessage,
                                                    List<ErrorDTO> errors) {
        return ServerResponse.status(httpStatus)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(APIResponse.builder()
                        .code(httpStatus.value())
                        .message(technicalMessage.getMessage())
                        .timestamp(Instant.now().toString())
                        .identifier(messageId)
                        .errors(errors)
                        .build());
    }
}
