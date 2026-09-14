import { assetUrl } from '../lib/assets.js';

// Editorial source: supplied «Структура и контент сайта _ DEBT TECH 2026.docx».
// Discrepancies are retained and listed in docs/CONTENT_NOTES.md, not silently reconciled.
export const event = {
  title: 'DEBT TECH 2026',
  date: '13 ноября 2026',
  city: 'Москва',
  target: '2026-11-13T00:00:00+03:00',
  headline: 'Стратегии, технологии и инновационные сервисы для работы с долговыми обязательствами',
  countdownLabel: 'Время для запуска'
};
export const ticker = ['800+ делегатов', '70+ спикеров', '50+ участников выставки', '3 сцены', 'креативная программа', 'интерактивные зоны', 'пресс-студия', 'фуршет', 'VIP-резиденция', 'Afterparty'];
export const about = {
  title: 'DEBT TECH 2026',
  lead: 'Ежегодная форум-выставка о технологиях на рынке долговых активов',
  rendezvous: 'До встречи на 13 ноября в Москве',
  features: ['Эксклюзивная деловая программа с практическими кейсами', 'Активное участие представителей государственных органов и СРО', 'Спецформаты и услуги для участников', 'Доступ к готовым решениям: демостенды, контакты интеграторов и разработчиков', 'Новые партнёры и сделки'],
  stats: [{
    value: '800+',
    label: 'участников'
  }, {
    value: '400+',
    label: 'компаний'
  }, {
    value: '100+',
    label: 'спикеров'
  }, {
    value: '50+',
    label: 'партнеров'
  }],
  topics: ['Искусственный интеллект', 'Big Data', 'AI-агенты', 'Речевая аналитика', 'BI', 'Low-code', 'Импортозамещение', 'Low-code', 'Data Driven', 'Электронное правосудие', 'Проблемный долг', 'Цессия', 'Инвестиции', 'Электронные торги']
};
export const venue = {
  title: 'Место проведения',
  name: 'TAU — пространство музыкальных культур',
  address: 'Москва, Рязанский проспект, 8Ас10',
  route: 'https://yandex.ru/maps/?text=%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0%2C%20%D0%A0%D1%8F%D0%B7%D0%B0%D0%BD%D1%81%D0%BA%D0%B8%D0%B9%20%D0%BF%D1%80%D0%BE%D1%81%D0%BF%D0%B5%D0%BA%D1%82%2C%208%D0%90%D1%8110',
  images: ['event', 'hall', 'lounge'].map(name => assetUrl(`assets/images/venue/${name}.webp`))
};
export const gallery = Array.from({
  length: 20
}, (_, i) => ({
  src: assetUrl(`assets/images/gallery/${String(i + 1).padStart(2, '0')}.webp`),
  alt: `DEBT TECH 2025 — кадр ${i + 1}`
}));
export const stages = [{
  title: 'Центр управления полетами',
  label: 'Главная сцена',
  visual: 'core'
}, {
  title: 'Орбитальная станция',
  label: 'Малая сцена',
  visual: 'rings'
}, {
  title: 'Обсерватория',
  label: 'Вендорская сцена',
  visual: 'sphere'
}];
export const program = [{
  id: 'expo',
  title: 'Масштабная выставка продуктовых решений и технологий',
  items: ['Цифровой планетарий, где можно в реальном времени протестировать сервисы'],
  visual: 'rings'
}, {
  id: 'zones',
  title: 'Тематические зоны',
  items: ['Гадание по звездам', 'Центр притяжения инвестиций', 'DEBT TECH / НАВИГАТОР'],
  visual: 'constellation'
}, {
  id: 'afterparty',
  title: 'Развлекательная программа',
  items: ['Криозона', 'Вечерний фуршет', 'SpaceDisco AFTERPARTY'],
  visual: 'wave'
}];
export const privateZones = [{
  title: 'КОСМИЧЕСКАЯ VIP-РЕЗИДЕНЦИЯ',
  text: 'Ваша личная орбитальная база: приватные зоны и комфорт высшего уровня'
}, {
  title: 'TALK ZONE',
  text: 'Зона деловых переговоров с бронированием тайм-слотов'
}];
export const services = [{
  title: 'Зона переговоров и сделок',
  lead: 'Организуем деловые встречи на площадке форума',
  items: ['Отдельный зал с бронированием тайм-слотов', 'Экран для проведения презентаций', 'Бар и индивидуальное обслуживание', 'Помощь в подготовке встреч'],
  visual: 'rings'
}, {
  title: 'Сервис деловых знакомств',
  lead: 'Помогаем найти контакты и договориться о встрече',
  items: ['По запросу подберем нужного человека или компанию', 'Организуем знакомство и переговоры'],
  visual: 'constellation'
}, {
  title: 'Пресс-студия «Рынка Взыскания»',
  lead: 'Проводим видеоинтервью с гостями',
  items: ['Профессиональное оборудование для видеосъемки', 'Согласование вопросов и консалтинг', 'Публикация на сайте и во всех каналах «Рынка Взыскания»'],
  visual: 'wave'
}];
export const serviceSteps = ['Сообщите менеджеру, с кем хотите встретиться', 'Укажите тему и цель общения', 'Выберите удобное время (10–15 минут)'];
export const participants = ['БАНКИ', 'ПКО', 'МФО', 'БКИ', 'ОРГАНИЗАЦИИ ЖКХ И ТЭК', 'АРБИТРАЖНЫЕ УПРАВЛЯЮЩИЕ', 'ОТРАСЛЕВЫЕ СРО', 'ГОСУДАРСТВЕННЫЕ ОРГАНЫ', 'ЮРИДИЧЕСКИЕ КОМПАНИИ', 'КОНСАЛТИНГОВЫЕ КОМПАНИИ', 'IT-ВЕНДОРЫ', 'ТОРГОВЫЕ ПЛОЩАДКИ'];
export const organizer = {
  title: 'СМИ «РЫНОК ВЗЫСКАНИЯ»',
  license: 'Эл № ФС77-82673 от 10.02.2022',
  lead: 'Единственное медиа о профессиональном взыскании',
  stats: [{
    value: '50 000+',
    label: 'постоянных читателей'
  }, {
    value: '1000+',
    label: 'участников конференций в 2025 году'
  }],
  features: ['Совместные исследования с лидерами отрасли', 'Актуальные новости рынка', 'Обзоры it-технологий в коллекшн', 'Судебная практика', 'Интервью с ключевыми персонами'],
  rating: {
    title: 'РЕЙТИНГ ПКО-300',
    text: 'Уникальный инструмент оценки коллекторских компаний'
  },
  navigator: {
    title: 'DEBT TECH НАВИГАТОР',
    text: 'Навигатор по технологическим решениям для работы с долговыми обязательствами: от аналитики до продажи, взыскания и банкротства.'
  }
};
export const conferences = [{
  id: 'kazan-2026',
  title: 'DOLG TALK Казань',
  year: 2026,
  href: 'https://kazan.dolgtalk.ru/',
  image: null
}, {
  id: 'dolg-2026',
  title: 'DOLG TALK',
  year: 2026,
  href: 'https://dolgtalk.ru/',
  image: 'https://static.tildacdn.com/tild3439-6133-4664-b530-626166626538/Rectangle_3976050_1.png'
}, {
  id: 'siberia-2026',
  title: 'DOLG TALK Сибирь',
  year: 2026,
  href: 'https://novosib.dolgtalk.ru/',
  image: 'https://static.tildacdn.com/tild6330-3662-4133-b638-663835333638/DolgTalk_Mordvinov-0.jpg'
}, {
  id: 'debt-2025',
  title: 'DEBT TECH',
  year: 2025,
  href: 'https://2025.debt-tech.ru/',
  image: 'https://static.tildacdn.com/tild3337-6136-4633-a161-303766326233/1-233_1.jpg'
}, {
  id: 'dolg-2025',
  title: 'DOLG TALK',
  year: 2025,
  href: 'https://dolgtalk.ru/2025',
  image: 'https://static.tildacdn.com/tild3264-6533-4230-a433-323533616635/DSC_8432_resized_1_1.png'
}, {
  id: 'kazan-2025',
  title: 'DOLG TALK Казань',
  year: 2025,
  href: 'https://kazan.dolgtalk.ru/2025',
  image: 'https://static.tildacdn.com/tild3938-3862-4162-b565-313962663439/Rectangle_3975985_1.png'
}, {
  id: 'debt-2024',
  title: 'DEBT TECH',
  year: 2024,
  href: 'https://debttech.rvzrus.ru/',
  image: 'https://static.tildacdn.com/tild6362-3663-4864-b332-303065383566/Rectangle_75_1.png'
}, {
  id: 'analytics-2023',
  title: 'АНАЛИТИКА И ФИНАНСЫ ДОЛГОВЫХ ПОРТФЕЛЕЙ 2.0',
  year: 2023,
  href: 'https://rvzrus.ru/news/2521',
  image: 'https://static.tildacdn.com/tild3037-3437-4335-a336-343266366264/image_6_1.png'
}, {
  id: 'analytics-2022',
  title: 'АНАЛИТИКА И ФИНАНСЫ ДОЛГОВЫХ ПОРТФЕЛЕЙ',
  year: 2022,
  href: 'https://rvzrus.ru/news/2464',
  image: 'https://static.tildacdn.com/tild3935-3236-4966-a234-393461333562/image_5_1.png'
}, {
  id: 'petersburg-2021',
  title: 'ПЕТЕРБУРГСКИЙ ФОРУМ ВЗЫСКАТЕЛЕЙ',
  year: 2021,
  href: 'https://rvzrus.ru/news/2083',
  image: 'https://static.tildacdn.com/tild3365-3435-4331-b763-666231666563/image_4_1.png'
}];
export const tariffFeatures = ['Деловая программа', 'Кофе-брейк, обед', 'Фотоотчет', 'Презентации спикеров', 'Видеозапись конференции', 'Креативная вечерняя программа', 'Space Disco Afterparty'];
// The supplied Word source lists the same features for all tiers: no invented exclusions.
export const tariffs = [{
  id: 'business',
  title: 'Деловой',
  price: '44 000 ₽',
  visual: 'sphere'
}, {
  id: 'full',
  title: 'Полный',
  price: '49 000 ₽',
  visual: 'rings'
}, {
  id: 'full-plus',
  title: 'Полный Plus',
  price: '66 000 ₽',
  visual: 'core'
}];
export const links = {
  organizer: 'https://rvzrus.ru/',
  telegram: 'https://t.me/rvzrus_chat',
  max: 'https://max.ru/id9725047250_biz',
  whatsapp: 'https://wa.me/79657868846',
  privacy: 'https://rvzrus.ru/politic'
};
