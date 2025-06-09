import { NextApiRequest, NextApiResponse } from 'next'
import { DynamoDBClient, CreateTableCommand } from '@aws-sdk/client-dynamodb'

const client = new DynamoDBClient({
    region: 'us-east-1',
    endpoint: 'http://localhost:4566', // LocalStack o AWS real
    credentials: {
        accessKeyId: 'test',
        secretAccessKey: 'test',
    },
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).end()

    try {
        const command = new CreateTableCommand(req.body)
        const result = await client.send(command)
        res.status(200).json(result)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Error al crear la tabla" })
    }
}
