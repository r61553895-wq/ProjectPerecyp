import React, { useState, useMemo } from 'react';
import { useGame } from '../../context/GameContext';
import { MarketListing, ItemCategory, RiskLevel, ItemCondition } from '../../types';
import { CATEGORY_NAMES } from '../../data/itemsCatalog';
import { PurchaseCelebrationData } from '../modals/PurchaseCelebrationModal';
import {
  Search,
  Filter,
  ArrowUpDown,
  Flame,
  Eye,
  ShoppingBag,
  RotateCcw,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface MarketViewProps {
  onOpenListing: (listing: MarketListing) => void;
  onOpenNegotiation: (listing: MarketListing) => void;
  onPurchaseSuccess?: (data: PurchaseCelebrationData) => void;
}

export const MarketView: React.FC<MarketViewProps> = ({
  onOpenListing,
  onOpenNegotiation,
  onPurchaseSuccess
}) => {
  const { state, buyListing } = useGame();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('profit_desc'); // profit_desc, price_asc, price_desc, risk_asc, new
  const [onlyHotDeals, setOnlyHotDeals] = useState(false);

  const categories = useMemo(() => {
    return [
      { id: 'all', label: 'Все категории' },
      ...Object.entries(CATEGORY_NAMES).map(([id, label]) => ({ id, label }))
    ];
  }, []);

  const conditionLabels: Record<string, string> = {
    ideal: 'S-GRADE',
    good: 'A-GRADE',
    fair: 'B-GRADE',
    broken: 'C-GRADE (Ремонт)',
    unknown: 'UNGRADED'
  };

  const riskLabels: Record<string, { label: string; color: string }> = {
    low: { label: 'LOW RISK', color: 'text-blue-400 bg-blue-950/60 border-blue-900/50' },
    medium: { label: 'MID RISK', color: 'text-amber-400 bg-amber-950/60 border-amber-900/50' },
    high: { label: 'HIGH RISK', color: 'text-red-400 bg-red-950/60 border-red-900/50' }
  };

  const filteredListings = useMemo(() => {
    return state.listings
      .filter((item) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchCat = item.categoryLabel.toLowerCase().includes(q);
          if (!matchTitle && !matchCat) return false;
        }

        if (selectedCategory !== 'all' && item.category !== selectedCategory) {
          return false;
        }

        if (selectedRisk !== 'all' && item.risk !== selectedRisk) {
          return false;
        }

        if (selectedCondition !== 'all' && item.publicCondition !== selectedCondition) {
          return false;
        }

        if (onlyHotDeals && !item.isHotDeal) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'profit_desc') {
          return b.estimatedProfit - a.estimatedProfit;
        }
        if (sortBy === 'price_asc') {
          return a.askingPrice - b.askingPrice;
        }
        if (sortBy === 'price_desc') {
          return b.askingPrice - a.askingPrice;
        }
        if (sortBy === 'risk_asc') {
          const riskWeight: Record<RiskLevel, number> = { low: 1, medium: 2, high: 3 };
          return riskWeight[a.risk] - riskWeight[b.risk];
        }
        if (sortBy === 'new') {
          return b.createdAtDay - a.createdAtDay;
        }
        return 0;
      });
  }, [
    state.listings,
    searchQuery,
    selectedCategory,
    selectedRisk,
    selectedCondition,
    sortBy,
    onlyHotDeals
  ]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedRisk('all');
    setSelectedCondition('all');
    setSortBy('profit_desc');
    setOnlyHotDeals(false);
  };

  return (
    <div className="space-y-4" id="market-listings-view">
      {/* Search & Main Filter Controls Bento Bar */}
      <div className="p-4 rounded-xl bg-[#161616] border border-[#262626] space-y-3.5">
        {/* Search & Top Action */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
            <input
              id="market-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск товаров, моделей или брендов..."
              className="w-full pl-9 pr-8 py-2 rounded-lg bg-[#111111] border border-[#262626] text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500 placeholder-neutral-500 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-neutral-500 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Hot Deals Filter Toggle */}
            <button
              type="button"
              onClick={() => setOnlyHotDeals(!onlyHotDeals)}
              className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap flex-1 sm:flex-none ${
                onlyHotDeals
                  ? 'bg-red-950/80 border-red-800 text-red-300'
                  : 'bg-[#1a1a1a] border-[#333333] text-neutral-400 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-red-400" />
              <span>Только HOT</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#111111] border border-[#262626] text-xs text-neutral-400 flex-1 sm:flex-none">
              <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
              <select
                id="market-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-white text-xs focus:outline-none cursor-pointer w-full uppercase font-medium"
              >
                <option value="profit_desc" className="bg-[#161616] text-white">
                  Макс. выгода
                </option>
                <option value="price_asc" className="bg-[#161616] text-white">
                  Сначала дешевле
                </option>
                <option value="price_desc" className="bg-[#161616] text-white">
                  Сначала дороже
                </option>
                <option value="risk_asc" className="bg-[#161616] text-white">
                  Минимум риска
                </option>
                <option value="new" className="bg-[#161616] text-white">
                  Свежие лоты
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Horizontal Scroll Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors border ${
                selectedCategory === cat.id
                  ? 'bg-white text-black border-white'
                  : 'bg-[#1a1a1a] text-neutral-400 border-[#333333] hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Secondary filters row */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#262626] text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-neutral-500 text-[10px] uppercase tracking-wider">Фильтры:</span>

            {/* Risk filter */}
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="px-2.5 py-1 rounded-md bg-[#111111] border border-[#262626] text-[11px] text-neutral-300 focus:outline-none uppercase"
            >
              <option value="all" className="bg-[#161616]">
                Любой риск
              </option>
              <option value="low" className="bg-[#161616]">
                Низкий риск
              </option>
              <option value="medium" className="bg-[#161616]">
                Средний риск
              </option>
              <option value="high" className="bg-[#161616]">
                Высокий риск
              </option>
            </select>

            {/* Condition filter */}
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="px-2.5 py-1 rounded-md bg-[#111111] border border-[#262626] text-[11px] text-neutral-300 focus:outline-none uppercase"
            >
              <option value="all" className="bg-[#161616]">
                Все грейды
              </option>
              <option value="ideal" className="bg-[#161616]">
                S-Grade (Идеал)
              </option>
              <option value="good" className="bg-[#161616]">
                A-Grade (Хорошее)
              </option>
              <option value="fair" className="bg-[#161616]">
                B-Grade (Удовл.)
              </option>
              <option value="broken" className="bg-[#161616]">
                C-Grade (Дефект)
              </option>
            </select>

            {(selectedCategory !== 'all' ||
              selectedRisk !== 'all' ||
              selectedCondition !== 'all' ||
              onlyHotDeals ||
              searchQuery) && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-[10px] uppercase font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 ml-1"
              >
                <RotateCcw className="w-3 h-3" /> Сброс
              </button>
            )}
          </div>

          <div className="text-[10px] uppercase tracking-wider text-neutral-500">
            Найдено лотов:{' '}
            <strong className="text-white font-mono-num">{filteredListings.length}</strong>
          </div>
        </div>
      </div>

      {/* Grid of Bento Classified Listings */}
      {filteredListings.length === 0 ? (
        <div className="p-12 rounded-xl bg-[#161616] border border-[#262626] text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-neutral-500 mx-auto" />
          <div className="text-sm font-bold text-white uppercase tracking-wider">Лотов по заданным параметрам не найдено</div>
          <div className="text-xs text-neutral-400 max-w-sm mx-auto">
            Попробуйте сбросить фильтры или пропустите день (Клавиша D) для обновления доски объявлений.
          </div>
          <button
            type="button"
            onClick={resetFilters}
            className="px-4 py-2 rounded-lg bg-white text-black hover:bg-neutral-200 text-xs font-bold uppercase transition-colors"
          >
            Сбросить фильтры
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {filteredListings.map((listing) => {
            const diff = listing.marketAveragePrice - listing.askingPrice;
            const canAfford = state.balance >= listing.askingPrice;

            return (
              <div
                key={listing.id}
                id={`market-item-${listing.id}`}
                className="p-4 rounded-xl bg-[#161616] border border-[#262626] hover:border-neutral-600 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  {/* Image & Badges */}
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

                    {/* Hot Deal Pill */}
                    {listing.isHotDeal && (
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-red-950/80 border border-red-800 text-red-300 text-[9px] font-bold uppercase tracking-wider">
                        HOT DEAL
                      </div>
                    )}

                    {/* Risk pill */}
                    <div className="absolute top-2 right-2">
                      <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${riskLabels[listing.risk].color}`}>
                        {riskLabels[listing.risk].label}
                      </span>
                    </div>

                    {/* Condition badge */}
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[9px] font-mono-num font-bold text-neutral-300 border border-[#333333]">
                      {conditionLabels[listing.publicCondition]}
                    </div>

                    {listing.isInspected && (
                      <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-blue-950/80 text-blue-400 text-[9px] font-bold uppercase flex items-center gap-1 border border-blue-900/60">
                        <ShieldCheck className="w-3 h-3" /> Проверен
                      </div>
                    )}
                  </div>

                  {/* Title & Category */}
                  <div>
                    <div className="text-[9px] uppercase tracking-widest text-neutral-500 font-semibold">
                      {listing.categoryLabel}
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-white truncate mt-0.5">
                      {listing.title}
                    </h3>
                  </div>

                  {/* Price Block */}
                  <div className="p-2.5 rounded-lg bg-[#1a1a1a] border border-[#262626] space-y-1">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[10px] uppercase tracking-wider text-neutral-500">Цена покупки:</span>
                      <span className="text-sm sm:text-base font-bold font-mono-num text-white">
                        {listing.askingPrice.toLocaleString('ru-RU')} ₽
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#262626]">
                      <span className="text-neutral-400 text-[10px]">
                        Рынок: {listing.marketAveragePrice.toLocaleString('ru-RU')} ₽
                      </span>
                      <span className="font-mono-num font-bold text-blue-400">
                        +{diff.toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                  </div>

                  {/* Seller Mini Info */}
                  <div className="flex items-center justify-between text-[10px] text-neutral-400 px-0.5">
                    <span>Продавец: {listing.seller.name}</span>
                    <span className="text-neutral-500 uppercase">{listing.seller.personalityLabel.split(' ')[0]}</span>
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
      )}
    </div>
  );
};
