import type { NextApiRequest, NextApiResponse } from "next";
import { dynamoDBClient } from "../../../lib/dynamodbClient";
import { DeleteItemCommand } from "@aws-sdk/client-dynamodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).end();

    const { tableName, key } = req.body;

    if (!tableName || typeof tableName !== "string" || !key || typeof key !== "object") {
        return res.status(400).json({ error: "Faltan parámetros obligatorios" });
    }

    try {
        const dynamoKey: Record<string, { S: string } | { N: string }> = {};

        for (const [attr, val] of Object.entries(key)) {
            if (typeof val === "string") {
                dynamoKey[attr] = { S: val };
            } else if (typeof val === "number") {
                dynamoKey[attr] = { N: val.toString() };
            } else {
                throw new Error("Tipo de clave no soportado");
            }
        }

        await dynamoDBClient.send(
            new DeleteItemCommand({
                TableName: tableName,
                Key: dynamoKey,
            })
        );

        res.status(200).json({ message: "Item eliminado" });
    } catch (error) {
        console.error("Error eliminando item:", error);
        res.status(500).json({ error: "Error eliminando item" });
    }
}
