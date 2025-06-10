import type { NextApiRequest, NextApiResponse } from "next";
import { sqsClient } from "@lib/sqsClient"; // o donde lo tengas
import { DeleteMessageCommand } from "@aws-sdk/client-sqs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).end();

    const { queueUrl, receiptHandle } = req.body;

    if (!queueUrl || !receiptHandle) {
        return res.status(400).json({ error: "queueUrl y receiptHandle requeridos" });
    }

    try {
        await sqsClient.send(
            new DeleteMessageCommand({ QueueUrl: queueUrl, ReceiptHandle: receiptHandle })
        );
        res.status(200).json({ message: "Mensaje eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar mensaje:", error);
        res.status(500).json({ error: "Error eliminando mensaje" });
    }
}
