import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { WarehouseItem } from '../../types';
import { DEFECTS_CATALOG } from '../../data/defectsCatalog';
import {
  Package,
  Wrench,
  Tag,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Trash2,
  Sparkles,
  ArrowUpRight,
  Zap
} from 'lucide-react';

interface WarehouseViewProps {
  onOpenRepair: (item: WarehouseItem) => void;
  onOpenSell: (item: WarehouseItem) => void;
  setActiveTab: (tab: string) => void;
}

export const WarehouseView: React.FC<WarehouseViewProps> = ({
  onOpenRepair,
  onOpenSell,
  setActiveTab
}) => {
  const { state, unlistItem } = useGame();
  const [filterStatus, setFilterStatus] = useState<'all' | 'listed' | 'stored'>('all');

  const filteredItems = state.warehouse.filter((item) => {
    if (filterStatus === 'listed') return item.isListed;
    if (filterStatus === 'stored') return !item.isListed;
    return true;
  });

  const totalInventoryValue = state.warehouse.reduce(
    (acc, i) => acc + i.currentMarketPrice,
    0
  );
  const totalInvested = state.warehouse.reduce(
    (acc, i) => acc + i.boughtPrice + i.repairCostSpent,
    0
  );

  return (
    <div className="space-y-4" id="warehouse-management-view">
      {/* Top Warehouse Header & Capacity Bar */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#161616] border border-[#262626] space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-blue-400" />
              <h2 className="text-xs font-bold text-neutral-300 uppercase tracking-widest">
                Склад и товарные запасы
              </h2>
            </div>
            <div className="text-xs text-neutral-500 mt-0.5">
              Управление инвентарем, устранение поломок и выставление позиций на продажу
            </div>
          </div>

          {/* Quick Upgrade Capacity Link */}
          <button
            type="button"
            onClick={() => setActiveTab('business')}
            className="px-3 py-1.5 rounded-lg bg-[#1a1a1a] hover:bg-[#222222] border border-[#333333] text-xs text-blue-400 font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Расширить склад ({state.warehouseCapacity} мест)</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Capacity Meter */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[10px] uppercase tracking-wider text-neutral-500">Заполненность склада:</span>
            <span className="font-mono-num font-bold text-white">
              {state.warehouse.length} / {state.warehouseCapacity} шт. ({Math.round((state.warehouse.length / state.warehouseCapacity) * 100)}%)
            </span>
          </div>
          <div className="w-full h-2 bg-[#111111] border border-[#262626] rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                state.warehouse.length >= state.warehouseCapacity
                  ? 'bg-red-500'
                  : state.warehouse.length / state.warehouseCapacity > 0.7
                  ? 'bg-amber-400'
                  : 'bg-blue-500'
              }`}
              style={{
                width: `${Math.min(100, (state.warehouse.length / state.warehouseCapacity) * 100)}%`
              }}
            />
          </div>
        </div>

        {/* Aggregate Info strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 border-t border-[#262626] text-xs">
          <div className="p-2.5 rounded-lg bg-[#1a1a1a] border border-[#262626]">
            <div className="text-[9px] uppercase tracking-widest text-neutral-500">Вложено в товары:</div>
            <div className="font-mono-num font-bold text-white mt-0.5 text-sm">
              {totalInvested.toLocaleString('ru-RU')} ₽
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-[#1a1a1a] border border-[#262626]">
            <div className="text-[9px] uppercase tracking-widest text-neutral-500">Оценка стоимости:</div>
            <div className="font-mono-num font-bold text-blue-400 mt-0.5 text-sm">
              {totalInventoryValue.toLocaleString('ru-RU')} ₽
            </div>
          </div>
          <div className="col-span-2 sm:col-span-1 p-2.5 rounded-lg bg-[#1a1a1a] border border-[#262626]">
            <div className="text-[9px] uppercase tracking-widest text-neutral-500">Ожидаемая выгода:</div>
            <div className="font-mono-num font-bold text-emerald-400 mt-0.5 text-sm">
              +{(totalInventoryValue - totalInvested).toLocaleString('ru-RU')} ₽
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Filter Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors border ${
              filterStatus === 'all'
                ? 'bg-white text-black border-white'
                : 'bg-[#161616] text-neutral-400 border-[#262626] hover:text-white'
            }`}
          >
            Все позиции ({state.warehouse.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('listed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors border ${
              filterStatus === 'listed'
                ? 'bg-white text-black border-white'
                : 'bg-[#161616] text-neutral-400 border-[#262626] hover:text-white'
            }`}
          >
            На продаже ({state.warehouse.filter((i) => i.isListed).length})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('stored')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors border ${
              filterStatus === 'stored'
                ? 'bg-white text-black border-white'
                : 'bg-[#161616] text-neutral-400 border-[#262626] hover:text-white'
            }`}
          >
            В запасе ({state.warehouse.filter((i) => !i.isListed).length})
          </button>
        </div>
      </div>

      {/* Warehouse Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="p-12 rounded-xl bg-[#161616] border border-[#262626] text-center space-y-3">
          <Package className="w-8 h-8 text-neutral-500 mx-auto" />
          <div className="text-sm font-bold text-white uppercase tracking-wider">На складе пусто</div>
          <div className="text-xs text-neutral-400 max-w-sm mx-auto">
            Перейдите на рынок, чтобы найти выгодные лоты и выкупить их для дальнейшей перепродажи.
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('market')}
            className="px-4 py-2 rounded-lg bg-white text-black hover:bg-neutral-200 text-xs font-bold uppercase transition-colors"
          >
            Открыть рынок лотов
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {filteredItems.map((item) => {
            const totalInvest = item.boughtPrice + item.repairCostSpent;
            const diff = (item.listedPrice || item.currentMarketPrice) - totalInvest;
            const hasDefects = item.knownDefects.length > 0;

            return (
              <div
                key={item.id}
                id={`warehouse-item-${item.id}`}
                className="p-4 rounded-xl bg-[#161616] border border-[#262626] hover:border-neutral-600 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  {/* Image & Status Tag */}
                  <div className="relative rounded-lg overflow-hidden bg-[#0a0a0a] border border-[#262626] aspect-[16/10] flex items-center justify-center">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80';
                      }}
                    />

                    {/* Listed status pill */}
                    <div className="absolute top-2 left-2">
                      {item.isListed ? (
                        <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-blue-950/90 text-blue-300 border border-blue-800 flex items-center gap-1">
                          <Tag className="w-3 h-3" /> В продаже: {item.listedPrice?.toLocaleString('ru-RU')} ₽
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-black/80 text-neutral-400 border border-[#333333]">
                          В запасе
                        </span>
                      )}
                    </div>

                    {/* Days in stock counter */}
                    <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-mono-num font-bold text-neutral-300 border border-[#333333] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-neutral-500" />
                      <span>{item.daysHeld} дн.</span>
                    </div>
                  </div>

                  {/* Title & category */}
                  <div>
                    <div className="text-[9px] uppercase tracking-widest text-neutral-500 font-semibold">
                      {item.category}
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-white truncate mt-0.5">
                      {item.title}
                    </h3>
                  </div>

                  {/* Financial Breakdown */}
                  <div className="p-2.5 rounded-lg bg-[#1a1a1a] border border-[#262626] space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500 text-[10px] uppercase">Закупка + Ремонт:</span>
                      <span className="font-mono-num text-white">
                        {totalInvest.toLocaleString('ru-RU')} ₽
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500 text-[10px] uppercase">Оценка рынка:</span>
                      <span className="font-mono-num text-neutral-400">
                        {item.currentMarketPrice.toLocaleString('ru-RU')} ₽
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-[#262626]">
                      <span className="text-neutral-400 text-[10px] uppercase">Маржа:</span>
                      <span
                        className={`font-mono-num font-bold ${
                          diff >= 0 ? 'text-blue-400' : 'text-red-400'
                        }`}
                      >
                        {diff >= 0 ? '+' : ''}
                        {diff.toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                  </div>

                  {/* Defect status indicator */}
                  <div className="p-2.5 rounded-lg bg-[#111111] border border-[#262626] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      {hasDefects ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                      )}
                      <span className={`text-[11px] font-medium ${hasDefects ? 'text-red-400' : 'text-blue-400'}`}>
                        {hasDefects
                          ? `Дефектов: ${item.knownDefects.length}`
                          : 'Полностью исправен'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onOpenRepair(item)}
                      className="text-[10px] uppercase font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                    >
                      <Wrench className="w-3 h-3" />
                      {hasDefects ? 'Ремонт' : 'Осмотр'}
                    </button>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-[#262626]">
                  <button
                    type="button"
                    onClick={() => onOpenRepair(item)}
                    className="px-2.5 py-2 rounded-lg bg-[#1a1a1a] hover:bg-[#222222] text-neutral-300 border border-[#333333] text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1"
                  >
                    <Wrench className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Мастерская</span>
                  </button>

                  {item.isListed ? (
                    <button
                      type="button"
                      onClick={() => unlistItem(item.id)}
                      className="px-2.5 py-2 rounded-lg bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-800 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1"
                    >
                      <span>Снять</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onOpenSell(item)}
                      className="px-2.5 py-2 rounded-lg bg-white text-black hover:bg-neutral-200 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1"
                    >
                      <Tag className="w-3.5 h-3.5" />
                      <span>Выставить</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
