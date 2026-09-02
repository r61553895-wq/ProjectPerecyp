export type ItemCategory =
  | 'smartphones'
  | 'laptops'
  | 'consoles'
  | 'monitors'
  | 'pc'
  | 'cameras'
  | 'tv'
  | 'audio'
  | 'peripherals'
  | 'appliances'
  | 'collectibles'
  | 'cars';

export type ItemCondition = 'ideal' | 'good' | 'fair' | 'broken' | 'unknown';

export type RiskLevel = 'low' | 'medium' | 'high';
export type DemandLevel = 'low' | 'medium' | 'high' | 'viral';

export type DefectType =
  | 'battery_worn'
  | 'screen_scratches'
  | 'screen_broken'
  | 'overheating'
  | 'fan_noise'
  | 'fake_part'
  | 'missing_box'
  | 'camera_dust'
  | 'chassis_dented'
  | 'port_loose'
  | 'engine_knock'
  | 'paint_damage';

export interface DefectInfo {
  type: DefectType;
  name: string;
  repairCost: number;
  valuePenaltyPct: number; // Penalty to resale price if unfixed
  description: string;
}

export type SellerPersonality =
  | 'urgent'      // Easily gives big discounts, hasty
  | 'greedy'      // Refuses concessions, demands market price
  | 'calm'        // Moderate, gives 5-10% discount
  | 'haggler'     // Counter-offers repeatedly
  | 'clueless'    // Doesn't know the real worth, huge profit margin potential
  | 'expert'      // Knows exact flaws, tough negotiator
  | 'stubborn';   // Low patience, leaves quickly if lowballed

export interface SellerProfile {
  name: string;
  avatar: string;
  personality: SellerPersonality;
  personalityLabel: string;
  patience: number; // 0 to 100
  lowestAcceptPrice: number;
  reasonForSale: string;
  dialogueHistory: {
    sender: 'player' | 'seller' | 'system';
    text: string;
    offer?: number;
  }[];
  hasWalkedOut: boolean;
}

export interface MarketListing {
  id: string;
  title: string;
  category: ItemCategory;
  categoryLabel: string;
  imageUrl: string;
  askingPrice: number;
  marketAveragePrice: number;
  estimatedProfit: number;
  publicCondition: ItemCondition;
  trueCondition: ItemCondition;
  hiddenDefects: DefectType[];
  isInspected: boolean;
  inspectionLevel: 'none' | 'quick' | 'basic' | 'full';
  ageMonths: number;
  demand: DemandLevel;
  liquidity: number; // 1-100
  risk: RiskLevel;
  seller: SellerProfile;
  priceHistory: { day: number; price: number }[];
  expiresInDays: number;
  createdAtDay: number;
  isHotDeal?: boolean;
  snatchedByCompetitor?: boolean;
}

export interface WarehouseItem {
  id: string;
  title: string;
  category: ItemCategory;
  categoryLabel: string;
  imageUrl: string;
  boughtPrice: number;
  originalAskingPrice: number;
  marketPriceAtBuy: number;
  currentMarketPrice: number;
  condition: ItemCondition;
  knownDefects: DefectType[];
  fixedDefects: DefectType[];
  repairCostSpent: number;
  boughtAtDay: number;
  daysHeld: number;
  isListed: boolean;
  listedPrice?: number;
  promoLevel?: 'standard' | 'boost' | 'urgent';
  viewsCount?: number;
  potentialProfit?: number;
}

export type BuyerType = 'fast' | 'haggler' | 'expert' | 'rookie' | 'cautious' | 'reseller';

export interface BuyerOffer {
  id: string;
  warehouseItemId: string;
  itemTitle: string;
  itemImage: string;
  buyerName: string;
  buyerType: BuyerType;
  buyerTypeLabel: string;
  offeredPrice: number;
  listedPrice: number;
  message: string;
  receivedAtDay: number;
  expiresInDays: number;
}

export interface DealRecord {
  id: string;
  itemTitle: string;
  category: ItemCategory;
  categoryLabel: string;
  imageUrl: string;
  boughtPrice: number;
  repairSpent: number;
  soldPrice: number;
  netProfit: number;
  profitMarginPct: number;
  daysHeld: number;
  buyerName: string;
  buyerType: string;
  soldAtDay: number;
}

export interface AuctionItem {
  id: string;
  title: string;
  category: ItemCategory;
  categoryLabel: string;
  imageUrl: string;
  startingPrice: number;
  currentBid: number;
  minBidStep: number;
  estimatedMarketPrice: number;
  estimatedValue?: number;
  condition: ItemCondition;
  sellerDescription: string;
  highestBidder: string;
  leader?: string;
  isPlayerWinning: boolean;
  endTimerSeconds: number;
  maxTimerSeconds: number;
  competitors: {
    name: string;
    maxBudget: number;
    bidChance: number;
  }[];
  isFinished: boolean;
  winnerName?: string;
}

export interface BusinessBranch {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  level: number;
  maxLevel: number;
  cost: number;
  perks: string[];
  isUnlocked: boolean;
  minPlayerLevel: number;
}

export interface Skill {
  id: string;
  name: string;
  category: 'trading' | 'inspection' | 'repair' | 'business';
  categoryLabel: string;
  level: number;
  maxLevel: number;
  cost: number;
  description: string;
  effectLabel: string;
}

export interface MarketEvent {
  id: string;
  title: string;
  category: ItemCategory | 'all';
  multiplier: number; // e.g. 1.25 = +25% price
  demandShift: DemandLevel;
  durationDays: number;
  startDay: number;
  description: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  rewardMoney: number;
  rewardXp: number;
  progress: number;
  maxProgress: number;
}

export interface NotificationToast {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  timestamp: number;
}

export interface CategoryTrend {
  category: ItemCategory;
  label: string;
  currentAvgPrice: number;
  previousAvgPrice: number;
  changePct: number;
  demand: DemandLevel;
  activeListingsCount: number;
  history: { day: number; price: number }[];
}

export interface GameState {
  balance: number;
  day: number;
  level: number; // 1 to 6
  xp: number;
  maxXp: number;
  reputation: number; // 0 to 100
  totalTurnover: number;
  totalProfit: number;
  totalDeals: number;
  successfulNegotiations: number;
  failedNegotiations: number;
  bestDealProfit: number;
  worstDealProfit: number;
  listings: MarketListing[];
  warehouse: WarehouseItem[];
  deals: DealRecord[];
  dealHistory?: DealRecord[];
  incomingOffers: BuyerOffer[];
  auctions: AuctionItem[];
  businesses: BusinessBranch[];
  skills: Skill[];
  achievements: Achievement[];
  activeEvents: MarketEvent[];
  categoryTrends: Record<ItemCategory, CategoryTrend>;
  warehouseCapacity: number;
  maxActiveListings: number;
  lastProfitToday: number;
  notifications: NotificationToast[];
}
