import { PutObjectCommand } from "@aws-sdk/client-s3"
import fs from "fs"
import { IncomingForm } from "formidable"
import type { NextApiRequest, NextApiResponse } from "next"
import { s3 } from "../../../lib/config";

export const config = {
    api: {
        bodyParser: false,
    },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const form = new IncomingForm()
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(500).json({ error: "Error parsing form", details: err });
        }

        const bucket = fields.bucket as unknown as string || "";
        const file = Array.isArray(files.file) ? files.file[0] : files.file;

        if (!bucket || !file || !file.filepath || !file.originalFilename) {
            return res.status(400).json({
                error: "Missing file or bucket info",
                details: { file, bucket },
            });
        }

        const stream = fs.createReadStream(file.filepath);
        const command = new PutObjectCommand({
            Bucket: bucket,
            Key: file.originalFilename,
            Body: stream,
        });

        try {
            await s3.send(command);
            return res.status(200).json({ success: true });
        } catch (e) {
            return res.status(500).json({ error: "Error uploading file", details: e });
        }
    });

}
