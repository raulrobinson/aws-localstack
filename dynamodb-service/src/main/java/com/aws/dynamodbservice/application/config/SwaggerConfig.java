package com.aws.dynamodbservice.application.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI myOpenAPI(
            @Value("${openapi.service.title}") String serviceTitle,
            @Value("${openapi.service.version}") String serviceVersion,
            @Value("${openapi.service.description}") String description,
            @Value("${openapi.service.contact.email}") String contactEmail,
            @Value("${openapi.service.contact.name}") String contactName,
            @Value("${openapi.service.host}") String host) {

        // Contact information for the service
        Contact contact = new Contact()
                .email(contactEmail)
                .name(contactName);

        // License information for the service
        License mitLicense = new License()
                .name("MIT License")
                .url("https://opensource.org/licenses/MIT");

        // Service information for the OpenAPI specification
        Info info = new Info()
                .title(serviceTitle)
                .version(serviceVersion)
                .contact(contact)
                .description(description)
                .termsOfService("https://opensource.org/licenses/MIT")
                .license(mitLicense);

        return new OpenAPI()
                .servers(List.of(new Server().url(host).description(description)))
                .info(info);
    }

}
