'use client'

import {useEffect, useState} from 'react'
import axios from 'axios'

export default function FileViewer({ fileName, fileType, onClose }: {
    fileName: string
    fileType: string
    onClose: () => void
}) {
    const [content, setContent] = useState<string | null>(null)

    useEffect(() => {
        const fetchContent = async () => {
            try {

                // Download the file from the S3 service
                const res = await axios.get(`/api/download/${fileName}`, {
                    responseType: fileType === 'text' ? 'text' : 'blob',
                })

                if (fileType === 'text') {
                    setContent(res.data)
                } else if (fileType === 'image' || fileType === 'pdf') {
                    const blob = new Blob([res.data], {
                        type: fileType === 'pdf' ? 'application/pdf' : 'image/*',
                    })
                    const url = URL.createObjectURL(blob)
                    setContent(url)
                } else {
                    setContent(null)
                }
            } catch (err) {
                console.error('Error loading file:', err)
                setContent(null)
            }
        }

        fetchContent()

        // Validate fileType
        return () => {
            if (content && fileType !== 'text') {
                URL.revokeObjectURL(content)
            }
        }
    }, [fileName, fileType])

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg w-[80%] h-[80%] overflow-auto relative">
                <button
                    className="absolute top-2 right-2 text-red-500"
                    onClick={onClose}
                >
                    ✕
                </button>

                {fileType === 'text' && content &&
                    <pre className="text-gray-500">{content}</pre>
                }

                {fileType === 'image' && content && (
                    <img
                        src={content}
                        alt={fileName}
                        className="max-w-full max-h-full"
                    />
                )}

                {fileType === 'pdf' && content && (
                    <iframe
                        src={content}
                        title={fileName}
                        className="w-full h-full"
                        frameBorder="0"
                    />
                )}

                {fileType === 'binary' &&
                    <p className="text-gray-500">Este tipo de archivo no es soportado para vista previa.</p>
                }

                {content === null && fileType !== 'binary' &&
                    <p>Cargando contenido...</p>
                }
            </div>
        </div>)
}
