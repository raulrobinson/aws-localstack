import { NextApiRequest, NextApiResponse } from "next";
import { CreateBucketCommand } from "@aws-sdk/client-s3";
import { s3 } from "../../../lib/config";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).end("Method not allowed");

    const { bucketName } = req.body;
    if (!bucketName) return res.status(400).json({ error: "Bucket name is required" });

    try {
        const command = new CreateBucketCommand({ Bucket: bucketName });
        await s3.send(command);
        res.status(200).json({ message: "Bucket created", bucket: bucketName });
    } catch (error) {
        console.error("Error creating bucket:", error);
        res.status(500).json({ error: "Failed to create bucket", details: error });
    }
}
