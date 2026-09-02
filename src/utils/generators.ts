import {
  ItemCategory,
  ItemCondition,
  MarketListing,
  RiskLevel,
  DemandLevel,
  DefectType,
  SellerPersonality,
  SellerProfile,
  AuctionItem,
  BuyerOffer,
  BuyerType,
  WarehouseItem,
  CategoryTrend
} from '../types';
import { ITEMS_CATALOG, SELLER_NAMES, SELLER_AVATARS, BUYER_NAMES, CatalogTemplate, CATEGORY_NAMES } from '../data/itemsCatalog';
import { DEFECTS_CATALOG } from '../data/defectsCatalog';

const PERSONALITIES: SellerPersonality[] = [
  'urgent',
  'greedy',
  'calm',
  'haggler',
  'clueless',
  'expert',
  'stubborn'
];

const PERSONALITY_LABELS: Record<SellerPersonality, string> = {
  urgent: 'Срочно нужны деньги (легкий торг)',
  greedy: 'Жадный (не хочет уступать)',
  calm: 'Спокойный (умеренный торг)',
  haggler: 'Любит торговаться',
  clueless: 'Не разбирается в технике',
  expert: 'Специалист (знает точную цену)',
  stubborn: 'Упрямый (может отменить сделку)'
};

const SALE_REASONS = [
  'Подарили другую модель, эта лежит без дела',
  'Срочно нужны деньги на непредвиденные расходы',
  'Обновился на более мощную версию',
  'Продаю за ненадобностью, пользовался редко',
  'Переезд в другой город, распродаю вещи',
  'Просто нужны наличные прямо сегодня',
  'Брал для проекта, проект закрылся'
];

