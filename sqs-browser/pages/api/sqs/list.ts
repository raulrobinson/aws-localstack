import { ListQueuesCommand } from "@aws-sdk/client-sqs";
import { sqsClient } from "@lib/sqsClient";

export default async function handler(req: any, res: any) {
    try {
        const data = await sqsClient.send(new ListQueuesCommand({}));
        res.status(200).json({ queues: data.QueueUrls || [] });
    } catch (err) {
        res.status(500).json({ error: "Error al listar las colas" });
    }
}
