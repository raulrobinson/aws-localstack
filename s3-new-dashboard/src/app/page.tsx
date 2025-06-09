'use client'

import { useEffect, useRef, useState } from "react"
import axios from "axios"
import CreateBucket from "./bucket-create/page"
import toast from "react-hot-toast"
import { MdDelete } from "react-icons/md";

export default function S3Dashboard() {
    const [buckets, setBuckets] = useState<{ Name: string }[]>([])
    const [selectedBucket, setSelectedBucket] = useState<string | null>(null)
    const [objects, setObjects] = useState<{ Key: string }[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [bucketToDelete, setBucketToDelete] = useState<string | null>(null);

    // Load buckets
    useEffect(() => {
        axios.get("/api/s3/list-buckets").then(res => setBuckets(res.data))
    }, [])

    // Load objects for selected bucket
    useEffect(() => {
        if (selectedBucket) {
            axios.get(`/api/s3/list-objects?bucket=${selectedBucket}`)
                .then(res => setObjects(res.data))
        }
    }, [selectedBucket])

    const refreshObjects = () => {
        axios.get(`/api/s3/list-objects?bucket=${selectedBucket}`)
            .then(res => setObjects(res.data))
    }

    const viewObject = async (key: string) => {
        const res = await axios.get(`/api/s3/get-url?bucket=${selectedBucket}&key=${encodeURIComponent(key)}`)
        window.open(res.data.url, "_blank")
    }

    const deleteObject = async (key: string) => {
        await axios.post("/api/s3/delete-object", { bucket: selectedBucket, key })
        setObjects(objects.filter(obj => obj.Key !== key))
    }

    const uploadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file || !selectedBucket) return

        const formData = new FormData()
        formData.append("file", file)
        formData.append("bucket", selectedBucket)

        await axios.post("/api/s3/upload", formData)
        refreshObjects()
    }

    return (
        <div className="p-6 font-sans">
            <div onClick={() => window.location.reload()} className="text-center mb-6 cursor-pointer">
                <h1 className="text-2xl font-bold mb-4 flex items-center justify-center space-x-4">
                    <img src="/logo.png" alt="Logo" className="h-12" />
                    <span>S3 Resource Browser</span>
                </h1>
            </div>

            <CreateBucket onBucketCreated={() => {
                axios.get("/api/s3/list-buckets").then(res => setBuckets(res.data))
            }} />

            <div className="flex space-x-2 border-b mb-4">
                {buckets.map(bucket => (
                    <div
                        key={bucket.Name}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-t cursor-pointer ${
                            selectedBucket === bucket.Name ? "bg-blue-500 text-white" : "bg-gray-200"
                        }`}
                        onClick={() => setSelectedBucket(bucket.Name)}
                    >
                        <span>{bucket.Name}</span>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setBucketToDelete(bucket.Name);
                            }}
                            className="p-1 rounded-full hover:bg-red-600 hover:text-white transition"
                            title="Eliminar bucket"
                        >
                            <MdDelete size={20} />
                        </button>
                    </div>

                ))}
            </div>

            {bucketToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-md max-w-sm w-full text-center">
                        <p className="mb-4">¿Estás seguro de eliminar el bucket "{bucketToDelete}"?</p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={() => setBucketToDelete(null)}
                                className="px-4 py-2 border rounded"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={async () => {
                                    try {
                                        await toast.promise(
                                            axios.post("/api/s3/delete-bucket", { bucket: bucketToDelete }),
                                            {
                                                loading: "Eliminando bucket...",
                                                success: "Bucket eliminado",
                                                error: "Error eliminando bucket",
                                            }
                                        );
                                        setBuckets(buckets.filter(b => b.Name !== bucketToDelete));
                                        if (selectedBucket === bucketToDelete) {
                                            setSelectedBucket(null);
                                        }
                                    } finally {
                                        setBucketToDelete(null);
                                    }
                                }}
                                className="px-4 py-2 bg-red-600 text-white rounded"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {selectedBucket && (
                <div>
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Contenido de: {selectedBucket}</h2>
                        <div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={uploadFile}
                                className="hidden"
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-green-600 text-white px-4 py-2 rounded"
                            >
                                Subir archivo
                            </button>
                        </div>
                    </div>

                    {objects.length === 0 ? (
                        <p className="text-gray-500">Este bucket está vacío.</p>
                    ) : (
                        <ul className="space-y-2">
                            {objects.map(obj => (
                                <li
                                    key={obj.Key}
                                    className="flex justify-between items-center bg-gray-100 p-2 rounded"
                                >
                                    <span>{obj.Key}</span>
                                    <div className="space-x-2">
                                        <button
                                            onClick={() => viewObject(obj.Key)}
                                            className="bg-blue-600 text-white px-3 py-1 rounded"
                                        >
                                            Ver
                                        </button>
                                        <button
                                            onClick={() => deleteObject(obj.Key)}
                                            className="bg-red-600 text-white px-3 py-1 rounded"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    )
}

