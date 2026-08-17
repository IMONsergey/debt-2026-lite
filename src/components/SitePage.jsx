import { useEffect, useMemo, useRef, useState } from 'react';
import { FixedMenu, SidebarInfo } from './FixedMenu.jsx';
import { typograf } from '../lib/typography.js';

export function SitePage({ content }) {
  const countdown = useCountdown(content.hero.countdownTarget, content.hero.countdown);
  const isHeroLanding = content.pageMode === 'hero-landing';

  return (
    <div className="app-shell">
      <div className="site-grid">
        <FixedMenu site={content.site} menu={content.menu} />
        <main className="page-flow" aria-label="Debt Tech 2026">
          <section
            className="hero-placeholder"
            id="top"
            style={{
              '--hero-image': `url("${content.hero.backgroundImage}")`,
              '--hero-image-adaptive': `url("${content.hero.backgroundImageAdaptive ?? content.hero.backgroundImage}")`,
            }}
          >
            <h1 className="visually-hidden">{content.hero.title}</h1>
            <div className="hero-placeholder__meta">
              <span>{content.site.date}</span>
              <span>{typograf(content.site.city)}</span>
            </div>
            <div className="hero-bottom">
              <div className="hero-bottom__content desktop-content-area content-grid">
                <p>{typograf(content.hero.bottomTitle)}</p>
                <div className="countdown" aria-label={content.hero.countdownLabel}>
                  <span className="countdown__label">{typograf(content.hero.countdownLabel)}</span>
                  <div className="countdown__items">
                    {countdown.map((item) => (
                      <span className="countdown__item" key={`${item.value}-${item.label}`}>
                        <strong>{item.value}</strong>
                        <span>{typograf(item.label)}</span>
                      </span>
                    ))}
                  </div>
                </div>
                <SidebarInfo className="mobile-hero-info" menu={content.menu} />
              </div>
            </div>
          </section>
          <TickerStrip items={content.ticker?.items} />
          {content.heroVideo ? <HeroVideoSection video={content.heroVideo} /> : null}
          {isHeroLanding ? (
            <>
              <GallerySection gallery={content.gallery} />
              <HeroLandingFooter logo={content.site.logo} footer={content.footer} />
            </>
          ) : (
            <>
              <AboutSection about={content.about} />
              <GallerySection gallery={content.gallery} />
              <ServicesSection services={content.services} />
              <ParticipantsSection participants={content.participants} />
              <OrganizerSection organizer={content.organizer} />
              <ConferencesSection conferences={content.conferences} />
              <PartnersSection partners={content.partners} />
              <InformationPartnersSection partners={content.informationPartners} />
              <ContactsSection contacts={content.contacts} />
              <SiteFooter footer={content.footer} brandImage={content.menu?.sidebar?.organizersImage} />
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function HeroVideoSection({ video }) {
  if (!video?.embedUrl) {
    return null;
  }

  return (
    <section className="hero-video-section" aria-labelledby="hero-video-title">
      <h2 id="hero-video-title">{typograf(video.title)}</h2>
      <div className="hero-video-section__player">
        <iframe
          src={video.embedUrl}
          title={video.title}
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer; clipboard-write"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </section>
  );
}

function HeroLandingFooter({ logo, footer }) {
  const privacyHref = footer?.privacyHref ?? '#privacy';

  return (
    <footer className="hero-landing-footer" id="privacy">
      <a className="hero-landing-footer__brand" href="#top" aria-label="Наверх">
        <img src={logo} alt="DEBT TECH 2026" />
      </a>
      <div className="hero-landing-footer__meta">
        <span>{typograf(footer?.copyright ?? '© 2026. Все права защищены.')}</span>
        <a href={privacyHref} target="_blank" rel="noreferrer">
          {typograf(footer?.privacyLabel ?? 'Политика конфиденциальности и персональных данных')}
        </a>
      </div>
    </footer>
  );
}

function SectionTitle({ children, className = '', ...props }) {
  return <h2 className={`section-title ${className}`.trim()} {...props}>{typograf(children)}</h2>;
}

function ParticipantsSection({ participants }) {
  if (!participants?.items?.length) {
    return null;
  }

  return (
    <section className="participants-section content-section site-content-rail" id="participants" aria-labelledby="participants-title">
      <span className="section-anchor" id="speakers" aria-hidden="true" />
      <span className="section-anchor" id="topics" aria-hidden="true" />
      <SectionTitle className="participants-section__title" id="participants-title">{participants.title}</SectionTitle>
      <div className="participants-grid">
        <img className="participants-grid__rocket" src={participants.rocketImage ?? 'assets/figma/participants-rocket.png'} alt="" loading="lazy" decoding="async" aria-hidden="true" />
        {participants.items.map((item, index) => (
          <article className={`participant-card participant-card--${index + 1}`} key={`${item.number}-${item.title}`}>
            <span className="participant-card__number">N{item.number}</span>
            <h3>{typograf(item.title)}</h3>
          </article>
        ))}
      </div>
    </section>
  );
}

function OrganizerSection({ organizer }) {
  if (!organizer) {
    return null;
  }

  return (
    <section className="organizer-section content-section site-content-rail" id="organizer" aria-labelledby="organizer-title">
      <SectionTitle className="organizer-section__title" id="organizer-title">{organizer.title}</SectionTitle>
      <div className="organizer-layout">
        <article className="organizer-card organizer-card--brand">
          <img src={organizer.brandLogo ?? 'assets/organizer/market-logo.svg'} alt="" aria-hidden="true" />
          <h3>{typograf(organizer.name)}</h3>
          <span>{typograf(organizer.registration)}</span>
        </article>
        <figure className="organizer-card organizer-card--photo">
          <img src={organizer.teamImage ?? 'assets/organizer/awards.png'} alt={organizer.teamImageAlt ?? 'Команда СМИ «Рынок Взыскания»'} loading="lazy" decoding="async" />
        </figure>
        <article className="organizer-card organizer-card--rating">
          <h3>{typograf(organizer.products?.[0]?.title)}</h3>
          <img src={organizer.ratingImage ?? 'assets/organizer/rating-300.svg'} alt="" aria-hidden="true" />
          <p>{typograf(organizer.products?.[0]?.text)}</p>
        </article>
        <article className="organizer-card organizer-card--metrics">
          <p>{typograf(organizer.description)}</p>
          <div className="organizer-metrics">
            {organizer.metrics?.map((metric) => (
              <div key={metric.label}>
                <strong>{typograf(metric.value)}</strong>
                <span>{typograf(metric.label)}</span>
              </div>
            ))}
          </div>
        </article>
        <article className="organizer-card organizer-card--features" aria-label="Направления работы">
          {organizer.features?.map((feature, index) => (
            <p key={feature}><span>{String(index + 1).padStart(2, '0')}</span>{typograf(feature)}</p>
          ))}
        </article>
        <article className="organizer-card organizer-card--navigator">
          <img src={organizer.navigatorImage ?? 'assets/organizer/navigator.png'} alt={organizer.navigatorImageAlt ?? 'Навигатор решений'} loading="lazy" decoding="async" />
          <div>
            <h3>{typograf(organizer.products?.[1]?.title)}</h3>
            <p>{typograf(organizer.products?.[1]?.text)}</p>
          </div>
        </article>
      </div>
    </section>
  );
}

function ConferencesSection({ conferences }) {
  if (!conferences?.items?.length) {
    return null;
  }

  return (
    <section className="conferences-section content-section site-content-rail" id="program" aria-labelledby="conferences-title">
      <div className="conferences-section__heading">
        <SectionTitle className="conferences-section__title" id="conferences-title">{conferences.title}</SectionTitle>
        <span>{typograf(conferences.period)}</span>
      </div>
      <div className="conferences-grid">
        {conferences.items.map((conference, index) => (
          <article className={index === 0 ? 'conference-card conference-card--featured' : 'conference-card'} key={conference.title}>
            <img src={conference.image} alt={conference.title} loading="lazy" decoding="async" />
            <div className="conference-card__content">
              <h3>{typograf(conference.title)}</h3>
              <span className="conference-card__year">{conference.year ?? String(2026 - Math.floor(index / 2))}</span>
              <img
                className="conference-card__arrow"
                src={index === 0 ? 'assets/conferences/featured-arrow.svg' : 'assets/conferences/card-arrow.svg'}
                alt=""
                aria-hidden="true"
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function PartnersSection({ partners }) {
  if (!partners) {
    return null;
  }

  return (
    <section className="partners-section content-section site-content-rail" id="partners" aria-labelledby="partners-title">
      <span className="section-anchor" id="tickets" aria-hidden="true" />
      <SectionTitle className="partners-section__title" id="partners-title">{partners.title}</SectionTitle>
      <article className="partner-feature">
        <header>
          <h3>{typograf(partners.name)}</h3>
          <span>{typograf(partners.subtitle)}</span>
          <img className="partner-feature__logo" src={partners.logo ?? 'assets/partners/debtprice-logo.svg'} alt={partners.logoAlt ?? 'DEBTPRICE Аукцион'} />
        </header>
        <div className="partner-feature__copy">
          {partners.paragraphs?.map((paragraph) => <p key={paragraph}>{typograf(paragraph)}</p>)}
        </div>
      </article>
    </section>
  );
}

function InformationPartnersSection({ partners }) {
  if (!partners?.items?.length) {
    return null;
  }

  return (
    <section className="information-partners content-section site-content-rail" aria-labelledby="information-partners-title">
      <SectionTitle className="information-partners__title" id="information-partners-title">{partners.title}</SectionTitle>
      <div className="information-partners__scene">
        <img className="information-partners__station" src={partners.stationImage ?? 'assets/partners/station.png'} alt="" loading="lazy" decoding="async" aria-hidden="true" />
        <div className="information-partners__grid">
        {partners.items.map((partner) => (
          <figure key={partner.name}>
            <img src={partner.image} alt={partner.name} loading="lazy" decoding="async" />
          </figure>
        ))}
        </div>
      </div>
    </section>
  );
}

function ContactsSection({ contacts }) {
  if (!contacts?.groups?.length) {
    return null;
  }

  return (
    <section className="contacts-section content-section site-content-rail" id="contacts" aria-labelledby="contacts-title">
      <div className="contacts-section__heading">
        <SectionTitle className="contacts-section__title" id="contacts-title">{contacts.title}</SectionTitle>
        <a className="contacts-accreditation" href={`mailto:${contacts.mediaEmail}`}>
          <span>{typograf(contacts.mediaLabel)}:</span>
          <strong>{contacts.mediaEmail}</strong>
          <img src={contacts.infoIcon ?? 'assets/contacts-info.svg'} alt="" aria-hidden="true" />
        </a>
      </div>
      <div className="contacts-grid">
        {contacts.groups.map((group, index) => (
          <article className={`contacts-card contacts-card--${index + 1}`} key={group.title}>
            <h3>{typograf(group.title)}</h3>
            <span>{typograf(group.primaryLabel ?? (index === 2 ? 'Сайт' : 'E-mail'))}</span>
            <a href={contactHref(group.email)}>{group.email}</a>
            <span>{typograf(group.secondaryLabel ?? (index === 2 ? 'Телеграм' : 'Тел.'))}</span>
            <a href={contactHref(group.phone)}>{group.phone}</a>
            {index === 0 && contacts.socials?.length ? (
              <div className="contacts-card__socials" aria-label="Социальные сети">
                {contacts.socials.map((social) => (
                  <a href={social.href} aria-label={social.label} key={social.href}>
                    <img src={social.image} alt="" aria-hidden="true" />
                  </a>
                ))}
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

function SiteFooter({ footer, brandImage }) {
  if (!footer) {
    return null;
  }

  return (
    <footer className="site-footer site-content-rail" id="privacy">
      {brandImage ? (
        <div className="site-footer__brand">
          <img src={brandImage} alt="DEBTPRICE и Рынок Взыскания" />
        </div>
      ) : null}
      <div className="site-footer__meta">
        <span>{typograf(footer.copyright)}</span>
        <a href={footer.privacyHref}>{typograf(footer.privacyLabel)}</a>
      </div>
      <a className="site-footer__up" href="#top" aria-label="Наверх"><img src="assets/arrow-up.svg" alt="" aria-hidden="true" /></a>
    </footer>
  );
}

function contactHref(value = '') {
  if (value.startsWith('+')) {
    return `tel:${value.replace(/\s+/g, '')}`;
  }
  if (value.includes('@') && !value.startsWith('@')) {
    return `mailto:${value}`;
  }
  if (value.startsWith('@')) {
    return `https://t.me/${value.slice(1).replace('.ru', '')}`;
  }
  return `https://${value}`;
}

function ServicesSection({ services }) {
  if (!services?.items?.length) {
    return null;
  }

  return (
    <section className="services-section content-section" id="services" aria-labelledby="services-title">
      <h2 className="services-section__title" id="services-title">{typograf(services.title)}</h2>
      <div className="services-section__list">
        {services.items.map((service) => (
          <ServiceRow service={service} key={service.id} />
        ))}
      </div>
    </section>
  );
}

function ServiceRow({ service }) {
  const mediaFirst = service.mediaSide !== 'right';

  return (
    <article className={`service-row service-row--${service.size ?? 'compact'} service-row--media-${service.mediaSide ?? 'left'}`}>
      {mediaFirst ? <ServiceMedia service={service} /> : <ServiceCopy service={service} />}
      {mediaFirst ? <ServiceCopy service={service} /> : <ServiceMedia service={service} />}
    </article>
  );
}

function ServiceMedia({ service }) {
  return (
    <figure className="service-row__media">
      <img src={service.image} alt={service.imageAlt} loading="lazy" decoding="async" />
    </figure>
  );
}

function ServiceCopy({ service }) {
  return (
    <div className="service-row__copy">
      <h3>{typograf(service.title)}</h3>
      {service.subtitle ? <p className="service-row__subtitle">{typograf(service.subtitle)}</p> : null}
      {service.body ? <p className="service-row__body">{typograf(service.body)}</p> : null}
      {service.bullets?.length ? <ServiceList items={service.bullets} /> : null}
      {service.secondaryTitle ? <h4>{typograf(service.secondaryTitle)}</h4> : null}
      {service.steps?.length ? <ServiceList items={service.steps} ordered /> : null}
      {service.cta ? (
        <a className="service-row__cta" href={service.cta.href}>
          <span>{typograf(service.cta.label)}</span>
          <img src="assets/arrow-up.svg" alt="" aria-hidden="true" />
        </a>
      ) : null}
    </div>
  );
}

function ServiceList({ items, ordered = false }) {
  const List = ordered ? 'ol' : 'ul';

  return (
    <List className={`service-row__list${ordered ? ' service-row__list--ordered' : ''}`}>
      {items.map((item, index) => <li key={`${item}-${index}`}>{typograf(item)}</li>)}
    </List>
  );
}

function GallerySection({ gallery }) {
  const items = gallery?.items ?? [];
  const initialIndex = Math.min(1, Math.max(0, items.length - 1));
  const [activeVirtualIndex, setActiveVirtualIndex] = useState(() => items.length + initialIndex);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [lightboxState, setLightboxState] = useState('closed');
  const [lightboxMotion, setLightboxMotion] = useState('open');
  const carouselRef = useRef(null);
  const slideRefs = useRef([]);
  const scrollEndTimerRef = useRef(null);
  const lightboxRef = useRef(null);
  const touchStartRef = useRef(null);
  const lightboxCloseTimerRef = useRef(null);
  const lightboxOpenFrameRef = useRef(null);
  const loopItems = useMemo(() => Array.from({ length: items.length * 3 }, (_, virtualIndex) => ({
    ...items[virtualIndex % items.length],
    sourceIndex: virtualIndex % items.length,
    virtualIndex,
  })), [items]);
  const activeIndex = items.length ? activeVirtualIndex % items.length : 0;

  useEffect(() => {
    const middleIndex = items.length + Math.min(1, Math.max(0, items.length - 1));
    setActiveVirtualIndex(middleIndex);
    const frame = window.requestAnimationFrame(() => scrollToSlide(middleIndex, 'auto'));

    return () => window.cancelAnimationFrame(frame);
  }, [items.length]);

  useEffect(() => () => window.clearTimeout(scrollEndTimerRef.current), []);

  useEffect(() => () => {
    window.clearTimeout(lightboxCloseTimerRef.current);
    if (lightboxOpenFrameRef.current) {
      window.cancelAnimationFrame(lightboxOpenFrameRef.current);
    }
  }, []);

  useEffect(() => {
    if (lightboxIndex === null) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    lightboxRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        closeLightbox();
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        moveLightbox(-1);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        moveLightbox(1);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [items.length, lightboxIndex]);

  if (!gallery || items.length === 0) {
    return null;
  }

  const galleryLinkIsExternal = /^https?:\/\//.test(gallery.href ?? '');

  function scrollToSlide(virtualIndex, behavior = 'smooth') {
    const carousel = carouselRef.current;
    const slide = slideRefs.current[virtualIndex];
    if (!carousel || !slide) {
      return;
    }

    carousel.scrollTo({
      left: slide.offsetLeft - ((carousel.clientWidth - slide.offsetWidth) / 2),
      behavior,
    });
  }

  function selectVirtualSlide(virtualIndex, behavior = 'smooth') {
    setActiveVirtualIndex(virtualIndex);
    scrollToSlide(virtualIndex, behavior);
  }

  function handleCarouselScroll() {
    window.clearTimeout(scrollEndTimerRef.current);
    scrollEndTimerRef.current = window.setTimeout(() => {
      const carousel = carouselRef.current;
      if (!carousel) {
        return;
      }

      const carouselCenter = carousel.scrollLeft + (carousel.clientWidth / 2);
      const nearestIndex = slideRefs.current.reduce((closestIndex, slide, index) => {
        if (!slide) {
          return closestIndex;
        }

        const closest = slideRefs.current[closestIndex];
        const currentDistance = Math.abs((slide.offsetLeft + (slide.offsetWidth / 2)) - carouselCenter);
        const closestDistance = closest
          ? Math.abs((closest.offsetLeft + (closest.offsetWidth / 2)) - carouselCenter)
          : Number.POSITIVE_INFINITY;

        return currentDistance < closestDistance ? index : closestIndex;
      }, 0);

      const normalizedIndex = nearestIndex < items.length
        ? nearestIndex + items.length
        : nearestIndex >= items.length * 2
          ? nearestIndex - items.length
          : nearestIndex;

      setActiveVirtualIndex(normalizedIndex);
      if (normalizedIndex !== nearestIndex) {
        scrollToSlide(normalizedIndex, 'auto');
      }
    }, 90);
  }

  function moveSlide(direction) {
    selectVirtualSlide(activeVirtualIndex + direction);
  }

  function openLightbox(index) {
    window.clearTimeout(lightboxCloseTimerRef.current);
    if (lightboxOpenFrameRef.current) {
      window.cancelAnimationFrame(lightboxOpenFrameRef.current);
    }

    setLightboxMotion('open');
    setLightboxIndex(index);
    setLightboxState('enter');

    lightboxOpenFrameRef.current = window.requestAnimationFrame(() => {
      lightboxOpenFrameRef.current = window.requestAnimationFrame(() => {
        lightboxOpenFrameRef.current = null;
        setLightboxState('open');
      });
    });
  }

  function closeLightbox() {
    if (lightboxIndex === null || lightboxState === 'exit') {
      return;
    }

    if (lightboxOpenFrameRef.current) {
      window.cancelAnimationFrame(lightboxOpenFrameRef.current);
    }

    setLightboxState('exit');
    lightboxCloseTimerRef.current = window.setTimeout(() => {
      lightboxCloseTimerRef.current = null;
      setLightboxIndex(null);
      setLightboxState('closed');
      setLightboxMotion('open');
    }, 320);
  }

  function moveLightbox(direction) {
    if (lightboxIndex === null || lightboxState === 'exit') {
      return;
    }
    setLightboxMotion(direction > 0 ? 'next' : 'previous');
    setLightboxIndex((index) => (index + direction + items.length) % items.length);
  }

  return (
    <section className="gallery-section content-section" id="gallery" aria-labelledby="gallery-title">
      <h2 id="gallery-title">{typograf(gallery.title)}</h2>
      <div className="gallery-carousel">
        <div className="gallery-carousel__viewport" ref={carouselRef} tabIndex="0" onScroll={handleCarouselScroll} onKeyDown={(event) => {
          if (event.key === 'ArrowLeft') {
            event.preventDefault();
            moveSlide(-1);
          }
          if (event.key === 'ArrowRight') {
            event.preventDefault();
            moveSlide(1);
          }
        }}>
          <div className="gallery-carousel__track">
            {loopItems.map((item) => (
              <button
                className={`gallery-slide ${item.virtualIndex === activeVirtualIndex ? 'is-active' : ''}`}
                type="button"
                key={`${item.image}-${item.virtualIndex}`}
                ref={(node) => { slideRefs.current[item.virtualIndex] = node; }}
                tabIndex={item.virtualIndex >= items.length && item.virtualIndex < items.length * 2 ? 0 : -1}
                aria-current={item.virtualIndex === activeVirtualIndex ? 'true' : undefined}
                aria-label={`${typograf(item.alt)}. Кадр ${item.sourceIndex + 1} из ${items.length}`}
                onClick={() => openLightbox(item.sourceIndex)}
              >
                <img src={item.image} alt={item.alt} decoding="async" />
              </button>
            ))}
          </div>
        </div>
        <button className="gallery-carousel__arrow gallery-carousel__arrow--previous" type="button" onClick={() => moveSlide(-1)} aria-label="Предыдущий кадр">
          <img className="gallery-arrow-icon gallery-arrow-icon--previous" src="assets/arrow-up.svg" alt="" aria-hidden="true" />
        </button>
        <button className="gallery-carousel__arrow gallery-carousel__arrow--next" type="button" onClick={() => moveSlide(1)} aria-label="Следующий кадр">
          <img className="gallery-arrow-icon gallery-arrow-icon--next" src="assets/arrow-up.svg" alt="" aria-hidden="true" />
        </button>
      </div>
      <a
        className="gallery-section__link"
        href={gallery.href}
        target={galleryLinkIsExternal ? '_blank' : undefined}
        rel={galleryLinkIsExternal ? 'noreferrer' : undefined}
      >
        <span>{typograf(gallery.ctaLabel)}</span>
        <img src="assets/arrow-up.svg" alt="" aria-hidden="true" />
      </a>
      {lightboxIndex !== null && (
        <div
          className="gallery-lightbox"
          data-state={lightboxState}
          role="dialog"
          aria-modal="true"
          aria-label={`Просмотр фотографии: ${typograf(items[lightboxIndex].alt)}`}
          ref={lightboxRef}
          tabIndex="-1"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeLightbox();
            }
          }}
        >
          <button className="gallery-lightbox__close" type="button" onClick={closeLightbox} aria-label="Закрыть галерею">×</button>
          <button className="gallery-lightbox__arrow gallery-lightbox__arrow--previous" type="button" onClick={() => moveLightbox(-1)} aria-label="Предыдущая фотография">
            <img className="gallery-arrow-icon gallery-arrow-icon--previous" src="assets/arrow-up.svg" alt="" aria-hidden="true" />
          </button>
          <figure
            className="gallery-lightbox__figure"
            data-motion={lightboxMotion}
            onTouchStart={(event) => { touchStartRef.current = event.touches[0]?.clientX ?? null; }}
            onTouchEnd={(event) => {
              const start = touchStartRef.current;
              const end = event.changedTouches[0]?.clientX;
              touchStartRef.current = null;
              if (start === null || end === undefined || Math.abs(start - end) < 42) {
                return;
              }
              moveLightbox(start > end ? 1 : -1);
            }}
          >
            <img
              key={`${lightboxIndex}-${lightboxMotion}`}
              className="gallery-lightbox__image"
              src={items[lightboxIndex].image}
              alt={items[lightboxIndex].alt}
              decoding="async"
            />
            <figcaption>{String(lightboxIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</figcaption>
          </figure>
          <button className="gallery-lightbox__arrow gallery-lightbox__arrow--next" type="button" onClick={() => moveLightbox(1)} aria-label="Следующая фотография">
            <img className="gallery-arrow-icon gallery-arrow-icon--next" src="assets/arrow-up.svg" alt="" aria-hidden="true" />
          </button>
        </div>
      )}
    </section>
  );
}

function AboutSection({ about }) {
  if (!about) {
    return null;
  }

  return (
    <section className="about-section content-section" id="about" aria-labelledby="about-title">
      <h2 className="about-section__title" id="about-title">
        {typograf(about.title)}
      </h2>
      <div className="about-section__grid">
        <article className="about-card">
          <div className="about-card__top">
            <img className="about-card__mark" src={about.markImage} alt="" aria-hidden="true" />
            <p className="about-card__lead">{typograf(about.lead)}</p>
          </div>

          <div className="about-card__body">
            <p className="about-card__paragraph">{typograf(about.body)}</p>
            <p className="about-card__paragraph">
              {renderHighlightedText(about.closing, about.highlight)}
            </p>
          </div>
          <img className="about-card__info" src={about.infoIcon} alt="" aria-hidden="true" />
        </article>

        <figure className="about-photo">
          <img src={about.photo} alt={about.photoAlt} />
        </figure>
      </div>
      <AboutExpectations expectations={about.expectations} />
    </section>
  );
}

function AboutExpectations({ expectations }) {
  if (!expectations?.items?.length) {
    return null;
  }

  return (
    <section className="about-expectations" aria-labelledby="expectations-title">
      <div className="about-expectations__heading">
        <h3 id="expectations-title">{typograf(expectations.title)}</h3>
        <div className="about-expectations__callout">
          <div>
            <span>{typograf(expectations.calloutKicker)}</span>
            <strong>{typograf(expectations.calloutText)}</strong>
          </div>
          <img src={expectations.calloutLogo} alt="Debt Tech 2026" />
        </div>
      </div>

      <div className="about-expectations__grid">
        {expectations.items.map((item, index) => (
          <article className="expectation-card" key={`${item.number}-${index}`}>
            <p>{typograf(item.text)}</p>
            <span aria-hidden="true">{item.number}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

function renderHighlightedText(text, highlight) {
  if (!text || !highlight || !text.includes(highlight)) {
    return typograf(text);
  }

  const parts = text.split(highlight);
  return parts.map((part, index) => (
    <span key={`${part}-${index}`}>
      {typograf(part)}
      {index < parts.length - 1 ? <strong>{typograf(highlight)}</strong> : null}
    </span>
  ));
}

function TickerStrip({ items = [] }) {
  const normalizedItems = items.filter(Boolean);

  if (normalizedItems.length === 0) {
    return null;
  }

  const renderedItems = [...normalizedItems, ...normalizedItems, ...normalizedItems];

  return (
    <section className="ticker-strip" aria-label="Ключевые преимущества форума">
      <div className="ticker-strip__viewport">
        <div className="ticker-strip__track">
          {renderedItems.map((item, index) => (
            <span className="ticker-strip__unit" key={`${item}-${index}`} aria-hidden={index >= normalizedItems.length}>
              <span className="ticker-strip__item">[ {typograf(item)} ]</span>
              <span className="ticker-strip__separator">//</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function useCountdown(target, fallbackItems) {
  const labels = useMemo(() => (fallbackItems ?? []).map((item) => item.label), [fallbackItems]);

  function getItems() {
    const targetMs = Date.parse(target);
    if (!Number.isFinite(targetMs)) {
      return fallbackItems ?? [];
    }

    const totalSeconds = Math.max(0, Math.floor((targetMs - Date.now()) / 1000));
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const values = [days, hours, minutes, seconds];

    return values.map((value, index) => ({
      value: String(value).padStart(index === 0 ? 2 : 2, '0'),
      label: labels[index] ?? ['дней', 'часов', 'минут', 'секунд'][index],
    }));
  }

  const [items, setItems] = useState(getItems);

  useEffect(() => {
    setItems(getItems());
    const interval = window.setInterval(() => setItems(getItems()), 1000);
    return () => window.clearInterval(interval);
  }, [target, labels]);

  return items;
}
