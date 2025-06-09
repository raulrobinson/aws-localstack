"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export function CreateClientForm({ onCreated }: { onCreated: () => void }) {
    const [form, setForm] = useState({ name: "", email: "", phone: "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post("/api/dynamodb/create-item", form);
            toast.success("Cliente creado");
            setForm({ name: "", email: "", phone: "" });
            onCreated();
        } catch (err) {
            toast.error("Error creando cliente");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-2 p-4 border rounded bg-white mb-6">
            <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nombre"
                className="border p-2 rounded w-full"
                required
            />
            <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="border p-2 rounded w-full"
                required
            />
            <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Teléfono"
                className="border p-2 rounded w-full"
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                Crear Cliente
            </button>
        </form>
    );
}
