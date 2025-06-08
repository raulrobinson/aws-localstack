package com.aws.dynamodbservice.infrastructure.inbound.mapper;

import com.aws.dynamodbservice.domain.model.Client;
import com.aws.dynamodbservice.infrastructure.adapters.persistence.entity.ClientEntity;
import com.aws.dynamodbservice.infrastructure.inbound.dto.ClientDTO;
import com.aws.dynamodbservice.infrastructure.inbound.dto.ClientResponseDTO;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;

@Component
public class ClientMapper {

    public Client toDomain(ClientDTO dto) {
        if (dto == null) return null;
        return Client.builder()
                .name(dto.getName())
                .age(dto.getAge())
                .status(dto.getStatus())
                .build();
    }

    public ClientEntity toEntity(Client client) {
        if (client == null) return null;
        return ClientEntity.builder()
                .name(client.getName())
                .age(client.getAge())
                .status(client.getStatus())
                .build();
    }

    public Client toDomainFromDTO(ClientDTO dto) {
        if (dto == null) return null;
        return Client.builder()
                .name(dto.getName())
                .age(dto.getAge())
                .status(dto.getStatus())
                .build();
    }

    public Mono<ClientResponseDTO> toResponseDTO(Mono<Client> save) {
        return save.map(client -> ClientResponseDTO.builder()
                .id(client.getId())
                .name(client.getName())
                .age(client.getAge())
                .status(client.getStatus())
                .build());
    }
}
