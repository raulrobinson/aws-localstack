package com.aws.dynamodbservice.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Client {
    private String id;
    private String name;
    private String age;
    private Boolean status;
}