export function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate single market listing
export function generateMarketListing(
  day: number,
  playerLevel: number,
  categoryTrendMultiplier = 1.0,
  categoryDemand?: DemandLevel
): MarketListing {
  // Filter template by player level
  const eligibleTemplates = ITEMS_CATALOG.filter(t => t.minPlayerLevel <= playerLevel + 1);
  const template = getRandomElement(eligibleTemplates) || ITEMS_CATALOG[0];

  // Market price with category fluctuations
  const marketPrice = Math.round((template.baseMarketPrice * categoryTrendMultiplier * (0.95 + Math.random() * 0.1)) / 100) * 100;

  // Seller personality
  const personality = getRandomElement(PERSONALITIES);
  const name = getRandomElement(SELLER_NAMES);
  const avatar = getRandomElement(SELLER_AVATARS);
  const reason = getRandomElement(SALE_REASONS);

  // Determine initial pricing factor
  let discountFactor = 0.15 + Math.random() * 0.2; // 15% to 35% below market
  if (personality === 'clueless') discountFactor = 0.35 + Math.random() * 0.2; // 35-55% below!
  if (personality === 'urgent') discountFactor = 0.25 + Math.random() * 0.15;
  if (personality === 'greedy') discountFactor = 0.05 + Math.random() * 0.08;
  if (personality === 'expert') discountFactor = 0.1 + Math.random() * 0.1;

  let askingPrice = Math.round((marketPrice * (1 - discountFactor)) / 100) * 100;
  if (askingPrice < 1000) askingPrice = 1000;

  // Lowest price seller would take
  let lowestFactor = 0.05 + Math.random() * 0.15;
  if (personality === 'urgent') lowestFactor = 0.2 + Math.random() * 0.15;
  if (personality === 'greedy') lowestFactor = 0.02 + Math.random() * 0.04;
  if (personality === 'stubborn') lowestFactor = 0.05 + Math.random() * 0.05;

  const lowestAcceptPrice = Math.round((askingPrice * (1 - lowestFactor)) / 100) * 100;

  // Defects & True condition
  const possibleDefects = template.typicalDefects;
  const hiddenDefects: DefectType[] = [];
  const hasDefects = Math.random() < 0.45;

  if (hasDefects && possibleDefects.length > 0) {
    const count = Math.random() < 0.75 ? 1 : 2;
    for (let i = 0; i < count; i++) {
      const def = getRandomElement(possibleDefects);
      if (!hiddenDefects.includes(def)) {
        hiddenDefects.push(def);
      }
    }
  }

  // Conditions
  let publicCondition: ItemCondition = 'good';
  let trueCondition: ItemCondition = 'good';

  if (hiddenDefects.length === 0) {
    trueCondition = Math.random() < 0.4 ? 'ideal' : 'good';
    publicCondition = trueCondition;
  } else if (hiddenDefects.some(d => d === 'screen_broken' || d === 'engine_knock')) {
    trueCondition = 'broken';
    publicCondition = personality === 'clueless' ? 'unknown' : (Math.random() < 0.5 ? 'fair' : 'broken');
  } else {
    trueCondition = 'fair';
    publicCondition = Math.random() < 0.6 ? 'good' : 'fair';
  }

  // Risk
  let risk: RiskLevel = 'low';
  if (publicCondition === 'unknown' || hiddenDefects.length >= 2 || discountFactor > 0.35) {
    risk = 'high';
  } else if (hiddenDefects.length === 1 || discountFactor > 0.22) {
    risk = 'medium';
  }

  // Demand
  const demandList: DemandLevel[] = ['low', 'medium', 'high', 'viral'];
  const demand = categoryDemand || getRandomElement(demandList);

  const estimatedProfit = Math.max(0, marketPrice - askingPrice);

  const priceHistory = [
    { day: Math.max(1, day - 4), price: Math.round(marketPrice * 0.98) },
    { day: Math.max(1, day - 3), price: Math.round(marketPrice * 1.02) },
    { day: Math.max(1, day - 2), price: Math.round(marketPrice * 0.99) },
    { day: Math.max(1, day - 1), price: Math.round(marketPrice * 1.01) },
    { day: day, price: marketPrice }
  ];

  const seller: SellerProfile = {
    name,
    avatar,
    personality,
    personalityLabel: PERSONALITY_LABELS[personality],
    patience: personality === 'stubborn' ? 60 : (personality === 'urgent' ? 95 : 80),
    lowestAcceptPrice,
    reasonForSale: reason,
    dialogueHistory: [
      {
        sender: 'seller',
        text: `Здравствуйте! Продаю ${template.title}. ${reason}. Цена окончательная, но готов выслушать адекватные предложения.`
      }
    ],
    hasWalkedOut: false
  };

  return {
    id: `listing_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    title: template.title,
    category: template.category,
    categoryLabel: template.categoryLabel,
    imageUrl: template.imageUrl,
    askingPrice,
    marketAveragePrice: marketPrice,
    estimatedProfit,
    publicCondition,
    trueCondition,
    hiddenDefects,
    isInspected: false,
    inspectionLevel: 'none',
    ageMonths: getRandomInt(2, 28),
    demand,
    liquidity: template.liquidity,
    risk,
    seller,
    priceHistory,
    expiresInDays: getRandomInt(2, 4),
    createdAtDay: day,
    isHotDeal: discountFactor >= 0.28
  };
}

// Generate batch of initial listings
export function generateInitialListings(count = 9, day = 1, playerLevel = 1): MarketListing[] {
  const listings: MarketListing[] = [];
  for (let i = 0; i < count; i++) {
    listings.push(generateMarketListing(day, playerLevel));
  }
  return listings;
}

// Generate an Auction Lot
export function generateAuction(day: number, playerLevel: number): AuctionItem {
  const eligible = ITEMS_CATALOG.filter(t => t.minPlayerLevel <= playerLevel + 1);
  const template = getRandomElement(eligible) || ITEMS_CATALOG[0];

  const estimatedMarketPrice = Math.round((template.baseMarketPrice * (1.05 + Math.random() * 0.2)) / 100) * 100;
  const startingPrice = Math.round((estimatedMarketPrice * (0.35 + Math.random() * 0.2)) / 100) * 100;
  const minBidStep = Math.max(500, Math.round((estimatedMarketPrice * 0.03) / 100) * 100);

  const competitorsCount = getRandomInt(2, 4);
  const competitors = [];
  for (let i = 0; i < competitorsCount; i++) {
    const compName = getRandomElement(BUYER_NAMES);
    const maxBudget = Math.round((estimatedMarketPrice * (0.75 + Math.random() * 0.35)) / 100) * 100;
    competitors.push({
      name: `${compName} (Перекуп)`,
      maxBudget,
      bidChance: 0.6 + Math.random() * 0.3
    });
  }

  return {
    id: `auction_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    title: template.title,
    category: template.category,
    categoryLabel: template.categoryLabel,
    imageUrl: template.imageUrl,
    startingPrice,
    currentBid: startingPrice,
    minBidStep,
    estimatedMarketPrice,
    condition: Math.random() < 0.5 ? 'ideal' : 'good',
    sellerDescription: 'Конфискованное / срочное имущество с ликвидационного аукциона. Минимальный стартовый лот.',
    highestBidder: 'Стартовая цена площадки',
    isPlayerWinning: false,
    endTimerSeconds: 45,
    maxTimerSeconds: 45,
    competitors,
    isFinished: false
  };
}

