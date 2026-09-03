import { useEffect, useState } from 'react';
import '../styles/video-widget.css';

const DESKTOP_QUERY = '(min-width: 1181px)';

export function VideoWidget({ video }) {
  const [isAdaptive, setIsAdaptive] = useState(() => !window.matchMedia(DESKTOP_QUERY).matches);
  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isFloating, setIsFloating] = useState(false);
  const [anchor, setAnchor] = useState(null);

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_QUERY);
    let frame = 0;
    let slot = null;

    const findSlot = () => {
      const slots = [...document.querySelectorAll('[data-video-widget-slot]')];
      return slots.find((item) => {
        const rect = item.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && window.getComputedStyle(item).display !== 'none';
      });
    };

    const updateFloating = () => {
      if (!slot || media.matches) return;

      const rect = slot.getBoundingClientRect();
      setIsFloating((current) => (current ? rect.top <= 64 : rect.top <= 18));
    };

    const handleScroll = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(updateFloating);
    };

    const measure = () => {
      const adaptive = !media.matches;
      setIsAdaptive(adaptive);

      if (!adaptive) {
        slot = null;
        setAnchor(null);
        setIsFloating(false);
        return;
      }

      slot = findSlot();

      if (!slot) {
        setAnchor(null);
        setIsFloating(false);
        return;
      }

      const rect = slot.getBoundingClientRect();
      setAnchor({
        top: Math.round(rect.top + window.scrollY),
        left: Math.round(rect.left + window.scrollX),
        width: Math.round(rect.width),
      });

      updateFloating();
    };

    measure();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', measure);
    media.addEventListener?.('change', measure);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', measure);
      media.removeEventListener?.('change', measure);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isAdaptive || !video || isHidden) return null;

  const className = [
    'video-widget',
    isFloating ? 'is-floating' : 'is-hero',
    isOpen ? 'is-open' : '',
    anchor ? 'is-ready' : '',
  ].filter(Boolean).join(' ');

  const style = anchor && !isFloating ? {
    '--video-anchor-top': `${anchor.top}px`,
    '--video-anchor-left': `${anchor.left}px`,
    '--video-anchor-width': `${anchor.width}px`,
  } : undefined;

  return (
    <aside className={className} style={style} aria-label="Видео о конференции">
      <span className="video-widget__caption">{video.title}</span>

      {isOpen ? (
        <div className="video-widget__player">
          <div className="video-widget__media">
            <iframe
              key="video-widget-main"
              src={video.widgetUrl ?? video.embedUrl}
              title={video.title}
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer; clipboard-write; screen-wake-lock"
              loading="eager"
              allowFullScreen
            />
          </div>
          <button
            className="video-widget__close video-widget__close--player"
            type="button"
            aria-label="Свернуть видео"
            onClick={() => setIsOpen(false)}
          >
            ×
          </button>
        </div>
      ) : (
        <div className="video-widget__preview">
          <div className="video-widget__media" aria-hidden="true">
            <iframe
              key="video-widget-preview"
              src={video.previewUrl ?? video.embedUrl}
              title={`${video.title} - превью`}
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer; clipboard-write; screen-wake-lock"
              loading="eager"
              tabIndex="-1"
            />
          </div>
          <button
            className="video-widget__open"
            type="button"
            aria-label="Открыть видео"
            onClick={() => setIsOpen(true)}
          >
            <span className="video-widget__play" aria-hidden="true" />
          </button>
          <button
            className="video-widget__close video-widget__close--preview"
            type="button"
            aria-label="Скрыть видео"
            onClick={() => setIsHidden(true)}
          >
            ×
          </button>
        </div>
      )}
    </aside>
  );
}
