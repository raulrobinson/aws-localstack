'use client';

import {useEffect, useState} from "react";
import axios from "axios";

export default function SqsDashboard() {
    const [queues, setQueues] = useState<string[]>([]);
    const [selectedQueue, setSelectedQueue] = useState<string | null>(null);
    const [messageBody, setMessageBody] = useState("");
    const [messages, setMessages] = useState<{ Body: string; MessageId: string }[]>([]);

    useEffect(() => {
        axios.get("/api/sqs/list").then((res) => {
            setQueues(res.data.queues);
        });
    }, []);

    const sendMessage = async () => {
        if (!selectedQueue || !messageBody) return;
        await axios.post("/api/sqs/send", {
            queueUrl: selectedQueue,
            messageBody,
        });
        alert("Mensaje enviado");
        setMessageBody("");
    };

    const fetchMessages = async () => {
        if (!selectedQueue) return;
        const res = await axios.post("/api/sqs/receive", {queueUrl: selectedQueue});
        setMessages(res.data.messages);
    };

    return (
        <div className="p-4">
            {/*<h1 className="text-2xl font-bold">Dashboard de SQS</h1>*/}

            <div className="mt-4">
                <label className="block">Selecciona una cola:</label>
                <select
                    className="p-2 border rounded"
                    onChange={(e) => {
                        const value = e.target.value;
                        setSelectedQueue(value);
                        setMessages([]);
                    }}
                >
                    <option value="">--Seleccionar--</option>
                    {queues.map((q) => (
                        <option key={q} value={q}>
                            {q}
                        </option>
                    ))}
                </select>
            </div>

            {selectedQueue && (
                <>
                    <div className="mt-4">
                        <textarea
                            placeholder="Escribe tu mensaje..."
                            className="w-full border p-2"
                            rows={4}
                            value={messageBody}
                            onChange={(e) => setMessageBody(e.target.value)}
                        />
                        <button
                            onClick={sendMessage}
                            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
                        >
                            Enviar mensaje
                        </button>
                        <button
                            onClick={fetchMessages}
                            className="mt-2 ml-2 px-4 py-2 bg-green-600 text-white rounded"
                        >
                            Ver mensajes
                        </button>
                    </div>

                    <div className="mt-6">
                        <h2 className="text-xl font-semibold">Mensajes recibidos:</h2>
                        {messages.length === 0 ? (
                            <p className="text-gray-600">No hay mensajes.</p>
                        ) : (
                            <ul className="mt-2 space-y-2">
                                {messages.map((msg) => (
                                    <li key={msg.MessageId} className="p-2 border rounded bg-gray-100">
                                        <strong>ID:</strong> {msg.MessageId}
                                        <br />
                                        <strong>Contenido:</strong> {msg.Body}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
