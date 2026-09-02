import { MarketEvent } from '../types';

export const RANDOM_EVENTS: Omit<MarketEvent, 'startDay' | 'id'>[] = [
  {
    title: 'Анонс новой линейки флагманов',
    category: 'smartphones',
    multiplier: 0.88,
    demandShift: 'high',
    durationDays: 4,
    description: 'Цены на предыдущие поколения смартфонов временно просели на 12%, но спрос на вторичке вырос.'
  },
  {
    title: 'Дефицит видеокарт и чипов',
    category: 'pc',
    multiplier: 1.25,
    demandShift: 'viral',
    durationDays: 5,
    description: 'Взрывной рост цен на видеокарты и игровые сборки. Перепродажа приносит сверхприбыль.'
  },
  {
    title: 'Праздничный сезон подарков',
    category: 'consoles',
    multiplier: 1.18,
    demandShift: 'viral',
    durationDays: 3,
    description: 'Игровые приставки и портативки сметают с полок по любым ценам.'
  },
  {
    title: 'Массовый завоз параллельного импорта',
    category: 'laptops',
    multiplier: 0.85,
    demandShift: 'medium',
    durationDays: 4,
    description: 'Рынок ноутбуков временно перенасыщен, средние цены снизились на 15%.'
  },
  {
    title: 'Бум винтажной фотографии в соцсетях',
    category: 'collectibles',
    multiplier: 1.35,
    demandShift: 'viral',
    durationDays: 6,
    description: 'Спрос на пленочные камеры и ретро-гаджеты взлетел до небес!'
  },
  {
    title: 'Сезон отпусков и путешествий',
    category: 'cameras',
    multiplier: 1.2,
    demandShift: 'high',
    durationDays: 4,
    description: 'Повышенный спрос на беззеркальные камеры и объективы.'
  },
  {
    title: 'Колебание курса валют',
    category: 'all',
    multiplier: 1.1,
    demandShift: 'medium',
    durationDays: 5,
    description: 'Общий рост рыночных цен на всю импортную технику на 10%.'
  },
  {
    title: 'Подорожание автозапчастей и утильсбора',
    category: 'cars',
    multiplier: 1.15,
    demandShift: 'high',
    durationDays: 7,
    description: 'Вторичный авторынок растет в цене, автомобили продаются с высокой маржой.'
  }
];
