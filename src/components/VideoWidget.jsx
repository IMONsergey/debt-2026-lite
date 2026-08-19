import { useEffect, useState } from 'react';
import '../styles/video-widget.css';

const DESKTOP_QUERY = '(min-width: 1181px)';

export function VideoWidget({ video }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isFloating, setIsFloating] = useState(false);
  const [anchor, setAnchor] = useState(null);

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_QUERY);
    let frame = 0;

    const updateState = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const slots = [...document.querySelectorAll('[data-video-widget-slot]')];
        const slot = slots.find((item) => {
          const rect = item.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0 && window.getComputedStyle(item).display !== 'none';
        });

        if (!slot) {
          setAnchor(null);
          return;
        }

        const rect = slot.getBoundingClientRect();
        setAnchor({
          top: Math.round(rect.top),
          left: Math.round(rect.left),
          width: Math.round(rect.width),
        });

        if (media.matches) {
          const threshold = Math.max(150, Math.min(240, window.innerHeight * 0.22));
          setIsFloating(window.scrollY > threshold);
        } else {
          setIsFloating(rect.top <= 18);
        }
      });
    };

    updateState();
    window.addEventListener('scroll', updateState, { passive: true });
    window.addEventListener('resize', updateState);
    media.addEventListener?.('change', updateState);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updateState);
      window.removeEventListener('resize', updateState);
      media.removeEventListener?.('change', updateState);
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

  if (!video || isHidden) return null;

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
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer; clipboard-write"
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
          <div className="video-widget__media">
            <iframe
              key="video-widget-preview"
              src={video.previewUrl}
              title={`${video.title} — превью`}
              allow="autoplay; encrypted-media"
              tabIndex="-1"
              aria-hidden="true"
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
