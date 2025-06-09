import { GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { s3 } from "../../../lib/config";

export default async function handler(req: any, res: any) {
    const { bucket, key } = req.query
    try {
        const command = new GetObjectCommand({ Bucket: bucket, Key: key })
        const url = await getSignedUrl(s3, command, { expiresIn: 300 })
        res.status(200).json({ url })
    } catch (err) {
        res.status(500).json({ error: "Error getting URL", details: err })
    }
}
