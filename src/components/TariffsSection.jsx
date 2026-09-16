import { ResponsiveImage } from './ResponsiveImage.jsx';
import { typograf } from '../lib/typography.js';
import { assetUrl } from '../lib/assets.js';

export function TariffsSection({ tariffs, onOpenApplication }) {
  if (!tariffs || !Array.isArray(tariffs.items) || tariffs.items.length === 0) return null;

  return (
    <section className="tariffs-section page-section" id="tariffs" aria-labelledby="tariffs-title">
      <div className="tariffs-section__hero">
        <div className="tariffs-section__intro">
          <span className="tariffs-section__eyebrow">{typograf(tariffs.eyebrow)}</span>
          <h2 className="section-title" id="tariffs-title">{typograf(tariffs.title)}</h2>
        </div>

        <div className="tariffs-section__visual" aria-hidden="true">
          <img className="tariffs-section__slash" src={tariffs.logoImage} alt="" decoding="async" loading="lazy" />
          <ResponsiveImage className="tariffs-section__hand" src={tariffs.handImage} alt="" decoding="async" />
        </div>
      </div>

      <div className="tariffs-section__cards">
        {tariffs.items.map((item) => (
          <article className={`tariff-card tariff-card--${item.id}`} key={item.id}>
            <img className="tariff-card__bg" src={item.background} alt="" aria-hidden="true" loading="lazy" decoding="async" />
            <div className="tariff-card__inner">
              <h3>{typograf(item.title)}</h3>

              <ul className="tariff-card__features">
                {item.features.map((feature) => (
                  <li className={feature.active ? '' : 'is-muted'} key={feature.label}>
                    <img src={item.icon} alt="" aria-hidden="true" loading="lazy" decoding="async" />
                    <span>{typograf(feature.label)}</span>
                  </li>
                ))}
              </ul>

              <div className="tariff-card__footer">
                <span className="tariff-card__price-label">Стоимость</span>
                <span className="tariff-card__price-note">{typograf(tariffs.note)}</span>
                <strong>{typograf(item.price)}</strong>
                <button
                  className="ui-button ui-button--secondary tariff-card__button"
                  type="button"
                  onClick={() => onOpenApplication?.({
                    kind: tariffs.ctaModal,
                    tariff: {
                      id: item.id,
                      title: item.title,
                      price: item.price,
                    },
                  })}
                >
                  <span>{typograf(tariffs.ctaLabel)}</span>
                  <img src={assetUrl('assets/icons/arrow-up.svg')} alt="" aria-hidden="true" loading="lazy" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
