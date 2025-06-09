import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export const dynamoDBClient = new DynamoDBClient({
    region: "us-east-1", // ajusta la región si es necesario
    endpoint: "http://localhost:4566",
});

/*export const dynamoDBClient = new DynamoDBClient({
    endpoint: "http://localhost:4566",
    region: "us-east-1", // cambia a tu región de AWS
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
});*/
