'use client'

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"

export default function ResourceBrowser() {
    const [buckets, setBuckets] = useState<string[]>([])
    const [selectedBucket, setSelectedBucket] = useState<string | null>(null)
    const [objects, setObjects] = useState<string[]>([])

    useEffect(() => {
        fetch("/api/s3/buckets/list")
            .then(res => res.json())
            .then(data => setBuckets(data))
    }, [])

    useEffect(() => {
        if (!selectedBucket) return
        fetch(`/api/s3/buckets/${selectedBucket}/objects`)
            .then(res => res.json())
            .then(data => setObjects(data))
    }, [selectedBucket])

    return (
        <Tabs defaultValue="s3" className="w-full">
            <TabsList>
                <TabsTrigger value="s3">S3 Buckets</TabsTrigger>
                <TabsTrigger value="logs">CloudWatch Logs</TabsTrigger>
            </TabsList>

            <TabsContent value="s3">
                <div className="grid grid-cols-4 gap-4 p-4">
                    <Card className="col-span-1">
                        <CardContent className="p-2 space-y-2">
                            <h3 className="text-lg font-semibold">Buckets</h3>
                            {buckets.map(bucket => (
                                <button
                                    key={bucket}
                                    className={`w-full text-left px-2 py-1 rounded hover:bg-gray-200 ${
                                        selectedBucket === bucket ? "bg-gray-100" : ""
                                    }`}
                                    onClick={() => setSelectedBucket(bucket)}
                                >
                                    {bucket}
                                </button>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="col-span-3">
                        <CardContent className="p-2">
                            <h3 className="text-lg font-semibold">Objects in {selectedBucket}</h3>
                            <ul className="mt-2 space-y-1">
                                {objects.map(obj => (
                                    <li key={obj} className="text-sm border-b pb-1">{obj}</li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </TabsContent>

            <TabsContent value="logs">
                <p className="p-4 text-muted">Mostrar CloudWatch logs u otros recursos.</p>
            </TabsContent>
        </Tabs>
    )
}
