import { ResponsiveImage } from './ResponsiveImage.jsx';
import { typograf } from '../lib/typography.js';
import { assetUrl } from '../lib/assets.js';
import { ChannelIcon } from './ChannelIcon.jsx';

export function OrganizerSection({ organizer }) {
  if (!organizer) return null;

  const contacts = organizer.contacts ?? {};
  const channels = contacts.channels ?? [];

  return (
    <section className="organizer-section content-section page-section" id="organizer" aria-labelledby="organizer-title">
      <div className="organizer-section__heading">
        <h2 className="organizer-section__title section-title" id="organizer-title">{typograf(organizer.title)}</h2>
        <address className="organizer-contact-strip" aria-label="Контакты организатора форума">
          <span className="organizer-contact-strip__label">{typograf(contacts.label)}</span>
          <div className="organizer-contact-strip__items">
            <a className="organizer-contact-strip__link" href={contacts.phoneHref}>{contacts.phone}</a>
            <a className="organizer-contact-strip__link" href={`mailto:${contacts.email}`}>{contacts.email}</a>
            <div className="organizer-contact-strip__actions">
              <a className="organizer-contact-strip__link organizer-contact-strip__site" href={contacts.websiteHref} target="_blank" rel="noreferrer">
                <span>{typograf(contacts.websiteLabel)}</span>
                <img src={assetUrl('assets/icons/arrow-up.svg')} width="16" height="16" alt="" aria-hidden="true" />
              </a>
              <div className="organizer-contact-strip__socials">
                {channels.map((channel) => (
                  <a key={channel.id} href={channel.href} target="_blank" rel="noreferrer" aria-label={`Открыть ${channel.label}`} title={channel.label}>
                    <ChannelIcon id={channel.id} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </address>
      </div>

      <div className="organizer-layout">
        <a className="organizer-card organizer-card--brand organizer-card--link" href={organizer.media.href} target="_blank" rel="noreferrer">
          <img src={organizer.media.logo} width="306" height="55" alt="Рынок взыскания" loading="lazy" decoding="async" />
          <div>
            <h3>{typograf(organizer.media.title)}</h3>
            <p>{typograf(organizer.media.license)}</p>
          </div>
          <span className="organizer-card__arrow" aria-hidden="true">
            <img src={assetUrl('assets/icons/organizer-arrow.svg')} width="32" height="32" alt="" />
          </span>
        </a>

        <figure className="organizer-card organizer-card--photo">
          <ResponsiveImage src={organizer.photo.image} alt={organizer.photo.alt} loading="lazy" decoding="async"  sizes="(max-width: 639px) 92vw, (max-width: 1180px) 46vw, 26vw" />
        </figure>

        <a className="organizer-card organizer-card--rating organizer-card--link" href={organizer.rating.href} target="_blank" rel="noreferrer">
          <div>
            <h3>{typograf(organizer.rating.title)}</h3>
            <p>{typograf(organizer.rating.description)}</p>
          </div>
          <strong className="organizer-card__rating-number" aria-hidden="true">300</strong>
          <span className="organizer-card__arrow" aria-hidden="true">
            <img src={assetUrl('assets/icons/organizer-arrow.svg')} width="32" height="32" alt="" />
          </span>
        </a>

        <article className="organizer-card organizer-card--metrics">
          <p>{typograf(organizer.metrics.title)}</p>
          <div className="organizer-metrics">
            {organizer.metrics.items.map((item) => (
              <div key={item.label}>
                <strong>{typograf(item.value)}</strong>
                <span>{typograf(item.label)}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="organizer-card organizer-card--features">
          {organizer.features.map((feature, index) => (
            <p key={feature}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              {typograf(feature)}
            </p>
          ))}
        </article>

        <a className="organizer-card organizer-card--navigator organizer-card--link" href={organizer.navigator.href} target="_blank" rel="noreferrer">
          <ResponsiveImage src={organizer.navigator.image} alt="" aria-hidden="true" loading="lazy" decoding="async"  sizes="(max-width: 639px) 92vw, (max-width: 1180px) 46vw, 26vw" />
          <div>
            <img className="organizer-card__navigator-logo" src={organizer.navigator.logo} width="306" height="39" alt={organizer.navigator.title} loading="lazy" decoding="async" />
            <p>{typograf(organizer.navigator.description)}</p>
          </div>
          <span className="organizer-card__arrow" aria-hidden="true">
            <img src={assetUrl('assets/icons/organizer-arrow.svg')} width="32" height="32" alt="" />
          </span>
        </a>
      </div>
    </section>
  );
}
