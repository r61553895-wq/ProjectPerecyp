import React from 'react';
import { useGame } from '../../context/GameContext';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  DollarSign,
  Award,
  Package,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Building2
} from 'lucide-react';

export const StatsView: React.FC = () => {
  const { state } = useGame();

  const warehouse = state.warehouse || [];
  const businesses = state.businesses || [];
  const dealsList = state.deals || state.dealHistory || [];

  const inventoryValue = warehouse.reduce((acc, i) => acc + (i.currentMarketPrice || 0), 0);
  const businessValuation = businesses.reduce(
    (acc, b) => acc + (b.level || 0) * ((b.cost || 0) * 0.75),
    0
  );
  const totalNetWorth = (state.balance || 0) + inventoryValue + businessValuation;

  const totalRevenue = dealsList.reduce((acc, d) => acc + (d.soldPrice || 0), 0);
  const totalSpentInventory = dealsList.reduce((acc, d) => acc + (d.boughtPrice || 0), 0);
  const totalSpentRepairs = dealsList.reduce((acc, d) => acc + (d.repairSpent || 0), 0);
  const totalNetProfit = dealsList.reduce((acc, d) => acc + (d.netProfit || 0), 0);

  const bestDeal = dealsList.length > 0
    ? [...dealsList].sort((a, b) => (b.netProfit || 0) - (a.netProfit || 0))[0]
    : null;

  const avgMargin = dealsList.length > 0
    ? Math.round(dealsList.reduce((acc, d) => acc + (d.profitMarginPct || 0), 0) / dealsList.length)
    : 0;

  const avgHoldingDays = dealsList.length > 0
    ? (dealsList.reduce((acc, d) => acc + (d.daysHeld || 0), 0) / dealsList.length).toFixed(1)
    : '0';

  return (
    <div className="space-y-4" id="financial-analytics-view">
      {/* Header */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#161616] border border-[#262626] space-y-2">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-blue-400" />
          <h2 className="text-xs font-bold text-neutral-300 uppercase tracking-widest">
            Финансовая аналитика и статистика
          </h2>
        </div>
        <p className="text-xs text-neutral-400">
          Сводный отчет о движении капитала, рентабельности сделок, оценке активов и эффективности филиалов.
        </p>
      </div>

      {/* Net Worth & Assets Breakdown */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#161616] border border-[#262626] space-y-4">
        <div className="text-xs font-bold uppercase tracking-widest text-neutral-400">
          Оценка общего капитала предприятия (Net Worth)
        </div>

        <div className="text-2xl sm:text-3xl font-bold font-mono-num text-white tracking-tight">
          {totalNetWorth.toLocaleString('ru-RU')} ₽
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#262626]">
          <div className="p-3.5 rounded-lg bg-[#1a1a1a] border border-[#262626]">
            <div className="text-[9px] uppercase tracking-wider text-neutral-500">Ликвидный кэш:</div>
            <div className="text-base font-bold font-mono-num text-white mt-0.5">
              {state.balance.toLocaleString('ru-RU')} ₽
            </div>
            <div className="text-[10px] text-blue-400 mt-1 font-mono-num font-bold">
              {totalNetWorth > 0 ? Math.round((state.balance / totalNetWorth) * 100) : 0}% от капитала
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#1a1a1a] border border-[#262626]">
            <div className="text-[9px] uppercase tracking-wider text-neutral-500">Товары на складе ({state.warehouse.length} шт.):</div>
            <div className="text-base font-bold font-mono-num text-white mt-0.5">
              {inventoryValue.toLocaleString('ru-RU')} ₽
            </div>
            <div className="text-[10px] text-blue-400 mt-1 font-mono-num font-bold">
              {totalNetWorth > 0 ? Math.round((inventoryValue / totalNetWorth) * 100) : 0}% от капитала
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#1a1a1a] border border-[#262626]">
            <div className="text-[9px] uppercase tracking-wider text-neutral-500">Оценка филиалов и оборудования:</div>
            <div className="text-base font-bold font-mono-num text-white mt-0.5">
              {businessValuation.toLocaleString('ru-RU')} ₽
            </div>
            <div className="text-[10px] text-blue-400 mt-1 font-mono-num font-bold">
              {totalNetWorth > 0 ? Math.round((businessValuation / totalNetWorth) * 100) : 0}% от капитала
            </div>
          </div>
        </div>
      </div>

      {/* P&L Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-[#161616] border border-[#262626] space-y-1">
          <div className="text-[9px] uppercase tracking-wider text-neutral-500">Совокупная выручка</div>
          <div className="text-base sm:text-lg font-bold font-mono-num text-white">
            {totalRevenue.toLocaleString('ru-RU')} ₽
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#161616] border border-[#262626] space-y-1">
          <div className="text-[9px] uppercase tracking-wider text-neutral-500">Затраты на выкуп</div>
          <div className="text-base sm:text-lg font-bold font-mono-num text-white">
            {totalSpentInventory.toLocaleString('ru-RU')} ₽
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#161616] border border-[#262626] space-y-1">
          <div className="text-[9px] uppercase tracking-wider text-neutral-500">Затраты на ремонт</div>
          <div className="text-base sm:text-lg font-bold font-mono-num text-white">
            {totalSpentRepairs.toLocaleString('ru-RU')} ₽
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#161616] border border-[#262626] space-y-1">
          <div className="text-[9px] uppercase tracking-wider text-neutral-500">Чистая прибыль</div>
          <div className="text-base sm:text-lg font-bold font-mono-num text-blue-400">
            +{totalNetProfit.toLocaleString('ru-RU')} ₽
          </div>
        </div>
      </div>

      {/* KPIs & Best Deal Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
        {/* KPI Panel */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#161616] border border-[#262626] space-y-3">
          <div className="text-xs font-bold uppercase tracking-widest text-neutral-300">
            Ключевые показатели эффективности (KPI)
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-lg bg-[#1a1a1a] border border-[#262626] flex items-center justify-between">
              <span className="text-neutral-400">Средняя маржинальность сделок:</span>
              <span className="font-mono-num font-bold text-blue-400">{avgMargin}%</span>
            </div>

            <div className="p-2.5 rounded-lg bg-[#1a1a1a] border border-[#262626] flex items-center justify-between">
              <span className="text-neutral-400">Средний срок реализации товара:</span>
              <span className="font-mono-num font-bold text-white">{avgHoldingDays} дн.</span>
            </div>

            <div className="p-2.5 rounded-lg bg-[#1a1a1a] border border-[#262626] flex items-center justify-between">
              <span className="text-neutral-400">Количество закрытых сделок:</span>
              <span className="font-mono-num font-bold text-white">{state.totalDeals}</span>
            </div>

            <div className="p-2.5 rounded-lg bg-[#1a1a1a] border border-[#262626] flex items-center justify-between">
              <span className="text-neutral-400">Успешность торга при покупке:</span>
              <span className="font-mono-num font-bold text-blue-400">~74%</span>
            </div>
          </div>
        </div>

        {/* Best Deal Showcase */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#161616] border border-[#262626] space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-neutral-300">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Самая прибыльная сделка</span>
            </div>

            {bestDeal ? (
              <div className="mt-3 p-3.5 rounded-lg bg-[#1a1a1a] border border-[#262626] space-y-2">
                <div className="text-sm font-bold text-white">{bestDeal.itemTitle}</div>
                <div className="text-[11px] text-neutral-400">
                  Покупатель: {bestDeal.buyerName} ({bestDeal.buyerType})
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#262626] text-xs">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-neutral-500">Закупка:</span>
                    <div className="font-mono-num font-bold text-white">
                      {(bestDeal.boughtPrice + bestDeal.repairSpent).toLocaleString('ru-RU')} ₽
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] uppercase tracking-wider text-neutral-500">Продано:</span>
                    <div className="font-mono-num font-bold text-white">
                      {bestDeal.soldPrice.toLocaleString('ru-RU')} ₽
                    </div>
                  </div>
                </div>
                <div className="pt-2 border-t border-[#262626] flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Чистая прибыль:</span>
                  <span className="font-mono-num font-bold text-blue-400">
                    +{bestDeal.netProfit.toLocaleString('ru-RU')} ₽ ({bestDeal.profitMarginPct}%)
                  </span>
                </div>
              </div>
            ) : (
              <div className="mt-3 p-6 text-center text-xs text-neutral-500 bg-[#1a1a1a] rounded-lg border border-[#262626]">
                Совершите первую сделку, чтобы зафиксировать рекордную операцию
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
