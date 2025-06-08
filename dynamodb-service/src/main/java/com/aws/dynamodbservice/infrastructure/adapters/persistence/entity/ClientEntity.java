package com.aws.dynamodbservice.infrastructure.adapters.persistence.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey;

@Data
@AllArgsConstructor
@NoArgsConstructor
@DynamoDbBean
@Builder(toBuilder = true)
public class ClientEntity {
    private String id;
    private String name;
    private String age;
    private Boolean status;

    @DynamoDbPartitionKey
    public String getId() {
        return id;
    }
}
