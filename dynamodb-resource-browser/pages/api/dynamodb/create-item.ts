import { NextApiRequest, NextApiResponse } from "next";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
    region: "us-east-1",
    endpoint: "http://localhost:4566", // Cambia esto si usas AWS real
});

const ddbDoc = DynamoDBDocumentClient.from(client);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Método no permitido" });
    }

    try {
        const body = req.body;

        const newItem = {
            id: Date.now().toString(),
            name: body.name,
            email: body.email,
            phone: body.phone,
        };

        const command = new PutCommand({
            TableName: "Clients",
            Item: newItem,
        });

        await ddbDoc.send(command);

        return res.status(200).json({ success: true, item: newItem });
    } catch (error) {
        console.error("Error creando item:", error);
        return res.status(500).json({ success: false, error: "Error creando item" });
    }
}