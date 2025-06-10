import { NextApiRequest, NextApiResponse } from "next";
import { ListSecretsCommand } from "@aws-sdk/client-secrets-manager";
import { secretsManagerClient } from "@lib/secretsManagerClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const data = await secretsManagerClient.send(new ListSecretsCommand({}));
        res.status(200).json(data);
    } catch (error) {
        console.error("Error listando secretos:", error);
        res.status(500).json({ error: "Error listando secretos" });
    }
}
