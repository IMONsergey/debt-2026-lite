import { useDialog } from '../hooks/useDialog.js';
import { formatPhoneValue, validateContactFields, createLeadPayload, sendLead } from '../lib/forms.js';
import { ChannelIcon } from './ChannelIcon.jsx';
import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { assetUrl } from '../lib/assets.js';

const FORM_DETAILS = {
  'early-registration': {
    id: 'early-registration-form',
    title: 'Ранняя регистрация',
    description: 'Оставьте контакты и укажите количество участников.\nМенеджер свяжется с вами и расскажет об условиях участия.',
    fields: [
      { name: 'full_name', label: 'ФИО участника / ответственного лица', type: 'text', autoComplete: 'name', required: true },
      { name: 'company', label: 'Название компании', type: 'text', autoComplete: 'organization', required: true },
      { name: 'participants_count', label: 'Количество участников', type: 'number', min: '1', inputMode: 'numeric', defaultValue: '1', required: true },
      { name: 'promo_code', label: 'Промокод', type: 'text', autoComplete: 'off' },
      { name: 'phone', label: 'Телефон', type: 'tel', autoComplete: 'tel', inputMode: 'tel', maxLength: '24', required: true },
      { name: 'email', label: 'E-mail', type: 'email', autoComplete: 'email', inputMode: 'email', maxLength: '120', required: true },
    ],
  },
  'stand-booking': {
    id: 'stand-booking-form',
    title: 'Забронировать стенд',
    description: 'Расскажите немного о компании и желаемом формате участия. Детали размещения согласуем отдельно.',
    fields: [
      { name: 'full_name', label: 'ФИО контактного лица', type: 'text', autoComplete: 'name', required: true },
      { name: 'company', label: 'Название компании', type: 'text', autoComplete: 'organization', required: true },
      { name: 'job_title', label: 'Должность', type: 'text', autoComplete: 'organization-title' },
      { name: 'phone', label: 'Телефон', type: 'tel', autoComplete: 'tel', inputMode: 'tel', maxLength: '24', required: true },
      { name: 'email', label: 'E-mail', type: 'email', autoComplete: 'email', inputMode: 'email', maxLength: '120', required: true },
      { name: 'comment', label: 'Комментарий / желаемый формат стенда', type: 'textarea', wide: true },
    ],
  },
};

function handleFieldInput(event) {
  event.currentTarget.setCustomValidity('');

  if (event.currentTarget.name === 'phone') {
    event.currentTarget.value = formatPhoneValue(event.currentTarget.value);
  }
}

function preserveMobileScroll(event) {
  if (window.innerWidth > 699) return;

  const dialog = event.currentTarget.closest('.application-modal__dialog');
  const modal = event.currentTarget.closest('.application-modal');
  const dialogScrollTop = dialog?.scrollTop ?? 0;
  const modalScrollTop = modal?.scrollTop ?? 0;

  window.requestAnimationFrame(() => {
    if (dialog) dialog.scrollTop = dialogScrollTop;
    if (modal) modal.scrollTop = modalScrollTop;
  });
}

