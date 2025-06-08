package com.aws.ws;

import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.cloudwatch.CloudWatchClient;
import software.amazon.awssdk.services.cloudwatch.model.*;

import java.net.URI;
import java.time.Instant;

@Service
public class CloudWatchService {

    private final CloudWatchClient cloudWatchClient;

    public CloudWatchService() {
        this.cloudWatchClient = CloudWatchClient.builder()
                .endpointOverride(URI.create("http://localhost:4566"))
                .region(Region.US_EAST_1)
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create("test", "test")))
                .build();
    }

    public void sendMetric() {
        MetricDatum datum = MetricDatum.builder()
                .metricName("RequestCount")
                .unit(StandardUnit.COUNT)
                .value(1.0)
                .timestamp(Instant.now())
                .build();

        PutMetricDataRequest request = PutMetricDataRequest.builder()
                .namespace("MyApp/Metrics")
                .metricData(datum)
                .build();

        cloudWatchClient.putMetricData(request);
    }
}

