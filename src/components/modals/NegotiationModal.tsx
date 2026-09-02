import React, { useState, useEffect } from 'react';
import { MarketListing } from '../../types';
import { useGame } from '../../context/GameContext';
import { PurchaseCelebrationData } from './PurchaseCelebrationModal';
import {
  X,
  Send,
  UserCheck,
  TrendingUp,
  Percent,
  AlertCircle,
  ShoppingBag,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';

interface NegotiationModalProps {
  listing: MarketListing | null;
  onClose: () => void;
  onSuccessfulPurchase?: (data: PurchaseCelebrationData) => void;
  onPurchaseSuccess?: (data: PurchaseCelebrationData) => void;
}

export const NegotiationModal: React.FC<NegotiationModalProps> = ({
  listing,
  onClose,
  onSuccessfulPurchase,
  onPurchaseSuccess
}) => {
  const { state, negotiate, buyListing } = useGame();
  const [offerInput, setOfferInput] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBuying, setIsBuying] = useState(false);

  const handlePurchaseNotify = onPurchaseSuccess || onSuccessfulPurchase;

  useEffect(() => {
    if (listing) {
      setOfferInput(Math.round((listing.askingPrice * 0.85) / 100) * 100);
    }
  }, [listing?.id]);

  if (!listing) return null;

  const liveListing = state.listings.find((l) => l.id === listing.id) || listing;

  const handleSendOffer = () => {
    if (isSubmitting || liveListing.seller.hasWalkedOut) return;
    setIsSubmitting(true);
    negotiate(liveListing.id, offerInput);
    setTimeout(() => {
      setIsSubmitting(false);
    }, 200);
  };

  const handleQuickPercent = (pct: number) => {
    const discounted = Math.round((liveListing.askingPrice * (1 - pct)) / 100) * 100;
    setOfferInput(discounted);
  };

  const handleBuyCurrent = () => {
    if (isBuying) return;
    setIsBuying(true);

    const boughtData: PurchaseCelebrationData = {
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
        if (onSuccessfulPurchase) onSuccessfulPurchase(boughtData);
      }
    }, 250);
  };

  const estimatedMargin = Math.max(0, liveListing.marketAveragePrice - offerInput);
  const isAffordable = state.balance >= liveListing.askingPrice;

  return (
    <div
      id="negotiation-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        id="negotiation-modal-card"
        className="bg-[#111111] border border-[#262626] rounded-xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-[#262626] bg-[#161616]">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">
              Переговоры по цене
            </span>
            <span className="text-neutral-600">·</span>
            <span className="text-xs text-neutral-400 truncate max-w-[200px]">
              {liveListing.title}
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
          {/* Seller Status Pill */}
          <div className="p-3.5 rounded-xl bg-[#161616] border border-[#262626] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <img
                src={liveListing.seller.avatar}
                alt={liveListing.seller.name}
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full object-cover border border-[#333333]"
              />
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1">
                  {liveListing.seller.name}
                  <UserCheck className="w-3 h-3 text-blue-400" />
                </div>
                <div className="text-[10px] uppercase tracking-wider text-neutral-400">
                  {liveListing.seller.personalityLabel}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[9px] uppercase tracking-wider text-neutral-500">
                Терпение: <strong className="text-white font-mono-num">{Math.max(0, liveListing.seller.patience)}%</strong>
              </div>
              <div className="w-20 h-1.5 bg-[#111111] rounded-full overflow-hidden mt-1 border border-[#262626]">
                <div
                  className={`h-full transition-all ${
                    liveListing.seller.patience > 40 ? 'bg-blue-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.max(5, liveListing.seller.patience)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Dialogue History Box */}
          <div className="space-y-2.5 max-h-56 overflow-y-auto p-3.5 rounded-xl bg-[#161616] border border-[#262626]">
            {liveListing.seller.dialogueHistory.map((item, index) => {
              const isPlayer = item.sender === 'player';
              return (
                <div
                  key={index}
                  className={`flex flex-col ${isPlayer ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-2.5 rounded-lg text-xs leading-relaxed ${
                      isPlayer
                        ? 'bg-[#222222] text-white border border-[#333333] rounded-br-none'
                        : 'bg-[#111111] text-neutral-300 border border-[#262626] rounded-bl-none'
                    }`}
                  >
                    <div className="text-[9px] uppercase tracking-wider text-neutral-500 mb-0.5 font-bold">
                      {isPlayer ? 'Вы' : liveListing.seller.name}
                    </div>
                    <div>{item.text}</div>
                  </div>
                </div>
              );
            })}

            {liveListing.seller.hasWalkedOut && (
              <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-900/50 text-xs text-rose-400 flex items-center gap-2 font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>Продавец прервал переговоры и снял товар с продажи.</span>
              </div>
            )}
          </div>

          {!liveListing.seller.hasWalkedOut && (
            <div className="space-y-3 pt-1">
              {/* Offer Selector */}
              <div className="p-3.5 rounded-xl bg-[#161616] border border-[#262626] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-400">Ваше предложение:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-bold font-mono-num text-white">
                      {offerInput.toLocaleString('ru-RU')} ₽
                    </span>
                    <span className="text-[11px] text-blue-400 font-bold">
                      ({Math.round(((liveListing.askingPrice - offerInput) / liveListing.askingPrice) * 100)}% скидка)
                    </span>
                  </div>
                </div>

                {/* Slider */}
                <input
                  type="range"
                  min={Math.round(liveListing.askingPrice * 0.4)}
                  max={liveListing.askingPrice}
                  step={500}
                  value={offerInput}
                  onChange={(e) => setOfferInput(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#111111] rounded-lg appearance-none cursor-pointer accent-blue-500"
                />

                {/* Quick percentage buttons */}
                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleQuickPercent(0.05)}
                    className="py-1 px-2 rounded-lg bg-[#1a1a1a] hover:bg-[#222222] text-[11px] text-neutral-300 font-bold border border-[#262626] transition-colors"
                  >
                    -5%
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickPercent(0.1)}
                    className="py-1 px-2 rounded-lg bg-[#1a1a1a] hover:bg-[#222222] text-[11px] text-neutral-300 font-bold border border-[#262626] transition-colors"
                  >
                    -10%
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickPercent(0.18)}
                    className="py-1 px-2 rounded-lg bg-[#1a1a1a] hover:bg-[#222222] text-[11px] text-neutral-300 font-bold border border-[#262626] transition-colors"
                  >
                    -18%
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickPercent(0.25)}
                    className="py-1 px-2 rounded-lg bg-[#1a1a1a] hover:bg-[#222222] text-[11px] text-neutral-300 font-bold border border-[#262626] transition-colors"
                  >
                    -25%
                  </button>
                </div>

                {/* Potential Resale Margin pill */}
                <div className="flex items-center justify-between text-xs pt-2 border-t border-[#262626]">
                  <span className="text-neutral-500 text-[10px] uppercase tracking-wider">Рыночная цена лота:</span>
                  <span className="font-mono-num text-neutral-400 font-semibold">
                    {liveListing.marketAveragePrice.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-500 text-[10px] uppercase tracking-wider">Ваша маржа при этой цене:</span>
                  <span className="font-mono-num font-bold text-emerald-400">
                    +{estimatedMargin.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3.5 border-t border-[#262626] bg-[#161616] flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
          >
            Закрыть
          </button>

          <div className="flex items-center gap-2">
            {!liveListing.seller.hasWalkedOut && (
              <button
                id="send-negotiation-offer-btn"
                type="button"
                onClick={handleSendOffer}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-lg bg-[#1a1a1a] hover:bg-[#222222] border border-[#333333] text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
              >
                {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>Предложить</span>
              </button>
            )}

            <button
              id="buy-after-bargain-btn"
              type="button"
              onClick={handleBuyCurrent}
              disabled={!isAffordable || liveListing.seller.hasWalkedOut || isBuying}
              className="px-4 py-2 rounded-lg bg-white text-black hover:bg-neutral-200 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isBuying ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Покупка...</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
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

