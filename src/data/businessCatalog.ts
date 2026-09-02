import { BusinessBranch } from '../types';

export const BUSINESS_BRANCHES: BusinessBranch[] = [
  {
    id: 'branch_store',
    title: 'Розничный шоурум',
    subtitle: 'Увеличивает поток клиентов и скорость продаж',
    iconName: 'Store',
    level: 0,
    maxLevel: 5,
    cost: 45000,
    perks: [
      '+3 слота одновременных объявлений',
      '+15% к скорости отклика покупателей',
      'Возможность выставлять товары с премиум-наценкой'
    ],
    isUnlocked: false,
    minPlayerLevel: 2
  },
  {
    id: 'branch_workshop',
    title: 'Собственный сервисный центр',
    subtitle: 'Снижает расходы на ремонт и диагностику',
    iconName: 'Wrench',
    level: 0,
    maxLevel: 5,
    cost: 65000,
    perks: [
      '-25% к стоимости запчастей и ремонта',
      'Бесплатная быстрая диагностика',
      'Возможность устранять сложные дефекты'
    ],
    isUnlocked: false,
    minPlayerLevel: 2
  },
  {
    id: 'branch_warehouse',
    title: 'Логистический склад',
    subtitle: 'Расширяет вместимость инвентаря для масштабных партий',
    iconName: 'Boxes',
    level: 0,
    maxLevel: 5,
    cost: 35000,
    perks: [
      '+10 мест на складе за каждый уровень',
      'Снижение риска порчи товара при хранении',
      'Пакетные скидки на запчасти'
    ],
    isUnlocked: false,
    minPlayerLevel: 1
  },
  {
    id: 'branch_retail_network',
    title: 'Сеть торговых точек',
    subtitle: 'Пассивные продажи и сетевой маркетинг',
    iconName: 'Building2',
    level: 0,
    maxLevel: 3,
    cost: 350000,
    perks: [
      'Пассивный поток выгодных входящих предложений',
      'Автоматический выкуп горячих лотов',
      '+50% к лимитам объявлений'
    ],
    isUnlocked: false,
    minPlayerLevel: 4
  },
  {
    id: 'branch_auto_salon',
    title: 'Автосалон премиум-класса',
    subtitle: 'Открывает доступ к автоподбору и автовыкупу',
    iconName: 'Car',
    level: 0,
    maxLevel: 3,
    cost: 1500000,
    perks: [
      'Доступ к рынку автомобилей',
      'Собственный покрасочный цех и автодиагностика',
      'Сверхвысокая маржа со сделок'
    ],
    isUnlocked: false,
    minPlayerLevel: 5
  }
];
