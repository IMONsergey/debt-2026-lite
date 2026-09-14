import { assetUrl } from '../lib/assets.js';
// Sidebar data preserved from the published branch.
export const legacyContent = {
  site: {
    title: 'DEBT TECH 2026',
    date: '13 ноября 2026',
    city: 'Москва',
    logo: assetUrl('assets/debttech-logo.svg')
  },
  menu: {
    groups: [],
    cta: {
      label: 'Ранняя регистрация',
      href: '#tariffs'
    },
    secondaryCta: {
      label: 'Забронировать стенд',
      href: 'https://t.me/anna_joys',
      modal: 'stand-booking'
    },
    sidebar: {
      contactLabel: 'Контакты для связи',
      contactEmail: 'redchief@rvzrus.ru',
      organizersLabel: 'ОРГАНИЗАТОРЫ',
      organizersImage: assetUrl('assets/icons/organizers.svg')
    }
  },
  heroVideo: {
    title: 'Как это было в 2025',
    previewUrl: 'https://kinescope.io/embed/dd7dQ3BMbTCeSfteZFXCiS?autopause=false&autoplay=true&background=true&controls=false&loop=true&muted=true&transparent=false',
    embedUrl: 'https://kinescope.io/embed/dd7dQ3BMbTCeSfteZFXCiS?autopause=false&autoplay=true&background=false&controls=true&loop=true&muted=true&transparent=true',
    widgetUrl: 'https://kinescope.io/embed/dd7dQ3BMbTCeSfteZFXCiS?autopause=false&autoplay=true&background=false&controls=true&loop=true&muted=false&transparent=false'
  },
  forms: {
    eventId: 'debt-tech-2026',
    contactEmail: 'redchief@rvzrus.ru',
    telegramUrl: 'https://t.me/anna_joys',
    channels: [{
      id: 'telegram',
      label: 'Telegram',
      href: 'https://t.me/rvzrus_chat'
    }, {
      id: 'max',
      label: 'Max',
      href: 'https://max.ru/id9725047250_biz'
    }]
  }
};
