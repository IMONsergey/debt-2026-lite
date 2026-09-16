import { ResponsiveImage } from './ResponsiveImage.jsx';
import { useDialog } from '../hooks/useDialog.js';
import { useCarouselResize } from '../hooks/useCarouselResize.js';
import { useCallback, useEffect, useRef, useState } from 'react';
import { typograf } from '../lib/typography.js';
import { assetUrl } from '../lib/assets.js';

export function GallerySection({ gallery }) {
  const items = gallery?.items ?? [];
  const initialIndex = Math.min(1, Math.max(0, items.length - 1));
  const [activeIndex, setActiveIndex] = useState(() => initialIndex);
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
  const moveLightbox = useCallback((direction) => {
    if (lightboxIndex === null || lightboxState === 'exit') return;
    setLightboxMotion(direction > 0 ? 'next' : 'previous');
    setLightboxIndex((index) => (index + direction + items.length) % items.length);
  }, [items.length, lightboxIndex, lightboxState]);
  useCarouselResize(carouselRef, () => scrollToSlide(activeIndex, 'instant'));

  useEffect(() => {
    const startIndex = Math.min(1, Math.max(0, items.length - 1));
    setActiveIndex(startIndex);
    const frame = window.requestAnimationFrame(() => scrollToSlide(startIndex, 'auto'));
    return () => window.cancelAnimationFrame(frame);
  }, [items.length]);

  useEffect(() => () => window.clearTimeout(scrollEndTimerRef.current), []);

  useEffect(() => () => {
    window.clearTimeout(lightboxCloseTimerRef.current);
    if (lightboxOpenFrameRef.current) window.cancelAnimationFrame(lightboxOpenFrameRef.current);
  }, []);

  useEffect(() => {
    if (lightboxIndex === null) return undefined;

    function handleKeyDown(event) {
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
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxIndex, moveLightbox]);

  useDialog({ dialogRef: lightboxRef, open: lightboxIndex !== null, onClose: closeLightbox });

  if (!gallery || items.length === 0) return null;

  const galleryLinkIsExternal = /^https?:\/\//.test(gallery.href ?? '');

  function scrollToSlide(virtualIndex, behavior = 'smooth') {
    const carousel = carouselRef.current;
    const slide = slideRefs.current[virtualIndex];
    if (!carousel || !slide) return;

    carousel.scrollTo({
      left: slide.offsetLeft - ((carousel.clientWidth - slide.offsetWidth) / 2),
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : behavior,
    });
  }

  function selectSlide(virtualIndex, behavior = 'smooth') {
    setActiveIndex(virtualIndex);
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

      setActiveIndex(nearestIndex);
    }, 90);
  }

  function moveSlide(direction) {
    if (!items.length) return;
    selectSlide((activeIndex + direction + items.length) % items.length);
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

  return (
    <section className="gallery-section content-section page-section" id="gallery" aria-labelledby="gallery-title">
      <h2 className="section-title" id="gallery-title">{typograf(gallery.title)}</h2>
      <div className="gallery-carousel">
        <div
          className="gallery-carousel__viewport"
          role="region"
          aria-label="Фотографии форума"
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
            {items.map((item, index) => (
              <button
                className={`gallery-slide ${index === activeIndex ? 'is-active' : ''}`}
                type="button"
                key={`${item.image}-${index}`}
                ref={(node) => { slideRefs.current[index] = node; }}
                tabIndex={index === activeIndex ? 0 : -1}
                aria-current={index === activeIndex ? 'true' : undefined}
                aria-label={`${typograf(item.alt)}. Кадр ${index + 1} из ${items.length}`}
                onClick={() => openLightbox(index)}
              >
                <ResponsiveImage
                  sizes="(max-width: 699px) 92vw, (max-width: 1180px) 72vw, min(56.82vw, 818px)"
                  src={item.image}
                  alt={item.alt}
                  decoding="async"
                />
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
        className="ui-button ui-button--secondary gallery-section__link"
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
            <ResponsiveImage
              sizes="92vw"
              loading="eager"
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
