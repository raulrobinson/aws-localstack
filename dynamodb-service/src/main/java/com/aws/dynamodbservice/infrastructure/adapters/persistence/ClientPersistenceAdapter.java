package com.aws.dynamodbservice.infrastructure.adapters.persistence;

import com.aws.dynamodbservice.domain.api.ClientPersistencePort;
import com.aws.dynamodbservice.domain.model.Client;
import com.aws.dynamodbservice.infrastructure.adapters.persistence.entity.ClientEntity;
import com.aws.dynamodbservice.infrastructure.adapters.persistence.mapper.ClientEntityMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.Key;

import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class ClientPersistenceAdapter implements ClientPersistencePort {

    private final DynamoDbTable<ClientEntity> clientTable;
    private final ClientEntityMapper mapper;

    @Override
    public Mono<Client> save(Client client) {
        ClientEntity savedItem = ClientEntity.builder()
                .id(UUID.randomUUID().toString())
                .name(client.getName())
                .age(client.getAge())
                .status(client.getStatus())
                .build();
        clientTable.putItem(savedItem);
        return Mono.just(mapper.toDomain(savedItem));
    }

    @Override
    public Mono<Client> getById(String id) {
        return Mono.fromCallable(() -> mapper.toDomain(clientTable.getItem(Key.builder().partitionValue(id).build())));
    }

    @Override
    public Flux<Client> getAll() {
        return Flux.fromIterable(mapper.toDomainClients(clientTable.scan().items().stream().toList()));
    }

    @Override
    public Mono<Void> delete(String id) {
        clientTable.deleteItem(Key.builder().partitionValue(id).build());
        return Mono.empty();
    }
}
