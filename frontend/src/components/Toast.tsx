import { useState, useEffect, useCallback } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

interface ToastMessage {
    id: number;
    type: 'success' | 'error';
    message: string;
}

let addToastFn: ((type: 'success' | 'error', message: string) => void) | null = null;

export const toast = {
    success: (message: string) => addToastFn?.('success', message),
    error: (message: string) => addToastFn?.('error', message),
};

const ToastContainer = () => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const addToast = useCallback((type: 'success' | 'error', message: string) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, type, message }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    }, []);

    useEffect(() => {
        addToastFn = addToast;
        return () => { addToastFn = null; };
    }, [addToast]);

    const dismiss = (id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    if (toasts.length === 0) return null;

    return (
        <div className="toast-container">
            {toasts.map((t) => (
                <div key={t.id} className={`toast toast-${t.type}`}>
                    {t.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    <span>{t.message}</span>
                    <button className="toast-dismiss" onClick={() => dismiss(t.id)}>
                        <X size={16} />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default ToastContainer;
