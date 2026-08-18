import { useEffect } from 'react';
import { CosmosPointerEffect } from './components/CosmosPointerEffect.jsx';
import { SitePage } from './components/SitePage.jsx';
import { VideoWidget } from './components/VideoWidget.jsx';
import './styles/hero-only.css';
import './styles/hero-only-media-fixes.css';
import './styles/soft-reveal.css';

const galleryImages = [
  '01.webp', '02.webp', '03.webp', '04.webp', '05.webp',
  '06.webp', '07.webp', '08.webp', '09.webp', '10.jpg',
  '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg',
  '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg',
];

const assetUrl = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;

const content = {
  pageMode: 'hero-landing',
  site: {
    title: 'DEBT TECH 2026',
    date: '13 ноября 2026',
    city: 'Москва',
    logo: assetUrl('assets/debttech-logo.svg'),
  },
  menu: {
    groups: [],
    cta: {
      label: 'Ранняя регистрация',
      href: 'https://t.me/anna_joys',
      modal: null,
    },
    secondaryCta: {
      label: 'Забронировать стенд',
      href: 'https://t.me/anna_joys',
      modal: null,
    },
    sidebar: {
      venueTitle: 'TAU - пространство\nмузыкальных культур',
      venueAddress: 'Москва, Рязанский проспект, 8Ас10',
      venueImage: assetUrl('assets/images/venue.webp'),
      routeLabel: 'Смотреть на карте',
      routeHref: 'https://yandex.ru/maps/?text=%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0%2C%20%D0%A0%D1%8F%D0%B7%D0%B0%D0%BD%D1%81%D0%BA%D0%B8%D0%B9%20%D0%BF%D1%80%D0%BE%D1%81%D0%BF%D0%B5%D0%BA%D1%82%2C%208%D0%90%D1%8110',
      contactLabel: 'Контакты для связи',
      contactEmail: 'redchief@rvzrus.ru',
      organizersLabel: 'ОРГАНИЗАТОРЫ',
      organizersImage: assetUrl('assets/icons/organizers.svg'),
    },
  },
  hero: {
    title: 'DEBT TECH 2026',
    backgroundImage: assetUrl('assets/hero-debttech-2026.png'),
    backgroundImageAdaptive: assetUrl('assets/hero-debttech-2026-adaptive.png'),
    bottomTitle: 'Стратегии, технологии и инновационные сервисы для работы с долговыми обязательствами',
    countdownLabel: 'Время до запуска',
    countdownTarget: '2026-11-13T00:00:00+03:00',
    countdown: [
      { value: '00', label: 'дней' },
      { value: '00', label: 'часов' },
      { value: '00', label: 'минут' },
      { value: '00', label: 'секунд' },
    ],
  },
  ticker: {
    items: [
      '800+ делегатов',
      '70+ спикеров',
      '50+ участников выставки',
      '3 сцены',
      'Креативная вечерняя программа',
      'Интерактивные зоны',
      'Пресс-студия',
      'Фуршет',
      'VIP-резиденции',
      'Afterparty',
    ],
  },
  heroVideo: {
    title: 'Как проходят наши конференции',
    previewUrl: 'https://kinescope.io/embed/dWWEsDjKoSiH5GH9RM24fz?autopause=false&autoplay=true&background=true&controls=false&loop=true&muted=true&transparent=false',
    embedUrl: 'https://kinescope.io/embed/dWWEsDjKoSiH5GH9RM24fz?autopause=false&autoplay=true&background=false&controls=true&loop=false&muted=true&transparent=true',
    widgetUrl: 'https://kinescope.io/embed/dWWEsDjKoSiH5GH9RM24fz?autopause=false&autoplay=true&background=false&controls=true&loop=false&muted=false&transparent=false',
  },
  gallery: {
    title: 'Кадры с DEBT TECH 2025',
    ctaLabel: 'Смотреть все фото',
    href: 'https://rvz.bitrix24.ru/~0IZ9x',
    items: galleryImages.map((name, index) => ({
      image: assetUrl(`assets/images/gallery/${name}`),
      alt: `DEBT TECH 2025 — кадр ${index + 1}`,
    })),
  },
  footer: {
    copyright: '© 2026 DEBT TECH. Все права защищены.',
    privacyLabel: 'Политика конфиденциальности и персональных данных',
    privacyHref: 'https://rvzrus.ru/politic',
  },
};

export default function App() {
  useEffect(() => {
    document.title = 'DEBT TECH 2026 - Вселенная технологий | 13 ноября | Москва';
  }, []);

  return (
    <>
      <CosmosPointerEffect />
      <div className="hero-only-view">
        <SitePage content={content} />
      </div>
      <VideoWidget video={content.heroVideo} />
    </>
  );
}
