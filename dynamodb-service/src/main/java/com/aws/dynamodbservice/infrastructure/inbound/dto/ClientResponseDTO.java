package com.aws.dynamodbservice.infrastructure.inbound.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(
        description = "Response for Client",
        title = "ClientDTO",
        type = "object"
)
public class ClientResponseDTO {
    @Schema(
            description = "Unique identifier for the client",
            example = "037d9dea-2e3a-4d0c-ada7-cb51c949bcf5"
    )
    private String id;

    @Schema(
            description = "Name of the client",
            example = "John Doe"
    )
    private String name;

    @Schema(
            description = "Age of the client",
            example = "30"
    )
    private String age;

    @Schema(
            description = "Status of the client",
            example = "true"
    )
    private Boolean status;
}
