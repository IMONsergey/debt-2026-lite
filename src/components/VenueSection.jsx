import { typograf } from '../lib/typography.js';
import { assetUrl } from '../lib/assets.js';

export function VenueSection({ venue }) {
  const images = venue?.images ?? [];

  if (!venue || images.length === 0) return null;

  const routeIsExternal = /^https?:\/\//.test(venue.routeHref ?? '');

  return (
    <section className="venue-section page-section" id="venue" aria-labelledby="venue-title">
      <h2 className="section-title" id="venue-title">{typograf(venue.title)}</h2>

      <div className="venue-section__layout">
        <div className="venue-section__details">
          <span className="venue-section__date">{typograf(venue.date)}</span>
          <div className="venue-section__address">
            <strong>{typograf(venue.name)}</strong>
            <span>{typograf(venue.address)}</span>
          </div>
          <a
            className="ui-button ui-button--secondary venue-section__route"
            href={venue.routeHref}
            target={routeIsExternal ? '_blank' : undefined}
            rel={routeIsExternal ? 'noreferrer' : undefined}
          >
            <span>{typograf(venue.routeLabel)}</span>
            <img src={assetUrl('assets/icons/route-pin.svg')} alt="" aria-hidden="true" />
          </a>
        </div>

        <div className="venue-bento" aria-label="Фотографии места проведения">
          {images.map((item, index) => (
            <figure
              className={`venue-bento__tile${index === 0 ? ' venue-bento__tile--primary' : ''}`}
              key={item.image}
            >
              <img src={item.image} alt={item.alt} loading="lazy" decoding="async" />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
