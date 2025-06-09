import type { NextApiRequest, NextApiResponse } from "next";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDBClient } from "../../../lib/dynamodbClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { table } = req.query;
    if (!table || typeof table !== "string") {
        return res.status(400).json({ error: "Falta parámetro 'table'" });
    }

    try {
        const data = await dynamoDBClient.send(
            new ScanCommand({
                TableName: table,
            })
        );
        res.status(200).json({ Items: data.Items || [] });
    } catch (error) {
        console.error("Error listando items:", error);
        res.status(500).json({ error: "Error listando items" });
    }
}
