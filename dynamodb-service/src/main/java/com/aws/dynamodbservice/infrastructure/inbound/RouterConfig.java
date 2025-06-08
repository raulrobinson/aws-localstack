package com.aws.dynamodbservice.infrastructure.inbound;

import com.aws.dynamodbservice.infrastructure.common.handler.ErrorDTO;
import com.aws.dynamodbservice.infrastructure.inbound.dto.ClientDTO;
import com.aws.dynamodbservice.infrastructure.inbound.dto.ClientResponseDTO;
import com.aws.dynamodbservice.infrastructure.inbound.handler.ClientHandler;
import org.springdoc.core.annotations.RouterOperation;
import org.springdoc.core.annotations.RouterOperations;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerResponse;

@Configuration
public class RouterConfig {

    @Bean
    @RouterOperations({
            @RouterOperation(
                    path = "/clients",
                    produces = "application/json",
                    method = RequestMethod.POST,
                    beanClass = ClientHandler.class,
                    beanMethod = "saveClient",
                    operation = @io.swagger.v3.oas.annotations.Operation(
                            operationId = "saveClient",
                            summary = "Create a new Client",
                            description = "Create a new Client in the database.",
                            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                                    required = true,
                                    description = "Client Request DTO",
                                    content = @io.swagger.v3.oas.annotations.media.Content(
                                            mediaType = "application/json",
                                            schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = ClientDTO.class)
                                    )
                            ),
                            responses = {
                                    @io.swagger.v3.oas.annotations.responses.ApiResponse(
                                            responseCode = "201",
                                            description = "Created",
                                            content = @io.swagger.v3.oas.annotations.media.Content(
                                                    mediaType = "application/json",
                                                    schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = ClientResponseDTO.class)
                                            )
                                    ),
                                    @io.swagger.v3.oas.annotations.responses.ApiResponse(
                                            responseCode = "400",
                                            description = "Bad Request",
                                            content = @io.swagger.v3.oas.annotations.media.Content(
                                                    mediaType = "application/json",
                                                    array = @io.swagger.v3.oas.annotations.media.ArraySchema(
                                                            schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = ErrorDTO.class)
                                                    )
                                            )
                                    ),
                                    @io.swagger.v3.oas.annotations.responses.ApiResponse(
                                            responseCode = "409",
                                            description = "Conflict",
                                            content = @io.swagger.v3.oas.annotations.media.Content(
                                                    mediaType = "application/json",
                                                    array = @io.swagger.v3.oas.annotations.media.ArraySchema(
                                                            schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = ErrorDTO.class)
                                                    )
                                            )
                                    ),
                                    @io.swagger.v3.oas.annotations.responses.ApiResponse(
                                            responseCode = "500",
                                            description = "Internal Server Error",
                                            content = @io.swagger.v3.oas.annotations.media.Content(
                                                    mediaType = "application/json",
                                                    array = @io.swagger.v3.oas.annotations.media.ArraySchema(
                                                            schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = ErrorDTO.class)
                                                    )
                                            )
                                    )
                            }
                    )
            ),
    })
    public RouterFunction<ServerResponse> route(ClientHandler handler) {
        return RouterFunctions
                .route()
                .POST("/clients", handler::saveClient)
                .GET("/clients/{id}", handler::getClientById)
                .GET("/clients", handler::getAllClients)
                .DELETE("/clients/{id}", handler::deleteClient)
                .build();
    }
}
