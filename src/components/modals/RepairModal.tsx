import React, { useState } from 'react';
import { WarehouseItem, DefectType } from '../../types';
import { useGame } from '../../context/GameContext';
import { DEFECTS_CATALOG } from '../../data/defectsCatalog';
import {
  X,
  Wrench,
  CheckCircle2,
  TrendingUp,
  ShieldAlert,
  Sparkles,
  Loader2,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RepairModalProps {
  item: WarehouseItem | null;
  onClose: () => void;
}

export const RepairModal: React.FC<RepairModalProps> = ({ item, onClose }) => {
  const { state, repairItem } = useGame();
  const [repairingDefect, setRepairingDefect] = useState<string | null>(null);
  const [recentlyRepaired, setRecentlyRepaired] = useState<{ name: string; gain: number } | null>(null);

  if (!item) return null;

  // Always bind to the live item in warehouse state so eliminations update immediately
  const liveItem = state.warehouse.find((w) => w.id === item.id) || item;

  const workshopLevel = state.businesses.find((b) => b.id === 'branch_workshop')?.level || 0;
  const repairSkill = state.skills.find((s) => s.id === 'skill_diy_repair')?.level || 0;
  const discountPct = Math.min(0.5, workshopLevel * 0.06 + repairSkill * 0.08);

  const handleFixDefect = (defectType: DefectType) => {
    const defect = DEFECTS_CATALOG[defectType];
    const valueGain = defect ? Math.round(liveItem.currentMarketPrice * (defect.valuePenaltyPct / 100)) : 0;
    
    setRepairingDefect(defectType);

    setTimeout(() => {
      repairItem(liveItem.id, defectType);
      setRepairingDefect(null);
      if (defect) {
        setRecentlyRepaired({ name: defect.name, gain: valueGain });
        setTimeout(() => setRecentlyRepaired(null), 3000);
      }
    }, 400);
  };

  return (
    <div
      id="repair-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        id="repair-modal-card"
        className="bg-[#111111] border border-[#262626] rounded-xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-[#262626] bg-[#161616]">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-300">
              Мастерская и восстановление
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
          {/* Item summary banner */}
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#161616] border border-[#262626]">
            <img
              src={liveItem.imageUrl}
              alt={liveItem.title}
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded object-cover border border-[#333333]"
            />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate">{liveItem.title}</div>
              <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-0.5 font-mono-num">
                <span>Закупка: {liveItem.boughtPrice.toLocaleString('ru-RU')} ₽</span>
                <span>·</span>
                <span className="text-emerald-400 font-bold">
                  Оценка рынка: {liveItem.currentMarketPrice.toLocaleString('ru-RU')} ₽
                </span>
              </div>
            </div>
          </div>

          {/* Success Flash Notification inside modal */}
          <AnimatePresence>
            {recentlyRepaired && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-800/80 text-emerald-200 text-xs flex items-center justify-between shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    Дефект <strong>«{recentlyRepaired.name}»</strong> устранен!
                  </span>
                </div>
                <span className="font-mono-num font-bold text-emerald-300">
                  +{recentlyRepaired.gain.toLocaleString('ru-RU')} ₽
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Workshop discount info banner */}
          {discountPct > 0 && (
            <div className="p-3 rounded-xl bg-[#161616] border border-[#262626] text-xs text-neutral-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0 text-blue-400" />
              <span>
                Ваша скидка на сервис:{' '}
                <strong className="text-blue-400 font-mono-num">-{Math.round(discountPct * 100)}%</strong> (Мастерская + Навыки).
              </span>
            </div>
          )}

          {/* Defect List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
              <span>Обнаруженные дефекты ({liveItem.knownDefects.length}):</span>
              {liveItem.fixedDefects.length > 0 && (
                <span className="text-emerald-400">Устранено: {liveItem.fixedDefects.length} шт.</span>
              )}
            </div>

            {liveItem.knownDefects.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-xl bg-[#161616] border border-emerald-900/50 text-center space-y-2"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="w-5 h-5" />
                </div>
                <div className="text-sm font-bold text-white uppercase tracking-wider">Все дефекты устранены!</div>
                <div className="text-xs text-neutral-400 max-w-xs mx-auto">
                  Товар приведен в идеальное состояние (S-Grade) и готов к продаже с максимальной наценкой.
                </div>
              </motion.div>
            ) : (
              <AnimatePresence>
                {liveItem.knownDefects.map((defectKey) => {
                  const defect = DEFECTS_CATALOG[defectKey];
                  if (!defect) return null;

                  const actualCost = Math.round(defect.repairCost * (1 - discountPct));
                  const valueRestored = Math.round(liveItem.currentMarketPrice * (defect.valuePenaltyPct / 100));
                  const canAfford = state.balance >= actualCost;
                  const isBusy = repairingDefect === defectKey;

                  return (
                    <motion.div
                      key={defectKey}
                      layout
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, height: 0 }}
                      className={`p-3.5 rounded-xl border space-y-2.5 transition-colors ${
                        isBusy
                          ? 'bg-blue-950/30 border-blue-800'
                          : 'bg-[#161616] border-[#262626]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-2">
                            <span>{defect.name}</span>
                            <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-rose-950/80 text-rose-300 border border-rose-900">
                              -{defect.valuePenaltyPct}% к цене
                            </span>
                          </div>
                          <div className="text-xs text-neutral-400 mt-0.5 leading-relaxed">
                            {defect.description}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#262626] text-xs">
                        <div className="space-y-0.5">
                          <div className="text-[9px] uppercase tracking-wider text-neutral-500">
                            Стоимость работы:
                          </div>
                          <div className="font-mono-num font-bold text-white">
                            {actualCost.toLocaleString('ru-RU')} ₽
                          </div>
                        </div>

                        <div className="space-y-0.5 text-right">
                          <div className="text-[9px] uppercase tracking-wider text-neutral-500">
                            Рост стоимости:
                          </div>
                          <div className="font-mono-num font-bold text-emerald-400">
                            +{valueRestored.toLocaleString('ru-RU')} ₽
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleFixDefect(defectKey)}
                          disabled={!canAfford || isBusy}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                            isBusy
                              ? 'bg-blue-600 text-white animate-pulse'
                              : canAfford
                              ? 'bg-white text-black hover:bg-neutral-200'
                              : 'bg-[#1a1a1a] text-neutral-500 border border-[#262626] cursor-not-allowed'
                          }`}
                        >
                          {isBusy ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Ремонт...</span>
                            </>
                          ) : canAfford ? (
                            <>
                              <Wrench className="w-3.5 h-3.5" />
                              <span>Устранить</span>
                            </>
                          ) : (
                            'Мало денег'
                          )}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3.5 border-t border-[#262626] bg-[#161616] flex items-center justify-between">
          <div className="text-xs text-neutral-400 font-mono-num">
            Баланс: <strong className="text-white">{state.balance.toLocaleString('ru-RU')} ₽</strong>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#1a1a1a] hover:bg-[#222222] border border-[#333333] text-xs font-bold uppercase tracking-wider text-white transition-colors"
          >
            Готово
          </button>
        </div>
      </motion.div>
    </div>
  );
};

