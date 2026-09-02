import React from 'react';
import { useGame, RANK_NAMES } from '../../context/GameContext';
import { Skill } from '../../types';
import {
  Sparkles,
  MessageSquare,
  Search,
  Wrench,
  TrendingUp,
  CheckCircle2,
  Lock,
  ArrowUpRight
} from 'lucide-react';

export const SkillsView: React.FC = () => {
  const { state, upgradeSkill } = useGame();

  const categoryIcons: Record<string, React.ElementType> = {
    trading: MessageSquare,
    inspection: Search,
    repair: Wrench,
    business: TrendingUp
  };

  const categoryTitles: Record<string, string> = {
    trading: 'Искусство переговоров',
    inspection: 'Оценка и диагностика',
    repair: 'Ремонт и восстановление',
    business: 'Маркетинг и коммерция'
  };

  const groupedSkills: Record<string, Skill[]> = state.skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const xpPercent = Math.min(100, Math.round((state.xp / state.maxXp) * 100));

  return (
    <div className="space-y-4" id="skills-tree-view">
      {/* Top Experience & Rank Banner */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#161616] border border-[#262626] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <h2 className="text-xs font-bold text-neutral-300 uppercase tracking-widest">
              Квалификация и профессиональные навыки
            </h2>
          </div>
          <p className="text-xs text-neutral-400">
            Закрывайте сделки, повышайте ранг и открывайте перки для максимизации чистой маржи.
          </p>
        </div>

        {/* Player Level Card */}
        <div className="p-3 rounded-lg bg-[#1a1a1a] border border-[#262626] flex items-center gap-3.5 min-w-[240px]">
          <div className="w-10 h-10 rounded-lg bg-[#111111] border border-[#333333] flex items-center justify-center font-bold text-base text-blue-400 font-mono-num">
            {state.level}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-white uppercase tracking-wider truncate">
              {RANK_NAMES[state.level]}
            </div>
            <div className="text-[10px] text-neutral-400 font-mono-num mt-0.5">
              XP: {state.xp} / {state.maxXp}
            </div>
            <div className="w-full h-1.5 bg-[#111111] rounded-full overflow-hidden mt-1 border border-[#262626]">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Skills Grouped by Category */}
      <div className="space-y-5">
        {Object.entries(groupedSkills).map(([catKey, skills]) => {
          const CatIcon = categoryIcons[catKey] || Sparkles;

          return (
            <div key={catKey} className="space-y-2.5">
              <div className="flex items-center gap-2 px-1">
                <CatIcon className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-300">
                  {categoryTitles[catKey] || catKey}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {skills.map((skill) => {
                  const isMax = skill.level >= skill.maxLevel;
                  const requiredLevel = skill.level + 1;
                  const isLevelLocked = state.level < requiredLevel;
                  const canAfford = state.balance >= skill.cost && !isMax && !isLevelLocked;

                  return (
                    <div
                      key={skill.id}
                      id={`skill-card-${skill.id}`}
                      className="p-4 sm:p-5 rounded-xl bg-[#161616] border border-[#262626] hover:border-neutral-600 transition-all space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-white">
                              {skill.name}
                            </h4>
                            <div className="text-[10px] uppercase tracking-wider text-neutral-400 mt-0.5">
                              Уровень {skill.level} из {skill.maxLevel} · {skill.effectLabel}
                            </div>
                          </div>

                          <span className="text-[10px] font-mono-num font-bold px-2 py-0.5 rounded bg-[#111111] text-blue-400 border border-[#333333]">
                            {isMax ? 'MAX' : `LVL ${skill.level}`}
                          </span>
                        </div>

                        {/* Level pip dots */}
                        <div className="flex gap-1.5 py-1">
                          {Array.from({ length: skill.maxLevel }).map((_, i) => (
                            <div
                              key={i}
                              className={`h-1.5 flex-1 rounded-full ${
                                i < skill.level ? 'bg-blue-500' : 'bg-[#111111] border border-[#262626]'
                              }`}
                            />
                          ))}
                        </div>

                        <p className="text-xs text-neutral-400 leading-relaxed">
                          {skill.description}
                        </p>
                      </div>

                      {/* Upgrade Controls */}
                      <div className="pt-3 border-t border-[#262626] flex items-center justify-between gap-2">
                        {isMax ? (
                          <div className="w-full text-center py-2 text-xs text-blue-400 font-bold uppercase tracking-wider bg-[#111111] rounded-lg border border-[#262626]">
                            Навык полностью освоен
                          </div>
                        ) : isLevelLocked ? (
                          <div className="flex items-center gap-1.5 text-xs text-rose-400">
                            <Lock className="w-3.5 h-3.5" />
                            <span>Требуется ранг уровня {requiredLevel}</span>
                          </div>
                        ) : (
                          <>
                            <div>
                              <div className="text-[9px] uppercase tracking-wider text-neutral-500">Цена изучения:</div>
                              <div className="text-xs sm:text-sm font-bold font-mono-num text-white">
                                {skill.cost.toLocaleString('ru-RU')} ₽
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => upgradeSkill(skill.id)}
                              disabled={!canAfford}
                              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                                canAfford
                                  ? 'bg-white text-black hover:bg-neutral-200'
                                  : 'bg-[#1a1a1a] text-neutral-500 border border-[#262626] cursor-not-allowed'
                              }`}
                            >
                              <span>Изучить</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
