import { useEffect, useState } from 'react';
import { CosmosPointerEffect } from './components/CosmosPointerEffect.jsx';
import { ApplicationModal } from './components/ApplicationModal.jsx';
import { SitePage } from './components/SitePage.jsx';
import { VideoWidget } from './components/VideoWidget.jsx';
import { assetUrl } from './lib/assets.js';
import './styles/hero-only.css';
import './styles/hero-only-media-fixes.css';
import './styles/soft-reveal.css';
import './styles/venue-section.css';
import './styles/mobile-registration.css';

const galleryImages = [
  '01.webp', '02.webp', '03.webp', '04.webp', '05.webp',
  '06.webp', '07.webp', '08.webp', '09.webp', '10.jpg',
  '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg',
  '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg',
];

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
      modal: 'early-registration',
    },
    secondaryCta: {
      label: 'Забронировать стенд',
      href: 'https://t.me/anna_joys',
      modal: 'stand-booking',
    },
    sidebar: {
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
    title: 'Как это было в 2025',
    previewUrl: 'https://kinescope.io/embed/dd7dQ3BMbTCeSfteZFXCiS?autopause=false&autoplay=true&background=true&controls=false&loop=true&muted=true&transparent=false',
    embedUrl: 'https://kinescope.io/embed/dd7dQ3BMbTCeSfteZFXCiS?autopause=false&autoplay=true&background=false&controls=true&loop=true&muted=true&transparent=true',
    widgetUrl: 'https://kinescope.io/embed/dd7dQ3BMbTCeSfteZFXCiS?autopause=false&autoplay=true&background=false&controls=true&loop=true&muted=false&transparent=false',
  },
  venue: {
    title: 'Место проведения',
    date: '13 ноября 2026',
    name: 'TAU — пространство музыкальных культур',
    address: 'Москва, Рязанский проспект, 8Ас10',
    routeLabel: 'Смотреть на карте',
    routeHref: 'https://yandex.ru/maps/?text=%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0%2C%20%D0%A0%D1%8F%D0%B7%D0%B0%D0%BD%D1%81%D0%BA%D0%B8%D0%B9%20%D0%BF%D1%80%D0%BE%D1%81%D0%BF%D0%B5%D0%BA%D1%82%2C%208%D0%90%D1%8110',
    images: [
      { image: assetUrl('assets/images/venue/event.webp'), alt: 'Событие в пространстве TAU' },
      { image: assetUrl('assets/images/venue/lounge.webp'), alt: 'Лаунж-зона TAU' },
      { image: assetUrl('assets/images/venue/hall.webp'), alt: 'Главный зал TAU' },
    ],
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
  forms: {
    eventId: 'debt-tech-2026',
    contactEmail: 'redchief@rvzrus.ru',
    telegramUrl: 'https://t.me/anna_joys',
  },
};

export default function App() {
  const [activeForm, setActiveForm] = useState(null);

  useEffect(() => {
    document.title = 'DEBT TECH 2026 - Вселенная технологий | 13 ноября | Москва';
  }, []);

  return (
    <>
      <CosmosPointerEffect />
      <div className="hero-only-view">
        <SitePage content={content} onOpenApplication={setActiveForm} />
      </div>
      <VideoWidget video={content.heroVideo} />
      <MobileRegistration cta={content.menu.cta} onOpenApplication={setActiveForm} />
      {activeForm ? (
        <ApplicationModal
          key={activeForm}
          kind={activeForm}
          config={content.forms}
          privacyHref={content.footer.privacyHref}
          onClose={() => setActiveForm(null)}
        />
      ) : null}
    </>
  );
}

function MobileRegistration({ cta, onOpenApplication }) {
  if (!cta) return null;

  if (cta.modal) {
    return (
      <button className="mobile-registration" type="button" onClick={() => onOpenApplication(cta.modal)}>
        <span>{cta.label}</span>
        <img src={assetUrl('assets/icons/arrow-up.svg')} alt="" aria-hidden="true" />
      </button>
    );
  }

  if (!cta.href) return null;

  return (
    <a className="mobile-registration" href={cta.href} target="_blank" rel="noreferrer">
      <span>{cta.label}</span>
      <img src={assetUrl('assets/icons/arrow-up.svg')} alt="" aria-hidden="true" />
    </a>
  );
}
