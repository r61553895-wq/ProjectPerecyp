import React from 'react';
import { useGame } from '../../context/GameContext';
import {
  LayoutDashboard,
  Search,
  Handshake,
  Package,
  Gavel,
  Building2,
  Sparkles,
  BarChart3,
  Award,
  Settings,
  X
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  mobileNavOpen,
  setMobileNavOpen
}) => {
  const { state } = useGame();

  const hotDealsCount = state.listings.filter(l => l.isHotDeal).length;
  const incomingOffersCount = state.incomingOffers.length;
  const warehouseCount = state.warehouse.length;
  const unclaimedAchievements = state.achievements.filter(a => a.isUnlocked && a.progress >= a.maxProgress).length;
  const activeAuctionsCount = state.auctions.filter(a => !a.isFinished).length;

  const navItems = [
    {
      id: 'overview',
      label: 'Обзор',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'market',
      label: 'Рынок',
      icon: Search,
      badge: hotDealsCount > 0 ? `${hotDealsCount} HOT` : null,
      badgeColor: 'bg-red-950/60 text-red-400 border-red-900/50'
    },
    {
      id: 'deals',
      label: 'Сделки',
      icon: Handshake,
      badge: incomingOffersCount > 0 ? `${incomingOffersCount}` : null,
      badgeColor: 'bg-blue-950/60 text-blue-400 border-blue-900/50'
    },
    {
      id: 'warehouse',
      label: 'Склад',
      icon: Package,
      badge: `${warehouseCount}/${state.warehouseCapacity}`,
      badgeColor: warehouseCount >= state.warehouseCapacity ? 'bg-red-950/60 text-red-400 border-red-900/50' : 'bg-[#1a1a1a] text-neutral-400 border-[#333333]'
    },
    {
      id: 'auctions',
      label: 'Аукционы',
      icon: Gavel,
      badge: activeAuctionsCount > 0 ? `${activeAuctionsCount}` : null,
      badgeColor: 'bg-amber-950/60 text-amber-400 border-amber-900/50'
    },
    {
      id: 'business',
      label: 'Бизнес',
      icon: Building2,
      badge: null
    },
    {
      id: 'skills',
      label: 'Навыки',
      icon: Sparkles,
      badge: null
    },
    {
      id: 'stats',
      label: 'Аналитика',
      icon: BarChart3,
      badge: null
    },
    {
      id: 'achievements',
      label: 'Достижения',
      icon: Award,
      badge: unclaimedAchievements > 0 ? `${unclaimedAchievements}` : null,
      badgeColor: 'bg-purple-950/60 text-purple-400 border-purple-900/50'
    },
    {
      id: 'settings',
      label: 'Настройки',
      icon: Settings,
      badge: null
    }
  ];

  const handleSelect = (id: string) => {
    setActiveTab(id);
    setMobileNavOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileNavOpen && (
        <div
          id="mobile-backdrop"
          onClick={() => setMobileNavOpen(false)}
          className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-xs"
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="main-sidebar-navigation"
        className={`fixed md:sticky top-0 md:top-[53px] left-0 h-full md:h-[calc(100vh-53px-32px)] w-60 bg-[#111111] border-r border-[#222222] z-50 md:z-30 flex flex-col justify-between py-4 px-3 select-none transition-transform duration-200 ${
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-3 overflow-y-auto">
          {/* Mobile Header in Drawer */}
          <div className="flex items-center justify-between px-2 pb-2 md:hidden border-b border-[#222222]">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              FLIPPER.OS НАВИГАЦИЯ
            </span>
            <button
              type="button"
              onClick={() => setMobileNavOpen(false)}
              className="p-1 rounded text-neutral-400 hover:text-white"
              aria-label="Закрыть меню"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1" id="sidebar-nav-list">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  type="button"
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-500/10 text-white border border-blue-500/40 shadow-xs'
                      : 'text-neutral-400 hover:bg-[#161616] hover:text-white border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-blue-400' : 'text-neutral-500'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[9px] font-mono-num font-bold uppercase px-1.5 py-0.5 rounded border ${
                        item.badgeColor || 'bg-[#1a1a1a] text-neutral-400 border-[#333333]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Bento Mini Status */}
        <div className="pt-3 border-t border-[#222222] space-y-2">
          <div className="p-3 rounded-lg bg-[#161616] border border-[#262626] text-[11px] text-neutral-400 space-y-1.5">
            <div className="flex items-center justify-between text-neutral-300 text-[10px] uppercase tracking-wider font-semibold">
              <span>Лимит сделок</span>
              <span className="font-mono-num text-white">
                {state.warehouse.filter(w => w.isListed).length} / {state.maxActiveListings + (state.businesses.find(b => b.id === 'branch_store')?.level || 0) * 3}
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#222222] rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all"
                style={{
                  width: `${Math.min(
                    100,
                    (state.warehouse.filter(w => w.isListed).length /
                      (state.maxActiveListings + (state.businesses.find(b => b.id === 'branch_store')?.level || 0) * 3)) *
                      100
                  )}%`
                }}
              />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

