'use client'
import { useState } from 'react';
import axios from 'axios';

export default function FileUpload({ onUpload }: { onUpload: () => void }) {
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!file) return

        const formData = new FormData();
        formData.append('file', file);

        // Upload the file to the S3 service
        try {
            setLoading(true)
            await axios.post('/api/upload', formData);
            setLoading(false)
            onUpload()
        } catch (err) {
            console.error('Upload error:', err)
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="mb-6 flex gap-4 items-center">
            <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="border px-4 py-2 rounded-lg text-gray-500"
            />
            <button
                type="submit"
                disabled={!file || loading}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
                {loading ? 'Subiendo...' : 'Subir archivo'}
            </button>
        </form>
    )
}
