import { ReceiveMessageCommand } from "@aws-sdk/client-sqs";
import { sqsClient } from "@lib/sqsClient";

export default async function handler(req: any, res: any) {
    if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

    const { queueUrl } = req.body;
    if (!queueUrl) return res.status(400).json({ error: "queueUrl requerido" });

    try {
        const allMessages = [];
        let attempts = 0;

        while (attempts < 5) { // máximo 5 ciclos para evitar bucles infinitos
            const command = new ReceiveMessageCommand({
                QueueUrl: queueUrl,
                MaxNumberOfMessages: 10,
                WaitTimeSeconds: 1,
                VisibilityTimeout: 5, // opcional: oculta el mensaje temporalmente
            });

            const response = await sqsClient.send(command);
            const messages = response.Messages || [];

            if (messages.length === 0) break;

            allMessages.push(...messages);
            attempts++;
        }

        res.status(200).json({ messages: allMessages });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al recibir mensajes" });
    }
}
