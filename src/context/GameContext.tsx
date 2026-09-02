import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  GameState,
  MarketListing,
  WarehouseItem,
  DealRecord,
  BuyerOffer,
  AuctionItem,
  BusinessBranch,
  Skill,
  Achievement,
  MarketEvent,
  NotificationToast,
  DefectType,
  ItemCategory
} from '../types';
import {
  generateInitialListings,
  generateMarketListing,
  generateAuction,
  generateBuyerOffer,
  initializeCategoryTrends,
  getRandomElement,
  getRandomInt
} from '../utils/generators';
import { BUSINESS_BRANCHES } from '../data/businessCatalog';
import { SKILLS_CATALOG } from '../data/skillsCatalog';
import { ACHIEVEMENTS_CATALOG } from '../data/achievementsCatalog';
import { RANDOM_EVENTS } from '../data/eventsCatalog';
import { DEFECTS_CATALOG } from '../data/defectsCatalog';

const SAVE_KEY = 're_seller_game_state_v1';

export const RANK_NAMES: Record<number, string> = {
  1: 'Новичок',
  2: 'Перекуп',
  3: 'Профессионал',
  4: 'Эксперт',
  5: 'Магнат',
  6: 'Автоперекуп'
};

export const XP_THRESHOLDS: Record<number, number> = {
  1: 500,
  2: 1500,
  3: 4000,
  4: 10000,
  5: 25000,
  6: 999999
};

const INITIAL_STATE: GameState = {
  balance: 45000,
  day: 1,
  level: 1,
  xp: 0,
  maxXp: 500,
  reputation: 60,
  totalTurnover: 0,
  totalProfit: 0,
  totalDeals: 0,
  successfulNegotiations: 0,
  failedNegotiations: 0,
  bestDealProfit: 0,
  worstDealProfit: 0,
  listings: [],
  warehouse: [],
  deals: [],
  incomingOffers: [],
  auctions: [],
  businesses: BUSINESS_BRANCHES,
  skills: SKILLS_CATALOG,
  achievements: ACHIEVEMENTS_CATALOG,
  activeEvents: [],
  categoryTrends: initializeCategoryTrends(),
  warehouseCapacity: 8,
  maxActiveListings: 4,
  lastProfitToday: 0,
  notifications: []
};

interface GameContextType {
  state: GameState;
  buyListing: (listingId: string) => { success: boolean; message: string };
  inspectListing: (listingId: string, level: 'quick' | 'basic' | 'full') => { success: boolean; message: string };
  negotiate: (listingId: string, proposedPrice: number) => { success: boolean; message: string; counterOffer?: number; walkedOut?: boolean };
  repairItem: (warehouseItemId: string, defectType: DefectType) => { success: boolean; message: string };
  listItemForSale: (warehouseItemId: string, price: number, promo: 'standard' | 'boost' | 'urgent') => { success: boolean; message: string };
  unlistItem: (warehouseItemId: string) => void;
  acceptBuyerOffer: (offerId: string) => { success: boolean; message: string; profit: number };
  rejectBuyerOffer: (offerId: string) => void;
  counterBuyerOffer: (offerId: string, counterPrice: number) => { success: boolean; message: string; accepted: boolean };
  bidOnAuction: (auctionId: string, bidAmount: number) => { success: boolean; message: string };
  placeAuctionBid: (auctionId: string, bidAmount: number) => { success: boolean; message: string };
  upgradeBusiness: (branchId: string) => { success: boolean; message: string };
  upgradeSkill: (skillId: string) => { success: boolean; message: string };
  claimAchievement: (achId: string) => void;
  claimAchievementReward: (achId: string) => void;
  advanceDay: () => void;
  resetGame: () => void;
  exportSave: () => string;
  importSave: (jsonStr: string) => boolean;
  dismissNotification: (id: string) => void;
  addNotification: (title: string, message: string, type: 'info' | 'success' | 'warning' | 'alert') => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GameState>(() => {
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure migrations / defaults
        if (parsed.balance !== undefined) {
          if (!parsed.deals && parsed.dealHistory) {
            parsed.deals = parsed.dealHistory;
          }
          if (!Array.isArray(parsed.deals)) {
            parsed.deals = [];
          }
          if (!Array.isArray(parsed.auctions)) {
            parsed.auctions = [];
          }
          if (!Array.isArray(parsed.incomingOffers)) {
            parsed.incomingOffers = [];
          }
          if (!Array.isArray(parsed.warehouse)) {
            parsed.warehouse = [];
          }
          if (!Array.isArray(parsed.listings)) {
            parsed.listings = generateInitialListings(9, parsed.day || 1, parsed.level || 1);
          }
          parsed.dealHistory = parsed.deals;
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load saved state', e);
    }
    const initialListings = generateInitialListings(9, 1, 1);
    const initialAuctions = [generateAuction(1, 1), generateAuction(1, 1)];
    return {
      ...INITIAL_STATE,
      listings: initialListings,
      auctions: initialAuctions,
      dealHistory: []
    };
  });

