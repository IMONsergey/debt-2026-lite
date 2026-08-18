import { useEffect, useState } from 'react';
import '../styles/video-widget.css';

export function VideoWidget({ video }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!video || isHidden) return null;

  return (
    <aside className={`video-widget${isOpen ? ' is-open' : ''}`} aria-label="Видео о конференции">
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
