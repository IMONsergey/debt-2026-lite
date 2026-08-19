import { useEffect, useMemo, useRef, useState } from 'react';
import { FixedMenu, SidebarInfo } from './FixedMenu.jsx';
import { typograf } from '../lib/typography.js';
import { assetUrl } from '../lib/assets.js';

export function SitePage({ content }) {
  const countdown = useCountdown(content.hero.countdownTarget, content.hero.countdown);

  return (
    <div className="app-shell">
      <div className="site-grid">
        <FixedMenu site={content.site} menu={content.menu} video={content.heroVideo} />
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
                <SidebarInfo className="mobile-hero-info" menu={content.menu} video={content.heroVideo} />
              </div>
            </div>
          </section>

          <TickerStrip items={content.ticker?.items} />
          <VenueSection venue={content.venue} />
          <GallerySection gallery={content.gallery} />
          <HeroLandingFooter logo={content.site.logo} footer={content.footer} />
        </main>
      </div>
    </div>
  );
}

function VenueSection({ venue }) {
  const images = venue?.images ?? [];

  if (!venue || images.length === 0) return null;

  const routeIsExternal = /^https?:\/\//.test(venue.routeHref ?? '');

  return (
    <section className="venue-section" id="venue" aria-labelledby="venue-title">
      <h2 id="venue-title">{typograf(venue.title)}</h2>

      <div className="venue-section__layout">
        <div className="venue-section__details">
          <span className="venue-section__date">{typograf(venue.date)}</span>
          <div className="venue-section__address">
            <strong>{typograf(venue.name)}</strong>
            <span>{typograf(venue.address)}</span>
          </div>
          <a
            className="venue-section__route"
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
              <img src={item.image} alt={item.alt} loading={index === 0 ? 'eager' : 'lazy'} decoding="async" />
            </figure>
          ))}
        </div>
      </div>
    </section>
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
    if (lightboxOpenFrameRef.current) window.cancelAnimationFrame(lightboxOpenFrameRef.current);
  }, []);

  useEffect(() => {
    if (lightboxIndex === null) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    lightboxRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === 'Escape') closeLightbox();
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

  if (!gallery || items.length === 0) return null;

  const galleryLinkIsExternal = /^https?:\/\//.test(gallery.href ?? '');

  function scrollToSlide(virtualIndex, behavior = 'smooth') {
    const carousel = carouselRef.current;
    const slide = slideRefs.current[virtualIndex];
    if (!carousel || !slide) return;

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
      if (!carousel) return;

      const carouselCenter = carousel.scrollLeft + (carousel.clientWidth / 2);
      const nearestIndex = slideRefs.current.reduce((closestIndex, slide, index) => {
        if (!slide) return closestIndex;

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
      if (normalizedIndex !== nearestIndex) scrollToSlide(normalizedIndex, 'auto');
    }, 90);
  }

  function moveSlide(direction) {
    selectVirtualSlide(activeVirtualIndex + direction);
  }

  function openLightbox(index) {
    window.clearTimeout(lightboxCloseTimerRef.current);
    if (lightboxOpenFrameRef.current) window.cancelAnimationFrame(lightboxOpenFrameRef.current);

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
    if (lightboxIndex === null || lightboxState === 'exit') return;
    if (lightboxOpenFrameRef.current) window.cancelAnimationFrame(lightboxOpenFrameRef.current);

    setLightboxState('exit');
    lightboxCloseTimerRef.current = window.setTimeout(() => {
      lightboxCloseTimerRef.current = null;
      setLightboxIndex(null);
      setLightboxState('closed');
      setLightboxMotion('open');
    }, 320);
  }

  function moveLightbox(direction) {
    if (lightboxIndex === null || lightboxState === 'exit') return;
    setLightboxMotion(direction > 0 ? 'next' : 'previous');
    setLightboxIndex((index) => (index + direction + items.length) % items.length);
  }

  return (
    <section className="gallery-section content-section" id="gallery" aria-labelledby="gallery-title">
      <h2 id="gallery-title">{typograf(gallery.title)}</h2>
      <div className="gallery-carousel">
        <div
          className="gallery-carousel__viewport"
          ref={carouselRef}
          tabIndex="0"
          onScroll={handleCarouselScroll}
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft') {
              event.preventDefault();
              moveSlide(-1);
            }
            if (event.key === 'ArrowRight') {
              event.preventDefault();
              moveSlide(1);
            }
          }}
        >
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
          <img className="gallery-arrow-icon gallery-arrow-icon--previous" src={assetUrl('assets/icons/arrow-up.svg')} alt="" aria-hidden="true" />
        </button>
        <button className="gallery-carousel__arrow gallery-carousel__arrow--next" type="button" onClick={() => moveSlide(1)} aria-label="Следующий кадр">
          <img className="gallery-arrow-icon gallery-arrow-icon--next" src={assetUrl('assets/icons/arrow-up.svg')} alt="" aria-hidden="true" />
        </button>
      </div>

      <a
        className="gallery-section__link"
        href={gallery.href}
        target={galleryLinkIsExternal ? '_blank' : undefined}
        rel={galleryLinkIsExternal ? 'noreferrer' : undefined}
      >
        <span>{typograf(gallery.ctaLabel)}</span>
        <img src={assetUrl('assets/icons/arrow-up.svg')} alt="" aria-hidden="true" />
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
            if (event.target === event.currentTarget) closeLightbox();
          }}
        >
          <button className="gallery-lightbox__close" type="button" onClick={closeLightbox} aria-label="Закрыть галерею">×</button>
          <button className="gallery-lightbox__arrow gallery-lightbox__arrow--previous" type="button" onClick={() => moveLightbox(-1)} aria-label="Предыдущая фотография">
            <img className="gallery-arrow-icon gallery-arrow-icon--previous" src={assetUrl('assets/icons/arrow-up.svg')} alt="" aria-hidden="true" />
          </button>
          <figure
            className="gallery-lightbox__figure"
            data-motion={lightboxMotion}
            onTouchStart={(event) => { touchStartRef.current = event.touches[0]?.clientX ?? null; }}
            onTouchEnd={(event) => {
              const start = touchStartRef.current;
              const end = event.changedTouches[0]?.clientX;
              touchStartRef.current = null;
              if (start === null || end === undefined || Math.abs(start - end) < 42) return;
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
            <img className="gallery-arrow-icon gallery-arrow-icon--next" src={assetUrl('assets/icons/arrow-up.svg')} alt="" aria-hidden="true" />
          </button>
        </div>
      )}
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

function TickerStrip({ items = [] }) {
  const normalizedItems = items.filter(Boolean);
  if (normalizedItems.length === 0) return null;

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
    if (!Number.isFinite(targetMs)) return fallbackItems ?? [];

    const totalSeconds = Math.max(0, Math.floor((targetMs - Date.now()) / 1000));
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const values = [days, hours, minutes, seconds];

    return values.map((value, index) => ({
      value: String(value).padStart(2, '0'),
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
