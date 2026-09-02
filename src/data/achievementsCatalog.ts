import { Achievement } from '../types';

export const ACHIEVEMENTS_CATALOG: Achievement[] = [
  {
    id: 'ach_first_deal',
    title: 'Первая прибыль',
    description: 'Заключите свою первую успешную сделку перепродажи.',
    icon: 'BadgePercent',
    isUnlocked: false,
    rewardMoney: 3000,
    rewardXp: 100,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'ach_master_haggler',
    title: 'Мастер торга',
    description: 'Сбейте первоначальную цену продавца на 20% или более.',
    icon: 'Flame',
    isUnlocked: false,
    rewardMoney: 7500,
    rewardXp: 250,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'ach_ten_deals',
    title: 'Поток клиентов',
    description: 'Успешно продайте 10 товаров со склада.',
    icon: 'PackageCheck',
    isUnlocked: false,
    rewardMoney: 15000,
    rewardXp: 500,
    progress: 0,
    maxProgress: 10
  },
  {
    id: 'ach_millionaire',
    title: 'Первый миллион',
    description: 'Заработайте суммарный оборот свыше 1 000 000 ₽.',
    icon: 'Coins',
    isUnlocked: false,
    rewardMoney: 50000,
    rewardXp: 1500,
    progress: 0,
    maxProgress: 1000000
  },
  {
    id: 'ach_rare_hunter',
    title: 'Охотник за редкостями',
    description: 'Купите или выиграйте на аукционе редкий или коллекционный товар.',
    icon: 'Gem',
    isUnlocked: false,
    rewardMoney: 25000,
    rewardXp: 800,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'ach_repair_guru',
    title: 'Мастер восстановления',
    description: 'Устраните 5 дефектов и выведите проблемные товары в плюс.',
    icon: 'Wrench',
    isUnlocked: false,
    rewardMoney: 12000,
    rewardXp: 400,
    progress: 0,
    maxProgress: 5
  },
  {
    id: 'ach_auction_winner',
    title: 'Король торгов',
    description: 'Одержите победу в 3 аукционах против конкурентов.',
    icon: 'Gavel',
    isUnlocked: false,
    rewardMoney: 30000,
    rewardXp: 1000,
    progress: 0,
    maxProgress: 3
  },
  {
    id: 'ach_car_magnate',
    title: 'Автоперекуп',
    description: 'Купите и успешно перепродайте свой первый автомобиль.',
    icon: 'Car',
    isUnlocked: false,
    rewardMoney: 100000,
    rewardXp: 3000,
    progress: 0,
    maxProgress: 1
  }
];
