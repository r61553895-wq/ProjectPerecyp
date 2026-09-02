import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  Package,
  ArrowRight,
  TrendingUp,
  Sparkles,
  ShoppingBag,
  ShieldCheck,
  X
} from 'lucide-react';

export interface PurchaseCelebrationData {
  itemTitle: string;
  itemImage: string;
  categoryLabel?: string;
  pricePaid: number;
  marketPrice: number;
  estimatedProfit: number;
  condition?: string;
  defectsCount?: number;
}

interface PurchaseCelebrationModalProps {
  data: PurchaseCelebrationData | null;
  onClose: () => void;
  onGoToWarehouse: () => void;
}

export const PurchaseCelebrationModal: React.FC<PurchaseCelebrationModalProps> = ({
  data,
  onClose,
  onGoToWarehouse
}) => {
  if (!data) return null;

  return (
    <div
      id="purchase-celebration-backdrop"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        id="purchase-celebration-card"
        className="relative bg-[#111111] border border-emerald-900/60 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Decorative Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-24 bg-emerald-500/15 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-10 p-1.5 rounded-lg text-neutral-400 hover:text-white bg-black/40 hover:bg-black/80 transition-colors"
          aria-label="Закрыть"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header & Icon */}
        <div className="p-6 pb-4 text-center space-y-3">
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 15, delay: 0.1 }}
            className="w-14 h-14 rounded-2xl bg-emerald-950/90 border border-emerald-800 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/50"
          >
            <CheckCircle2 className="w-8 h-8" />
          </motion.div>

          <div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Сделка успешно закрыта</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-0.5">Товар куплен и на складе!</h2>
          </div>
        </div>

        {/* Item Preview Card */}
        <div className="px-6 space-y-3">
          <div className="p-3.5 rounded-xl bg-[#161616] border border-[#262626] flex items-center gap-3">
            <img
              src={data.itemImage}
              alt={data.itemTitle}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-lg object-cover border border-[#333333] shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80';
              }}
            />
            <div className="min-w-0 flex-1">
              {data.categoryLabel && (
                <div className="text-[9px] uppercase tracking-widest text-neutral-500 font-semibold">
                  {data.categoryLabel}
                </div>
              )}
              <div className="text-xs sm:text-sm font-bold text-white truncate">{data.itemTitle}</div>
              <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-1 font-mono-num">
                <span>Куплено: </span>
                <strong className="text-white">{data.pricePaid.toLocaleString('ru-RU')} ₽</strong>
              </div>
            </div>
          </div>

          {/* Financial Breakdown Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-xl bg-[#161616] border border-[#262626] space-y-1">
              <div className="text-[9px] uppercase tracking-wider text-neutral-500">Рыночная цена</div>
              <div className="font-mono-num font-bold text-white text-sm">
                {data.marketPrice.toLocaleString('ru-RU')} ₽
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#161616] border border-emerald-900/40 space-y-1">
              <div className="text-[9px] uppercase tracking-wider text-emerald-400 font-bold">Ожидаемая маржа</div>
              <div className="font-mono-num font-bold text-emerald-400 text-sm">
                +{data.estimatedProfit.toLocaleString('ru-RU')} ₽
              </div>
            </div>
          </div>

          {data.defectsCount !== undefined && data.defectsCount > 0 && (
            <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-900/50 text-[11px] text-amber-300 flex items-center justify-between">
              <span>Обнаружено дефектов: {data.defectsCount} шт.</span>
              <span className="text-[10px] uppercase font-bold text-amber-400 underline cursor-pointer" onClick={onGoToWarehouse}>
                Устранить в мастерской →
              </span>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="p-6 pt-5 grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-[#1a1a1a] hover:bg-[#222222] border border-[#333333] text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-white transition-colors text-center"
          >
            Дальше на рынке
          </button>

          <button
            type="button"
            onClick={onGoToWarehouse}
            className="px-4 py-2.5 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-lg"
          >
            <Package className="w-4 h-4" />
            <span>На склад</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
