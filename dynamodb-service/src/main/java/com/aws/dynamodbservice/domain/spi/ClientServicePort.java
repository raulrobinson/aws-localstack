package com.aws.dynamodbservice.domain.spi;

import com.aws.dynamodbservice.domain.model.Client;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface ClientServicePort {
    Mono<Client> save(Client client);

    Mono<Client> getById(String id);

    Flux<Client> getAll();

    Mono<Void> delete(String id);
}