function ApplicationModalSpace() {
  return (
    <svg
      className="application-modal__space"
      viewBox="0 0 1600 1000"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <pattern id="application-stars-far" width="337" height="293" patternUnits="userSpaceOnUse">
          <g fill="#77b6e8">
            <circle cx="18" cy="27" r=".7" /><circle cx="86" cy="61" r="1" />
            <circle cx="168" cy="19" r=".6" /><circle cx="299" cy="88" r=".8" />
            <circle cx="213" cy="106" r=".6" /><circle cx="46" cy="171" r=".8" />
            <circle cx="142" cy="128" r=".6" /><circle cx="267" cy="217" r=".9" />
            <circle cx="113" cy="267" r=".7" /><circle cx="201" cy="245" r=".6" />
            <circle cx="317" cy="278" r=".6" /><circle cx="23" cy="253" r=".6" />
          </g>
        </pattern>
        <pattern id="application-stars-near" width="563" height="457" patternUnits="userSpaceOnUse">
          <g fill="#d1f4ff">
            <circle cx="59" cy="82" r="1.3" /><circle cx="361" cy="36" r="1" />
            <circle cx="251" cy="269" r="1.2" /><circle cx="504" cy="389" r="1.4" />
            <circle cx="106" cy="427" r="1" />
          </g>
          <path d="M443 145v10m-5-5h10" stroke="#7cdbff" strokeWidth=".8" />
          <circle cx="443" cy="150" r="1.4" fill="#e0fbff" />
        </pattern>
        <linearGradient id="application-space-light" x1="100" y1="1000" x2="1490" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#036eec" stopOpacity="0" />
          <stop offset=".28" stopColor="#036eec" />
          <stop offset=".66" stopColor="#2eb9ff" />
          <stop offset="1" stopColor="#036eec" stopOpacity="0" />
        </linearGradient>
        <filter id="application-space-haze" x="-20%" y="-30%" width="140%" height="160%">
          <feGaussianBlur stdDeviation="22" />
        </filter>
      </defs>
      <g className="application-modal__stardrift">
        <path d="M-120 980C280 750 355 750 700 500S1160 180 1730-100" fill="none" stroke="url(#application-space-light)" strokeWidth="175" opacity=".1" filter="url(#application-space-haze)" />
        <path d="M-120 960C320 770 305 700 720 496S1240 148 1730-100" fill="none" stroke="url(#application-space-light)" strokeWidth="35" opacity=".11" filter="url(#application-space-haze)" />
        <rect x="-30" y="-30" width="1660" height="1060" fill="url(#application-stars-far)" opacity=".65" />
        <rect className="application-modal__starlight" x="-30" y="-30" width="1660" height="1060" fill="url(#application-stars-near)" opacity=".85" />
      </g>
    </svg>
  );
}

