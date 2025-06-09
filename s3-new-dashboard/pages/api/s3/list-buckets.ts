import { ListBucketsCommand } from "@aws-sdk/client-s3"
import { s3 } from "../../../lib/config";

export default async function handler(req: any, res: any) {
    try {
        const data = await s3.send(new ListBucketsCommand({}))
        res.status(200).json(data.Buckets || [])
    } catch (err) {
        res.status(500).json({ error: "Error listing buckets", details: err })
    }
}
