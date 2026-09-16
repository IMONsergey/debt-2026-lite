import { content } from './data/content.js';
import { lazy, Suspense, useEffect, useState } from 'react';
import { CosmosBackground } from './components/CosmosBackground.jsx';
import { DialogBoundary } from './components/DialogBoundary.jsx';
import { SitePage } from './components/SitePage.jsx';
import { VideoWidget } from './components/VideoWidget.jsx';
import { assetUrl } from './lib/assets.js';

const ApplicationModal = lazy(() => import('./components/ApplicationModal.jsx').then(module => ({ default: module.ApplicationModal })));
const TicketOfferModal = lazy(() => import('./components/TicketOfferModal.jsx').then(module => ({ default: module.TicketOfferModal })));

export default function App() {
  const [activeForm, setActiveForm] = useState(null);
  const [ticketOfferReady, setTicketOfferReady] = useState(false);
  const [ticketOfferDismissed, setTicketOfferDismissed] = useState(false);

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
      <div className="site-shell">
        <SitePage content={content} onOpenApplication={setActiveForm} />
      </div>
      <VideoWidget video={content.heroVideo} />
      <MobileRegistration cta={content.menu.cta} onOpenApplication={setActiveForm} />
      <DialogBoundary key={activeForm ? 'application' : ticketOfferReady && !ticketOfferDismissed ? 'offer' : 'closed'} onClose={() => { setActiveForm(null); setTicketOfferDismissed(true); }}>
        <Suspense fallback={<p className="dialog-loading" role="status">Загрузка…</p>}>
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
        </Suspense>
      </DialogBoundary>
    </>
  );
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
