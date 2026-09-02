import React, { useState } from 'react';
import { useGame, RANK_NAMES } from '../../context/GameContext';
import { MarketListing, ItemCategory } from '../../types';
import { PurchaseCelebrationData } from '../modals/PurchaseCelebrationModal';
import {
  TrendingUp,
  AlertTriangle,
  Flame,
  Search,
  Handshake,
  Package,
  Layers,
  ArrowUpRight,
  ShieldAlert,
  ArrowRight,
  Eye,
  ShoppingBag,
  Activity
} from 'lucide-react';

interface OverviewViewProps {
  onOpenListing: (listing: MarketListing) => void;
  onOpenNegotiation: (listing: MarketListing) => void;
  setActiveTab: (tab: string) => void;
  onPurchaseSuccess?: (data: PurchaseCelebrationData) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  onOpenListing,
  onOpenNegotiation,
  setActiveTab,
  onPurchaseSuccess
}) => {
  const { state, buyListing, advanceDay } = useGame();
  const [selectedCategoryTrend, setSelectedCategoryTrend] = useState<ItemCategory>('smartphones');

  const hotDeals = state.listings.filter((l) => l.isHotDeal).slice(0, 4);
  const regularDeals = state.listings.filter((l) => !l.isHotDeal).slice(0, 4);
  const displayDeals = hotDeals.length > 0 ? hotDeals : regularDeals;

  const listedWarehouseItems = state.warehouse.filter((w) => w.isListed);
  const incomingOffers = state.incomingOffers.slice(0, 3);

  const activeEvent = state.activeEvents[0];
  const trend = state.categoryTrends[selectedCategoryTrend];

  const conditionLabels: Record<string, string> = {
    ideal: 'S-GRADE (Идеал)',
    good: 'A-GRADE (Хорошее)',
    fair: 'B-GRADE (Удовл.)',
    broken: 'C-GRADE (Дефект)',
    unknown: 'UNGRADED'
  };

  return (
    <div className="space-y-4 sm:space-y-5" id="overview-dashboard-view">
      {/* Active Market Event Banner (if any) */}
      {activeEvent && (
        <div
          id="market-event-banner"
          className="p-3.5 sm:p-4 rounded-xl bg-[#161616] border border-amber-900/60 flex items-start sm:items-center justify-between gap-3 text-xs text-amber-200"
        >
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white uppercase tracking-wider text-[11px]">
                Рыночное событие: {activeEvent.title}
              </div>
              <div className="text-neutral-300 text-xs mt-0.5">{activeEvent.description}</div>
            </div>
          </div>
          <span className="shrink-0 text-[10px] font-mono-num font-bold uppercase px-2 py-1 rounded bg-[#111111] border border-amber-700/50 text-amber-400">
            {activeEvent.durationDays} дн.
          </span>
        </div>
      )}

      {/* Bento Metric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Balance */}
        <div className="p-4 rounded-xl bg-[#161616] border border-[#262626] hover:border-neutral-700 transition-colors flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-neutral-500">Доступный баланс</span>
            <span className="text-[9px] font-mono-num px-1.5 py-0.5 rounded bg-[#222222] text-neutral-400 border border-[#333333]">RUB</span>
          </div>
          <div className="my-2.5">
            <div className="text-2xl font-bold font-mono-num text-white tracking-tight">
              {state.balance.toLocaleString('ru-RU')} ₽
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#222222]">
            <span className="text-neutral-500 text-[10px] uppercase">Сегодня:</span>
            <span
              className={`font-mono-num font-semibold ${
                state.lastProfitToday > 0
                  ? 'text-blue-400'
                  : state.lastProfitToday < 0
                  ? 'text-red-400'
                  : 'text-neutral-400'
              }`}
            >
              {state.lastProfitToday > 0 ? '+' : ''}
              {state.lastProfitToday.toLocaleString('ru-RU')} ₽
            </span>
          </div>
        </div>

        {/* Metric 2: Warehouse Items */}
        <div className="p-4 rounded-xl bg-[#161616] border border-[#262626] hover:border-neutral-700 transition-colors flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-neutral-500">Склад товаров</span>
            <Package className="w-3.5 h-3.5 text-neutral-500 group-hover:text-blue-400 transition-colors" />
          </div>
          <div className="my-2.5">
            <div className="text-2xl font-bold font-mono-num text-white tracking-tight">
              {state.warehouse
                .reduce((acc, item) => acc + item.currentMarketPrice, 0)
                .toLocaleString('ru-RU')}{' '}
              ₽
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#222222]">
            <span className="text-neutral-400">
              {state.warehouse.length} / {state.warehouseCapacity} мест
            </span>
            <button
              type="button"
              onClick={() => setActiveTab('warehouse')}
              className="text-[10px] uppercase font-bold text-blue-400 hover:text-blue-300 transition-colors"
            >
              Склад →
            </button>
          </div>
        </div>

        {/* Metric 3: Active Offers */}
        <div className="p-4 rounded-xl bg-[#161616] border border-[#262626] hover:border-neutral-700 transition-colors flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-neutral-500">Активные продажи</span>
            <Handshake className="w-3.5 h-3.5 text-neutral-500 group-hover:text-blue-400 transition-colors" />
          </div>
          <div className="my-2.5">
            <div className="text-2xl font-bold font-mono-num text-white tracking-tight">
              {state.incomingOffers.length} <span className="text-xs text-neutral-500 font-normal">откликов</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#222222]">
            <span className="text-neutral-400">На витрине: {listedWarehouseItems.length}</span>
            <button
              type="button"
              onClick={() => setActiveTab('deals')}
              className="text-[10px] uppercase font-bold text-blue-400 hover:text-blue-300 transition-colors"
            >
              Сделки →
            </button>
          </div>
        </div>

        {/* Metric 4: All-time Profit */}
        <div className="p-4 rounded-xl bg-[#161616] border border-[#262626] hover:border-neutral-700 transition-colors flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-neutral-500">Общая прибыль</span>
            <TrendingUp className="w-3.5 h-3.5 text-neutral-500 group-hover:text-blue-400 transition-colors" />
          </div>
          <div className="my-2.5">
            <div className="text-2xl font-bold font-mono-num text-blue-400 tracking-tight">
              +{state.totalProfit.toLocaleString('ru-RU')} ₽
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#222222]">
            <span className="text-neutral-400">Сделок: {state.totalDeals}</span>
            <span className="text-neutral-300 font-medium text-[10px] uppercase tracking-wider">{RANK_NAMES[state.level]}</span>
          </div>
        </div>
      </div>

      {/* Main Bento Grid: Hot Deals + Active Offers Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        {/* Left 8 Cols: Hot Deals Showcase */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-red-400" />
              <h2 className="text-xs font-bold text-neutral-300 uppercase tracking-widest">
                Выгодные предложения на рынке
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('market')}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
            >
              Все объявления ({state.listings.length}) <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {displayDeals.map((listing) => {
              const diff = listing.marketAveragePrice - listing.askingPrice;
              const canAfford = state.balance >= listing.askingPrice;

              return (
                <div
                  key={listing.id}
                  id={`hot-deal-card-${listing.id}`}
                  className="p-4 rounded-xl bg-[#161616] border border-[#262626] hover:border-neutral-600 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    {/* Image & Price banner */}
                    <div className="relative rounded-lg overflow-hidden bg-[#0a0a0a] border border-[#262626] aspect-[16/10] flex items-center justify-center">
                      <img
                        src={listing.imageUrl}
                        alt={listing.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80';
                        }}
                      />
                      {listing.isHotDeal && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-red-950/80 border border-red-800 text-red-300 text-[9px] font-bold uppercase tracking-wider">
                          HOT DEAL
                        </div>
                      )}
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/80 border border-[#333333] text-[9px] font-mono-num font-bold text-neutral-300">
                        {conditionLabels[listing.publicCondition] || 'GRADE'}
                      </div>
                    </div>

                    {/* Title */}
                    <div>
                      <div className="text-[9px] uppercase tracking-widest text-neutral-500 font-semibold">
                        {listing.categoryLabel}
                      </div>
                      <h3 className="text-xs sm:text-sm font-bold text-white truncate mt-0.5">
                        {listing.title}
                      </h3>
                      <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">
                        {listing.description}
                      </p>
                    </div>

                    {/* Price Block */}
                    <div className="p-2.5 rounded-lg bg-[#1a1a1a] border border-[#262626] space-y-1">
                      <div className="flex items-baseline justify-between">
                        <span className="text-[10px] uppercase tracking-wider text-neutral-500">Цена покупки:</span>
                        <span className="text-base font-bold font-mono-num text-white">
                          {listing.askingPrice.toLocaleString('ru-RU')} ₽
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-neutral-400">
                        <span>Рынок: {listing.marketAveragePrice.toLocaleString('ru-RU')} ₽</span>
                        <span className="font-mono-num font-bold text-blue-400">
                          +{diff.toLocaleString('ru-RU')} ₽
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-[#262626]">
                    <button
                      type="button"
                      onClick={() => onOpenListing(listing)}
                      className="px-2.5 py-2 rounded-lg bg-[#1a1a1a] hover:bg-[#222222] text-neutral-300 border border-[#333333] text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> Осмотр
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (canAfford) {
                          const boughtData: PurchaseCelebrationData = {
                            itemTitle: listing.title,
                            itemImage: listing.imageUrl,
                            categoryLabel: listing.categoryLabel,
                            pricePaid: listing.askingPrice,
                            marketPrice: listing.marketAveragePrice,
                            estimatedProfit: listing.estimatedProfit,
                            condition: listing.publicCondition,
                            defectsCount: listing.hiddenDefects.length
                          };
                          const res = buyListing(listing.id);
                          if (res.success && onPurchaseSuccess) {
                            onPurchaseSuccess(boughtData);
                          }
                        } else {
                          onOpenListing(listing);
                        }
                      }}
                      disabled={!canAfford && state.balance < listing.askingPrice}
                      className={`px-2.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1 ${
                        canAfford
                          ? 'bg-white text-black hover:bg-neutral-200'
                          : 'bg-[#1a1a1a] text-neutral-500 border border-[#262626]'
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      {canAfford ? 'Купить' : 'Мало ₽'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 4 Cols: Active Buyer Offers & Market Pulse */}
        <div className="lg:col-span-4 space-y-4">
          {/* Active Deals / Buyer Offers */}
          <div className="p-4 sm:p-5 rounded-xl bg-[#161616] border border-[#262626] space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                Входящие отклики ({state.incomingOffers.length})
              </h2>
              <button
                type="button"
                onClick={() => setActiveTab('deals')}
                className="text-[10px] uppercase font-bold text-blue-400 hover:text-blue-300"
              >
                Все сделки →
              </button>
            </div>

            {incomingOffers.length === 0 ? (
              <div className="p-4 rounded-lg bg-[#1a1a1a] border border-[#262626] text-center text-xs text-neutral-500">
                {listedWarehouseItems.length === 0 ? (
                  <>
                    Выставьте товары со склада на продажу, чтобы получать предложения от покупателей.
                    <button
                      type="button"
                      onClick={() => setActiveTab('warehouse')}
                      className="block mt-2 mx-auto text-xs text-blue-400 underline font-semibold"
                    >
                      Перейти на склад
                    </button>
                  </>
                ) : (
                  'Ожидаем новых откликов от покупателей...'
                )}
              </div>
            ) : (
              <div className="space-y-2.5">
                {incomingOffers.map((offer) => (
                  <div
                    key={offer.id}
                    className="p-3 rounded-lg bg-[#1a1a1a] border border-[#262626] space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">
                          {offer.itemTitle}
                        </div>
                        <div className="text-[10px] text-neutral-400">
                          {offer.buyerName} ({offer.buyerTypeLabel})
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs font-bold font-mono-num text-blue-400">
                          {offer.offeredPrice.toLocaleString('ru-RU')} ₽
                        </div>
                      </div>
                    </div>

                    <div className="text-[11px] text-neutral-300 italic bg-[#111111] p-2 rounded border border-[#262626] truncate">
                      «{offer.message}»
                    </div>

                    <div className="pt-1 flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => setActiveTab('deals')}
                        className="text-[10px] uppercase font-bold text-blue-400 hover:text-blue-300"
                      >
                        Принять оффер →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Platform Pulse Feed */}
          <div className="p-4 sm:p-5 rounded-xl bg-[#161616] border border-[#262626] space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                Пульс площадки
              </h3>
              <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-900/50">
                LIVE
              </span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-[#1a1a1a] border border-[#262626] flex items-center justify-between">
                <span className="text-neutral-400">Лотов на рынке:</span>
                <span className="font-mono-num font-bold text-white">{state.listings.length * 12} шт.</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#1a1a1a] border border-[#262626] flex items-center justify-between">
                <span className="text-neutral-400">Перекупов онлайн:</span>
                <span className="font-mono-num font-bold text-blue-400">38 активных</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#1a1a1a] border border-[#262626] flex items-center justify-between">
                <span className="text-neutral-400">Скорость выкупа:</span>
                <span className="text-amber-400 font-semibold font-mono-num">~1.5 дня</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bento Box: Category Price Dynamics Chart */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#161616] border border-[#262626] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-neutral-400">
              Динамика цен: Аналитика категорий
            </div>
            <div className="text-xs text-neutral-500 mt-0.5">
              Мониторинг рыночных колебаний в реальном времени
            </div>
          </div>

          {/* Category Selector Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {(['smartphones', 'laptops', 'consoles', 'pc', 'cars'] as ItemCategory[]).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategoryTrend(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
                  selectedCategoryTrend === cat
                    ? 'bg-white text-black'
                    : 'bg-[#1a1a1a] text-neutral-400 border border-[#333333] hover:text-white'
                }`}
              >
                {state.categoryTrends[cat]?.label || cat}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Category Bento Details & Sparkline Chart */}
        {trend && (
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center pt-1">
            <div className="sm:col-span-4 space-y-2.5 p-4 rounded-xl bg-[#1a1a1a] border border-[#262626]">
              <div className="text-[10px] uppercase tracking-widest text-neutral-500">Категория: {trend.label}</div>
              <div className="text-2xl font-bold font-mono-num text-white">
                {trend.currentAvgPrice.toLocaleString('ru-RU')} ₽
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-neutral-500 text-[10px] uppercase tracking-wider">Тренд:</span>
                <span
                  className={`font-mono-num font-bold ${
                    trend.changePct >= 0 ? 'text-blue-400' : 'text-red-400'
                  }`}
                >
                  {trend.changePct >= 0 ? '+' : ''}
                  {trend.changePct}% к прошлой неделе
                </span>
              </div>
              <div className="text-xs text-neutral-400 pt-1 border-t border-[#262626]">
                Спрос: <strong className="text-white">{trend.demand}</strong> · Активно лотов:{' '}
                <span className="font-mono-num text-blue-400 font-bold">{trend.activeListingsCount}</span>
              </div>
            </div>

            {/* Sparkline & Bar Chart */}
            <div className="sm:col-span-8 p-4 rounded-xl bg-[#111111] border border-[#262626] h-40 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-neutral-500">
                <span>История котировок (7 дней)</span>
                <span className="font-mono-num text-neutral-400">Мин: {Math.min(...trend.history.map(h => h.price)).toLocaleString('ru-RU')} ₽</span>
              </div>

              {/* Bento Bars & SVG Line */}
              <div className="w-full h-24 relative flex items-end">
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 300 100">
                  {(() => {
                    const prices = trend.history.map(h => h.price);
                    const min = Math.min(...prices) * 0.95;
                    const max = Math.max(...prices) * 1.05;
                    const range = max - min || 1;
                    const points = prices
                      .map((p, idx) => {
                        const x = (idx / (prices.length - 1 || 1)) * 300;
                        const y = 100 - ((p - min) / range) * 85;
                        return `${x},${y}`;
                      })
                      .join(' ');

                    return (
                      <>
                        <polyline
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={points}
                        />
                        {prices.map((p, idx) => {
                          const x = (idx / (prices.length - 1 || 1)) * 300;
                          const y = 100 - ((p - min) / range) * 85;
                          return (
                            <circle
                              key={idx}
                              cx={x}
                              cy={y}
                              r="3.5"
                              fill="#60a5fa"
                              stroke="#111111"
                              strokeWidth="1.5"
                            />
                          );
                        })}
                      </>
                    );
                  })()}
                </svg>
              </div>

              <div className="flex items-center justify-between text-[10px] text-neutral-500 font-mono-num">
                {trend.history.map((h, i) => (
                  <span key={i}>Д{h.day}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

