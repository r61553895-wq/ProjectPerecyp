import React, { useState } from 'react';
import { MarketListing, DefectType } from '../../types';
import { useGame } from '../../context/GameContext';
import { DEFECTS_CATALOG } from '../../data/defectsCatalog';
import { PurchaseCelebrationData } from './PurchaseCelebrationModal';
import {
  X,
  ShieldCheck,
  Search,
  CheckCircle2,
  Clock,
  TrendingUp,
  UserCheck,
  ShoppingBag,
  DollarSign,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';

interface ListingDetailModalProps {
  listing: MarketListing | null;
  onClose: () => void;
  onOpenNegotiation: (listing: MarketListing) => void;
  onPurchaseSuccess?: (data: PurchaseCelebrationData) => void;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({
  listing,
  onClose,
  onOpenNegotiation,
  onPurchaseSuccess
}) => {
  const { state, buyListing, inspectListing } = useGame();
  const [isBuying, setIsBuying] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'history'>('info');

  if (!listing) return null;

  // Track live listing from state
  const liveListing = state.listings.find((l) => l.id === listing.id) || listing;

  const handleBuy = () => {
    if (isBuying) return;
    setIsBuying(true);

    const boughtItemData: PurchaseCelebrationData = {
      itemTitle: liveListing.title,
      itemImage: liveListing.imageUrl,
      categoryLabel: liveListing.categoryLabel,
      pricePaid: liveListing.askingPrice,
      marketPrice: liveListing.marketAveragePrice,
      estimatedProfit: liveListing.estimatedProfit,
      condition: liveListing.publicCondition,
      defectsCount: liveListing.hiddenDefects.length
    };

    setTimeout(() => {
      const res = buyListing(liveListing.id);
      setIsBuying(false);
      if (res.success) {
        onClose();
        if (onPurchaseSuccess) {
          onPurchaseSuccess(boughtItemData);
        }
      }
    }, 250);
  };

  const handleInspect = (level: 'quick' | 'basic' | 'full') => {
    inspectListing(liveListing.id, level);
  };

  const conditionLabels: Record<string, string> = {
    ideal: 'Идеальное (как новое)',
    good: 'Хорошее (незначительные следы)',
    fair: 'Удовлетворительное',
    broken: 'Требует ремонта / дефектный',
    unknown: 'Неизвестно (требует проверки)'
  };

  const riskLabels: Record<string, { label: string; color: string }> = {
    low: { label: 'Низкий риск', color: 'text-[#93c5fd] bg-[#142233] border-[#22354d]' },
    medium: { label: 'Средний риск', color: 'text-[#fcd34d] bg-[#292215] border-[#4a391e]' },
    high: { label: 'Высокий риск', color: 'text-[#fca5a5] bg-[#2d1b1f] border-[#572b33]' }
  };

  const demandLabels: Record<string, string> = {
    low: 'Низкий',
    medium: 'Стабильный',
    high: 'Высокий',
    viral: 'Ажиотажный спрос'
  };

  const isAffordable = state.balance >= liveListing.askingPrice;
  const isWarehouseFull = state.warehouse.length >= state.warehouseCapacity;

  return (
    <div
      id="listing-detail-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        id="listing-detail-modal-card"
        className="bg-[#111111] border border-[#262626] rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-[#262626] bg-[#161616]">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[10px] uppercase tracking-widest text-blue-400 font-bold">
              {liveListing.categoryLabel}
            </span>
            <span className="text-neutral-600">·</span>
            <span className="text-xs text-neutral-400 truncate font-mono-num">
              ЛОТ #{liveListing.id.substring(liveListing.id.length - 6)}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-[#222222] transition-colors"
            aria-label="Закрыть"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Main Title & Image Header */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
            <div className="sm:col-span-5 relative rounded-lg overflow-hidden bg-[#0a0a0a] border border-[#262626] aspect-video sm:aspect-square flex items-center justify-center">
              <img
                src={liveListing.imageUrl}
                alt={liveListing.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80';
                }}
              />
              <div className="absolute top-2 left-2">
                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${riskLabels[liveListing.risk].color}`}>
                  {riskLabels[liveListing.risk].label}
                </span>
              </div>
            </div>

            <div className="sm:col-span-7 space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-white leading-snug">
                {liveListing.title}
              </h2>

              {/* Pricing breakdown banner */}
              <div className="p-3.5 rounded-xl bg-[#161616] border border-[#262626] space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-neutral-400">Цена продавца:</span>
                  <span className="text-lg sm:text-xl font-bold font-mono-num text-white">
                    {liveListing.askingPrice.toLocaleString('ru-RU')} ₽
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-1.5 border-t border-[#262626]">
                  <span className="text-neutral-500 text-[10px] uppercase tracking-wider">Рыночная оценка:</span>
                  <span className="font-mono-num text-neutral-400 font-semibold">
                    {liveListing.marketAveragePrice.toLocaleString('ru-RU')} ₽
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-1.5 border-t border-[#262626]">
                  <span className="text-neutral-500 text-[10px] uppercase tracking-wider">Потенциальная маржа:</span>
                  <span className="font-mono-num font-bold text-emerald-400">
                    +{liveListing.estimatedProfit.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
              </div>

              {/* Status Tags */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-[#161616] border border-[#262626]">
                  <div className="text-[9px] uppercase tracking-wider text-neutral-500">Состояние</div>
                  <div className="font-semibold text-white truncate mt-0.5">
                    {conditionLabels[liveListing.publicCondition]}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#161616] border border-[#262626]">
                  <div className="text-[9px] uppercase tracking-wider text-neutral-500">Спрос / Ликвидность</div>
                  <div className="font-semibold text-white mt-0.5">
                    {demandLabels[liveListing.demand]} ({liveListing.liquidity}%)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Seller Card */}
          <div className="p-3.5 rounded-xl bg-[#161616] border border-[#262626] space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={liveListing.seller.avatar}
                  alt={liveListing.seller.name}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full object-cover border border-[#333333]"
                />
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    {liveListing.seller.name}
                    <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-neutral-400">
                    {liveListing.seller.personalityLabel}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[9px] uppercase tracking-wider text-neutral-500">Терпение продавца</div>
                <div className="w-20 h-1.5 bg-[#111111] rounded-full overflow-hidden mt-1 ml-auto border border-[#262626]">
                  <div
                    className="h-full bg-blue-500 transition-all"
                    style={{ width: `${Math.max(5, liveListing.seller.patience)}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="text-xs text-neutral-300 italic bg-[#111111] p-2.5 rounded-lg border border-[#262626]">
              «{liveListing.seller.reasonForSale}»
            </div>
          </div>

          {/* Diagnostics Section */}
          <div className="p-3.5 rounded-xl bg-[#161616] border border-[#262626] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold text-neutral-300 uppercase tracking-widest">
                  Диагностика и проверка
                </span>
              </div>
              <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">
                {liveListing.isInspected
                  ? `Проведено (${liveListing.inspectionLevel})`
                  : 'Не проверялся'}
              </span>
            </div>

            {liveListing.isInspected ? (
              <div className="p-2.5 rounded-lg bg-[#111111] border border-[#262626] space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Товар проверен техническим экспертом
                </div>
                {liveListing.hiddenDefects.length === 0 ? (
                  <div className="text-xs text-neutral-400">
                    Скрытых дефектов и следов вмешательства нет. Идеальная техника.
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="text-xs text-rose-400 font-bold uppercase tracking-wider">
                      Обнаруженные дефекты:
                    </div>
                    <ul className="text-xs text-neutral-300 space-y-0.5 list-disc pl-4">
                      {liveListing.hiddenDefects.map((d) => (
                        <li key={d}>
                          <span className="text-white font-bold">{DEFECTS_CATALOG[d]?.name}:</span>{' '}
                          {DEFECTS_CATALOG[d]?.description} (Ремонт: ~{DEFECTS_CATALOG[d]?.repairCost.toLocaleString('ru-RU')} ₽)
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleInspect('quick')}
                  className="p-2.5 rounded-lg bg-[#1a1a1a] hover:bg-[#222222] border border-[#262626] text-left transition-colors"
                >
                  <div className="text-xs font-bold text-white uppercase tracking-wider">Быстрая</div>
                  <div className="text-[10px] text-neutral-500">Бесплатно</div>
                  <div className="text-[10px] text-neutral-400 mt-1">Осмотр внешнего вида</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleInspect('basic')}
                  className="p-2.5 rounded-lg bg-[#1a1a1a] hover:bg-[#222222] border border-[#262626] text-left transition-colors"
                >
                  <div className="text-xs font-bold text-white uppercase tracking-wider">Базовая</div>
                  <div className="text-[10px] text-blue-400 font-mono-num font-bold">
                    ~{Math.max(500, Math.round(liveListing.marketAveragePrice * 0.015)).toLocaleString('ru-RU')} ₽
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-1">Тест батареи и портов</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleInspect('full')}
                  className="p-2.5 rounded-lg bg-[#1a1a1a] hover:bg-[#222222] border border-[#262626] text-left transition-colors"
                >
                  <div className="text-xs font-bold text-white uppercase tracking-wider">Полная</div>
                  <div className="text-[10px] text-blue-400 font-mono-num font-bold">
                    ~{Math.max(1200, Math.round(liveListing.marketAveragePrice * 0.035)).toLocaleString('ru-RU')} ₽
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-1">100% вскрытие дефектов</div>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-4 sm:px-6 py-3.5 border-t border-[#262626] bg-[#161616] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-neutral-400 w-full sm:w-auto text-center sm:text-left">
            {!isAffordable ? (
              <span className="text-rose-400 font-bold">Не хватает денег на покупку</span>
            ) : isWarehouseFull ? (
              <span className="text-rose-400 font-bold">Склад переполнен ({state.warehouse.length}/{state.warehouseCapacity})</span>
            ) : (
              <span className="text-neutral-400">Доступно для мгновенной сделки</span>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              id="start-negotiate-btn"
              type="button"
              onClick={() => {
                onClose();
                onOpenNegotiation(liveListing);
              }}
              className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-[#1a1a1a] hover:bg-[#222222] border border-[#333333] text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
            >
              <DollarSign className="w-4 h-4" />
              <span>Поторговаться</span>
            </button>

            <button
              id="direct-buy-listing-btn"
              type="button"
              onClick={handleBuy}
              disabled={!isAffordable || isWarehouseFull || isBuying}
              className={`flex-1 sm:flex-none px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                !isAffordable || isWarehouseFull || isBuying
                  ? 'bg-[#1a1a1a] text-neutral-500 border border-[#262626] cursor-not-allowed'
                  : 'bg-white text-black hover:bg-neutral-200'
              }`}
            >
              {isBuying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Оформление...</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Купить за {liveListing.askingPrice.toLocaleString('ru-RU')} ₽</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

