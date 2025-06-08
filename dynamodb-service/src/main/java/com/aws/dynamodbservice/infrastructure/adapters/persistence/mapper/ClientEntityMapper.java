package com.aws.dynamodbservice.infrastructure.adapters.persistence.mapper;

import com.aws.dynamodbservice.domain.model.Client;
import com.aws.dynamodbservice.infrastructure.adapters.persistence.entity.ClientEntity;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ClientEntityMapper {

    public ClientEntity toEntity(Client domain) {
        if (domain == null) return null;
        return ClientEntity.builder()
                .name(domain.getName())
                .age(domain.getAge())
                .status(domain.getStatus())
                .build();
    }

    public Client toDomain(ClientEntity client) {
        if (client == null) return null;
        return Client.builder()
                .id(client.getId())
                .name(client.getName())
                .age(client.getAge())
                .status(client.getStatus())
                .build();
    }

    public List<Client> toDomainClients(List<ClientEntity> clientEntities) {
        if (clientEntities == null || clientEntities.isEmpty()) return List.of();
        return clientEntities.stream()
                .map(this::toDomain)
                .toList();
    }
}
