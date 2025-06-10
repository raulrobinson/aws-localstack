"use client";

import { useState } from "react";

interface ConfirmDialogProps {
    title?: string;
    message: string;
    onConfirm: () => void;
    children: (open: () => void) => React.ReactNode;
}

export function ConfirmDialog({
                                  title = "¿Estás seguro?",
                                  message,
                                  onConfirm,
                                  children,
                              }: ConfirmDialogProps) {
    const [open, setOpen] = useState(false);

    const handleConfirm = () => {
        onConfirm();
        setOpen(false);
    };

    return (
        <>
            {children(() => setOpen(true))}

            {open && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                        <h2 className="text-xl font-semibold mb-2">{title}</h2>
                        <p className="mb-4">{message}</p>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setOpen(false)}
                                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
