import { Skill } from '../types';

export const SKILLS_CATALOG: Skill[] = [
  // --- Переговоры (Trading) ---
  {
    id: 'skill_haggling',
    name: 'Мастер переговоров',
    category: 'trading',
    categoryLabel: 'Переговоры',
    level: 0,
    maxLevel: 5,
    cost: 15000,
    description: 'Увеличивает податливость продавцов и шанс сбить цену на 5–25%.',
    effectLabel: '+5% к успешности торга за уровень'
  },
  {
    id: 'skill_psychology',
    name: 'Психология продавца',
    category: 'trading',
    categoryLabel: 'Переговоры',
    level: 0,
    maxLevel: 3,
    cost: 25000,
    description: 'Отображает минимальный порог цены продавца и его запас терпения.',
    effectLabel: 'Раскрывает психологический профиль'
  },

  // --- Диагностика и Оценка (Inspection) ---
  {
    id: 'skill_appraisal',
    name: 'Чутье рынка',
    category: 'inspection',
    categoryLabel: 'Оценка',
    level: 0,
    maxLevel: 5,
    cost: 12000,
    description: 'Подсвечивает реальную рыночную стоимость и скрытые риски дефектов.',
    effectLabel: '+10% точность оценки ликвидности'
  },
  {
    id: 'skill_fast_diagnostics',
    name: 'Экспресс-диагностика',
    category: 'inspection',
    categoryLabel: 'Диагностика',
    level: 0,
    maxLevel: 3,
    cost: 18000,
    description: 'Снижает стоимость полной проверки товара и выявляет скрытые дефекты быстрее.',
    effectLabel: '-30% стоимости диагностики'
  },

  // --- Ремонт и Подготовка (Repair) ---
  {
    id: 'skill_diy_repair',
    name: 'Модульный ремонт',
    category: 'repair',
    categoryLabel: 'Ремонт',
    level: 0,
    maxLevel: 5,
    cost: 20000,
    description: 'Снижает стоимость запчастей и увеличивает рыночную надбавку после ремонта.',
    effectLabel: '-8% стоимости любого ремонта'
  },
  {
    id: 'skill_detailing',
    name: 'Предпродажная подготовка',
    category: 'repair',
    categoryLabel: 'Ремонт',
    level: 0,
    maxLevel: 3,
    cost: 16000,
    description: 'Полировка, очистка и упаковка повышают привлекательность лота для покупателей.',
    effectLabel: '+15% шанс быстрой продажи по верхней цене'
  },

  // --- Продажи и Маркетинг (Business) ---
  {
    id: 'skill_marketing',
    name: 'Эффективный маркетинг',
    category: 'business',
    categoryLabel: 'Маркетинг',
    level: 0,
    maxLevel: 5,
    cost: 22000,
    description: 'Привлекает больше щедрых покупателей и снижает время ожидания откликов.',
    effectLabel: '+20% входящих предложений'
  },
  {
    id: 'skill_auctioneer',
    name: 'Аукционная хватка',
    category: 'business',
    categoryLabel: 'Аукционы',
    level: 0,
    maxLevel: 3,
    cost: 40000,
    description: 'Позволяет точнее оценивать лимиты ботов на аукционах и забирать редкие лоты дешевле.',
    effectLabel: 'Видно максимальный бюджет конкурентов'
  }
];
