import { useEffect } from 'react';

export default function Toast({ message, type = 'success', show, onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 2500);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  const bgColor = type === 'success' ? 'bg-green-600 dark:bg-green-700' : 'bg-red-600 dark:bg-red-700';
  const icon = type === 'success' ? '✓' : '✕';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slideUp">
      <div className={`${bgColor} text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3`}>
        <span className="text-lg font-bold">{icon}</span>
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
}