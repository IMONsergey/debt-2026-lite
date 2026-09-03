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
import './styles/about-forum.css';
import './styles/tariffs.css';

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
      href: '#tariffs',
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
  tariffs: {
    eyebrow: 'Multipass',
    title: 'Welcome',
    logoImage: assetUrl('assets/images/tariffs/logo-form.svg'),
    handImage: assetUrl('assets/images/tariffs/hand-spaceman.png'),
    offer: 'Скидка 50% на один билет любого тарифа для представителя компании, которая впервые участвует в DEBT TECH.',
    agreement: 'Скидка предоставляется по согласованию с организаторами.',
    note: 'Стоимость указана по тарифу ранней регистрации и действует до 15 сентября.',
    ctaLabel: 'Принять участие',
    ctaModal: 'early-registration',
    items: [
      {
        id: 'business',
        title: 'Деловой',
        price: '44 000 ₽',
        background: assetUrl('assets/images/tariffs/business-bg.svg'),
        icon: assetUrl('assets/images/tariffs/business-icon.svg'),
        features: [
          { label: 'Деловая программа', active: true },
          { label: 'Кофе-брейк, обед', active: true },
          { label: 'Фотоотчет', active: true },
          { label: 'Презентации спикеров', active: true },
          { label: 'Видеозапись конференции', active: true },
          { label: 'Креативная вечерняя программа', active: false },
          { label: 'Space Disco Afterparty', active: false },
        ],
      },
      {
        id: 'full',
        title: 'Полный',
        price: '49 000 ₽',
        background: assetUrl('assets/images/tariffs/full-bg.svg'),
        icon: assetUrl('assets/images/tariffs/full-icon.svg'),
        features: [
          { label: 'Деловая программа', active: true },
          { label: 'Кофе-брейк, обед', active: true },
          { label: 'Фотоотчет', active: true },
          { label: 'Презентации спикеров', active: true },
          { label: 'Видеозапись конференции', active: true },
          { label: 'Креативная вечерняя программа', active: true },
          { label: 'Space Disco Afterparty', active: false },
        ],
      },
      {
        id: 'full-plus',
        title: 'Полный Plus',
        price: '66 000 ₽',
        background: assetUrl('assets/images/tariffs/full-plus-bg.svg'),
        icon: assetUrl('assets/images/tariffs/full-plus-icon.svg'),
        features: [
          { label: 'Деловая программа', active: true },
          { label: 'Кофе-брейк, обед', active: true },
          { label: 'Фотоотчет', active: true },
          { label: 'Презентации спикеров', active: true },
          { label: 'Видеозапись конференции', active: true },
          { label: 'Креативная вечерняя программа', active: true },
          { label: 'Space Disco Afterparty', active: true },
        ],
      },
    ],
  },
  aboutForum: {
    eyebrow: 'О форуме',
    title: 'DEBT TECH 2026',
    description: 'Ежегодная форум-выставка о технологиях на рынке долговых активов',
    planetImage: assetUrl('assets/images/about-forum/planet-about.png'),
    features: [
      'Эксклюзивная деловая программа с практическими кейсами',
      'Активное участие представителей государственных органов и СРО',
      'Спецформаты и услуги для участников',
      'Доступ к готовым решениям: демостенды, контакты интеграторов и разработчиков',
      'Новые партнёры и сделки',
    ],
    stats: [
      { value: '800+', label: 'участников' },
      { value: '400+', label: 'компаний' },
      { value: '100+', label: 'спикеров' },
      { value: '50+', label: 'партнеров' },
    ],
    tags: [
      { id: 'artificial-intelligence', label: 'Искусственный интеллект', icon: assetUrl('assets/images/about-forum/tags/artificial-intelligence.svg') },
      { id: 'big-data', label: 'Big Data', icon: assetUrl('assets/images/about-forum/tags/big-data.svg') },
      { id: 'ai-agents', label: 'AI-агенты', icon: assetUrl('assets/images/about-forum/tags/ai-agents.svg') },
      { id: 'speech-analytics', label: 'Речевая аналитика', icon: assetUrl('assets/images/about-forum/tags/speech-analytics.svg') },
      { id: 'bi', label: 'BI', icon: assetUrl('assets/images/about-forum/tags/bi.svg') },
      { id: 'low-code', label: 'Low-code', icon: assetUrl('assets/images/about-forum/tags/low-code.svg') },
      { id: 'import-substitution', label: 'Импортозамещение', icon: assetUrl('assets/images/about-forum/tags/import-substitution.svg') },
      { id: 'data-driven', label: 'Data driven', icon: assetUrl('assets/images/about-forum/tags/data-driven.svg') },
      { id: 'e-justice', label: 'Электронное правосудие', icon: assetUrl('assets/images/about-forum/tags/e-justice.svg') },
      { id: 'distressed-debt', label: 'Проблемный долг', icon: assetUrl('assets/images/about-forum/tags/distressed-debt.svg') },
      { id: 'cession', label: 'Цессия', icon: assetUrl('assets/images/about-forum/tags/cession.svg') },
      { id: 'investments', label: 'Инвестиции', icon: assetUrl('assets/images/about-forum/tags/investments.svg') },
      { id: 'e-auctions', label: 'Электронные торги', icon: assetUrl('assets/images/about-forum/tags/e-auctions.svg') },
    ],
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
    channels: [
      { id: 'telegram', label: 'Telegram', href: 'https://t.me/rvzrus_chat' },
      { id: 'max', label: 'Max', href: 'https://max.ru/id9725047250_biz' },
    ],
  },
};

export default function App() {
  const [activeForm, setActiveForm] = useState(null);

  useEffect(() => {
    document.title = 'DEBT TECH 2026 - Вселенная технологий | 13 ноября | Москва';
    preloadImages([
      content.hero.backgroundImage,
      content.hero.backgroundImageAdaptive,
      content.aboutForum.planetImage,
      ...content.aboutForum.tags.map((tag) => tag.icon),
      content.tariffs.logoImage,
      content.tariffs.handImage,
      ...content.tariffs.items.flatMap((item) => [item.background, item.icon]),
      ...content.venue.images.map((item) => item.image),
      ...content.gallery.items.map((item) => item.image),
    ]);
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
          key={typeof activeForm === 'string' ? activeForm : `${activeForm.kind}-${activeForm.tariff?.id ?? 'form'}`}
          kind={typeof activeForm === 'string' ? activeForm : activeForm.kind}
          selectedTariff={typeof activeForm === 'string' ? null : activeForm.tariff}
          config={content.forms}
          privacyHref={content.footer.privacyHref}
          onClose={() => setActiveForm(null)}
        />
      ) : null}
    </>
  );
}

function preloadImages(urls) {
  urls.filter(Boolean).forEach((url) => {
    const image = new Image();
    image.decoding = 'async';
    image.loading = 'eager';
    image.fetchPriority = 'high';
    image.src = url;
  });
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

  const isExternal = /^https?:\/\//.test(cta.href);

  return (
    <a
      className="mobile-registration"
      href={cta.href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noreferrer' : undefined}
    >
      <span>{cta.label}</span>
      <img src={assetUrl('assets/icons/arrow-up.svg')} alt="" aria-hidden="true" />
    </a>
  );
}
