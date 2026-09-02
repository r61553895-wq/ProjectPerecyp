import React, { useEffect, useState } from 'react';
import { useGame } from '../../context/GameContext';
import { NotificationToast } from '../../types';
import { Info, CheckCircle2, AlertTriangle, XCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ToastItemProps {
  notification: NotificationToast;
  onDismiss: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ notification, onDismiss }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    // 2-second auto-dismiss as requested by user
    const duration = 2000;
    const intervalTime = 20;
    const step = (intervalTime / duration) * 100;

    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.max(0, prev - step));
    }, intervalTime);

    const dismissTimer = setTimeout(() => {
      onDismiss(notification.id);
    }, duration);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(dismissTimer);
    };
  }, [notification.id, onDismiss]);

  const isAlert = notification.type === 'alert';
  const isSuccess = notification.type === 'success';
  const isWarning = notification.type === 'warning';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`relative pointer-events-auto p-3.5 rounded-xl border shadow-2xl flex items-start gap-3 overflow-hidden backdrop-blur-md ${
        isAlert
          ? 'bg-[#181214]/95 border-rose-900/60 text-rose-200 shadow-rose-950/40'
          : isSuccess
          ? 'bg-[#0f1715]/95 border-emerald-900/60 text-emerald-200 shadow-emerald-950/40'
          : isWarning
          ? 'bg-[#1a1710]/95 border-amber-900/60 text-amber-200 shadow-amber-950/40'
          : 'bg-[#14161b]/95 border-[#2c3240] text-neutral-200 shadow-black/50'
      }`}
    >
      <div className="shrink-0 mt-0.5">
        {isAlert && <XCircle className="w-4 h-4 text-rose-400" />}
        {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
        {isWarning && <AlertTriangle className="w-4 h-4 text-amber-400" />}
        {!isAlert && !isSuccess && !isWarning && <Info className="w-4 h-4 text-blue-400" />}
      </div>

      <div className="flex-1 min-w-0 pr-2">
        <div className="text-xs font-bold tracking-tight text-white flex items-center justify-between">
          <span>{notification.title}</span>
        </div>
        <div className="text-[11px] text-neutral-300 mt-0.5 leading-relaxed break-words">
          {notification.message}
        </div>
      </div>

      <button
        type="button"
        onClick={() => onDismiss(notification.id)}
        className="shrink-0 p-1 text-neutral-400 hover:text-white transition-colors rounded hover:bg-white/10"
        aria-label="Закрыть уведомление"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* 2-second visual timer countdown line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/40">
        <div
          className={`h-full transition-all duration-75 ease-linear ${
            isAlert
              ? 'bg-rose-500'
              : isSuccess
              ? 'bg-emerald-400'
              : isWarning
              ? 'bg-amber-400'
              : 'bg-blue-400'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </motion.div>
  );
};

export const NotificationToastContainer: React.FC = () => {
  const { state, dismissNotification } = useGame();

  return (
    <div
      id="notification-toast-container"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-3 sm:px-0"
    >
      <AnimatePresence mode="popLayout">
        {state.notifications.map((notif) => (
          <ToastItem
            key={notif.id}
            notification={notif}
            onDismiss={dismissNotification}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

