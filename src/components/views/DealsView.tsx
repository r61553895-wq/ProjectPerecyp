import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { BuyerOffer, DealRecord, WarehouseItem } from '../../types';
import {
  Handshake,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  Tag,
  Eye,
  UserCheck,
  Send,
  Calendar,
  DollarSign
} from 'lucide-react';

interface DealsViewProps {
  onOpenSellModal: (item: WarehouseItem) => void;
  setActiveTab: (tab: string) => void;
}

export const DealsView: React.FC<DealsViewProps> = ({
  onOpenSellModal,
  setActiveTab
}) => {
  const { state, acceptBuyerOffer, counterBuyerOffer, rejectBuyerOffer, unlistItem } = useGame();

  const [activeSubTab, setActiveSubTab] = useState<'offers' | 'active' | 'history'>('offers');
  const [counterInput, setCounterInput] = useState<{ [offerId: string]: number }>({});

  const dealsList = state.deals || state.dealHistory || [];
  const listedItems = (state.warehouse || []).filter((w) => w.isListed);
  const totalProfitAllTime = dealsList.reduce((acc, d) => acc + (d.netProfit || 0), 0);
  const avgMargin =
    dealsList.length > 0
      ? Math.round(
          dealsList.reduce((acc, d) => acc + (d.profitMarginPct || 0), 0) /
            dealsList.length
        )
      : 0;

  const handleCounter = (offer: BuyerOffer) => {
    const proposed = counterInput[offer.id] || Math.round((offer.offeredPrice + offer.listedPrice) / 2);
    counterBuyerOffer(offer.id, proposed);
  };

  return (
    <div className="space-y-4" id="deals-management-view">
      {/* Sub Tabs Selector */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#161616] border border-[#262626]">
          <button
            type="button"
            onClick={() => setActiveSubTab('offers')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'offers'
                ? 'bg-white text-black'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Handshake className="w-3.5 h-3.5" />
            <span>Входящие офферы</span>
            {state.incomingOffers.length > 0 && (
              <span className="text-[10px] font-mono-num font-bold px-1.5 py-0.2 rounded bg-blue-600 text-white">
                {state.incomingOffers.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('active')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'active'
                ? 'bg-white text-black'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>На продаже ({listedItems.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('history')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'history'
                ? 'bg-white text-black'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>История ({dealsList.length})</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: INCOMING OFFERS */}
      {activeSubTab === 'offers' && (
        <div className="space-y-3">
          {state.incomingOffers.length === 0 ? (
            <div className="p-12 rounded-xl bg-[#161616] border border-[#262626] text-center space-y-3">
              <Handshake className="w-8 h-8 text-neutral-500 mx-auto" />
              <div className="text-sm font-bold text-white uppercase tracking-wider">Новых откликов пока нет</div>
              <div className="text-xs text-neutral-400 max-w-sm mx-auto">
                {listedItems.length === 0 ? (
                  <>
                    Чтобы получить покупателей, выставьте товары со склада на продажу.
                    <button
                      type="button"
                      onClick={() => setActiveTab('warehouse')}
                      className="block mt-2 mx-auto text-xs text-blue-400 hover:text-blue-300 font-bold uppercase"
                    >
                      Перейти на склад →
                    </button>
                  </>
                ) : (
                  'Покупатели изучают ваши объявления. Пропустите день (Клавиша D) для обновления потока клиентов.'
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-4">
              {state.incomingOffers.map((offer) => {
                const warehouseItem = state.warehouse.find((w) => w.id === offer.warehouseItemId);
                const cost = warehouseItem ? warehouseItem.boughtPrice + warehouseItem.repairCostSpent : 0;
                const profit = offer.offeredPrice - cost;
                const margin = cost > 0 ? Math.round((profit / cost) * 100) : 0;

                const counterVal = counterInput[offer.id] || Math.round((offer.offeredPrice + offer.listedPrice) / 2);

                return (
                  <div
                    key={offer.id}
                    id={`buyer-offer-card-${offer.id}`}
                    className="p-4 sm:p-5 rounded-xl bg-[#161616] border border-[#262626] hover:border-neutral-600 transition-all space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Buyer Profile Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={offer.itemImage}
                            alt={offer.buyerName}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-full object-cover border border-[#333333]"
                          />
                          <div>
                            <div className="text-xs font-bold text-white flex items-center gap-1.5">
                              {offer.buyerName}
                              <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-[#1a1a1a] text-blue-400 border border-[#333333]">
                                {offer.buyerTypeLabel}
                              </span>
                            </div>
                            <div className="text-[10px] text-neutral-500 uppercase tracking-wider mt-0.5">
                              Истекает через: {offer.expiresInDays} дн.
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-[9px] uppercase tracking-widest text-neutral-500">Предлагает:</div>
                          <div className="text-base sm:text-lg font-bold font-mono-num text-white">
                            {offer.offeredPrice.toLocaleString('ru-RU')} ₽
                          </div>
                        </div>
                      </div>

                      {/* Item Reference Strip */}
                      <div className="p-2.5 rounded-lg bg-[#1a1a1a] border border-[#262626] flex items-center justify-between text-xs">
                        <div className="min-w-0">
                          <div className="text-neutral-500 text-[9px] uppercase tracking-wider">Товар:</div>
                          <div className="font-bold text-white truncate text-xs">
                            {offer.itemTitle}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-[9px] uppercase tracking-wider text-neutral-500">Цена в объявлении:</div>
                          <div className="font-mono-num text-neutral-400 text-xs">
                            {offer.listedPrice.toLocaleString('ru-RU')} ₽
                          </div>
                        </div>
                      </div>

                      {/* Buyer Message Bubble */}
                      <div className="text-xs text-neutral-300 italic bg-[#111111] p-3 rounded-lg border border-[#262626]">
                        «{offer.message}»
                      </div>

                      {/* Profit Estimation */}
                      <div className="flex items-center justify-between text-xs p-2.5 rounded bg-[#111111] border border-[#262626]">
                        <span className="text-neutral-500 text-[10px] uppercase tracking-wider">Чистая выгода:</span>
                        <span
                          className={`font-mono-num font-bold ${
                            profit >= 0 ? 'text-blue-400' : 'text-red-400'
                          }`}
                        >
                          {profit >= 0 ? '+' : ''}
                          {profit.toLocaleString('ru-RU')} ₽ ({margin}%)
                        </span>
                      </div>

                      {/* Counter-offer controls */}
                      <div className="p-3 rounded-lg bg-[#1a1a1a] border border-[#262626] space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[10px] uppercase tracking-wider text-neutral-400">Встречная цена:</span>
                          <span className="font-mono-num font-bold text-white">
                            {counterVal.toLocaleString('ru-RU')} ₽
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min={offer.offeredPrice}
                            max={offer.listedPrice}
                            step={500}
                            value={counterVal}
                            onChange={(e) =>
                              setCounterInput({
                                ...counterInput,
                                [offer.id]: Number(e.target.value)
                              })
                            }
                            className="flex-1 h-1.5 bg-[#111111] rounded appearance-none cursor-pointer accent-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => handleCounter(offer)}
                            className="px-3 py-1.5 rounded-lg bg-[#111111] hover:bg-[#222222] text-blue-400 border border-[#333333] text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1"
                          >
                            <Send className="w-3 h-3" />
                            <span>Торг</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-[#262626]">
                      <button
                        type="button"
                        onClick={() => rejectBuyerOffer(offer.id)}
                        className="px-3 py-2 rounded-lg bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-800 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Отклонить</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => acceptBuyerOffer(offer.id)}
                        className="px-3 py-2 rounded-lg bg-white text-black hover:bg-neutral-200 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Принять ({offer.offeredPrice.toLocaleString('ru-RU')} ₽)</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: ACTIVE LISTINGS */}
      {activeSubTab === 'active' && (
        <div className="space-y-3">
          {listedItems.length === 0 ? (
            <div className="p-12 rounded-xl bg-[#161616] border border-[#262626] text-center space-y-3">
              <Tag className="w-8 h-8 text-neutral-500 mx-auto" />
              <div className="text-sm font-bold text-white uppercase tracking-wider">Нет активных объявлений</div>
              <div className="text-xs text-neutral-400 max-w-sm mx-auto">
                Выберите товары на складе и выставьте их, чтобы начать получать отклики покупателей.
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('warehouse')}
                className="px-4 py-2 rounded-lg bg-white text-black hover:bg-neutral-200 text-xs font-bold uppercase transition-colors"
              >
                Перейти на склад
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
              {listedItems.map((item) => {
                const totalCost = item.boughtPrice + item.repairCostSpent;
                const asking = item.listedPrice || item.currentMarketPrice;
                const profit = asking - totalCost;

                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-[#161616] border border-[#262626] hover:border-neutral-600 transition-all space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2.5">
                      <div className="relative rounded-lg overflow-hidden bg-[#0a0a0a] border border-[#262626] aspect-[16/10] flex items-center justify-center">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono-num font-bold text-blue-400 border border-[#333333]">
                          {asking.toLocaleString('ru-RU')} ₽
                        </div>
                      </div>

                      <div>
                        <div className="text-[9px] uppercase tracking-widest text-neutral-500 font-semibold">
                          {item.category}
                        </div>
                        <div className="text-xs sm:text-sm font-bold text-white truncate mt-0.5">
                          {item.title}
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-[#1a1a1a] border border-[#262626] text-xs space-y-1">
                        <div className="flex items-center justify-between text-neutral-500 text-[10px] uppercase">
                          <span>Себестоимость:</span>
                          <span className="font-mono-num text-white">
                            {totalCost.toLocaleString('ru-RU')} ₽
                          </span>
                        </div>
                        <div className="flex items-center justify-between pt-1 border-t border-[#262626]">
                          <span className="text-neutral-400 text-[10px] uppercase">Маржа:</span>
                          <span className="font-mono-num font-bold text-blue-400">
                            +{profit.toLocaleString('ru-RU')} ₽
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-[#262626]">
                      <button
                        type="button"
                        onClick={() => onOpenSellModal(item)}
                        className="px-2.5 py-2 rounded-lg bg-[#1a1a1a] hover:bg-[#222222] text-neutral-300 border border-[#333333] text-xs font-semibold uppercase tracking-wider transition-colors"
                      >
                        Изменить цену
                      </button>

                      <button
                        type="button"
                        onClick={() => unlistItem(item.id)}
                        className="px-2.5 py-2 rounded-lg bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-800 text-xs font-bold uppercase tracking-wider transition-colors"
                      >
                        Снять
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 3: DEAL HISTORY */}
      {activeSubTab === 'history' && (
        <div className="space-y-4">
          {/* History KPI Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 sm:p-5 rounded-xl bg-[#161616] border border-[#262626]">
            <div>
              <div className="text-[9px] uppercase tracking-widest text-neutral-500 font-semibold">Успешных сделок:</div>
              <div className="text-xl font-bold font-mono-num text-white mt-0.5">
                {dealsList.length}
              </div>
            </div>

            <div>
              <div className="text-[9px] uppercase tracking-widest text-neutral-500 font-semibold">Общий чистый профит:</div>
              <div className="text-xl font-bold font-mono-num text-emerald-400 mt-0.5">
                +{totalProfitAllTime.toLocaleString('ru-RU')} ₽
              </div>
            </div>

            <div>
              <div className="text-[9px] uppercase tracking-widest text-neutral-500 font-semibold">Средняя маржа:</div>
              <div className="text-xl font-bold font-mono-num text-blue-400 mt-0.5">
                {avgMargin}%
              </div>
            </div>
          </div>

          {dealsList.length === 0 ? (
            <div className="p-12 rounded-xl bg-[#161616] border border-[#262626] text-center space-y-2">
              <Clock className="w-8 h-8 text-neutral-500 mx-auto" />
              <div className="text-sm font-bold text-white uppercase tracking-wider">История сделок пока пуста</div>
              <div className="text-xs text-neutral-400">
                После первой успешной продажи здесь появится журнал операций.
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {dealsList.map((deal) => (
                <div
                  key={deal.id}
                  className="p-3.5 sm:p-4 rounded-xl bg-[#161616] border border-[#262626] hover:border-neutral-600 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{deal.itemTitle}</span>
                      <span className="text-[9px] font-mono-num uppercase px-1.5 py-0.5 rounded bg-[#111111] text-blue-400 border border-[#333333]">
                        День {deal.soldAtDay}
                      </span>
                    </div>
                    <div className="text-neutral-500 text-[11px]">
                      Покупатель: {deal.buyerName} ({deal.buyerType}) · В наличии: {deal.daysHeld} дн.
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-6 justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-[#262626]">
                    <div className="text-left sm:text-right">
                      <div className="text-[9px] uppercase tracking-wider text-neutral-500">Закупка + Ремонт</div>
                      <div className="font-mono-num text-white">
                        {((deal.boughtPrice || 0) + (deal.repairSpent || 0)).toLocaleString('ru-RU')} ₽
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="text-[9px] uppercase tracking-wider text-neutral-500">Продано за</div>
                      <div className="font-mono-num text-white font-semibold">
                        {(deal.soldPrice || 0).toLocaleString('ru-RU')} ₽
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[9px] uppercase tracking-wider text-neutral-500">Чистый профит</div>
                      <div className="font-mono-num font-bold text-emerald-400">
                        +{(deal.netProfit || 0).toLocaleString('ru-RU')} ₽ ({deal.profitMarginPct || 0}%)
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
