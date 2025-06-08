'use client'
import { useState } from 'react'
import FileUpload from '../components/FileUpload'
import FileList from '../components/FileList'
import FileViewer from '../components/FileViewer'

export default function Dashboard() {
    const [viewer, setViewer] = useState<{ fileName: string; fileType: string } | null>(null)

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-10 px-4">
            <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8">
                <header className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">📁 AWS S3 Dashboard</h1>
                    <p className="text-gray-500">Sube, visualiza y administra tus archivos en tu S3 Bucket.</p>
                </header>

                <section className="mb-10">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">📤 Subir archivo</h2>
                    <FileUpload
                        onUpload={() => window.location.reload()}
                    />
                </section>

                <section>
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">📄 Archivos</h2>
                    <FileList
                        onPreview={(fileName, fileType) => setViewer({ fileName, fileType })}
                    />
                </section>
            </div>

            {viewer && (
                <FileViewer
                    fileName={viewer.fileName}
                    fileType={viewer.fileType}
                    onClose={() => setViewer(null)}
                />
            )}
        </main>
    )
}