  // Auto-save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Save error', e);
    }
  }, [state]);

  const addNotification = useCallback((
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'alert' = 'info'
  ) => {
    const newNotif: NotificationToast = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title,
      message,
      type,
      timestamp: Date.now()
    };
    setState(prev => ({
      ...prev,
      notifications: [newNotif, ...prev.notifications.slice(0, 4)]
    }));
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.filter(n => n.id !== id)
    }));
  }, []);

  // Helper to add XP and check level ups
  const addXp = useCallback((amount: number) => {
    setState(prev => {
      let newXp = prev.xp + amount;
      let newLevel = prev.level;
      let maxXp = prev.maxXp;

      while (newXp >= maxXp && newLevel < 6) {
        newXp -= maxXp;
        newLevel += 1;
        maxXp = XP_THRESHOLDS[newLevel] || 999999;
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        maxXp
      };
    });
  }, []);

  // Buy listing from Market
  const buyListing = useCallback((listingId: string) => {
    let result = { success: false, message: '' };

    setState(prev => {
      const listing = prev.listings.find(l => l.id === listingId);
      if (!listing) {
        result = { success: false, message: 'Объявление уже снято с публикации или продано.' };
        return prev;
      }

      if (prev.warehouse.length >= prev.warehouseCapacity) {
        result = { success: false, message: `Склад переполнен (максимум ${prev.warehouseCapacity} товаров). Расширьте склад в разделе Бизнес.` };
        return prev;
      }

      if (prev.balance < listing.askingPrice) {
        result = { success: false, message: `Недостаточно средств. Необходимо: ${listing.askingPrice.toLocaleString('ru-RU')} ₽` };
        return prev;
      }

      // Check if defects become known (if inspected, they are already known, else discovered upon arrival)
      const knownDefects = [...listing.hiddenDefects];

      const newWarehouseItem: WarehouseItem = {
        id: `wh_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        title: listing.title,
        category: listing.category,
        categoryLabel: listing.categoryLabel,
        imageUrl: listing.imageUrl,
        boughtPrice: listing.askingPrice,
        originalAskingPrice: listing.askingPrice,
        marketPriceAtBuy: listing.marketAveragePrice,
        currentMarketPrice: listing.marketAveragePrice,
        condition: listing.trueCondition,
        knownDefects,
        fixedDefects: [],
        repairCostSpent: 0,
        boughtAtDay: prev.day,
        daysHeld: 0,
        isListed: false
      };

      // Achievement progress check
      const isRare = listing.category === 'collectibles';
      const isCar = listing.category === 'cars';

      const updatedAchievements = prev.achievements.map(ach => {
        if (ach.id === 'ach_rare_hunter' && isRare && !ach.isUnlocked) {
          return { ...ach, isUnlocked: true, progress: 1 };
        }
        return ach;
      });

      result = {
        success: true,
        message: `Товар «${listing.title}» куплен за ${listing.askingPrice.toLocaleString('ru-RU')} ₽ и доставлен на склад.`
      };

      return {
        ...prev,
        balance: prev.balance - listing.askingPrice,
        totalTurnover: prev.totalTurnover + listing.askingPrice,
        warehouse: [newWarehouseItem, ...prev.warehouse],
        listings: prev.listings.filter(l => l.id !== listingId),
        achievements: updatedAchievements
      };
    });

    if (result.success) {
      addNotification('Сделка совершена', result.message, 'success');
      addXp(40);
    } else {
      addNotification('Ошибка покупки', result.message, 'alert');
    }

    return result;
  }, [addNotification, addXp]);

  // Inspection
  const inspectListing = useCallback((listingId: string, level: 'quick' | 'basic' | 'full') => {
    let result = { success: false, message: '' };

    setState(prev => {
      const listing = prev.listings.find(l => l.id === listingId);
      if (!listing) {
        result = { success: false, message: 'Объявление не найдено.' };
        return prev;
      }

      // Skill & Workshop discounts
      const workshopLevel = prev.businesses.find(b => b.id === 'branch_workshop')?.level || 0;
      const diagSkill = prev.skills.find(s => s.id === 'skill_fast_diagnostics')?.level || 0;

      let cost = 0;
      if (level === 'basic') cost = Math.max(500, Math.round(listing.marketAveragePrice * 0.015));
      if (level === 'full') cost = Math.max(1200, Math.round(listing.marketAveragePrice * 0.035));

      if (workshopLevel > 0 && level === 'quick') cost = 0;
      if (diagSkill > 0) cost = Math.round(cost * (1 - diagSkill * 0.1));

      if (prev.balance < cost) {
        result = { success: false, message: `Недостаточно денег для диагностики (${cost.toLocaleString('ru-RU')} ₽)` };
        return prev;
      }

      let revealedDefects = '';
      if (listing.hiddenDefects.length === 0) {
        revealedDefects = 'Скрытых дефектов не обнаружено. Товар в отличном техническом состоянии.';
      } else {
        const defectsNames = listing.hiddenDefects.map(d => DEFECTS_CATALOG[d]?.name || d).join(', ');
        revealedDefects = `Выявлены дефекты: ${defectsNames}.`;
      }

      const updatedListings = prev.listings.map(l => {
        if (l.id === listingId) {
          return {
            ...l,
            isInspected: true,
            inspectionLevel: level,
            publicCondition: l.trueCondition
          };
        }
        return l;
      });

      result = {
        success: true,
        message: `Диагностика проведена (${level === 'quick' ? 'Быстрая' : level === 'basic' ? 'Базовая' : 'Полная'}). ${revealedDefects}`
      };

      return {
        ...prev,
        balance: prev.balance - cost,
        listings: updatedListings
      };
    });

    if (result.success) {
      addNotification('Диагностика завершена', result.message, 'info');
      addXp(15);
    }
    return result;
  }, [addNotification, addXp]);

  // Bargaining / Negotiation
  const negotiate = useCallback((listingId: string, proposedPrice: number) => {
    let result = {
      success: false,
      message: '',
      counterOffer: undefined as number | undefined,
      walkedOut: false
    };

    setState(prev => {
      const listing = prev.listings.find(l => l.id === listingId);
      if (!listing) {
        result = { success: false, message: 'Объявление не найдено.', counterOffer: undefined, walkedOut: true };
        return prev;
      }

      const seller = { ...listing.seller };
      if (seller.hasWalkedOut) {
        result = { success: false, message: 'Продавец отказался от переговоров и ушел.', counterOffer: undefined, walkedOut: true };
        return prev;
      }

      // Haggling skill bonus
      const hagglingSkill = prev.skills.find(s => s.id === 'skill_haggling')?.level || 0;
      const skillDiscountBonus = hagglingSkill * 0.03; // +3% per skill level

      const originalPrice = listing.askingPrice;
      const lowestAccept = Math.round(seller.lowestAcceptPrice * (1 - skillDiscountBonus));
      const discountPct = (originalPrice - proposedPrice) / originalPrice;

      let dialogueResponse = '';
      let newPrice = listing.askingPrice;
      let counterOffer: number | undefined = undefined;
      let isSuccess = false;
      let walkedOut = false;

      // Seller evaluation
      if (proposedPrice >= originalPrice) {
        dialogueResponse = 'Отлично, по рукам! Забирайте по указанной цене.';
        newPrice = proposedPrice;
        isSuccess = true;
      } else if (proposedPrice >= lowestAccept) {
        // Seller agrees!
        dialogueResponse = `Хорошо, уговорили. Сделаю скидку до ${proposedPrice.toLocaleString('ru-RU')} ₽, так как нужно решить вопрос быстрее.`;
        newPrice = proposedPrice;
        isSuccess = true;
        seller.patience = Math.max(10, seller.patience - 15);
      } else {
        // Proposed price is below lowest threshold
        const patienceLoss = Math.round(discountPct * 60);
        seller.patience -= patienceLoss;

        if (seller.patience <= 0 || seller.personality === 'stubborn' && Math.random() < 0.35) {
          // Walk out
          walkedOut = true;
          seller.hasWalkedOut = true;
          dialogueResponse = 'Вы предлагаете смешные деньги. Никакого торга не будет, объявление закрыто!';
        } else {
          // Counter-offer midway between current asking and proposed
          counterOffer = Math.round((listing.askingPrice + Math.max(lowestAccept, proposedPrice)) / 2 / 100) * 100;
          newPrice = counterOffer;
          dialogueResponse = `Слишком мало. Меньше чем за ${counterOffer.toLocaleString('ru-RU')} ₽ не отдам. Это моё последнее слово.`;
        }
      }

      const updatedHistory = [
        ...seller.dialogueHistory,
        { sender: 'player' as const, text: `Предлагаю ${proposedPrice.toLocaleString('ru-RU')} ₽.`, offer: proposedPrice },
        { sender: 'seller' as const, text: dialogueResponse, offer: counterOffer }
      ];

      seller.dialogueHistory = updatedHistory;

      // Update listing
      const updatedListings = prev.listings.map(l => {
        if (l.id === listingId) {
          return {
            ...l,
            askingPrice: newPrice,
            estimatedProfit: Math.max(0, l.marketAveragePrice - newPrice),
            seller
          };
        }
        return l;
      });

      // Track achievements for heavy bargaining (>20% discount)
      const initialAsking = listing.seller.dialogueHistory[0]?.offer || listing.askingPrice;
      const totalDiscount = (initialAsking - newPrice) / initialAsking;
      const updatedAchievements = prev.achievements.map(ach => {
        if (ach.id === 'ach_master_haggler' && totalDiscount >= 0.2 && isSuccess && !ach.isUnlocked) {
          return { ...ach, isUnlocked: true, progress: 1 };
        }
        return ach;
      });

      result = {
        success: isSuccess,
        message: dialogueResponse,
        counterOffer,
        walkedOut
      };

      return {
        ...prev,
        successfulNegotiations: isSuccess ? prev.successfulNegotiations + 1 : prev.successfulNegotiations,
        failedNegotiations: walkedOut ? prev.failedNegotiations + 1 : prev.failedNegotiations,
        listings: updatedListings,
        achievements: updatedAchievements
      };
    });

    if (result.success) {
      addNotification('Торг успешен', result.message, 'success');
      addXp(30);
    } else if (result.walkedOut) {
      addNotification('Срыв переговоров', result.message, 'alert');
    } else {
      addNotification('Ответ продавца', result.message, 'info');
    }

    return result;
  }, [addNotification, addXp]);

  // Repair item in Warehouse
  const repairItem = useCallback((warehouseItemId: string, defectType: DefectType) => {
    let result = { success: false, message: '' };

    setState(prev => {
      const item = prev.warehouse.find(w => w.id === warehouseItemId);
      if (!item) {
        result = { success: false, message: 'Товар не найден на складе.' };
        return prev;
      }

      const defect = DEFECTS_CATALOG[defectType];
      if (!defect) {
        result = { success: false, message: 'Неизвестный тип дефекта.' };
        return prev;
      }

      // Workshop & Skill discounts
      const workshopLevel = prev.businesses.find(b => b.id === 'branch_workshop')?.level || 0;
      const repairSkill = prev.skills.find(s => s.id === 'skill_diy_repair')?.level || 0;
      const discountPct = Math.min(0.5, workshopLevel * 0.06 + repairSkill * 0.08);

      const actualCost = Math.round(defect.repairCost * (1 - discountPct));

      if (prev.balance < actualCost) {
        result = { success: false, message: `Недостаточно средств на ремонт (${actualCost.toLocaleString('ru-RU')} ₽)` };
        return prev;
      }

      const remainingDefects = item.knownDefects.filter(d => d !== defectType);
      const fixedDefects = [...item.fixedDefects, defectType];

      // Value increase
      const valueRestored = Math.round(item.currentMarketPrice * (defect.valuePenaltyPct / 100));
      const newMarketPrice = item.currentMarketPrice + valueRestored;

      let newCondition = item.condition;
      if (remainingDefects.length === 0) {
        newCondition = 'ideal';
      } else if (!remainingDefects.some(d => d === 'screen_broken' || d === 'engine_knock')) {
        newCondition = 'good';
      }

      const updatedWarehouse = prev.warehouse.map(w => {
        if (w.id === warehouseItemId) {
          return {
            ...w,
            condition: newCondition,
            knownDefects: remainingDefects,
            fixedDefects,
            repairCostSpent: w.repairCostSpent + actualCost,
            currentMarketPrice: newMarketPrice
          };
        }
        return w;
      });

      // Achievement progress
      const totalRepairsMade = fixedDefects.length;
      const updatedAchievements = prev.achievements.map(ach => {
        if (ach.id === 'ach_repair_guru') {
          const newProg = ach.progress + 1;
          return {
            ...ach,
            progress: newProg,
            isUnlocked: newProg >= ach.maxProgress ? true : ach.isUnlocked
          };
        }
        return ach;
      });

      result = {
        success: true,
        message: `Дефект «${defect.name}» успешно устранен за ${actualCost.toLocaleString('ru-RU')} ₽. Рыночная цена выросла на +${valueRestored.toLocaleString('ru-RU')} ₽.`
      };

      return {
        ...prev,
        balance: prev.balance - actualCost,
        warehouse: updatedWarehouse,
        achievements: updatedAchievements
      };
    });

    if (result.success) {
      addNotification('Ремонт завершен', result.message, 'success');
      addXp(50);
    }
    return result;
  }, [addNotification, addXp]);

  // List warehouse item for sale
  const listItemForSale = useCallback((warehouseItemId: string, price: number, promo: 'standard' | 'boost' | 'urgent') => {
    let result = { success: false, message: '' };

    setState(prev => {
      const activeListingsCount = prev.warehouse.filter(w => w.isListed).length;
      const storeLevel = prev.businesses.find(b => b.id === 'branch_store')?.level || 0;
      const maxSlots = prev.maxActiveListings + storeLevel * 3;

      if (activeListingsCount >= maxSlots) {
        result = { success: false, message: `Достигнут лимит активных объявлений (${maxSlots} шт). Прокачайте розничный шоурум.` };
        return prev;
      }

      let promoCost = 0;
      if (promo === 'boost') promoCost = Math.round(price * 0.015);
      if (promo === 'urgent') promoCost = Math.round(price * 0.035);

      if (prev.balance < promoCost) {
        result = { success: false, message: `Недостаточно средств на продвижение (${promoCost.toLocaleString('ru-RU')} ₽)` };
        return prev;
      }

      const updatedWarehouse = prev.warehouse.map(w => {
        if (w.id === warehouseItemId) {
          return {
            ...w,
            isListed: true,
            listedPrice: price,
            promoLevel: promo,
            viewsCount: 0,
            potentialProfit: price - (w.boughtPrice + w.repairCostSpent)
          };
        }
        return w;
      });

      result = {
        success: true,
        message: `Товар выставлен на продажу за ${price.toLocaleString('ru-RU')} ₽.`
      };

      return {
        ...prev,
        balance: prev.balance - promoCost,
        warehouse: updatedWarehouse
      };
    });

    if (result.success) {
      addNotification('Объявление опубликовано', result.message, 'info');
    }
    return result;
  }, [addNotification]);

  // Unlist warehouse item
  const unlistItem = useCallback((warehouseItemId: string) => {
    setState(prev => ({
      ...prev,
      warehouse: prev.warehouse.map(w => w.id === warehouseItemId ? { ...w, isListed: false, listedPrice: undefined } : w),
      incomingOffers: prev.incomingOffers.filter(o => o.warehouseItemId !== warehouseItemId)
    }));
    addNotification('Снято с продажи', 'Товар возвращен на склад.', 'info');
  }, [addNotification]);

  // Accept buyer offer
  const acceptBuyerOffer = useCallback((offerId: string) => {
    let result = { success: false, message: '', profit: 0 };

    setState(prev => {
      const offer = prev.incomingOffers.find(o => o.id === offerId);
      if (!offer) {
        result = { success: false, message: 'Предложение устарело или отозвано покупателем.', profit: 0 };
        return prev;
      }

      const item = prev.warehouse.find(w => w.id === offer.warehouseItemId);
      if (!item) {
        result = { success: false, message: 'Товар больше не числится на складе.', profit: 0 };
        return prev;
      }

      const totalSpent = item.boughtPrice + item.repairCostSpent;
      const profit = offer.offeredPrice - totalSpent;
      const profitMarginPct = totalSpent > 0 ? Math.round((profit / totalSpent) * 100) : 0;

      const dealRecord: DealRecord = {
        id: `deal_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        itemTitle: item.title,
        category: item.category,
        categoryLabel: item.categoryLabel,
        imageUrl: item.imageUrl,
        boughtPrice: item.boughtPrice,
        repairSpent: item.repairCostSpent,
        soldPrice: offer.offeredPrice,
        netProfit: profit,
        profitMarginPct,
        daysHeld: item.daysHeld,
        buyerName: offer.buyerName,
        buyerType: offer.buyerTypeLabel,
        soldAtDay: prev.day
      };

      const newTotalTurnover = prev.totalTurnover + offer.offeredPrice;
      const newTotalProfit = prev.totalProfit + profit;
      const newTotalDeals = prev.totalDeals + 1;

      // Achievements updates
      const updatedAchievements = prev.achievements.map(ach => {
        if (ach.id === 'ach_first_deal' && !ach.isUnlocked) {
          return { ...ach, isUnlocked: true, progress: 1 };
        }
        if (ach.id === 'ach_ten_deals') {
          const prog = Math.min(ach.maxProgress, newTotalDeals);
          return { ...ach, progress: prog, isUnlocked: prog >= ach.maxProgress ? true : ach.isUnlocked };
        }
        if (ach.id === 'ach_millionaire') {
          const prog = Math.min(ach.maxProgress, newTotalTurnover);
          return { ...ach, progress: prog, isUnlocked: prog >= ach.maxProgress ? true : ach.isUnlocked };
        }
        if (ach.id === 'ach_car_magnate' && item.category === 'cars' && profit > 0 && !ach.isUnlocked) {
          return { ...ach, isUnlocked: true, progress: 1 };
        }
        return ach;
      });

      result = {
        success: true,
        message: `Товар «${item.title}» продан за ${offer.offeredPrice.toLocaleString('ru-RU')} ₽. Чистая прибыль: ${profit >= 0 ? '+' : ''}${profit.toLocaleString('ru-RU')} ₽ (${profitMarginPct}%).`,
        profit
      };

      return {
        ...prev,
        balance: prev.balance + offer.offeredPrice,
        totalTurnover: newTotalTurnover,
        totalProfit: newTotalProfit,
        totalDeals: newTotalDeals,
        bestDealProfit: Math.max(prev.bestDealProfit, profit),
        worstDealProfit: prev.worstDealProfit === 0 ? profit : Math.min(prev.worstDealProfit, profit),
        lastProfitToday: prev.lastProfitToday + profit,
        warehouse: prev.warehouse.filter(w => w.id !== item.id),
        incomingOffers: prev.incomingOffers.filter(o => o.warehouseItemId !== item.id),
        deals: [dealRecord, ...prev.deals],
        achievements: updatedAchievements
      };
    });

    if (result.success) {
      addNotification('Сделка закрыта', result.message, 'success');
      addXp(Math.max(50, Math.round(result.profit / 200)));
    }
    return result;
  }, [addNotification, addXp]);

  // Reject buyer offer
  const rejectBuyerOffer = useCallback((offerId: string) => {
    setState(prev => ({
      ...prev,
      incomingOffers: prev.incomingOffers.filter(o => o.id !== offerId)
    }));
    addNotification('Предложение отклонено', 'Покупатель уведомлен об отказе.', 'info');
  }, [addNotification]);

  // Counter buyer offer
  const counterBuyerOffer = useCallback((offerId: string, counterPrice: number) => {
    let result = { success: false, message: '', accepted: false };

    setState(prev => {
      const offer = prev.incomingOffers.find(o => o.id === offerId);
      if (!offer) {
        result = { success: false, message: 'Предложение не найдено.', accepted: false };
        return prev;
      }

      const item = prev.warehouse.find(w => w.id === offer.warehouseItemId);
      if (!item) {
        result = { success: false, message: 'Товар не найден.', accepted: false };
        return prev;
      }

      // Acceptance probability based on buyer personality
      const hagglingSkill = prev.skills.find(s => s.id === 'skill_haggling')?.level || 0;
      let acceptChance = 0.5 + hagglingSkill * 0.08;

      if (offer.buyerType === 'rookie' || offer.buyerType === 'fast') acceptChance = 0.8;
      if (offer.buyerType === 'reseller' || offer.buyerType === 'expert') acceptChance = 0.3;

      const isAccepted = Math.random() < acceptChance && counterPrice <= offer.listedPrice;

      if (isAccepted) {
        // Updated offer
        const updatedOffers = prev.incomingOffers.map(o => {
          if (o.id === offerId) {
            return {
              ...o,
              offeredPrice: counterPrice,
              message: `Договорились! Забираю за ${counterPrice.toLocaleString('ru-RU')} ₽.`
            };
          }
          return o;
        });

        result = {
          success: true,
          message: `Покупатель ${offer.buyerName} согласился на вашу цену ${counterPrice.toLocaleString('ru-RU')} ₽!`,
          accepted: true
        };

        return {
          ...prev,
          incomingOffers: updatedOffers
        };
      } else {
        // Buyer rejects counter-offer and leaves
        result = {
          success: true,
          message: `Покупатель ${offer.buyerName} посчитал цену ${counterPrice.toLocaleString('ru-RU')} ₽ завышенной и отменил заявку.`,
          accepted: false
        };

        return {
          ...prev,
          incomingOffers: prev.incomingOffers.filter(o => o.id !== offerId)
        };
      }
    });

    if (result.accepted) {
      addNotification('Торг успешен', result.message, 'success');
      addXp(25);
    } else {
      addNotification('Отказ покупателя', result.message, 'alert');
    }

    return result;
  }, [addNotification, addXp]);

  // Bid on Auction
  const bidOnAuction = useCallback((auctionId: string, bidAmount: number) => {
    let result = { success: false, message: '' };

    setState(prev => {
      const auction = prev.auctions.find(a => a.id === auctionId);
      if (!auction || auction.isFinished) {
        result = { success: false, message: 'Аукцион уже завершен.' };
        return prev;
      }

      if (bidAmount <= auction.currentBid) {
        result = { success: false, message: `Ставка должна быть выше текущей (${auction.currentBid.toLocaleString('ru-RU')} ₽)` };
        return prev;
      }

      if (prev.balance < bidAmount) {
        result = { success: false, message: `Недостаточно средств для ставки (${bidAmount.toLocaleString('ru-RU')} ₽)` };
        return prev;
      }

      const updatedAuctions = prev.auctions.map(a => {
        if (a.id === auctionId) {
          return {
            ...a,
            currentBid: bidAmount,
            highestBidder: 'Вы (Игрок)',
            isPlayerWinning: true,
            endTimerSeconds: Math.max(15, a.endTimerSeconds + 5) // Extend timer on late bid
          };
        }
        return a;
      });

      result = {
        success: true,
        message: `Ваша ставка ${bidAmount.toLocaleString('ru-RU')} ₽ принята! Вы лидируете в аукционе.`
      };

      return {
        ...prev,
        auctions: updatedAuctions
      };
    });

    if (result.success) {
      addNotification('Ставка принята', result.message, 'info');
    }
    return result;
  }, [addNotification]);

  // Upgrade Business Branch
  const upgradeBusiness = useCallback((branchId: string) => {
    let result = { success: false, message: '' };

    setState(prev => {
      const branch = prev.businesses.find(b => b.id === branchId);
      if (!branch) {
        result = { success: false, message: 'Направление бизнеса не найдено.' };
        return prev;
      }

      if (prev.level < branch.minPlayerLevel) {
        result = { success: false, message: `Требуется уровень игрока ${branch.minPlayerLevel} (${RANK_NAMES[branch.minPlayerLevel]}).` };
        return prev;
      }

      const cost = Math.round(branch.cost * Math.pow(1.5, branch.level));
      if (prev.balance < cost) {
        result = { success: false, message: `Недостаточно средств (${cost.toLocaleString('ru-RU')} ₽).` };
        return prev;
      }

      if (branch.level >= branch.maxLevel) {
        result = { success: false, message: 'Достигнут максимальный уровень улучшения.' };
        return prev;
      }

      const newLevel = branch.level + 1;
      let newCapacity = prev.warehouseCapacity;
      if (branch.id === 'branch_warehouse') newCapacity += 10;

      const updatedBusinesses = prev.businesses.map(b => {
        if (b.id === branchId) {
          return {
            ...b,
            level: newLevel,
            isUnlocked: true
          };
        }
        return b;
      });

      result = {
        success: true,
        message: `«${branch.title}» улучшен до уровня ${newLevel}!`
      };

      return {
        ...prev,
        balance: prev.balance - cost,
        warehouseCapacity: newCapacity,
        businesses: updatedBusinesses
      };
    });

    if (result.success) {
      addNotification('Бизнес масштабирован', result.message, 'success');
      addXp(120);
    }
    return result;
  }, [addNotification, addXp]);

  // Upgrade Skill
  const upgradeSkill = useCallback((skillId: string) => {
    let result = { success: false, message: '' };

    setState(prev => {
      const skill = prev.skills.find(s => s.id === skillId);
      if (!skill) {
        result = { success: false, message: 'Навык не найден.' };
        return prev;
      }

      if (skill.level >= skill.maxLevel) {
        result = { success: false, message: 'Навык уже прокачан на максимум.' };
        return prev;
      }

      const cost = Math.round(skill.cost * Math.pow(1.4, skill.level));
      if (prev.balance < cost) {
        result = { success: false, message: `Недостаточно средств на обучение (${cost.toLocaleString('ru-RU')} ₽).` };
        return prev;
      }

      const newLevel = skill.level + 1;
      const updatedSkills = prev.skills.map(s => {
        if (s.id === skillId) {
          return { ...s, level: newLevel };
        }
        return s;
      });

      result = {
        success: true,
        message: `Навык «${skill.name}» повышен до ${newLevel} ур.!`
      };

      return {
        ...prev,
        balance: prev.balance - cost,
        skills: updatedSkills
      };
    });

    if (result.success) {
      addNotification('Навык изучен', result.message, 'success');
      addXp(80);
    }
    return result;
  }, [addNotification, addXp]);

  // Claim Achievement reward
  const claimAchievement = useCallback((achId: string) => {
    setState(prev => {
      const ach = prev.achievements.find(a => a.id === achId);
      if (!ach || !ach.isUnlocked) return prev;

      addNotification('Награда получена', `Бонус +${ach.rewardMoney.toLocaleString('ru-RU')} ₽ и +${ach.rewardXp} XP начислены.`, 'success');
      return {
        ...prev,
        balance: prev.balance + ach.rewardMoney,
        xp: prev.xp + ach.rewardXp
      };
    });
  }, [addNotification]);

  // Advance Day / Next Turn (Heartbeat of market simulation)
  const advanceDay = useCallback(() => {
    setState(prev => {
      const nextDay = prev.day + 1;

      // 1. Process active market events
      let currentEvents = prev.activeEvents.map(e => ({
        ...e,
        durationDays: e.durationDays - 1
      })).filter(e => e.durationDays > 0);

      // Random chance for new economic event
      if (Math.random() < 0.35 && currentEvents.length < 2) {
        const randEventTemplate = getRandomElement(RANDOM_EVENTS);
        const newEvent: MarketEvent = {
          id: `event_${Date.now()}`,
          title: randEventTemplate.title,
          category: randEventTemplate.category,
          multiplier: randEventTemplate.multiplier,
          demandShift: randEventTemplate.demandShift,
          durationDays: randEventTemplate.durationDays,
          startDay: nextDay,
          description: randEventTemplate.description
        };
        currentEvents.push(newEvent);
        addNotification('Экономическое событие', `${newEvent.title}: ${newEvent.description}`, 'warning');
      }

      // 2. Update Category Market Price Trends
      const updatedTrends = { ...prev.categoryTrends };
      Object.keys(updatedTrends).forEach(catKey => {
        const cat = catKey as ItemCategory;
        const trend = { ...updatedTrends[cat] };
        const eventOnCat = currentEvents.find(e => e.category === cat || e.category === 'all');
        const multiplier = eventOnCat ? eventOnCat.multiplier : (0.97 + Math.random() * 0.06);

        const newAvg = Math.round(trend.currentAvgPrice * multiplier / 100) * 100;
        const changePct = Number((((newAvg - trend.currentAvgPrice) / trend.currentAvgPrice) * 100).toFixed(1));

        trend.previousAvgPrice = trend.currentAvgPrice;
        trend.currentAvgPrice = newAvg;
        trend.changePct = changePct;
        trend.history = [...trend.history.slice(-6), { day: nextDay, price: newAvg }];
        updatedTrends[cat] = trend;
      });

      // 3. Update Warehouse Items (holding time, views, market pricing)
      const updatedWarehouse = prev.warehouse.map(item => {
        const catTrend = updatedTrends[item.category];
        const newCurrentPrice = catTrend ? Math.round(catTrend.currentAvgPrice * (item.condition === 'ideal' ? 1.05 : item.condition === 'good' ? 0.95 : 0.8)) : item.currentMarketPrice;
        return {
          ...item,
          daysHeld: item.daysHeld + 1,
          currentMarketPrice: newCurrentPrice,
          viewsCount: item.isListed ? (item.viewsCount || 0) + getRandomInt(4, 18) : item.viewsCount
        };
      });

      // 4. Competitor Bots snatching unbought high-yield market listings
      let updatedListings = prev.listings.map(listing => {
        // If hot deal not bought, NPC resellers snatch it
        const isSnatchChance = listing.isHotDeal ? 0.45 : 0.15;
        if (Math.random() < isSnatchChance && listing.expiresInDays <= 1) {
          return { ...listing, snatchedByCompetitor: true };
        }
        return { ...listing, expiresInDays: listing.expiresInDays - 1 };
      }).filter(l => l.expiresInDays > 0 && !l.snatchedByCompetitor);

      // Generate new listings
      const replenishCount = Math.max(3, 9 - updatedListings.length);
      for (let i = 0; i < replenishCount; i++) {
        const catMultiplier = 1.0;
        updatedListings.push(generateMarketListing(nextDay, prev.level, catMultiplier));
      }

      // 5. Generate Buyer Offers for Listed Warehouse Items
      const listedItems = updatedWarehouse.filter(w => w.isListed);
      const newOffers: BuyerOffer[] = [...prev.incomingOffers.filter(o => o.expiresInDays > 1).map(o => ({ ...o, expiresInDays: o.expiresInDays - 1 }))];

      const retailNetworkLevel = prev.businesses.find(b => b.id === 'branch_retail_network')?.level || 0;
      const marketingSkill = prev.skills.find(s => s.id === 'skill_marketing')?.level || 0;
      const offerRate = 0.5 + retailNetworkLevel * 0.2 + marketingSkill * 0.1;

      for (const item of listedItems) {
        if (Math.random() < offerRate && newOffers.filter(o => o.warehouseItemId === item.id).length < 2) {
          const generatedOffer = generateBuyerOffer(item, nextDay);
          if (generatedOffer) {
            newOffers.unshift(generatedOffer);
          }
        }
      }

      // 6. Auctions Resolution & Progress
      const resolvedAuctions: AuctionItem[] = [];
      let balanceChange = 0;
      const newWarehouseItemsFromAuction: WarehouseItem[] = [];

      for (const auc of prev.auctions) {
        if (!auc.isFinished) {
          if (auc.isPlayerWinning) {
            // Player won auction!
            if (prev.balance >= auc.currentBid) {
              balanceChange -= auc.currentBid;
              const newItem: WarehouseItem = {
                id: `wh_auc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
                title: auc.title,
                category: auc.category,
                categoryLabel: auc.categoryLabel,
                imageUrl: auc.imageUrl,
                boughtPrice: auc.currentBid,
                originalAskingPrice: auc.startingPrice,
                marketPriceAtBuy: auc.estimatedMarketPrice,
                currentMarketPrice: auc.estimatedMarketPrice,
                condition: auc.condition,
                knownDefects: [],
                fixedDefects: [],
                repairCostSpent: 0,
                boughtAtDay: nextDay,
                daysHeld: 0,
                isListed: false
              };
              newWarehouseItemsFromAuction.push(newItem);
              addNotification('Победа на аукционе!', `Вы выиграли лот «${auc.title}» за ${auc.currentBid.toLocaleString('ru-RU')} ₽!`, 'success');
            }
          }
        }
      }

      // Generate 1-2 new auctions if old finished
      const activeAuctions = [generateAuction(nextDay, prev.level), generateAuction(nextDay, prev.level)];

      return {
        ...prev,
        day: nextDay,
        balance: prev.balance + balanceChange,
        lastProfitToday: 0, // Reset today's profit counter for new day
        activeEvents: currentEvents,
        categoryTrends: updatedTrends,
        warehouse: [...newWarehouseItemsFromAuction, ...updatedWarehouse],
        listings: updatedListings,
        incomingOffers: newOffers.slice(0, 8),
        auctions: activeAuctions
      };
    });

    addNotification('Новый игровой день', 'Цены на рынке обновились. Проверьте новые объявления и отклики покупателей.', 'info');
  }, [addNotification]);

  // Reset Game
  const resetGame = useCallback(() => {
    localStorage.removeItem(SAVE_KEY);
    const initialListings = generateInitialListings(9, 1, 1);
    const initialAuctions = [generateAuction(1, 1), generateAuction(1, 1)];
    setState({
      ...INITIAL_STATE,
      listings: initialListings,
      auctions: initialAuctions
    });
    addNotification('Сброс прогресса', 'Игра перезапущена с начальным балансом 45 000 ₽.', 'info');
  }, [addNotification]);

  // Export Save
  const exportSave = useCallback(() => {
    return JSON.stringify(state, null, 2);
  }, [state]);

  // Import Save
  const importSave = useCallback((jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.balance !== undefined && Array.isArray(parsed.listings)) {
        setState(parsed);
        addNotification('Загрузка сохранения', 'Прогресс успешно восстановлен.', 'success');
        return true;
      }
    } catch (e) {
      console.error('Import save error', e);
    }
    addNotification('Ошибка загрузки', 'Некорректный формат файла сохранения.', 'alert');
    return false;
  }, [addNotification]);

  return (
    <GameContext.Provider
      value={{
        state,
        buyListing,
        inspectListing,
        negotiate,
        repairItem,
        listItemForSale,
        unlistItem,
        acceptBuyerOffer,
        rejectBuyerOffer,
        counterBuyerOffer,
        bidOnAuction,
        placeAuctionBid: bidOnAuction,
        upgradeBusiness,
        upgradeSkill,
        claimAchievement,
        claimAchievementReward: claimAchievement,
        advanceDay,
        resetGame,
        exportSave,
        importSave,
        dismissNotification,
        addNotification
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
