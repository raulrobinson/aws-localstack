import { SendMessageCommand } from "@aws-sdk/client-sqs";
import { sqsClient } from "@lib/sqsClient";

export default async function handler(req: any, res: any) {
    const { queueUrl, messageBody } = req.body;

    try {
        await sqsClient.send(
            new SendMessageCommand({
                QueueUrl: queueUrl,
                MessageBody: messageBody,
            })
        );
        res.status(200).json({ message: "Mensaje enviado" });
    } catch (err) {
        res.status(500).json({ error: "Error enviando el mensaje" });
    }
}
