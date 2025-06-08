import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import FormData from 'form-data'
import axios from 'axios'
import { parseForm } from "@/app/lib/parseForm";

export const config = {
    api: {
        bodyParser: false,
    },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).end()

    try {
        const { files } = await parseForm(req)

        const fileData = files.file

        if (!fileData || (Array.isArray(fileData) && fileData.length === 0)) {
            return res.status(400).json({ error: 'Invalid file' })
        }

        const uploadedFile = Array.isArray(fileData) ? fileData[0] : fileData


        if (!uploadedFile || Array.isArray(uploadedFile)) {
            return res.status(400).json({ error: 'Invalid file' })
        }

        const fileStream = fs.createReadStream(uploadedFile.filepath)

        const formData = new FormData()
        formData.append('file', fileStream, uploadedFile.originalFilename || 'upload')

        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_S3_SERVICE_URL}/upload`,
            formData,
            {
                headers: formData.getHeaders(),
            }
        )

        return res.status(200).json({ message: 'Upload complete', data: response.data })
    } catch (error) {
        console.error('Upload failed:', error)
        res.status(500).json({ error: 'Upload failed' })
    }
}
