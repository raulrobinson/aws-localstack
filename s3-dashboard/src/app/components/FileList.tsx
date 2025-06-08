'use client'
import { useEffect, useState } from 'react'
import axios from "axios";
import { detectType } from "@/app/utils/DetectType";

export default function FileList({ onPreview }: { onPreview: (fileName: string, type: string) => void }) {
    const [files, setFiles] = useState<string[]>([])

    // Fetch the list of files from the S3 service
    const fetchFiles = async () => {
        const res = await axios.get('/api/list')
        setFiles(res.data)
    }

    // Delete a file from the S3 service
    const handleDelete = async (fileName: string) => {
        await axios.delete(`/api/delete/${fileName}`)
        fetchFiles()
    }

    useEffect(() => {
        fetchFiles()
    }, [])

    return (
        <table className="w-full border mt-4">
            <thead>
            <tr className="bg-gray-200">
                <th className="p-2 text-left text-gray-600">Archivo</th>
                <th className="p-2 text-gray-600">Acciones</th>
            </tr>
            </thead>
            <tbody>
            {files.length > 0 ? (
                files.map((file) => (
                    <tr key={file} className="border-t hover:bg-gray-50 transition-colors">
                        <td className="p-3 text-gray-700">{file}</td>
                        <td className="p-3 space-x-2 text-right">
                            <button
                                onClick={() => onPreview(file, detectType(file))}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md shadow-sm transition"
                            >
                                Ver
                            </button>
                            <button
                                onClick={() => handleDelete(file)}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-md shadow-sm transition"
                            >
                                Eliminar
                            </button>
                        </td>
                    </tr>
                ))
            ) : (
                <tr>
                    <td colSpan={2} className="p-6 text-center text-gray-400 italic">
                        No hay archivos disponibles.
                    </td>
                </tr>
            )}
            </tbody>
        </table>
    )
}
