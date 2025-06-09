import type { NextApiRequest, NextApiResponse } from "next";
import { DeleteTableCommand } from "@aws-sdk/client-dynamodb";
import { dynamoDBClient } from "../../../lib/dynamodbClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).end();

    const { tableName } = req.body;
    if (!tableName || typeof tableName !== "string") {
        return res.status(400).json({ error: "Falta parámetro 'tableName'" });
    }

    try {
        await dynamoDBClient.send(new DeleteTableCommand({ TableName: tableName }));
        res.status(200).json({ message: "Tabla eliminada" });
    } catch (error) {
        console.error("Error eliminando tabla:", error);
        res.status(500).json({ error: "Error eliminando tabla" });
    }
}
