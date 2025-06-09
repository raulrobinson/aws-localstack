'use client'

import { useEffect, useState } from "react";
import axios from "axios";

export default function CreateBucket({ onBucketCreated }: { onBucketCreated?: () => void }) {
    const [bucketName, setBucketName] = useState("");
    const [status, setStatus] = useState("");

    const handleCreateBucket = async () => {
        if (!bucketName) return;
        try {
            const res = await axios.post("/api/s3/create-bucket", { bucketName });
            setStatus("✅ Bucket creado: " + res.data.bucket);
            onBucketCreated?.()
        } catch (err) {
            setStatus("❌ Error creando bucket");
            console.error(err);
        }
    };

    return (
        <div className="p-4 border rounded shadow w-fit mb-4">
            <input
                type="text"
                value={bucketName}
                onChange={(e) => setBucketName(e.target.value)}
                placeholder="Nombre del bucket"
                className="border px-2 py-1 mr-2"
            />
            <button onClick={handleCreateBucket} className="bg-blue-500 text-white px-3 py-1 rounded">
                Crear Bucket
            </button>
            {status && <p className="mt-2">{status}</p>}
        </div>
    );
}
