import { NextApiRequest, NextApiResponse } from "next";
import { secretsManagerClient } from "@lib/secretsManagerClient";
import { GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { secretName } = req.query;

    if (!secretName || typeof secretName !== "string") {
        return res.status(400).json({ error: "Falta el nombre del secreto" });
    }

    try {
        const data = await secretsManagerClient.send(
            new GetSecretValueCommand({ SecretId: secretName })
        );
        res.status(200).json(data);
    } catch (error) {
        console.error("Error obteniendo secreto:", error);
        res.status(500).json({ error: "Error obteniendo secreto" });
    }
}
