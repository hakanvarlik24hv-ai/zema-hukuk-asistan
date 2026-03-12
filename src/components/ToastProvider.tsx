import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (type: ToastType, title: string, message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((type: ToastType, title: string, message: string, duration = 5000) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message, duration }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-md w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              className="pointer-events-auto"
            >
              <div className="bg-[#1a1a24]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl flex items-start gap-4 ring-1 ring-white/5 overflow-hidden relative">
                <div className={`absolute left-0 top-0 w-1.5 h-full ${
                  toast.type === 'error' ? 'bg-red-500' : 
                  toast.type === 'success' ? 'bg-green-500' : 
                  toast.type === 'warning' ? 'bg-logo-gold' : 'bg-blue-500'
                }`} />
                
                <div className={`p-2 rounded-xl ${
                  toast.type === 'error' ? 'bg-red-500/10 text-red-500' : 
                  toast.type === 'success' ? 'bg-green-500/10 text-green-500' : 
                  toast.type === 'warning' ? 'bg-logo-gold/10 text-logo-gold' : 'bg-blue-500/10 text-blue-500'
                }`}>
                  {toast.type === 'error' && <AlertCircle size={20} />}
                  {toast.type === 'success' && <CheckCircle size={20} />}
                  {toast.type === 'info' && <Info size={20} />}
                  {toast.type === 'warning' && <AlertTriangle size={20} />}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-sm text-white">{toast.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{toast.message}</p>
                </div>

                <button 
                  onClick={() => removeToast(toast.id)}
                  className="text-slate-500 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
