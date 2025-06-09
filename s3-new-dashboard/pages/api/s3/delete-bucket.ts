import { DeleteBucketCommand } from "@aws-sdk/client-s3"
import { s3 } from "../../../lib/config";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" })
    }

    try {
        const { bucket } = req.body
        const command = new DeleteBucketCommand({ Bucket: bucket })
        await s3.send(command)
        return res.status(200).json({ success: true })
    } catch (error) {
        return res.status(500).json({ error: "Error deleting bucket", details: error })
    }
}

