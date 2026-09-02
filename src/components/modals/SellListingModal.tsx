import React, { useState } from 'react';
import { WarehouseItem } from '../../types';
import { useGame } from '../../context/GameContext';
import {
  X,
  Tag,
  Zap,
  Flame,
  TrendingUp,
  ShoppingBag
} from 'lucide-react';

interface SellListingModalProps {
  item: WarehouseItem | null;
  onClose: () => void;
}

export const SellListingModal: React.FC<SellListingModalProps> = ({ item, onClose }) => {
  const { state, listItemForSale } = useGame();

  const [priceInput, setPriceInput] = useState<number>(() => {
    if (!item) return 0;
    return item.listedPrice || item.currentMarketPrice;
  });

  const [promoLevel, setPromoLevel] = useState<'standard' | 'boost' | 'urgent'>('standard');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!item) return null;

  const totalCost = item.boughtPrice + item.repairCostSpent;
  const potentialProfit = priceInput - totalCost;
  const marginPct = totalCost > 0 ? Math.round((potentialProfit / totalCost) * 100) : 0;

  const promoCosts = {
    standard: 0,
    boost: Math.round(priceInput * 0.015),
    urgent: Math.round(priceInput * 0.035)
  };

  const handlePublish = () => {
    if (isSubmitting || priceInput <= 0) return;
    setIsSubmitting(true);
    const res = listItemForSale(item.id, priceInput, promoLevel);
    if (res.success) {
      onClose();
    }
    setIsSubmitting(false);
  };

  const setRecommendedPrice = (factor: number) => {
    setPriceInput(Math.round((item.currentMarketPrice * factor) / 100) * 100);
  };

  return (
    <div
      id="sell-listing-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="sell-listing-modal-card"
        className="bg-[#111111] border border-[#262626] rounded-xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-[#262626] bg-[#161616]">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-300">
              Публикация объявления
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-neutral-400 hover:text-white transition-colors"
            aria-label="Закрыть"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Item Card */}
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#161616] border border-[#262626]">
            <img
              src={item.imageUrl}
              alt={item.title}
              referrerPolicy="no-referrer"
              className="w-14 h-14 rounded object-cover border border-[#333333]"
            />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate">{item.title}</div>
              <div className="text-[11px] text-neutral-400 mt-0.5">
                Закупочная стоимость:{' '}
                <span className="font-mono-num font-bold text-white">
                  {totalCost.toLocaleString('ru-RU')} ₽
                </span>{' '}
                {item.repairCostSpent > 0 && `(вкл. ремонт ${item.repairCostSpent.toLocaleString('ru-RU')} ₽)`}
              </div>
              <div className="text-[11px] text-blue-400 font-bold mt-0.5">
                Средняя рыночная цена: {item.currentMarketPrice.toLocaleString('ru-RU')} ₽
              </div>
            </div>
          </div>

          {/* Pricing input section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="listing-price-input" className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                Цена для продажи:
              </label>
              <div className="text-xs font-mono-num font-bold text-white">
                {priceInput.toLocaleString('ru-RU')} ₽
              </div>
            </div>

            <div className="relative">
              <input
                id="listing-price-input"
                type="number"
                min={1000}
                max={50000000}
                step={500}
                value={priceInput}
                onChange={(e) => setPriceInput(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#161616] border border-[#262626] text-sm text-white font-mono-num focus:outline-none focus:border-neutral-500"
                placeholder="Укажите цену..."
              />
              <span className="absolute right-3 top-2.5 text-xs text-neutral-500 font-mono-num">₽</span>
            </div>

            {/* Quick Pricing preset buttons */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setRecommendedPrice(0.92)}
                className="p-2 rounded-lg bg-[#1a1a1a] hover:bg-[#222222] text-[11px] text-neutral-300 font-bold border border-[#262626] text-center transition-colors"
              >
                Быстрая (-8%)
              </button>
              <button
                type="button"
                onClick={() => setRecommendedPrice(1.0)}
                className="p-2 rounded-lg bg-[#1a1a1a] hover:bg-[#222222] text-[11px] text-blue-400 border border-[#262626] text-center font-bold transition-colors"
              >
                По рынку (100%)
              </button>
              <button
                type="button"
                onClick={() => setRecommendedPrice(1.1)}
                className="p-2 rounded-lg bg-[#1a1a1a] hover:bg-[#222222] text-[11px] text-neutral-300 font-bold border border-[#262626] text-center transition-colors"
              >
                Премиум (+10%)
              </button>
            </div>
          </div>

          {/* Promotion Tier selector */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              Пакет продвижения на площадке:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPromoLevel('standard')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  promoLevel === 'standard'
                    ? 'bg-[#1a1a1a] border-white text-white'
                    : 'bg-[#161616] border-[#262626] text-neutral-400 hover:bg-[#1a1a1a]'
                }`}
              >
                <div className="text-xs font-bold text-white uppercase tracking-wider">Стандарт</div>
                <div className="text-[10px] text-neutral-500 mt-0.5">Бесплатно</div>
                <div className="text-[10px] text-neutral-400 mt-1">Обычная лента объявлений</div>
              </button>

              <button
                type="button"
                onClick={() => setPromoLevel('boost')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  promoLevel === 'boost'
                    ? 'bg-[#1a1a1a] border-blue-500 text-white'
                    : 'bg-[#161616] border-[#262626] text-neutral-400 hover:bg-[#1a1a1a]'
                }`}
              >
                <div className="text-xs font-bold text-white flex items-center gap-1 uppercase tracking-wider">
                  <Zap className="w-3 h-3 text-blue-400" /> В топ
                </div>
                <div className="text-[10px] text-blue-400 font-mono-num mt-0.5 font-bold">
                  +{promoCosts.boost.toLocaleString('ru-RU')} ₽
                </div>
                <div className="text-[10px] text-neutral-400 mt-1">+50% к скорости откликов</div>
              </button>

              <button
                type="button"
                onClick={() => setPromoLevel('urgent')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  promoLevel === 'urgent'
                    ? 'bg-[#1a1a1a] border-amber-500 text-white'
                    : 'bg-[#161616] border-[#262626] text-neutral-400 hover:bg-[#1a1a1a]'
                }`}
              >
                <div className="text-xs font-bold text-white flex items-center gap-1 uppercase tracking-wider">
                  <Flame className="w-3 h-3 text-amber-400" /> Срочно
                </div>
                <div className="text-[10px] text-amber-400 font-mono-num mt-0.5 font-bold">
                  +{promoCosts.urgent.toLocaleString('ru-RU')} ₽
                </div>
                <div className="text-[10px] text-neutral-400 mt-1">Максимальный охват</div>
              </button>
            </div>
          </div>

          {/* Profit estimation card */}
          <div className="p-3.5 rounded-xl bg-[#161616] border border-[#262626] space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-500 text-[10px] uppercase tracking-wider">Расходы на публикацию:</span>
              <span className="font-mono-num text-white font-bold">
                {promoCosts[promoLevel].toLocaleString('ru-RU')} ₽
              </span>
            </div>

            <div className="flex items-center justify-between text-xs pt-1.5 border-t border-[#262626]">
              <span className="text-neutral-400 text-[10px] uppercase tracking-wider font-bold">Прогнозируемая чистая прибыль:</span>
              <div className="text-right">
                <span
                  className={`font-mono-num font-bold text-sm ${
                    potentialProfit >= 0 ? 'text-blue-400' : 'text-rose-400'
                  }`}
                >
                  {potentialProfit >= 0 ? '+' : ''}
                  {potentialProfit.toLocaleString('ru-RU')} ₽
                </span>
                <span className="text-[10px] text-neutral-500 ml-1.5 font-mono-num">
                  ({marginPct}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3.5 border-t border-[#262626] bg-[#161616] flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
          >
            Отмена
          </button>

          <button
            id="confirm-publish-listing-btn"
            type="button"
            onClick={handlePublish}
            disabled={isSubmitting || priceInput <= 0}
            className="px-5 py-2 rounded-lg bg-white text-black hover:bg-neutral-200 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 disabled:opacity-40"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Опубликовать за {priceInput.toLocaleString('ru-RU')} ₽</span>
          </button>
        </div>
      </div>
    </div>
  );
};