// Generate Buyer Offer for a listed item in warehouse
export function generateBuyerOffer(
  warehouseItem: WarehouseItem,
  day: number,
  marketingBoost = 1.0
): BuyerOffer | null {
  if (!warehouseItem.isListed || !warehouseItem.listedPrice) return null;

  const buyerTypes: BuyerType[] = ['fast', 'haggler', 'expert', 'rookie', 'cautious', 'reseller'];
  const buyerType = getRandomElement(buyerTypes);
  const buyerName = getRandomElement(BUYER_NAMES);

  const targetPrice = warehouseItem.currentMarketPrice;
  const listedPrice = warehouseItem.listedPrice;

  let offerPrice = listedPrice;
  let message = 'Здравствуйте! Готов забрать сегодня без лишних вопросов.';

  switch (buyerType) {
    case 'fast':
      // Pays asking price or -3%
      offerPrice = Math.round((listedPrice * (0.97 + Math.random() * 0.03)) / 100) * 100;
      message = 'Добрый день. Устраивает цена, готов оформить сделку прямо сейчас.';
      break;
    case 'haggler':
      // Tries to knock off 10-20%
      offerPrice = Math.round((listedPrice * (0.8 + Math.random() * 0.1)) / 100) * 100;
      message = `Приветствую! За ${offerPrice.toLocaleString('ru-RU')} ₽ отдадите? Деньги на руках.`;
      break;
    case 'expert':
      // Strict on quality, offers fair market price
      offerPrice = Math.round((targetPrice * 0.95) / 100) * 100;
      message = 'Проверил все параметры по рынку. С учетом износа предлагаю честную сумму.';
      break;
    case 'rookie':
      // Sometimes overpays slightly if listed high
      offerPrice = Math.round((listedPrice * (0.95 + Math.random() * 0.1)) / 100) * 100;
      message = 'Здравствуйте! Очень понравился этот вариант. Зарезервируйте за мной.';
      break;
    case 'cautious':
      offerPrice = Math.round((listedPrice * 0.9) / 100) * 100;
      message = 'Интересует покупка. Точно ли всё работает без нареканий? Готов взять с небольшой скидкой.';
      break;
    case 'reseller':
      // Lowballs heavily
      offerPrice = Math.round((listedPrice * (0.65 + Math.random() * 0.15)) / 100) * 100;
      message = `Заберу за ${offerPrice.toLocaleString('ru-RU')} ₽ через 30 минут курьером.`;
      break;
  }

  const TYPE_LABELS: Record<BuyerType, string> = {
    fast: 'Быстрый покупатель',
    haggler: 'Торгующийся',
    expert: 'Эксперт / Профи',
    rookie: 'Обычный покупатель',
    cautious: 'Осторожный покупатель',
    reseller: 'Конкурент / Перекуп'
  };

  return {
    id: `offer_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    warehouseItemId: warehouseItem.id,
    itemTitle: warehouseItem.title,
    itemImage: warehouseItem.imageUrl,
    buyerName,
    buyerType,
    buyerTypeLabel: TYPE_LABELS[buyerType],
    offeredPrice: Math.min(offerPrice, Math.round(listedPrice * 1.05)),
    listedPrice,
    message,
    receivedAtDay: day,
    expiresInDays: getRandomInt(1, 2)
  };
}

// Initialize Category Trends
export function initializeCategoryTrends(): Record<ItemCategory, CategoryTrend> {
  const categories: ItemCategory[] = [
    'smartphones', 'laptops', 'consoles', 'monitors', 'pc',
    'cameras', 'tv', 'audio', 'peripherals', 'appliances', 'collectibles', 'cars'
  ];

  const result = {} as Record<ItemCategory, CategoryTrend>;

  for (const cat of categories) {
    const items = ITEMS_CATALOG.filter(i => i.category === cat);
    const avg = items.length > 0
      ? Math.round(items.reduce((sum, item) => sum + item.baseMarketPrice, 0) / items.length)
      : 50000;

    result[cat] = {
      category: cat,
      label: CATEGORY_NAMES[cat],
      currentAvgPrice: avg,
      previousAvgPrice: avg,
      changePct: 0,
      demand: 'medium',
      activeListingsCount: getRandomInt(8, 25),
      history: [
        { day: 1, price: Math.round(avg * 0.98) },
        { day: 2, price: Math.round(avg * 1.01) },
        { day: 3, price: avg }
      ]
    };
  }

  return result;
}
