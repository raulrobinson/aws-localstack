import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

const baseUrl = process.env.NEXT_PUBLIC_S3_SERVICE_URL as string

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { fileName } = req.query

    if (req.method !== 'DELETE') {
        return res.status(405).json({ message: 'Method Not Allowed' })
    }

    if (!fileName || typeof fileName !== 'string') {
        return res.status(400).json({ message: 'Invalid file name' })
    }

    try {
        const backendUrl = `${baseUrl}/delete/${fileName}`
        await axios.delete(backendUrl)

        return res.status(200).json({ message: 'File deleted successfully' })
    } catch (error) {
        console.error('Delete failed:', error)
        return res.status(500).json({ message: 'Failed to delete file' })
    }
}
