import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

const baseUrl = process.env.NEXT_PUBLIC_S3_SERVICE_URL as string

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET'])
        return res.status(405).end(`Method ${req.method} Not Allowed`)
    }

    const { fileName } = req.query

    if (!fileName || typeof fileName !== 'string') {
        return res.status(400).json({ error: 'Missing or invalid fileName' })
    }

    try {
        const response = await axios.get(`${baseUrl}/download/${encodeURIComponent(fileName)}`, {
            responseType: 'arraybuffer',
        })

        const contentType = response.headers['content-type'] || 'application/octet-stream'

        res.setHeader('Content-Type', contentType)
        res.setHeader('Content-Disposition', `inline; filename="${fileName}"`)
        res.status(200).send(response.data)
    } catch (error: any) {
        console.error('Error downloading file:', error?.response?.data || error.message)
        res.status(500).json({ error: 'Failed to download file' })
    }
}
