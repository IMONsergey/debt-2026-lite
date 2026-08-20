import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { assetUrl } from '../lib/assets.js';

const FORM_DETAILS = {
  'early-registration': {
    id: 'early-registration-form',
    title: 'Ранняя регистрация',
    description: 'Оставьте контакты и укажите количество участников. Менеджер свяжется с вами и расскажет об условиях участия.',
    fields: [
      { name: 'full_name', label: 'ФИО участника / ответственного лица', type: 'text', autoComplete: 'name', required: true },
      { name: 'company', label: 'Название компании', type: 'text', autoComplete: 'organization', required: true },
      { name: 'participants_count', label: 'Количество участников', type: 'number', min: '1', inputMode: 'numeric', defaultValue: '1', required: true },
      { name: 'promo_code', label: 'Промокод', type: 'text', autoComplete: 'off' },
      { name: 'phone', label: 'Телефон', type: 'tel', autoComplete: 'tel', required: true },
      { name: 'email', label: 'E-mail', type: 'email', autoComplete: 'email', required: true },
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
      { name: 'phone', label: 'Телефон', type: 'tel', autoComplete: 'tel', required: true },
      { name: 'email', label: 'E-mail', type: 'email', autoComplete: 'email', required: true },
      { name: 'comment', label: 'Комментарий / желаемый формат стенда', type: 'textarea', wide: true },
    ],
  },
};

export function ApplicationModal({ kind, config, privacyHref, onClose }) {
  const details = FORM_DETAILS[kind] ?? FORM_DETAILS['early-registration'];
  const firstFieldRef = useRef(null);
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    firstFieldRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose();
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (status === 'sending') return;

    const endpoint = document
      .querySelector('meta[name="debt-tech-forms-endpoint"]')
      ?.getAttribute('content')
      ?.trim();

    if (!endpoint) {
      setStatus('not-configured');
      setMessage('Отправка на сервер пока не подключена. Свяжитесь с организаторами по почте или в Telegram.');
      return;
    }

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    payload.consent = formData.get('consent') === 'yes';
    payload.source_page = window.location.href;
    payload.submitted_at = new Date().toISOString();

    const searchParams = new URLSearchParams(window.location.search);
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach((key) => {
      if (searchParams.has(key)) payload[key] = searchParams.get(key);
    });

    setStatus('sending');
    setMessage('');

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success === false) {
        throw new Error(result.message || 'Не удалось отправить заявку');
      }

      setStatus('success');
    } catch (error) {
      setStatus('error');
      setMessage(error.message || 'Не удалось отправить заявку. Попробуйте ещё раз.');
    }
  }

  const contactEmail = config.contactEmail;
  const telegramUrl = config.telegramUrl;

  return createPortal(
    <div
      className="application-modal"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="application-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${details.id}-title`}
        aria-describedby={`${details.id}-description`}
      >
        <button className="application-modal__close" type="button" onClick={onClose} aria-label="Закрыть окно">×</button>
        <div className="application-modal__heading">
          <h2 id={`${details.id}-title`}>{details.title}</h2>
          <p id={`${details.id}-description`}>{details.description}</p>
        </div>

        {status === 'success' ? (
          <div className="application-modal__success" role="status">
            <strong>Спасибо! Заявка отправлена</strong>
            <p>Мы получили ваши данные и свяжемся с вами в ближайшее время.</p>
            <button type="button" onClick={onClose}>Закрыть</button>
          </div>
        ) : (
          <form id={details.id} name={details.id} className="application-modal__form" onSubmit={handleSubmit}>
            <input type="hidden" name="form_id" value={details.id} />
            <input type="hidden" name="event_id" value={config.eventId} />
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
                    defaultValue={field.defaultValue}
                    autoComplete={field.autoComplete}
                    required={field.required}
                  />
                )}
              </label>
            ))}

            <label className="application-modal__consent application-modal__field--wide">
              <input name="consent" type="checkbox" value="yes" required />
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

            <button className="application-modal__submit application-modal__field--wide" type="submit" disabled={status === 'sending'}>
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
