package com.aws.dynamodbservice.domain.api;

import com.aws.dynamodbservice.domain.model.Client;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface ClientPersistencePort {
    Mono<Client> save(Client client);

    Mono<Client> getById(String id);

    Flux<Client> getAll();

    Mono<Void> delete(String id);
}
