import type { NextApiRequest, NextApiResponse } from "next";
import { ListTablesCommand } from "@aws-sdk/client-dynamodb";
import { dynamoDBClient } from "../../../lib/dynamodbClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const data = await dynamoDBClient.send(new ListTablesCommand({}));
        res.status(200).json({ Tables: data.TableNames || [] });
    } catch (error) {
        console.error("Error listando tablas:", error);
        res.status(500).json({ error: "Error listando tablas" });
    }
}
