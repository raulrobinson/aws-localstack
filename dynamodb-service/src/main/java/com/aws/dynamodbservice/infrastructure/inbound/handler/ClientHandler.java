package com.aws.dynamodbservice.infrastructure.inbound.handler;

import com.aws.dynamodbservice.domain.spi.ClientServicePort;
import com.aws.dynamodbservice.infrastructure.common.handler.GlobalErrorHandler;
import com.aws.dynamodbservice.infrastructure.inbound.dto.ClientDTO;
import com.aws.dynamodbservice.infrastructure.inbound.mapper.ClientMapper;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;
import reactor.util.context.Context;

import static com.aws.dynamodbservice.domain.exception.TechnicalMessage.X_MESSAGE_ID;
import static com.aws.dynamodbservice.infrastructure.common.handler.MessageHeaderHandler.getMessageId;
import static com.aws.dynamodbservice.infrastructure.common.util.Constants.CREATE_ERROR;

@Slf4j
@Component
@RequiredArgsConstructor
@Tag(name = "Clients", description = "Clients Management")
public class ClientHandler {

    private final ClientServicePort servicePort;
    private final ClientMapper mapper;
    private final GlobalErrorHandler globalErrorHandler;

    public Mono<ServerResponse> saveClient(ServerRequest request) {
        return request.bodyToMono(ClientDTO.class)
                .map(mapper::toDomainFromDTO)
                .flatMap(client -> mapper.toResponseDTO(servicePort.save(client)))
                .flatMap(saved -> ServerResponse.ok().bodyValue(saved))
                .contextWrite(Context.of(X_MESSAGE_ID, getMessageId(request)))
                .doOnError(error -> log.error(CREATE_ERROR, error.getMessage()))
                .onErrorResume(exception -> globalErrorHandler.handle(exception, getMessageId(request)));
    }

    public Mono<ServerResponse> getClientById(ServerRequest request) {
        return null;
    }

    public Mono<ServerResponse> getAllClients(ServerRequest request) {
        return null;
    }

    public Mono<ServerResponse> deleteClient(ServerRequest request) {
        return  null;
    }
}
