'use client'

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import axios from "axios"
import toast from "react-hot-toast"

export function CreateTableButton({ onTableCreated }: { onTableCreated: () => void }) {
    const [open, setOpen] = useState(false)
    const [tableName, setTableName] = useState("")
    const [pkName, setPkName] = useState("id")
    const [loading, setLoading] = useState(false)

    const handleCreate = async () => {
        if (!tableName || !pkName) {
            toast.custom("Todos los campos son obligatorios")
            return
        }

        setLoading(true)
        try {
            await axios.post("/api/dynamodb/create-table", {
                TableName: tableName,
                KeySchema: [{ AttributeName: pkName, KeyType: "HASH" }],
                AttributeDefinitions: [{ AttributeName: pkName, AttributeType: "S" }],
                ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
            })
            toast.success("Tabla creada exitosamente")
            onTableCreated()
            setOpen(false)
        } catch (err) {
            toast.error("Error al crear tabla")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Button onClick={() => setOpen(true)} className="mb-4">
                ➕ Nueva Tabla
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Crear Nueva Tabla</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Input placeholder="Nombre de la tabla" value={tableName} onChange={(e) => setTableName(e.target.value)} />
                        <Input placeholder="Nombre de la clave primaria (PK)" value={pkName} onChange={(e) => setPkName(e.target.value)} />
                    </div>
                    <DialogFooter>
                        <Button onClick={handleCreate} disabled={loading}>
                            {loading ? "Creando..." : "Crear"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
