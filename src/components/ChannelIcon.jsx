import { assetUrl } from '../lib/assets.js';

const CHANNEL_ICON_BY_ID = {
  telegram: 'telegram-contact.svg',
  max: 'max-contact.svg',
  whatsapp: 'whatsapp-contact.svg',
};

export function ChannelIcon({ id }) {
  const icon = CHANNEL_ICON_BY_ID[id] ?? CHANNEL_ICON_BY_ID.max;

  return (
    <img src={assetUrl(`assets/icons/${icon}`)} width="39" height="39" loading="lazy" alt="" aria-hidden="true" />
  );
}
