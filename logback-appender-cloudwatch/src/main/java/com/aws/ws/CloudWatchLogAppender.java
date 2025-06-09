package com.aws.ws;

import ch.qos.logback.core.AppenderBase;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.Layout;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.cloudwatchlogs.CloudWatchLogsClient;
import software.amazon.awssdk.services.cloudwatchlogs.model.*;

import java.net.URI;
import java.time.Instant;
import java.util.Collections;

public class CloudWatchLogAppender extends AppenderBase<ILoggingEvent> {

    private Layout<ILoggingEvent> layout;

    private CloudWatchLogsClient logsClient;
    private String logGroupName;
    private String logStreamName;
    private String endpoint;

    private String nextSequenceToken;

    @Override
    public void start() {
        try {
            logsClient = CloudWatchLogsClient.builder()
                    .region(Region.US_EAST_1)
                    .endpointOverride(URI.create(endpoint))
                    .credentialsProvider(
                            StaticCredentialsProvider.create(
                                    AwsBasicCredentials.create("test", "test")
                            )
                    )
                    .build();

            try {
                logsClient.createLogGroup(CreateLogGroupRequest.builder()
                        .logGroupName(logGroupName)
                        .build());
            } catch (ResourceAlreadyExistsException ignored) {}

            try {
                logsClient.createLogStream(CreateLogStreamRequest.builder()
                        .logGroupName(logGroupName)
                        .logStreamName(logStreamName)
                        .build());
            } catch (ResourceAlreadyExistsException ignored) {}

            DescribeLogStreamsResponse streamsResponse = logsClient.describeLogStreams(
                    DescribeLogStreamsRequest.builder()
                            .logGroupName(logGroupName)
                            .logStreamNamePrefix(logStreamName)
                            .build());

            if (!streamsResponse.logStreams().isEmpty()) {
                nextSequenceToken = streamsResponse.logStreams().getFirst().uploadSequenceToken();
            }

            super.start();
        } catch (Exception e) {
            addError("Error iniciando CloudWatchAppender", e);
        }
    }

    @Override
    protected void append(ILoggingEvent eventObject) {
        if (logsClient == null) return;

        String message = layout != null ? layout.doLayout(eventObject) : eventObject.getFormattedMessage();

        InputLogEvent logEvent = InputLogEvent.builder()
                .message(message)
                .timestamp(Instant.now().toEpochMilli())
                .build();

        PutLogEventsRequest.Builder putLogEventsRequestBuilder = PutLogEventsRequest.builder()
                .logGroupName(logGroupName)
                .logStreamName(logStreamName)
                .logEvents(Collections.singletonList(logEvent));

        if (nextSequenceToken != null) {
            putLogEventsRequestBuilder.sequenceToken(nextSequenceToken);
        }

        try {
            PutLogEventsResponse response = logsClient.putLogEvents(putLogEventsRequestBuilder.build());
            nextSequenceToken = response.nextSequenceToken();
        } catch (InvalidSequenceTokenException e) {
            nextSequenceToken = e.expectedSequenceToken();
            putLogEventsRequestBuilder.sequenceToken(nextSequenceToken);
            PutLogEventsResponse response = logsClient.putLogEvents(putLogEventsRequestBuilder.build());
            nextSequenceToken = response.nextSequenceToken();
        } catch (Exception e) {
            addError("Error enviando logs a CloudWatch", e);
        }
    }

    // Setters para inyectar configuración desde logback.xml
    public void setLogGroupName(String logGroupName) {
        this.logGroupName = logGroupName;
    }

    public void setLogStreamName(String logStreamName) {
        this.logStreamName = logStreamName;
    }

    public void setEndpoint(String endpoint) {
        this.endpoint = endpoint;
    }

    public void setLayout(Layout<ILoggingEvent> layout) {
        this.layout = layout;
    }
}

