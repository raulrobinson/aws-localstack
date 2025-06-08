import { NextApiRequest, NextApiResponse } from 'next';
import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_S3_SERVICE_URL as string;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method !== 'GET') {
            res.setHeader('Allow', ['GET']);
            return res.status(405).end(`Method ${req.method} Not Allowed`);
        }

        // fetching a file list from S3
        const response = await axios.get(baseUrl + '/list', {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const messages = response.data;
        console.log('Fetched messages:', messages);

        res.status(200).json(messages);

    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}