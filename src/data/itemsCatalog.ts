import { ItemCategory, DefectType } from '../types';

export interface CatalogTemplate {
  id: string;
  title: string;
  category: ItemCategory;
  categoryLabel: string;
  baseMarketPrice: number;
  imageUrl: string;
  minPlayerLevel: number;
  typicalDefects: DefectType[];
  liquidity: number; // 10 to 95
  volatility: number; // 0.05 to 0.25
}

export const CATEGORY_NAMES: Record<ItemCategory, string> = {
  smartphones: 'Смартфоны',
  laptops: 'Ноутбуки',
  consoles: 'Приставки',
  monitors: 'Мониторы',
  pc: 'Компьютеры',
  cameras: 'Фототехника',
  tv: 'Телевизоры',
  audio: 'Аудио / Наушники',
  peripherals: 'Периферия',
  appliances: 'Бытовая техника',
  collectibles: 'Редкие товары',
  cars: 'Автомобили'
};

export const ITEMS_CATALOG: CatalogTemplate[] = [
  // --- Смартфоны ---
  {
    id: 'phone_iphone_15_pro',
    title: 'Apple iPhone 15 Pro 128GB',
    category: 'smartphones',
    categoryLabel: 'Смартфоны',
    baseMarketPrice: 78000,
    imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80',
    minPlayerLevel: 1,
    typicalDefects: ['battery_worn', 'screen_scratches', 'camera_dust'],
    liquidity: 95,
    volatility: 0.08
  },
  {
    id: 'phone_samsung_s24_ultra',
    title: 'Samsung Galaxy S24 Ultra 256GB',
    category: 'smartphones',
    categoryLabel: 'Смартфоны',
    baseMarketPrice: 86000,
    imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&auto=format&fit=crop&q=80',
    minPlayerLevel: 2,
    typicalDefects: ['screen_broken', 'fake_part', 'port_loose'],
    liquidity: 88,
    volatility: 0.1
  },
  {
    id: 'phone_iphone_13',
    title: 'Apple iPhone 13 128GB Midnight',
    category: 'smartphones',
    categoryLabel: 'Смартфоны',
    baseMarketPrice: 42000,
    imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop&q=80',
    minPlayerLevel: 1,
    typicalDefects: ['battery_worn', 'missing_box', 'chassis_dented'],
    liquidity: 98,
    volatility: 0.06
  },
  {
    id: 'phone_pixel_8_pro',
    title: 'Google Pixel 8 Pro 128GB Bay',
    category: 'smartphones',
    categoryLabel: 'Смартфоны',
    baseMarketPrice: 58000,
    imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80',
    minPlayerLevel: 2,
    typicalDefects: ['screen_scratches', 'overheating'],
    liquidity: 75,
    volatility: 0.12
  },
  {
    id: 'phone_xiaomi_13t_pro',
    title: 'Xiaomi 13T Pro 12/512GB Black',
    category: 'smartphones',
    categoryLabel: 'Смартфоны',
    baseMarketPrice: 38000,
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
    minPlayerLevel: 1,
    typicalDefects: ['chassis_dented', 'port_loose'],
    liquidity: 82,
    volatility: 0.09
  },

  // --- Ноутбуки ---
  {
    id: 'laptop_macbook_air_m2',
    title: 'Apple MacBook Air 13 M2 8/256GB',
    category: 'laptops',
    categoryLabel: 'Ноутбуки',
    baseMarketPrice: 84000,
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
    minPlayerLevel: 1,
    typicalDefects: ['battery_worn', 'screen_scratches', 'chassis_dented'],
    liquidity: 92,
    volatility: 0.07
  },
  {
    id: 'laptop_macbook_pro_16_m3',
    title: 'Apple MacBook Pro 16 M3 Max 36GB',
    category: 'laptops',
    categoryLabel: 'Ноутбуки',
    baseMarketPrice: 285000,
    imageUrl: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=600&auto=format&fit=crop&q=80',
    minPlayerLevel: 4,
    typicalDefects: ['port_loose', 'screen_broken'],
    liquidity: 65,
    volatility: 0.15
  },
  {
    id: 'laptop_asus_rog_zephyrus',
    title: 'ASUS ROG Zephyrus G14 RTX 4070',
    category: 'laptops',
    categoryLabel: 'Ноутбуки',
    baseMarketPrice: 145000,
    imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80',
    minPlayerLevel: 3,
    typicalDefects: ['overheating', 'fan_noise', 'battery_worn'],
    liquidity: 78,
    volatility: 0.14
  },
  {
    id: 'laptop_lenovo_legion_5',
    title: 'Lenovo Legion 5 Pro RTX 3070',
    category: 'laptops',
    categoryLabel: 'Ноутбуки',
    baseMarketPrice: 92000,
    imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80',
    minPlayerLevel: 2,
    typicalDefects: ['fan_noise', 'overheating', 'missing_box'],
    liquidity: 85,
    volatility: 0.11
  },

  // --- Игровые приставки ---
  {
    id: 'console_ps5_slim',
    title: 'Sony PlayStation 5 Slim 1TB Disk',
    category: 'consoles',
    categoryLabel: 'Приставки',
    baseMarketPrice: 51000,
    imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&auto=format&fit=crop&q=80',
    minPlayerLevel: 1,
    typicalDefects: ['port_loose', 'fan_noise', 'missing_box'],
    liquidity: 96,
    volatility: 0.08
  },
  {
    id: 'console_nintendo_switch_oled',
    title: 'Nintendo Switch OLED Neon Edition',
    category: 'consoles',
    categoryLabel: 'Приставки',
    baseMarketPrice: 26000,
    imageUrl: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=600&auto=format&fit=crop&q=80',
    minPlayerLevel: 1,
    typicalDefects: ['screen_scratches', 'port_loose', 'battery_worn'],
    liquidity: 90,
    volatility: 0.07
  },
  {
    id: 'console_xbox_series_x',
    title: 'Microsoft Xbox Series X 1TB Black',
    category: 'consoles',
    categoryLabel: 'Приставки',
    baseMarketPrice: 46000,
    imageUrl: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=600&auto=format&fit=crop&q=80',
    minPlayerLevel: 1,
    typicalDefects: ['overheating', 'chassis_dented'],
    liquidity: 84,
    volatility: 0.09
  },
  {
    id: 'console_steam_deck_oled',
    title: 'Valve Steam Deck OLED 512GB',
    category: 'consoles',
    categoryLabel: 'Приставки',
    baseMarketPrice: 56000,
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
    minPlayerLevel: 2,
    typicalDefects: ['screen_scratches', 'fan_noise'],
    liquidity: 89,
    volatility: 0.1
  },

  // --- ПК и Комплектующие ---
  {
    id: 'pc_gaming_rtx_4080',
    title: 'Игровой ПК i7-14700KF / RTX 4080 32GB',
    category: 'pc',
    categoryLabel: 'Компьютеры',
    baseMarketPrice: 210000,
    imageUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80',
    minPlayerLevel: 3,
    typicalDefects: ['overheating', 'fan_noise', 'fake_part'],
    liquidity: 72,
    volatility: 0.16
  },
  {
    id: 'pc_gpu_rtx_4070_ti',
    title: 'Видеокарта Gigabyte GeForce RTX 4070 Ti',
    category: 'pc',
    categoryLabel: 'Компьютеры',
    baseMarketPrice: 79000,
    imageUrl: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&auto=format&fit=crop&q=80',
    minPlayerLevel: 2,
    typicalDefects: ['fan_noise', 'overheating'],
    liquidity: 91,
    volatility: 0.13
  },

  // --- Мониторы ---
  {
    id: 'monitor_samsung_odyssey_g9',
    title: 'Монитор Samsung Odyssey OLED G9 49"',
    category: 'monitors',
    categoryLabel: 'Мониторы',
    baseMarketPrice: 115000,
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80',
    minPlayerLevel: 3,
    typicalDefects: ['screen_broken', 'screen_scratches', 'port_loose'],
    liquidity: 68,
    volatility: 0.15
  },
  {
    id: 'monitor_lg_ultrafine_27',
    title: 'Монитор LG UltraFine 27GP850-B 2K 180Hz',
    category: 'monitors',
    categoryLabel: 'Мониторы',
    baseMarketPrice: 34000,
    imageUrl: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600&auto=format&fit=crop&q=80',
    minPlayerLevel: 1,
    typicalDefects: ['screen_scratches', 'missing_box'],
    liquidity: 88,
    volatility: 0.08
  },

  // --- Фототехника & Камеры ---
  {
    id: 'camera_sony_a7_iv',
    title: 'Камера Sony Alpha A7 IV Body',
    category: 'cameras',
    categoryLabel: 'Фототехника',
    baseMarketPrice: 185000,
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80',
    minPlayerLevel: 3,
    typicalDefects: ['camera_dust', 'battery_worn', 'port_loose'],
    liquidity: 79,
    volatility: 0.11
  },
  {
    id: 'camera_fujifilm_x100v',
    title: 'Компактная камера Fujifilm X100V Silver',
    category: 'cameras',
    categoryLabel: 'Фототехника',
    baseMarketPrice: 135000,
    imageUrl: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&auto=format&fit=crop&q=80',
    minPlayerLevel: 3,
    typicalDefects: ['chassis_dented', 'missing_box'],
    liquidity: 94,
    volatility: 0.18
  },

  // --- Аудио & Наушники ---
  {
    id: 'audio_airpods_max',
    title: 'Apple AirPods Max Space Gray',
    category: 'audio',
    categoryLabel: 'Аудио',
    baseMarketPrice: 49000,
    imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80',
    minPlayerLevel: 1,
    typicalDefects: ['battery_worn', 'fake_part', 'chassis_dented'],
    liquidity: 87,
    volatility: 0.12
  },
  {
    id: 'audio_sony_wh1000xm5',
    title: 'Sony WH-1000XM5 Wireless ANC',
    category: 'audio',
    categoryLabel: 'Аудио',
    baseMarketPrice: 31000,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    minPlayerLevel: 1,
    typicalDefects: ['battery_worn', 'missing_box'],
    liquidity: 90,
    volatility: 0.08
  },

  // --- Периферия ---
  {
    id: 'periph_logitech_g_pro_x_superlight',
    title: 'Logitech G PRO X Superlight 2 Wireless',
    category: 'peripherals',
    categoryLabel: 'Периферия',
    baseMarketPrice: 13500,
    imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80',
    minPlayerLevel: 1,
    typicalDefects: ['port_loose', 'chassis_dented'],
    liquidity: 93,
    volatility: 0.06
  },
  {
    id: 'periph_wooting_60he',
    title: 'Клавиатура Wooting 60HE+ Hall Effect',
    category: 'peripherals',
    categoryLabel: 'Периферия',
    baseMarketPrice: 22500,
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
    minPlayerLevel: 2,
    typicalDefects: ['missing_box', 'port_loose'],
    liquidity: 85,
    volatility: 0.12
  },

  // --- Бытовая техника & Телевизоры ---
  {
    id: 'tv_lg_oled_c3_65',
    title: 'Телевизор LG OLED evo C3 65" 4K 120Hz',
    category: 'tv',
    categoryLabel: 'Телевизоры',
    baseMarketPrice: 165000,
    imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&auto=format&fit=crop&q=80',
    minPlayerLevel: 3,
    typicalDefects: ['screen_broken', 'screen_scratches', 'port_loose'],
    liquidity: 62,
    volatility: 0.14
  },
  {
    id: 'appliance_dyson_airwrap',
    title: 'Мультистайлер Dyson Airwrap Complete Long',
    category: 'appliances',
    categoryLabel: 'Бытовая техника',
    baseMarketPrice: 48000,
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80',
    minPlayerLevel: 1,
    typicalDefects: ['fake_part', 'port_loose', 'missing_box'],
    liquidity: 97,
    volatility: 0.1
  },

  // --- Редкие и коллекционные товары ---
  {
    id: 'collect_gameboy_sealed',
    title: 'Nintendo Game Boy Original 1989 Mint Boxed',
    category: 'collectibles',
    categoryLabel: 'Редкие товары',
    baseMarketPrice: 75000,
    imageUrl: 'https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?w=600&auto=format&fit=crop&q=80',
    minPlayerLevel: 4,
    typicalDefects: ['battery_worn', 'screen_scratches', 'chassis_dented'],
    liquidity: 55,
    volatility: 0.28
  },
  {
    id: 'collect_leica_m6',
    title: 'Плёночный фотоаппарат Leica M6 Classic',
    category: 'collectibles',
    categoryLabel: 'Редкие товары',
    baseMarketPrice: 280000,
    imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80',
    minPlayerLevel: 4,
    typicalDefects: ['camera_dust', 'chassis_dented'],
    liquidity: 60,
    volatility: 0.24
  },

  // --- Автомобили (Топовый уровень) ---
  {
    id: 'car_bmw_3_g20',
    title: 'BMW 3-Series 320d G20 M-Sport 2021',
    category: 'cars',
    categoryLabel: 'Автомобили',
    baseMarketPrice: 3450000,
    imageUrl: 'https://images.unsplash.com/photo-1555353540-64580b51c258?w=600&auto=format&fit=crop&q=80',
    minPlayerLevel: 5,
    typicalDefects: ['engine_knock', 'paint_damage', 'port_loose'],
    liquidity: 70,
    volatility: 0.15
  },
  {
    id: 'car_toyota_camry_70',
    title: 'Toyota Camry XV70 2.5 Elegance Plus 2020',
    category: 'cars',
    categoryLabel: 'Автомобили',
    baseMarketPrice: 2650000,
    imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&auto=format&fit=crop&q=80',
    minPlayerLevel: 5,
    typicalDefects: ['paint_damage', 'chassis_dented'],
    liquidity: 94,
    volatility: 0.08
  },
  {
    id: 'car_porsche_cayenne',
    title: 'Porsche Cayenne GTS 4.0 V8 Twin-Turbo',
    category: 'cars',
    categoryLabel: 'Автомобили',
    baseMarketPrice: 8900000,
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80',
    minPlayerLevel: 6,
    typicalDefects: ['engine_knock', 'paint_damage'],
    liquidity: 50,
    volatility: 0.22
  }
];

export const SELLER_NAMES = [
  'Алексей В.', 'Дмитрий К.', 'Михаил С.', 'Сергей П.', 'Иван Т.',
  'Анна М.', 'Елена Р.', 'Максим Д.', 'Владислав Б.', 'Кирилл Н.',
  'Артем Г.', 'Денис О.', 'Роман Ф.', 'Ольга Ш.', 'Виктор Е.'
];

export const BUYER_NAMES = [
  'Константин', 'Артур', 'Тимур', 'Святослав', 'Павел',
  'Валерия', 'Виктория', 'Григорий', 'Станислав', 'Руслан',
  'Эдуард', 'Анатолий', 'Мария', 'Илья', 'Ярослав'
];

export const SELLER_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80'
];