export function ApplicationModal({ kind, selectedTariff = null, config, privacyHref, onClose }) {
  const details = FORM_DETAILS[kind] ?? FORM_DETAILS['early-registration'];
  const usesSpaceTheme = kind === 'stand-booking' || Boolean(selectedTariff);
  const firstFieldRef = useRef(null);
  const dialogRef = useRef(null);
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  useDialog({ dialogRef, onClose, initialFocusRef: firstFieldRef });

  async function handleSubmit(event) {
    event.preventDefault();
    if (status === 'sending') return;
    if (!validateContactFields(event.currentTarget)) return;

    const payload = createLeadPayload(new FormData(event.currentTarget), {
      formId: details.id, eventId: config.eventId, tariff: selectedTariff, sourceUrl: window.location.href,
    });

    setStatus('sending');
    setMessage('');

    try {
      await sendLead(payload, { endpoint: document.querySelector('meta[name="debt-tech-forms-endpoint"]')?.content?.trim() });
      setStatus('success');
    } catch (error) {
      setStatus('error');
      setMessage(error.message || 'Не удалось отправить заявку. Попробуйте ещё раз.');
    }
  }

  const contactEmail = config.contactEmail;
  const telegramUrl = config.telegramUrl;
  const channels = config.channels ?? [];
  const descriptionId = status === 'success' ? undefined : `${details.id}-description`;

  return createPortal(
    <div
      className={`application-modal${usesSpaceTheme ? ' application-modal--space' : ''}`}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className={`application-modal__dialog application-modal__dialog--${status}${usesSpaceTheme ? ' application-modal__dialog--space' : ''}`}
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${details.id}-title`}
        aria-describedby={descriptionId}
      >
        {usesSpaceTheme ? <ApplicationModalSpace /> : null}
        <button className="application-modal__close" type="button" onClick={onClose} aria-label="Закрыть окно">×</button>
        <div className="application-modal__heading">
          <h2 id={`${details.id}-title`}>{details.title}</h2>
          {status !== 'success' ? <p id={`${details.id}-description`}>{details.description}</p> : null}
          {status !== 'success' && selectedTariff ? (
            <p className="application-modal__tariff">
              Выбранный тариф: <strong>{selectedTariff.title}</strong>, {selectedTariff.price}
            </p>
          ) : null}
        </div>

        {status === 'success' ? (
          <div className="application-modal__success" role="status">
            <strong>Спасибо! Заявка отправлена</strong>
            <p>Мы получили ваши данные и свяжемся с вами в ближайшее время.</p>
            <div className="application-modal__channels">
              <p>Следить за обновлениями и новостями удобнее в наших каналах.</p>
              <div className="application-modal__channel-links" aria-label="Каналы DEBT TECH">
                {channels.map((channel) => (
                  <a href={channel.href} target="_blank" rel="noreferrer" key={channel.id}>
                    <ChannelIcon id={channel.id} />
                    <span>{channel.label}</span>
                  </a>
                ))}
              </div>
            </div>
            <button className="ui-button ui-button--primary" type="button" onClick={onClose}>Закрыть</button>
          </div>
        ) : (
          <form id={details.id} name={details.id} className="application-modal__form" onSubmit={handleSubmit}>
            <input type="hidden" name="form_id" defaultValue={details.id} />
            <input type="hidden" name="event_id" defaultValue={config.eventId} />
            {selectedTariff ? (
              <>
                <input type="hidden" name="tariff_id" defaultValue={selectedTariff.id} />
                <input type="hidden" name="tariff_name" defaultValue={selectedTariff.title} />
                <input type="hidden" name="tariff_price" defaultValue={selectedTariff.price} />
              </>
            ) : null}
            <label className="application-modal__honeypot" aria-hidden="true">
              <span>Сайт</span>
              <input name="website" type="text" tabIndex="-1" autoComplete="off" />
            </label>

            {details.fields.map((field, index) => (
              <label className={field.wide ? 'application-modal__field--wide' : undefined} key={field.name}>
                <span>{field.label}{field.required ? ' *' : ''}</span>
                {field.type === 'textarea' ? (
                  <textarea name={field.name} rows="3" />
                ) : (
                  <input
                    ref={index === 0 ? firstFieldRef : undefined}
                    name={field.name}
                    type={field.type}
                    min={field.min}
                    inputMode={field.inputMode}
                    maxLength={field.maxLength}
                    defaultValue={field.defaultValue}
                    autoComplete={field.autoComplete}
                    required={field.required}
                    onInput={handleFieldInput}
                  />
                )}
              </label>
            ))}

            <label className="application-modal__consent application-modal__field--wide">
              <input name="consent" type="checkbox" value="yes" required onChange={preserveMobileScroll} />
              <span>
                Я соглашаюсь на обработку персональных данных и принимаю условия{' '}
                <a href={privacyHref} target="_blank" rel="noreferrer">политики конфиденциальности</a>.
              </span>
            </label>

            {message ? (
              <div className={`application-modal__message application-modal__message--${status}`} role="status">
                <p>{message}</p>
                <div className="application-modal__contacts">
                  {contactEmail ? <a href={`mailto:${contactEmail}`}>{contactEmail}</a> : null}
                  {telegramUrl ? <a href={telegramUrl} target="_blank" rel="noreferrer">Написать в Telegram</a> : null}
                </div>
              </div>
            ) : null}

            <button className="ui-button ui-button--primary application-modal__submit application-modal__field--wide" type="submit" disabled={status === 'sending'}>
              <span>{status === 'sending' ? 'Отправляем…' : 'Отправить заявку'}</span>
              <img className="application-modal__submit-icon" src={assetUrl('assets/icons/arrow-up.svg')} alt="" aria-hidden="true" />
            </button>
          </form>
        )}
      </section>
    </div>,
    document.body,
  );
}
