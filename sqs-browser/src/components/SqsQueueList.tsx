'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

export default function SqsDashboard() {
    const [queues, setQueues] = useState<string[]>([]);
    const [selectedQueue, setSelectedQueue] = useState<string | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [showConfirm, setShowConfirm] = useState(false);
    const [toDelete, setToDelete] = useState<string | null>(null);
    const [messageBody, setMessageBody] = useState("");

    useEffect(() => {
        axios.get("/api/sqs/list").then((res) => setQueues(res.data.queues));
    }, []);

    useEffect(() => {
        if (!selectedQueue || !autoRefresh) return;
        fetchMessages();
        const interval = setInterval(() => fetchMessages(), 10000);
        return () => clearInterval(interval);
    }, [selectedQueue, autoRefresh]);

    const fetchMessages = async () => {
        if (!selectedQueue) return;
        setLoading(true);
        try {
            const res = await axios.post("/api/sqs/receive", { queueUrl: selectedQueue });
            setMessages(res.data.messages);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = (receiptHandle: string) => {
        setToDelete(receiptHandle);
        setShowConfirm(true);
    };

    const deleteMessage = async () => {
        if (!selectedQueue || !toDelete) return;
        try {
            await axios.post("/api/sqs/delete", { queueUrl: selectedQueue, receiptHandle: toDelete });
            fetchMessages();
        } catch (e) {
            console.error(e);
        } finally {
            setShowConfirm(false);
        }
    };

    const sendMessage = async () => {
        if (!selectedQueue || !messageBody) return;
        try {
            await axios.post("/api/sqs/send", { queueUrl: selectedQueue, messageBody });
            setMessageBody("");
            fetchMessages();
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="p-4 space-y-4">

            <div onClick={() => window.location.reload()} className="text-center mb-6 cursor-pointer">
                <h1 className="text-2xl font-bold mb-4 flex items-center justify-center space-x-4">
                    <img src="/logo.svg" alt="Logo" className="h-12" />
                    <span>SQS Dashboard</span>
                </h1>
            </div>
            <div className="flex gap-4">
                <div className="w-1/3 space-y-2">
                    {queues.map((q) => (
                        <button
                            key={q}
                            onClick={() => setSelectedQueue(q)}
                            className={`block w-full p-2 text-left border rounded ${
                                selectedQueue === q ? "bg-blue-100" : "bg-white"
                            }`}
                        >
                            {q}
                        </button>
                    ))}
                </div>

                <div className="w-2/3 space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold">Mensajes de: {selectedQueue}</h2>
                        <button
                            className="px-3 py-1 text-sm bg-gray-200 rounded"
                            onClick={() => setAutoRefresh(!autoRefresh)}
                        >
                            {autoRefresh ? "⏸ Pausar" : "▶ Reanudar"}
                        </button>
                    </div>

                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Escribe un mensaje"
                            className="w-full border p-2 rounded"
                            value={messageBody}
                            onChange={(e) => setMessageBody(e.target.value)}
                        />
                        <button
                            onClick={sendMessage}
                            className="bg-green-500 text-white px-4 py-2 rounded"
                        >
                            Enviar
                        </button>
                    </div>

                    {loading ? (
                        <p>Cargando mensajes...</p>
                    ) : messages.length === 0 ? (
                        <p>No hay mensajes.</p>
                    ) : (
                        <ul className="space-y-2">
                            {messages.map((m) => (
                                <li key={m.MessageId} className="border p-2 rounded">
                                    <p><strong>ID:</strong> {m.MessageId}</p>
                                    <p><strong>Body:</strong> {m.Body}</p>
                                    {m.Attributes && (
                                        <pre className="bg-gray-100 p-2 mt-1 text-sm">
                      {JSON.stringify(m.Attributes, null, 2)}
                    </pre>
                                    )}
                                    <button
                                        onClick={() => confirmDelete(m.ReceiptHandle)}
                                        className="mt-2 text-sm bg-red-500 text-white px-3 py-1 rounded"
                                    >
                                        Eliminar
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>¿Eliminar mensaje?</DialogTitle>
                        <DialogDescription>Esta acción no se puede deshacer.</DialogDescription>
                    </DialogHeader>
                    <div className="mt-4 flex justify-end gap-2">
                        <button onClick={() => setShowConfirm(false)} className="px-4 py-2">
                            Cancelar
                        </button>
                        <button
                            onClick={deleteMessage}
                            className="px-4 py-2 bg-red-600 text-white rounded"
                        >
                            Eliminar
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
