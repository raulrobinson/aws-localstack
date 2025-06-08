package com.aws.dynamodbservice.domain.usecase;

import com.aws.dynamodbservice.domain.api.ClientPersistencePort;
import com.aws.dynamodbservice.domain.exception.TechnicalMessage;
import com.aws.dynamodbservice.domain.model.Client;
import com.aws.dynamodbservice.domain.spi.ClientServicePort;
import com.aws.dynamodbservice.infrastructure.common.exception.NotFoundException;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Slf4j
public class ClientUseCase implements ClientServicePort {

    private final ClientPersistencePort persistencePort;

    public ClientUseCase(ClientPersistencePort persistencePort) {
        this.persistencePort = persistencePort;
    }

    @Override
    public Mono<Client> save(Client client) {
        return persistencePort.save(client)
                .doOnSuccess(savedClient -> log.info("Client saved successfully: {}", savedClient))
                .doOnError(error -> log.error("Error saving client: {}", error.getMessage()));
    }

    @Override
    public Mono<Client> getById(String id) {
        return persistencePort.getById(id)
                .doOnSuccess(client -> {
                    if (client == null) throw new NotFoundException(
                            TechnicalMessage.NOT_FOUND, "Client not found with ID: ", id);
                })
                .doOnError(error -> log.error("Error retrieving client: {}", error.getMessage()));
    }

    @Override
    public Flux<Client> getAll() {
        log.info("Fetching all clients");
        return persistencePort.getAll()
                .doOnNext(client -> log.info("Client retrieved: {}", client))
                .doOnError(error -> log.error("Error retrieving clients: {}", error.getMessage()));
    }

    @Override
    public Mono<Void> delete(String id) {
        log.info("Deleting client with ID: {}", id);
        return persistencePort.delete(id)
                .doOnSuccess(aVoid -> log.info("Client deleted successfully"))
                .doOnError(error -> log.error("Error deleting client: {}", error.getMessage()));
    }
}
