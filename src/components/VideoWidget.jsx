import { useEffect, useState } from 'react';
import '../styles/video-widget.css';

const DESKTOP_QUERY = '(min-width: 1181px)';

export function VideoWidget({ video }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isFloating, setIsFloating] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_QUERY);
    let frame = 0;

    const updateState = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        if (!media.matches) {
          setIsFloating(false);
          return;
        }

        const threshold = Math.max(150, Math.min(240, window.innerHeight * 0.22));
        setIsFloating(window.scrollY > threshold);
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
  ].filter(Boolean).join(' ');

  return (
    <aside className={className} aria-label="Видео о конференции">
      {isOpen ? (
        <div className="video-widget__player">
          <iframe
            key="video-widget-main"
            src={video.embedUrl}
            title={video.title}
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer; clipboard-write"
            allowFullScreen
          />
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
          <iframe
            key="video-widget-preview"
            src={video.previewUrl}
            title={`${video.title} — превью`}
            allow="autoplay; encrypted-media"
            tabIndex="-1"
            aria-hidden="true"
          />
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
