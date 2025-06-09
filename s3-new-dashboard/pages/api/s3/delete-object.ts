import { DeleteObjectCommand } from "@aws-sdk/client-s3"
import { s3 } from "../../../lib/config";

export default async function handler(req: any, res: any) {
    const { bucket, key } = req.body
    try {
        await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }))
        res.status(200).json({ success: true })
    } catch (err) {
        res.status(500).json({ error: "Error deleting object", details: err })
    }
}
