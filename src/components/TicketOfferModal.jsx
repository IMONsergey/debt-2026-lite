import { useDialog } from '../hooks/useDialog.js';
import { useRef } from 'react';
import { useCountdown } from '../hooks/useCountdown.js';
import { createPortal } from 'react-dom';
import { assetUrl } from '../lib/assets.js';

export function TicketOfferModal({ logo, countdownTarget, onClose, onBuy }) {
  const dialogRef = useRef(null);
  const countdown = useCountdown(countdownTarget);

  useDialog({ dialogRef, onClose });

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
        style={{ '--ticket-offer-background': `url("${assetUrl('assets/images/ticket-offer-background.webp')}")` }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ticket-offer-title"
        aria-describedby="ticket-offer-description"
        tabIndex={-1}
        ref={dialogRef}
      >
        <img
          className="ticket-offer-modal__planet"
          src={assetUrl('assets/images/ticket-offer-planet.webp')}
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

        <button className="ui-button ui-button--primary ticket-offer-modal__buy" type="button" onClick={onBuy}>
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
