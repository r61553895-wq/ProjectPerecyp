import React from 'react';
import { useGame } from '../../context/GameContext';
import { Achievement } from '../../types';
import {
  Award,
  CheckCircle2,
  Lock,
  Gift,
  Sparkles
} from 'lucide-react';

export const AchievementsView: React.FC = () => {
  const { state, claimAchievement, claimAchievementReward } = useGame();

  const handleClaim = (id: string) => {
    const fn = claimAchievementReward || claimAchievement;
    if (fn) fn(id);
  };

  const unlockedCount = state.achievements.filter((a) => a.isUnlocked).length;

  return (
    <div className="space-y-4" id="achievements-progress-view">
      {/* Header */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#161616] border border-[#262626] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-400" />
            <h2 className="text-xs font-bold text-neutral-300 uppercase tracking-widest">
              Достижения и карьерные вехи
            </h2>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Выполняйте бизнес-задачи, получайте денежные премии и повышайте свой профессиональный статус.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-lg bg-[#111111] border border-[#262626] text-xs font-bold uppercase tracking-wider text-neutral-300 shrink-0">
          Выполнено:{' '}
          <span className="text-blue-400 font-mono-num">
            {unlockedCount} / {state.achievements.length}
          </span>
        </div>
      </div>

      {/* Achievement Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {state.achievements.map((ach) => {
          const isCompleted = ach.progress >= ach.maxProgress;
          const isClaimed = ach.isUnlocked;
          const pct = Math.min(100, Math.round((ach.progress / ach.maxProgress) * 100));

          return (
            <div
              key={ach.id}
              id={`achievement-card-${ach.id}`}
              className={`p-4 sm:p-5 rounded-xl border space-y-3 flex flex-col justify-between transition-all ${
                isClaimed
                  ? 'bg-[#161616] border-[#262626]'
                  : isCompleted
                  ? 'bg-[#161616] border-blue-500/40 shadow-sm'
                  : 'bg-[#161616] border-[#262626] opacity-90'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center border ${
                        isClaimed
                          ? 'bg-[#111111] text-blue-400 border-[#262626]'
                          : isCompleted
                          ? 'bg-[#1a1a1a] text-blue-400 border-blue-500/50'
                          : 'bg-[#111111] text-neutral-500 border-[#262626]'
                      }`}
                    >
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-white">
                        {ach.title}
                      </h3>
                      <div className="text-[10px] text-neutral-400 mt-0.5">
                        {ach.description}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono-num font-bold text-neutral-400 shrink-0">
                    {ach.progress} / {ach.maxProgress}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-[#111111] rounded-full overflow-hidden border border-[#262626]">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isCompleted ? 'bg-blue-500' : 'bg-blue-500/60'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              {/* Reward & Action */}
              <div className="pt-2.5 border-t border-[#262626] flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-neutral-300">
                  <Gift className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[10px] uppercase tracking-wider text-neutral-500">Премия:</span>
                  <span className="font-mono-num font-bold text-white">
                    +{ach.rewardMoney.toLocaleString('ru-RU')} ₽
                  </span>
                </div>

                {isClaimed ? (
                  <span className="text-[10px] uppercase tracking-wider font-bold text-blue-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Получено
                  </span>
                ) : isCompleted ? (
                  <button
                    type="button"
                    onClick={() => handleClaim(ach.id)}
                    className="px-3 py-1 rounded-md bg-white text-black hover:bg-neutral-200 font-bold uppercase tracking-wider text-xs transition-colors flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Забрать</span>
                  </button>
                ) : (
                  <span className="text-[10px] uppercase tracking-wider text-neutral-500 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> В процессе
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
