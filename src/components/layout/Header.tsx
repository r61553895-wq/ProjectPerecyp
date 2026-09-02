import React from 'react';
import { useGame, RANK_NAMES } from '../../context/GameContext';
import {
  TrendingUp,
  Calendar,
  FastForward,
  Menu,
  X,
  Wallet,
  Activity
} from 'lucide-react';

interface HeaderProps {
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  mobileNavOpen,
  setMobileNavOpen,
  activeTab,
  setActiveTab
}) => {
  const { state, advanceDay } = useGame();

  const xpPercent = Math.min(100, Math.round((state.xp / state.maxXp) * 100));
  const rankLabel = RANK_NAMES[state.level] || 'Новичок';

  return (
    <header
      id="main-app-header"
      className="sticky top-0 z-40 bg-[#111111] border-b border-[#222222] px-4 sm:px-6 py-2.5 transition-colors select-none"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
        {/* Left: Brand & Mobile Toggle */}
        <div className="flex items-center gap-3 sm:gap-6">
          <button
            id="mobile-nav-toggle-btn"
            type="button"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="md:hidden p-2 rounded-lg bg-[#1a1a1a] border border-[#333333] text-neutral-400 hover:text-white transition-colors"
            aria-label="Переключить навигацию"
          >
            {mobileNavOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          <div
            id="brand-logo"
            onClick={() => setActiveTab('overview')}
            className="cursor-pointer flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-sm tracking-tighter">
              F
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-base font-bold tracking-tighter text-white">
                  FLIPPER.<span className="text-blue-500">OS</span>
                </span>
                <span className="text-[9px] font-mono-num font-bold uppercase px-1.5 py-0.5 rounded bg-[#1a1a1a] text-neutral-400 border border-[#333333] ml-1">
                  v2.0
                </span>
              </div>
              <div className="text-[10px] uppercase tracking-widest text-neutral-500 hidden sm:block">
                Симулятор Перекупа
              </div>
            </div>
          </div>
        </div>

        {/* Center: In-game Day & Next Turn Control */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div
            id="day-counter-badge"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a1a1a] border border-[#333333] text-xs text-neutral-300"
          >
            <Calendar className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-[10px] uppercase tracking-widest text-neutral-500 hidden sm:inline">День</span>
            <span className="font-mono-num font-bold text-white text-sm">#{state.day}</span>
          </div>

          <button
            id="next-day-advance-btn"
            type="button"
            onClick={advanceDay}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg bg-white text-black hover:bg-neutral-200 text-xs font-bold uppercase tracking-wider transition-all active:scale-95 shadow-sm"
            title="Обновить рынок и перейти на следующий день (Клавиша D)"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>Ход</span>
            <span className="hidden sm:inline font-mono text-[10px] opacity-75">(D)</span>
          </button>
        </div>

        {/* Right: Balance & Financial Stats */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Rank & Level */}
          <div
            id="user-rank-status"
            onClick={() => setActiveTab('skills')}
            className="hidden lg:flex flex-col items-end cursor-pointer group"
          >
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-[10px] uppercase tracking-widest text-neutral-500">Ранг:</span>
              <span className="font-semibold text-neutral-200 group-hover:text-blue-400 transition-colors">
                {rankLabel}
              </span>
              <span className="text-[10px] text-blue-400 font-mono-num">
                (Ур.{state.level})
              </span>
            </div>
            <div className="w-24 h-1.5 rounded-full bg-[#222222] overflow-hidden mt-1">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>

          {/* Today's Profit Pill */}
          <div
            id="header-daily-profit"
            className="hidden sm:flex flex-col items-end"
          >
            <p className="text-[9px] uppercase tracking-widest text-neutral-500">Доход сегодня</p>
            <p
              className={`text-sm font-mono-num font-medium ${
                state.lastProfitToday > 0
                  ? 'text-blue-400'
                  : state.lastProfitToday < 0
                  ? 'text-red-400'
                  : 'text-neutral-400'
              }`}
            >
              {state.lastProfitToday > 0 ? '+' : ''}
              {state.lastProfitToday.toLocaleString('ru-RU')} ₽
            </p>
          </div>

          <div className="hidden sm:block h-7 w-[1px] bg-[#2a2a2a]" />

          {/* Main Balance Display */}
          <div
            id="header-balance-card"
            className="flex flex-col items-end pl-1"
          >
            <p className="text-[9px] uppercase tracking-widest text-neutral-500">Баланс</p>
            <p className="text-sm sm:text-base font-mono-num font-bold text-white tracking-tight">
              {state.balance.toLocaleString('ru-RU')} ₽
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

