import { SecretsManagerClient } from "@aws-sdk/client-secrets-manager";

export const secretsManagerClient = new SecretsManagerClient({
    region: "us-east-1", // ajusta la región si es necesario
    endpoint: "http://localhost:4566",
});
