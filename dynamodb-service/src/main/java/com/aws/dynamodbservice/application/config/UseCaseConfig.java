package com.aws.dynamodbservice.application.config;

import com.aws.dynamodbservice.domain.api.ClientPersistencePort;
import com.aws.dynamodbservice.domain.usecase.ClientUseCase;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class UseCaseConfig {

    @Bean
    public ClientUseCase clientUseCase(ClientPersistencePort persistencePort) {
        return new ClientUseCase(persistencePort);
    }
}
