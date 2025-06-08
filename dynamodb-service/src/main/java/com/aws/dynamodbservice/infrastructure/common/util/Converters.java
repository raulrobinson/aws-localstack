package com.aws.dynamodbservice.infrastructure.common.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.experimental.UtilityClass;

import java.util.List;

@UtilityClass
public class Converters {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    public static String listToString(List<Integer> list) {
        try {
            return objectMapper.writeValueAsString(list);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error converting List to JSON", e);
        }
    }

    public static List<Integer> stringToList(String json) {
        try {
            return objectMapper.readValue(json, new TypeReference<List<Integer>>() {});
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error converting JSON to List", e);
        }
    }
}
