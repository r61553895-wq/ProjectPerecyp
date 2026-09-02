import { DefectInfo, DefectType } from '../types';

export const DEFECTS_CATALOG: Record<DefectType, DefectInfo> = {
  battery_worn: {
    type: 'battery_worn',
    name: 'Изношенный аккумулятор',
    repairCost: 2800,
    valuePenaltyPct: 18,
    description: 'Емкость АКБ ниже 75%. Требуется замена элемента питания.'
  },
  screen_scratches: {
    type: 'screen_scratches',
    name: 'Глубокие царапины экрана',
    repairCost: 1900,
    valuePenaltyPct: 12,
    description: 'Множественные потертости дисплея. Нужна полировка или замена стекла.'
  },
  screen_broken: {
    type: 'screen_broken',
    name: 'Разбит дисплей / матрица',
    repairCost: 6500,
    valuePenaltyPct: 35,
    description: 'Трещина на матрице, полосы или неработающий тачскрин.'
  },
  overheating: {
    type: 'overheating',
    name: 'Перегрев под нагрузкой',
    repairCost: 2200,
    valuePenaltyPct: 15,
    description: 'Высохшая термопаста и забитый радиатор.'
  },
  fan_noise: {
    type: 'fan_noise',
    name: 'Шум / люфт вентилятора',
    repairCost: 1500,
    valuePenaltyPct: 10,
    description: 'Износ подшипника кулера. Необходима смазка или замена.'
  },
  fake_part: {
    type: 'fake_part',
    name: 'Неоригинальный модуль',
    repairCost: 4200,
    valuePenaltyPct: 22,
    description: 'Установлена дешёвая неоригинальная копия без калибровки.'
  },
  missing_box: {
    type: 'missing_box',
    name: 'Отсутствует родной комплект/коробка',
    repairCost: 800,
    valuePenaltyPct: 8,
    description: 'Покупка фирменной упаковки и качественного кабеля повысит ликвидность.'
  },
  camera_dust: {
    type: 'camera_dust',
    name: 'Пыль/пятна в блоке камер',
    repairCost: 1800,
    valuePenaltyPct: 14,
    description: 'Разгерметизация оптического блока. Нужна чистка в сервисе.'
  },
  chassis_dented: {
    type: 'chassis_dented',
    name: 'Вмятины и сколы корпуса',
    repairCost: 3100,
    valuePenaltyPct: 16,
    description: 'Деформация рамки или задней крышки устройства.'
  },
  port_loose: {
    type: 'port_loose',
    name: 'Расшатан порт зарядки/HDMI',
    repairCost: 1400,
    valuePenaltyPct: 10,
    description: 'Периодически пропадает контакт. Требуется перепайка разъема.'
  },
  engine_knock: {
    type: 'engine_knock',
    name: 'Стук в двигателе / навесном',
    repairCost: 45000,
    valuePenaltyPct: 40,
    description: 'Критический дефект авто. Требуется ремонт ГБЦ или замена цепи.'
  },
  paint_damage: {
    type: 'paint_damage',
    name: 'Окрас/шпатлевка 2+ элементов',
    repairCost: 18000,
    valuePenaltyPct: 20,
    description: 'Сколы и вторичный окрас кузова. Требуется локальная полировка.'
  }
};
