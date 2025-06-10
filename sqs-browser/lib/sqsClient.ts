import { SQSClient } from "@aws-sdk/client-sqs";

export const sqsClient = new SQSClient({
    region: "us-east-1", // o tu región
    endpoint: "http://localhost:4566", // Cambia esto si usas AWS real
});
