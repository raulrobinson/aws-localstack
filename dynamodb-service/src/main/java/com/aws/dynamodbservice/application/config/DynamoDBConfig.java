package com.aws.dynamodbservice.application.config;

import com.aws.dynamodbservice.infrastructure.adapters.persistence.entity.ClientEntity;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.dynamodb.DynamoDbAsyncClient;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;

import java.net.URI;

@Configuration
public class DynamoDBConfig {

    @Value("${aws.region:us-east-1}")
    private String region;

    @Value("${aws.dynamodb.endpoint}")
    private String dynamoEndpoint;

    @Value("${aws.dynamodb.table.name}")
    private String tableName;

    @Value("${aws.secret.access.key}")
    private String secretAccessKey;

    @Value("${aws.access.key.id}")
    private String accessKeyId;

    @Bean
    public DynamoDbClient dynamoDbClient() {
        return DynamoDbClient.builder()
                .region(Region.of(region))
                .endpointOverride(URI.create(dynamoEndpoint)) // LocalStack
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(accessKeyId, secretAccessKey)
                ))
                .build();
    }

    @Bean
    public DynamoDbEnhancedClient enhancedClient(DynamoDbClient dynamoDbClient) {
        return DynamoDbEnhancedClient.builder()
                .dynamoDbClient(dynamoDbClient)
                .build();
    }

    @Bean
    public DynamoDbTable<ClientEntity> clientTable(DynamoDbEnhancedClient enhancedClient) {
        return enhancedClient.table(tableName, TableSchema.fromBean(ClientEntity.class));
    }

    @Bean
    public DynamoDbAsyncClient dynamoDbAsyncClient() {
        return DynamoDbAsyncClient.builder()
                .region(Region.US_EAST_1)
                .endpointOverride(URI.create(dynamoEndpoint)) // LocalStack
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(accessKeyId, secretAccessKey)
                ))
                .build();
    }
}
