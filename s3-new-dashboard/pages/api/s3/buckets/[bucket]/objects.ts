import { NextApiRequest, NextApiResponse } from "next"
import AWS from "aws-sdk";

const s3 = new AWS.S3({
    endpoint: process.env.NEXT_PUBLIC_S3_SERVICE_URL, // <- TODO: sí existe, aunque TypeScript no lo vea por defecto
    region: "us-east-1",
    s3ForcePathStyle: true,
    accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY
} as AWS.S3.ClientConfiguration); // <-- TODO: esto corrige el error TS2353

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { bucket } = req.query
    try {
        const response = await s3.listObjectsV2({ Bucket: bucket as string }).promise()
        const objectKeys = response.Contents?.map(obj => obj.Key!) || []
        res.status(200).json(objectKeys)
    } catch (err) {
        res.status(500).json({ error: "Error listing objects", details: err })
    }
}
