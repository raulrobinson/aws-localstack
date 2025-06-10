import { NextApiRequest, NextApiResponse } from "next";
import { secretsManagerClient } from "@lib/secretsManagerClient";
import { DeleteSecretCommand } from "@aws-sdk/client-secrets-manager";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).end();

    const { secretName } = req.body;

    if (!secretName) {
        return res.status(400).json({ error: "Falta el nombre del secreto" });
    }

    try {
        const command = new DeleteSecretCommand({
            SecretId: secretName,
            ForceDeleteWithoutRecovery: true,
        });
        await secretsManagerClient.send(command);
        res.status(200).json({ message: "Secreto eliminado" });
    } catch (error) {
        console.error("Error eliminando secreto:", error);
        res.status(500).json({ error: "Error eliminando secreto" });
    }
}
