"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

interface Props {
    onCreated?: () => void;
}

export function CreateSecretForm({ onCreated }: Props) {
    const [name, setName] = useState("");
    const [value, setValue] = useState("");

    const createSecret = async () => {
        if (!name || !value) {
            toast.error("Completa todos los campos");
            return;
        }

        try {
            await axios.post("/api/secrets/create", { name, value });
            toast.success("Secreto creado");
            setName("");
            setValue("");
            onCreated?.();
        } catch {
            toast.error("Error creando secreto");
        }
    };

    return (
        <div className="bg-gray-100 p-4 rounded mb-6">
            <h3 className="font-semibold mb-2">Crear nuevo secreto</h3>
            <input
                type="text"
                placeholder="Nombre"
                className="block w-full mb-2 p-2 border rounded"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <textarea
                placeholder="Valor secreto"
                className="block w-full mb-2 p-2 border rounded"
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
            <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={createSecret}
            >
                Crear
            </button>
        </div>
    );
}
