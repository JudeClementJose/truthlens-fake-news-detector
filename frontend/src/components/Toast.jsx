import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ message, type = 'info', onClose, duration = 4000 }) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-brand-500" />
  };

  const bgStyles = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/80 dark:border-emerald-800 dark:text-emerald-200',
    error: 'bg-red-50 border-red-200 text-red-900 dark:bg-red-950/80 dark:border-red-800 dark:text-red-200',
    info: 'bg-brand-50 border-brand-200 text-brand-900 dark:bg-brand-950/80 dark:border-brand-800 dark:text-brand-200'
  };

  return (
    <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl backdrop-blur-md animate-fade-in ${bgStyles[type]}`}>
      {icons[type]}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="p-1 hover:opacity-70">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
