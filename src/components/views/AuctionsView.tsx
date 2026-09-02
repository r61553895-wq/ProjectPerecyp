import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { AuctionItem } from '../../types';
import {
  Gavel,
  Clock,
  TrendingUp,
  User,
  ShieldAlert,
  ShoppingBag,
  Sparkles,
  HelpCircle,
  Tag
} from 'lucide-react';

export const AuctionsView: React.FC = () => {
  const { state, bidOnAuction, placeAuctionBid } = useGame();
  const [biddingIds, setBiddingIds] = useState<{ [key: string]: boolean }>({});

  const handleBid = (auction: AuctionItem, addedAmount: number) => {
    const nextBid = (auction.currentBid || auction.startingPrice || 0) + addedAmount;
    const bidFn = placeAuctionBid || bidOnAuction;
    if (bidFn) {
      setBiddingIds(prev => ({ ...prev, [auction.id]: true }));
      bidFn(auction.id, nextBid);
      setTimeout(() => {
        setBiddingIds(prev => ({ ...prev, [auction.id]: false }));
      }, 400);
    }
  };

  const auctionsList = state.auctions || [];

  return (
    <div className="space-y-4" id="auctions-trading-view">
      {/* Auctions Header */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#161616] border border-[#262626] space-y-2">
        <div className="flex items-center gap-2">
          <Gavel className="w-4 h-4 text-amber-400" />
          <h2 className="text-xs font-bold text-neutral-300 uppercase tracking-widest">
            Закрытые торги и аукционы конфиската
          </h2>
        </div>
        <p className="text-xs text-neutral-400 leading-relaxed">
          Участвуйте в динамических торгах против других перекупов и ломбардов.
          Делайте ставки, перебивайте конкурентов до истечения раундов и забирайте редкие лоты с максимальной выгодой.
        </p>
      </div>

      {/* Active Auctions Grid */}
      {auctionsList.length === 0 ? (
        <div className="p-12 rounded-xl bg-[#161616] border border-[#262626] text-center space-y-3">
          <Gavel className="w-8 h-8 text-neutral-500 mx-auto" />
          <div className="text-sm font-bold text-white uppercase tracking-wider">В данный момент активных аукционов нет</div>
          <div className="text-xs text-neutral-400 max-w-sm mx-auto">
            Новые лоты конфиската и ликвидационных складов появляются каждые 1–2 игровых дня (Клавиша D).
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-4">
          {auctionsList.map((auction) => {
            const currentBid = auction.currentBid || auction.startingPrice || 0;
            const minStep = auction.minBidStep || 500;
            const minNextBid = currentBid + minStep;
            const canAffordMin = (state.balance || 0) >= minNextBid;
            const isLeader = auction.isPlayerWinning || auction.highestBidder?.includes('Вы') || (auction as any).leader === 'player';
            const leaderName = auction.highestBidder || (auction as any).leader || 'Площадка торгов';
            const marketPrice = auction.estimatedMarketPrice || (auction as any).estimatedValue || 0;
            const diffFromMarket = Math.max(0, marketPrice - currentBid);
            const competitors = auction.competitors || [];

            return (
              <div
                key={auction.id}
                id={`auction-card-${auction.id}`}
                className="p-4 sm:p-5 rounded-xl bg-[#161616] border border-[#262626] hover:border-neutral-600 transition-all space-y-3 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  {/* Top Bar: Title & Image */}
                  <div className="flex gap-3">
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-[#0a0a0a] border border-[#262626] shrink-0">
                      <img
                        src={auction.imageUrl}
                        alt={auction.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-mono-num font-bold text-amber-400 border border-[#333333]">
                        ЛОТ #{auction.id.substring(Math.max(0, auction.id.length - 4))}
                      </div>
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="text-[9px] uppercase tracking-widest text-neutral-500 font-semibold">
                        {auction.categoryLabel || auction.category}
                      </div>
                      <h3 className="text-xs sm:text-sm font-bold text-white leading-snug truncate">
                        {auction.title}
                      </h3>
                      <div className="text-xs text-neutral-400">
                        Оценка рынка:{' '}
                        <span className="font-mono-num font-bold text-white">
                          {marketPrice.toLocaleString('ru-RU')} ₽
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Auction Timer & Leader Strip */}
                  <div className="p-3 rounded-lg bg-[#1a1a1a] border border-[#262626] flex items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-neutral-500">Текущая ставка:</div>
                      <div className="text-base sm:text-lg font-bold font-mono-num text-white">
                        {currentBid.toLocaleString('ru-RU')} ₽
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[9px] uppercase tracking-wider text-neutral-500">Лидер торга:</div>
                      <div className="flex items-center justify-end gap-1 font-semibold text-white">
                        <User className="w-3 h-3 text-blue-400" />
                        <span className={isLeader ? 'text-blue-400 font-bold' : 'text-neutral-300'}>
                          {isLeader ? 'Вы (Ваша ставка)' : leaderName}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Competitor Bidders Log */}
                  <div className="p-2.5 rounded-lg bg-[#111111] border border-[#262626] space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-[10px] text-neutral-500 uppercase tracking-wider">
                      <span>Участники ({competitors.length}):</span>
                      <span>Шаг: +{minStep.toLocaleString('ru-RU')} ₽</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {competitors.map((c, i) => {
                        const name = typeof c === 'string' ? c : c?.name || `Участник #${i + 1}`;
                        return (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded bg-[#1a1a1a] text-[10px] text-neutral-300 border border-[#262626] font-medium"
                          >
                            {name}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Margin potential */}
                  <div className="flex items-center justify-between text-xs px-1 text-neutral-400">
                    <span className="text-[10px] uppercase tracking-wider text-neutral-500">Потенциальная маржа:</span>
                    <span className="font-mono-num font-bold text-blue-400">
                      +{diffFromMarket.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                </div>

                {/* Bidding Actions */}
                <div className="space-y-2 pt-2.5 border-t border-[#262626]">
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleBid(auction, minStep)}
                      disabled={!canAffordMin || biddingIds[auction.id]}
                      className="px-2.5 py-2 rounded-lg bg-[#1a1a1a] hover:bg-[#222222] border border-[#333333] text-xs font-bold uppercase tracking-wider text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      +{minStep.toLocaleString('ru-RU')} ₽
                    </button>

                    <button
                      type="button"
                      onClick={() => handleBid(auction, minStep * 2)}
                      disabled={state.balance < currentBid + minStep * 2 || biddingIds[auction.id]}
                      className="px-2.5 py-2 rounded-lg bg-[#1a1a1a] hover:bg-[#222222] border border-[#333333] text-xs font-bold uppercase tracking-wider text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      +{(minStep * 2).toLocaleString('ru-RU')} ₽
                    </button>

                    <button
                      type="button"
                      onClick={() => handleBid(auction, minStep * 5)}
                      disabled={state.balance < currentBid + minStep * 5 || biddingIds[auction.id]}
                      className="px-2.5 py-2 rounded-lg bg-white text-black hover:bg-neutral-200 text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      +{(minStep * 5).toLocaleString('ru-RU')} ₽
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
