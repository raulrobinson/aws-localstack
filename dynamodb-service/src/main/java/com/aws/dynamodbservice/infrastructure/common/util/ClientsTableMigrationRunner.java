package com.aws.dynamodbservice.infrastructure.common.util;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.services.dynamodb.DynamoDbAsyncClient;
import software.amazon.awssdk.services.dynamodb.model.*;

import java.util.concurrent.CompletableFuture;

@Component
public class ClientsTableMigrationRunner implements CommandLineRunner {

    private final DynamoDbAsyncClient dynamoDb;

    public ClientsTableMigrationRunner(DynamoDbAsyncClient dynamoDb) {
        this.dynamoDb = dynamoDb;
    }

    @Override
    public void run(String... args) {
        dynamoDb.listTables()
                .thenCompose(listTablesResponse -> {
                    if (!listTablesResponse.tableNames().contains("Clients")) {
                        CreateTableRequest request = CreateTableRequest.builder()
                                .tableName("Clients")
                                .keySchema(KeySchemaElement.builder()
                                        .attributeName("id")
                                        .keyType(KeyType.HASH)
                                        .build())
                                .attributeDefinitions(AttributeDefinition.builder()
                                        .attributeName("id")
                                        .attributeType(ScalarAttributeType.S)
                                        .build())
                                .billingMode(BillingMode.PAY_PER_REQUEST)
                                .build();

                        System.out.println("Creating table 'Clients'...");
                        return dynamoDb.createTable(request);
                    } else {
                        System.out.println("Table 'Clients' already exists.");
                        return CompletableFuture.completedFuture(null);
                    }
                })
                .thenAccept(res -> {
                    if (res != null) {
                        System.out.println("Table created: " + res.tableDescription().tableName());
                    }
                })
                .exceptionally(ex -> {
                    System.err.println("Error creating table: " + ex.getMessage());
                    return null;
                })
                .join();
    }
}

