import { NextApiRequest, NextApiResponse } from "next";
import { secretsManagerClient } from "@lib/secretsManagerClient";
import { CreateSecretCommand } from "@aws-sdk/client-secrets-manager";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).end();

    const { name, value } = req.body;

    if (!name || !value) {
        return res.status(400).json({ error: "Faltan campos" });
    }

    try {
        const command = new CreateSecretCommand({
            Name: name,
            SecretString: value,
        });
        const data = await secretsManagerClient.send(command);
        res.status(200).json(data);
    } catch (error: any) {
        console.error("Error creando secreto:", error);
        res.status(500).json({ error: error.message });
    }
}
