import { content } from './data/content.js';
import { useEffect, useState } from 'react';
import { CosmosBackground } from './components/CosmosBackground.jsx';
import { ApplicationModal } from './components/ApplicationModal.jsx';
import { SitePage } from './components/SitePage.jsx';
import { TicketOfferModal } from './components/TicketOfferModal.jsx';
import { VideoWidget } from './components/VideoWidget.jsx';
import { assetUrl } from './lib/assets.js';

export default function App() {
  const [activeForm, setActiveForm] = useState(null);
  const [ticketOfferReady, setTicketOfferReady] = useState(false);
  const [ticketOfferDismissed, setTicketOfferDismissed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    document.title = 'DEBT TECH 2026 - Вселенная технологий | 13 ноября | Москва';
    const heroImage = window.matchMedia('(max-width: 1180px)').matches
      ? content.hero.backgroundImageAdaptive
      : content.hero.backgroundImage;
    const criticalImages = [...new Set([
      heroImage,
      content.aboutForum.planetImage,
      content.aboutForum.shuttleImage,
      content.aboutForum.logoImage,
    ].filter(Boolean))];
    let completed = 0;
    const reportProgress = () => {
      completed += 1;
      if (!cancelled) document.dispatchEvent(new CustomEvent('debt:progress', { detail: { completed, total: criticalImages.length + 1 } }));
    };
    Promise.allSettled([
      preloadImages(criticalImages, reportProgress),
      document.fonts.ready.then(reportProgress, reportProgress),
    ]).then(() => {
      if (!cancelled) document.dispatchEvent(new Event('debt:ready'));
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setTicketOfferReady(true), 15000);
    return () => window.clearTimeout(timer);
  }, []);

  function handleTicketOfferBuy() {
    setTicketOfferDismissed(true);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        const tariffsSection = document.getElementById('tariffs');
        if (!tariffsSection) return;
        window.history.pushState(null, '', '#tariffs');
        tariffsSection.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
      });
    });
  }

  return (
    <>
      <CosmosBackground />
      <div className="hero-only-view">
        <SitePage content={content} onOpenApplication={setActiveForm} />
      </div>
      <VideoWidget video={content.heroVideo} />
      <MobileRegistration cta={content.menu.cta} onOpenApplication={setActiveForm} />
      {activeForm ? (
        <ApplicationModal
          key={typeof activeForm === 'string' ? activeForm : `${activeForm.kind}-${activeForm.tariff?.id ?? 'form'}`}
          kind={typeof activeForm === 'string' ? activeForm : activeForm.kind}
          selectedTariff={typeof activeForm === 'string' ? null : activeForm.tariff}
          config={content.forms}
          privacyHref={content.footer.privacyHref}
          onClose={() => setActiveForm(null)}
        />
      ) : null}
      {ticketOfferReady && !ticketOfferDismissed && !activeForm ? (
        <TicketOfferModal
          logo={assetUrl('assets/images/ticket-offer-logo.svg')}
          countdownTarget="2026-09-25T00:00:00+03:00"
          onClose={() => setTicketOfferDismissed(true)}
          onBuy={handleTicketOfferBuy}
        />
      ) : null}
    </>
  );
}

function preloadImages(urls, onSettled = () => {}) {
  return Promise.allSettled([...new Set(urls.filter(Boolean))].map((url) => new Promise((resolve) => {
    const image = new Image();
    image.decoding = 'async';
    image.loading = 'eager';
    image.fetchPriority = 'high';
    const done = () => { onSettled(); resolve(); };
    image.onload = () => {
      image.decode().catch(() => {}).finally(done);
    };
    image.onerror = done;
    image.src = url;
  })));
}

function MobileRegistration({ cta, onOpenApplication }) {
  if (!cta) return null;

  if (cta.modal) {
    return (
      <button className="ui-button ui-button--primary mobile-registration" type="button" onClick={() => onOpenApplication(cta.modal)}>
        <span>{cta.label}</span>
        <img src={assetUrl('assets/icons/arrow-up.svg')} alt="" aria-hidden="true" />
      </button>
    );
  }

  if (!cta.href) return null;

  const isExternal = /^https?:\/\//.test(cta.href);

  return (
    <a
      className="ui-button ui-button--primary mobile-registration"
      href={cta.href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noreferrer' : undefined}
    >
      <span>{cta.label}</span>
      <img src={assetUrl('assets/icons/arrow-up.svg')} alt="" aria-hidden="true" />
    </a>
  );
}
