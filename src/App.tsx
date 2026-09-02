import React, { useState, useEffect } from 'react';
import { GameProvider, useGame, RANK_NAMES } from './context/GameContext';
import { MarketListing, WarehouseItem } from './types';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { NotificationToastContainer } from './components/common/NotificationToast';

import { OverviewView } from './components/views/OverviewView';
import { MarketView } from './components/views/MarketView';
import { WarehouseView } from './components/views/WarehouseView';
import { DealsView } from './components/views/DealsView';
import { AuctionsView } from './components/views/AuctionsView';
import { BusinessView } from './components/views/BusinessView';
import { SkillsView } from './components/views/SkillsView';
import { StatsView } from './components/views/StatsView';
import { AchievementsView } from './components/views/AchievementsView';
import { SettingsView } from './components/views/SettingsView';
import { ErrorBoundary } from './components/common/ErrorBoundary';

import { ListingDetailModal } from './components/modals/ListingDetailModal';
import { NegotiationModal } from './components/modals/NegotiationModal';
import { RepairModal } from './components/modals/RepairModal';
import { SellListingModal } from './components/modals/SellListingModal';
import { PurchaseCelebrationModal, PurchaseCelebrationData } from './components/modals/PurchaseCelebrationModal';

const GameAppContent: React.FC = () => {
  const { state, advanceDay } = useGame();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Modal states
  const [selectedListingForDetail, setSelectedListingForDetail] = useState<MarketListing | null>(null);
  const [selectedListingForNegotiate, setSelectedListingForNegotiate] = useState<MarketListing | null>(null);
  const [selectedItemForRepair, setSelectedItemForRepair] = useState<WarehouseItem | null>(null);
  const [selectedItemForSell, setSelectedItemForSell] = useState<WarehouseItem | null>(null);
  const [celebrationData, setCelebrationData] = useState<PurchaseCelebrationData | null>(null);

  // Global Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in inputs
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.key === 'd' || e.key === 'D' || e.key === 'в' || e.key === 'В') {
        e.preventDefault();
        advanceDay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [advanceDay]);

  const rankLabel = RANK_NAMES[state.level] || 'Новичок';

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-200 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <Header
        mobileNavOpen={mobileNavOpen}
        setMobileNavOpen={setMobileNavOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main App Body with Bento Grid Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          mobileNavOpen={mobileNavOpen}
          setMobileNavOpen={setMobileNavOpen}
        />

        {/* Bento Content Area */}
        <main
          id="main-app-content-viewport"
          className="flex-1 min-w-0 p-3 sm:p-5 lg:p-6 overflow-y-auto"
        >
          <ErrorBoundary key={activeTab} fallbackTab={setActiveTab}>
            {activeTab === 'overview' && (
              <OverviewView
                onOpenListing={(listing) => setSelectedListingForDetail(listing)}
                onOpenNegotiation={(listing) => setSelectedListingForNegotiate(listing)}
                setActiveTab={setActiveTab}
                onPurchaseSuccess={(data) => setCelebrationData(data)}
              />
            )}

            {activeTab === 'market' && (
              <MarketView
                onOpenListing={(listing) => setSelectedListingForDetail(listing)}
                onOpenNegotiation={(listing) => setSelectedListingForNegotiate(listing)}
                onPurchaseSuccess={(data) => setCelebrationData(data)}
              />
            )}

            {activeTab === 'warehouse' && (
              <WarehouseView
                onOpenRepair={(item) => setSelectedItemForRepair(item)}
                onOpenSell={(item) => setSelectedItemForSell(item)}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'deals' && (
              <DealsView
                onOpenSellModal={(item) => setSelectedItemForSell(item)}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'auctions' && <AuctionsView />}

            {activeTab === 'business' && <BusinessView />}

            {activeTab === 'skills' && <SkillsView />}

            {activeTab === 'stats' && <StatsView />}

            {activeTab === 'achievements' && <AchievementsView />}

            {activeTab === 'settings' && <SettingsView />}
          </ErrorBoundary>
        </main>
      </div>

      {/* Bento Grid OS Footer Bar */}
      <footer className="h-8 bg-[#111111] border-t border-[#222222] px-4 sm:px-6 flex items-center justify-between text-[10px] uppercase tracking-wider text-neutral-500 shrink-0 z-20">
        <div className="flex items-center gap-4">
          <span>Режим: <span className="text-white font-medium">BENTO.FLIPPER</span></span>
          <span className="hidden sm:inline">Регион: <span className="text-white font-medium">Москва MSK</span></span>
          <span>Игровой день: <span className="text-blue-400 font-mono-num font-medium">#{state.day}</span></span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden md:inline">Уровень: <span className="text-white font-medium">{rankLabel} ({state.level})</span></span>
          <span>Склад: <span className="text-blue-400 font-mono-num font-medium">{state.warehouse.length}/{state.warehouseCapacity}</span></span>
          <span>Статус: <span className="text-emerald-400 font-medium">ONLINE</span></span>
        </div>
      </footer>

      {/* Modals */}
      <ListingDetailModal
        listing={selectedListingForDetail}
        onClose={() => setSelectedListingForDetail(null)}
        onOpenNegotiation={(listing) => setSelectedListingForNegotiate(listing)}
        onPurchaseSuccess={(data) => setCelebrationData(data)}
      />

      <NegotiationModal
        listing={selectedListingForNegotiate}
        onClose={() => setSelectedListingForNegotiate(null)}
        onPurchaseSuccess={(data) => setCelebrationData(data)}
      />

      <RepairModal
        item={selectedItemForRepair}
        onClose={() => setSelectedItemForRepair(null)}
      />

      <SellListingModal
        item={selectedItemForSell}
        onClose={() => setSelectedItemForSell(null)}
      />

      {/* Purchase Celebration Modal */}
      <PurchaseCelebrationModal
        data={celebrationData}
        onClose={() => setCelebrationData(null)}
        onGoToWarehouse={() => {
          setCelebrationData(null);
          setActiveTab('warehouse');
        }}
      />

      {/* Visual notifications container */}
      <NotificationToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <GameProvider>
      <GameAppContent />
    </GameProvider>
  );
}
