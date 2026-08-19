import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { typograf } from '../lib/typography.js';
import { assetUrl } from '../lib/assets.js';

export function FixedMenu({ site, menu, video }) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <aside className={`fixed-menu${isVideoOpen ? ' is-video-open' : ''}`} aria-label="Информация о конференции">
      <a className="fixed-menu__brand" href="#top" aria-label={site.title}>
        <img src={site.logo} alt={site.title} />
      </a>
      <SidebarInfo
        className="fixed-menu__info"
        menu={menu}
        video={video}
        desktopVideo
        onVideoOpenChange={setIsVideoOpen}
      />
    </aside>
  );
}

export function SidebarInfo({ className = 'sidebar-info', menu, video, desktopVideo = false, onVideoOpenChange }) {
  const sidebar = menu.sidebar ?? {};

  return (
    <div className={className}>
      {desktopVideo ? (
        <SidebarVideo video={video} onOpenChange={onVideoOpenChange} />
      ) : (
        <div className="video-widget-slot" data-video-widget-slot aria-hidden="true" />
      )}

      <a className="contact-link" href={`mailto:${sidebar.contactEmail}`}>
        <span>{typograf(sidebar.contactLabel)}</span>
        <strong>{sidebar.contactEmail}</strong>
        <img className="contact-link__arrow" src={assetUrl('assets/icons/arrow-up.svg')} alt="" aria-hidden="true" />
      </a>

      <div className="organizers-mark">
        <span>{typograf(sidebar.organizersLabel)}</span>
        <img src={sidebar.organizersImage} alt={sidebar.organizersLabel} />
      </div>

      <SidebarCta cta={menu.cta} />
      {menu.secondaryCta ? <SidebarCta cta={menu.secondaryCta} secondary /> : null}
    </div>
  );
}

function SidebarVideo({ video, onOpenChange }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    onOpenChange?.(isOpen);
  }, [isOpen, onOpenChange]);

  useEffect(() => () => onOpenChange?.(false), [onOpenChange]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!video?.embedUrl) return null;

  return (
    <>
      <div className="desktop-sidebar-video">
        <span className="desktop-sidebar-video__caption">{typograf(video.title)}</span>
        <div className={`desktop-sidebar-video__frame${isOpen ? ' is-open' : ''}`}>
          <iframe
            src={video.previewUrl ?? video.embedUrl}
            title={video.title}
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer; clipboard-write"
            allowFullScreen
            tabIndex={isOpen ? undefined : '-1'}
            aria-hidden={isOpen ? undefined : 'true'}
          />
          {!isOpen ? (
            <button
              className="desktop-sidebar-video__open"
              type="button"
              aria-label="Открыть видео"
              onClick={() => setIsOpen(true)}
            >
              <span className="desktop-sidebar-video__play" aria-hidden="true" />
            </button>
          ) : null}
        </div>
      </div>

      {isOpen && createPortal(
        <div className="desktop-video-modal" role="dialog" aria-modal="true" aria-label={video.title} onClick={() => setIsOpen(false)}>
          <button
            className="desktop-video-modal__close"
            type="button"
            aria-label="Закрыть видео"
            onClick={() => setIsOpen(false)}
            autoFocus
          />
        </div>,
        document.body,
      )}
    </>
  );
}

function SidebarCta({ cta, secondary = false }) {
  const className = `fixed-menu__cta${secondary ? ' fixed-menu__cta--secondary' : ''}`;
  const isExternal = /^https?:\/\//.test(cta.href ?? '');

  return (
    <a
      className={className}
      href={cta.href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noreferrer' : undefined}
    >
      <span>{typograf(cta.label)}</span>
      <img className="fixed-menu__cta-icon" src={assetUrl('assets/icons/arrow-up.svg')} alt="" aria-hidden="true" />
    </a>
  );
}
