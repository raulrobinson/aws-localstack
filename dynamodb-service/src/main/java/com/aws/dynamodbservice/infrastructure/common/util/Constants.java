package com.aws.dynamodbservice.infrastructure.common.util;

import lombok.experimental.UtilityClass;

@UtilityClass
public class Constants {
    public static final String CREATE_ERROR = "Error creating resource: {}";
    public static final String LIST_ERROR = "Error listing resources: {}";
    public static final String ASSOC_TECHS_ERROR = "Error associating technologies: {}";
    public static final String FIND_ASSOC_TECHS_ERROR = "Error finding associated technologies: {}";
    public static final String DELETE_ASSOC_TECHS_ERROR = "Error deleting associated technologies: {}";
}
