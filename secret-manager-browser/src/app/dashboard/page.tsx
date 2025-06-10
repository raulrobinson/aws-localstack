"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { CreateSecretForm } from "@/components/CreateSecretForm";
import {ConfirmDialog} from "@/components/ConfirmDialog";

interface Secret {
    ARN: string;
    Name: string;
    CreatedDate: string;
    LastChangedDate: string;
}

export default function SecretsDashboard() {
    const [secrets, setSecrets] = useState<Secret[]>([]);
    const [selectedSecret, setSelectedSecret] = useState<string | null>(null);
    const [secretValue, setSecretValue] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchSecrets();
    }, []);

    const fetchSecrets = async () => {
        setLoading(true);
        try {
            const res = await axios.get("/api/secrets/list");
            setSecrets(res.data.SecretList || []);
        } catch {
            toast.error("Error cargando secretos");
        } finally {
            setLoading(false);
        }
    };

    const viewSecretValue = async (secretName: string) => {
        try {
            const res = await axios.get("/api/secrets/get", {
                params: { secretName },
            });
            setSecretValue(res.data.SecretString);
            setSelectedSecret(secretName);
        } catch {
            toast.error("Error obteniendo valor del secreto");
        }
    };

    const deleteSecret = async (secretName: string) => {
        try {
            await axios.post("/api/secrets/delete", { secretName });
            setSecrets(secrets.filter(s => s.Name !== secretName));
            if (selectedSecret === secretName) {
                setSelectedSecret(null);
                setSecretValue(null);
            }
            toast.success("Secreto eliminado");
        } catch {
            toast.error("Error eliminando secreto");
        }
    };

    return (
        <div className="p-6 font-sans">
            <div onClick={() => window.location.reload()} className="text-center mb-6 cursor-pointer">
                <h1 className="text-2xl font-bold mb-4 flex items-center justify-center space-x-4">
                    <img src="/logo.png" alt="Logo" className="h-12" />
                    <span>Secrets Manager</span>
                </h1>
            </div>
            <CreateSecretForm onCreated={fetchSecrets} />
            <div className="flex gap-8">
                <div className="w-1/3">
                    <h3 className="font-semibold mb-2">Secretos</h3>
                    {loading ? (
                        <p>Cargando...</p>
                    ) : (
                        <ul className="space-y-2">
                            {secrets.map(secret => (
                                <li
                                    key={secret.Name}
                                    className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded"
                                >
                                    <button
                                        onClick={() => viewSecretValue(secret.Name)}
                                        className="text-sm font-medium flex-1 text-left hover:underline"
                                    >
                                        {secret.Name}
                                    </button>

                                    <ConfirmDialog
                                        message={`¿Estás seguro de eliminar el secreto "${secret.Name}"?`}
                                        onConfirm={() => deleteSecret(secret.Name)}
                                    >
                                        {(open) => (
                                            <button
                                                onClick={open}
                                                className="text-red-600 hover:text-red-800 ml-2"
                                            >
                                                Eliminar
                                            </button>
                                        )}
                                    </ConfirmDialog>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="w-2/3">
                    <h3 className="font-semibold mb-2">
                        Valor de: {selectedSecret}
                    </h3>
                    <div className="bg-white border p-4 rounded">
                        {secretValue ? (
                            <pre className="whitespace-pre-wrap break-all">{secretValue}</pre>
                        ) : (
                            <p className="text-gray-500 text-sm">
                                Selecciona un secreto para ver su valor.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
