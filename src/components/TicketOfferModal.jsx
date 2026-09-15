import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { assetUrl } from '../lib/assets.js';

const DEFAULT_LABELS = ['дней', 'часов', 'минут', 'секунд'];

function getCountdownItems(target) {
  const targetMs = Date.parse(target);
  const totalSeconds = Number.isFinite(targetMs)
    ? Math.max(0, Math.floor((targetMs - Date.now()) / 1000))
    : 0;
  const values = [
    Math.floor(totalSeconds / 86400),
    Math.floor((totalSeconds % 86400) / 3600),
    Math.floor((totalSeconds % 3600) / 60),
    totalSeconds % 60,
  ];

  return values.map((value, index) => ({
    value: String(value).padStart(2, '0'),
    label: DEFAULT_LABELS[index],
  }));
}

export function TicketOfferModal({ logo, countdownTarget, onClose, onBuy }) {
  const dialogRef = useRef(null);
  const [countdown, setCountdown] = useState(() => getCountdownItems(countdownTarget));

  useEffect(() => {
    setCountdown(getCountdownItems(countdownTarget));
    const interval = window.setInterval(() => {
      setCountdown(getCountdownItems(countdownTarget));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [countdownTarget]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus({ preventScroll: true });

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key !== 'Tab') return;
      const controls = [...dialogRef.current.querySelectorAll('button:not([disabled]), a[href]')];
      if (!controls.length) return;
      const firstControl = controls[0];
      const lastControl = controls[controls.length - 1];

      if (event.shiftKey && (
        document.activeElement === firstControl
        || document.activeElement === dialogRef.current
      )) {
        event.preventDefault();
        lastControl.focus();
      } else if (!event.shiftKey && document.activeElement === lastControl) {
        event.preventDefault();
        firstControl.focus();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, [onClose]);

  return createPortal(
    <div
      className="ticket-offer-modal"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="ticket-offer-modal__dialog"
        style={{ '--ticket-offer-background': `url("${assetUrl('assets/images/ticket-offer-background.png')}")` }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ticket-offer-title"
        aria-describedby="ticket-offer-description"
        tabIndex={-1}
        ref={dialogRef}
      >
        <img
          className="ticket-offer-modal__planet"
          src={assetUrl('assets/images/ticket-offer-planet.png')}
          alt=""
          aria-hidden="true"
        />

        <button
          className="ticket-offer-modal__close"
          type="button"
          onClick={onClose}
          aria-label="Закрыть окно"
        >
          ×
        </button>

        <img className="ticket-offer-modal__logo" src={logo} alt="DEBT TECH 2026" />
        <span className="ticket-offer-modal__eyebrow">Форум-выставка</span>
        <h2 className="ticket-offer-modal__event-title" id="ticket-offer-title">
          «Вселенная технологий»
        </h2>
        <span className="ticket-offer-modal__booking-title">Раннее бронирование</span>
        <p id="ticket-offer-description">
          Успейте приобрести билеты со скидкой <strong>до 25 сентября</strong>
        </p>

        <div className="ticket-offer-modal__countdown" aria-label="До окончания скидки">
          {countdown.map((item) => (
            <span className="ticket-offer-modal__countdown-item" key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </span>
          ))}
        </div>

        <button className="ticket-offer-modal__buy" type="button" onClick={onBuy}>
          <span>Купить билет</span>
          <img
            className="ticket-offer-modal__buy-icon"
            src={assetUrl('assets/icons/arrow-up.svg')}
            alt=""
            aria-hidden="true"
          />
        </button>
      </section>
    </div>,
    document.body,
  );
}
