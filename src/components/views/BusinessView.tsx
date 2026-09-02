import React from 'react';
import { useGame } from '../../context/GameContext';
import { BusinessBranch } from '../../types';
import {
  Building2,
  Store,
  Wrench,
  Package,
  Network,
  Car,
  CheckCircle2,
  ArrowUpRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';

export const BusinessView: React.FC = () => {
  const { state, upgradeBusiness } = useGame();

  const iconMap: Record<string, React.ElementType> = {
    branch_store: Store,
    branch_workshop: Wrench,
    branch_warehouse: Package,
    branch_network: Network,
    branch_cars: Car
  };

  const handleUpgrade = (branchId: string) => {
    upgradeBusiness(branchId);
  };

  return (
    <div className="space-y-4" id="business-enterprise-view">
      {/* Header */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#161616] border border-[#262626] space-y-2">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-blue-400" />
          <h2 className="text-xs font-bold text-neutral-300 uppercase tracking-widest">
            Развитие бизнеса и филиалов
          </h2>
        </div>
        <p className="text-xs text-neutral-400 leading-relaxed">
          Инвестируйте заработанный капитал в масштабирование инфраструктуры: магазины, сервисные центры, складские комплексы и доступ к премиальным сегментам.
        </p>
      </div>

      {/* Branches List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
        {state.businesses.map((branch) => {
          const Icon = iconMap[branch.id] || Building2;
          const isMaxLevel = branch.level >= branch.maxLevel;
          const canAfford = state.balance >= branch.cost && !isMaxLevel;
          const levelPercent = Math.round((branch.level / branch.maxLevel) * 100);

          return (
            <div
              key={branch.id}
              id={`business-branch-${branch.id}`}
              className="p-4 sm:p-5 rounded-xl bg-[#161616] border border-[#262626] hover:border-neutral-600 transition-all space-y-3.5 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#111111] border border-[#262626] flex items-center justify-center text-blue-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-white leading-tight">
                        {branch.title}
                      </h3>
                      <div className="text-[10px] uppercase tracking-wider text-neutral-500 mt-0.5">
                        Уровень {branch.level} из {branch.maxLevel}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono-num font-bold px-2 py-0.5 rounded bg-[#111111] text-blue-400 border border-[#333333]">
                    {isMaxLevel ? 'MAX' : `LVL ${branch.level}`}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-[#111111] rounded-full overflow-hidden border border-[#262626]">
                  <div
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${levelPercent}%` }}
                  />
                </div>

                <p className="text-xs text-neutral-400 leading-relaxed">
                  {branch.subtitle}
                </p>

                {/* Perks Checklist */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-[9px] uppercase font-bold text-neutral-500 tracking-wider">
                    Бонусы и эффекты:
                  </div>
                  <div className="space-y-1">
                    {branch.perks.map((perk, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-neutral-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span>{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Upgrade Action Footer */}
              <div className="pt-3 border-t border-[#262626] flex items-center justify-between gap-3">
                {!isMaxLevel ? (
                  <>
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-neutral-500">Стоимость апгрейда:</div>
                      <div className="text-xs sm:text-sm font-bold font-mono-num text-white">
                        {branch.cost.toLocaleString('ru-RU')} ₽
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleUpgrade(branch.id)}
                      disabled={!canAfford}
                      className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                        canAfford
                          ? 'bg-white text-black hover:bg-neutral-200'
                          : 'bg-[#1a1a1a] text-neutral-500 border border-[#262626] cursor-not-allowed'
                      }`}
                    >
                      <span>Улучшить</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <div className="w-full text-center py-2 text-xs text-blue-400 font-bold uppercase tracking-wider bg-[#111111] rounded-lg border border-[#262626]">
                    Филиал полностью улучшен
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
