import { ListObjectsV2Command } from "@aws-sdk/client-s3"
import { s3 } from "../../../lib/config";

export default async function handler(req: any, res: any) {
    const { bucket } = req.query
    try {
        const data = await s3.send(new ListObjectsV2Command({ Bucket: bucket }))
        res.status(200).json(data.Contents || [])
    } catch (err) {
        res.status(500).json({ error: "Error listing objects", details: err })
    }
}
