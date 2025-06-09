"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { CreateTableButton } from "@/components/create-table";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { CreateClientForm } from "@/components/create-client";

interface Item {
    [key: string]: any;
}

export default function DynamoDashboard() {
    const [tables, setTables] = useState<string[]>([]);
    const [selectedTable, setSelectedTable] = useState<string | null>(null);
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchTables();
    }, []);

    const fetchTables = async () => {
        setLoading(true)
        try {
            const res = await axios.get("/api/dynamodb/list-tables")
            setTables(res.data.TableNames ?? res.data.Tables ?? [])
        } catch (err) {
            toast.error("Error cargando tablas")
        } finally {
            setLoading(false)
        }
    }

    const fetchItems = async (table: string) => {
        try {
            const res = await axios.get("/api/dynamodb/list-items", {
                params: { table },
            });
            setItems(res.data.Items);
            setSelectedTable(table);
        } catch (err) {
            toast.error("Error cargando items");
        }
    };

    const deleteTable = async (tableName: string) => {
        try {
            await axios.post("/api/dynamodb/delete-table", { tableName });
            setTables(tables.filter((t) => t !== tableName));
            if (selectedTable === tableName) {
                setSelectedTable(null);
                setItems([]);
            }
            toast.success("Tabla eliminada");
        } catch (err) {
            toast.error("Error eliminando tabla");
        }
    };

    const deleteItem = async (item: Item) => {
        try {
            await axios.post("/api/dynamodb/delete-item", {
                tableName: selectedTable,
                key: { id: item.id }, // TODO: AJUSTAR según la clave primaria real
            });
            setItems(items.filter((i) => i.id !== item.id)); // TODO: AJUSTAR también esto
            toast.success("Item eliminado");
        } catch (err) {
            toast.error("Error eliminando item");
        }
    };

    return (
        <div className="p-6 font-sans">
            <div onClick={() => window.location.reload()} className="text-center mb-6 cursor-pointer">
                <h1 className="text-2xl font-bold mb-4 flex items-center justify-center space-x-4">
                    <img src="/amazon-dynamodb.png" alt="Logo" className="h-12" />
                    <span>DynamoDB Manager</span>
                </h1>
            </div>
            <CreateTableButton onTableCreated={() => fetchTables()} />
            <div className="flex gap-8">

                <div className="w-1/3">
                    <h3 className="font-semibold mb-2">Tablas</h3>
                    {loading ? (
                        <p className="text-gray-500">Cargando...</p>
                    ) : (
                        <ul className="space-y-2">
                            {tables?.length ? (
                                tables.map((table) => (
                                    <li
                                        key={table}
                                        className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded"
                                    >
                                        <button
                                            onClick={() => fetchItems(table)}
                                            className="text-sm font-medium text-left flex-1 hover:underline"
                                        >
                                            {table}
                                        </button>

                                        <ConfirmDialog
                                            message={`¿Eliminar la tabla "${table}"?`}
                                            onConfirm={() => deleteTable(table)}
                                        >
                                            <button
                                                title="Eliminar tabla"
                                                className="ml-3 text-red-600 text-sm hover:underline"
                                            >
                                                🗑
                                            </button>
                                        </ConfirmDialog>
                                    </li>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">No hay tablas disponibles.</p>
                            )}

                        </ul>
                    )}
                </div>

                <div className="w-2/3">
                    <h3 className="font-semibold mb-2">Items en: {selectedTable}</h3>
                    <div className="overflow-auto max-h-[60vh] border rounded p-3 bg-white space-y-2">
                        {selectedTable === "Clients" && (
                            <CreateClientForm onCreated={() => fetchItems(selectedTable)} />
                        )}
                        {items.map((item, idx) => (
                            <div
                                key={idx}
                                className="flex justify-between items-start border p-2 rounded bg-gray-50 text-sm"
                            >
                                <pre className="whitespace-pre-wrap">{JSON.stringify(item, null, 2)}</pre>
                                <button
                                    className="text-red-500 text-xs"
                                    onClick={() => deleteItem(item)}
                                    title="Eliminar item"
                                >
                                    🗑
                                </button>
                            </div>
                        ))}
                        {items.length === 0 && <p className="text-gray-500 text-sm">No hay items</p>}
                    </div>
                </div>

            </div>
        </div>
    );
}
