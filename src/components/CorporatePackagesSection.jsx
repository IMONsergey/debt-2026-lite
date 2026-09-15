import { useState } from 'react';
import { assetUrl } from '../lib/assets.js';
import { typograf } from '../lib/typography.js';
import { MAX_CORPORATE_PARTICIPANTS } from '../lib/corporate-pricing.js';
import '../styles/corporate-packages.css';

const discounts = [
  { percent: 10, description: 'На третьего и четвертого участника', width: 180 },
  { percent: 20, description: 'На пятого и последующих участников', width: 196 },
];
const FORM_ID = 'corporate-package-form';

function formatPhoneValue(value) {
  let digits = value.replace(/\D/g, '');

  if (digits.startsWith('9')) {
    digits = `7${digits.slice(0, 10)}`;
  } else if (digits.startsWith('8')) {
    digits = `7${digits.slice(1, 11)}`;
  } else {
    digits = digits.slice(0, 15);
  }

  if (!digits) return '';
  if (!digits.startsWith('7')) return `+${digits}`;

  const local = digits.slice(1, 11);
  const parts = [];
  if (local.slice(0, 3)) parts.push(local.slice(0, 3));
  if (local.slice(3, 6)) parts.push(local.slice(3, 6));

  const tail = [local.slice(6, 8), local.slice(8, 10)].filter(Boolean).join('-');
  return `+7${parts.length ? ` ${parts.join(' ')}` : ''}${tail ? `-${tail}` : ''}`;
}

function validatePhone(form) {
  const phoneInput = form.elements.phone;
  const phoneDigits = phoneInput?.value.replace(/\D/g, '') ?? '';
  phoneInput?.setCustomValidity('');

  if (phoneDigits.length < 10 || phoneDigits.length > 15) {
    phoneInput?.setCustomValidity('Введите корректный телефон: от 10 до 15 цифр.');
    phoneInput?.reportValidity();
    return false;
  }

  return true;
}

export function CorporatePackagesSection({ tariffs, privacyHref, config }) {
  const items = tariffs?.items ?? [];
  const [tariffId, setTariffId] = useState(() => items.find(item => item.id === 'full-plus')?.id ?? items[0]?.id ?? '');
  const [participants, setParticipants] = useState('3');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  if (!items.length) return null;

  function resetStatus() {
    if (status === 'sending') return;
    setStatus('idle');
    setMessage('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (status === 'sending' || !validatePhone(event.currentTarget)) return;

    const tariff = items.find(item => item.id === tariffId);
    const endpoint = document
      .querySelector('meta[name="debt-tech-forms-endpoint"]')
      ?.getAttribute('content')
      ?.trim();

    if (!endpoint) {
      setStatus('success');
      return;
    }

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    payload.form_id = FORM_ID;
    payload.event_id = config?.eventId ?? 'debt-tech-2026';
    payload.tariff_id = tariff.id;
    payload.tariff_name = tariff.title;
    payload.tariff_price = tariff.price;
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

  return (
    <section className="corporate-packages" id="corporate-packages" aria-labelledby="corporate-packages-title">
      <div className="corporate-packages__panel">
        <div className="corporate-packages__offer">
          <h2 className="corporate-packages__title" id="corporate-packages-title">Корпоративные<br />пакеты*</h2>
          <p className="corporate-packages__note">*Скидки не суммируются</p>
          <ul className="corporate-packages__cards">
            {discounts.map(discount => (
              <li className="corporate-discount" key={discount.percent}>
                <div className="corporate-discount__inner">
                  <span className="corporate-discount__badge">Скидка</span>
                  <img className="corporate-discount__number" src={assetUrl(`assets/images/corporate-packages/discount-${discount.percent}.svg`)} width={discount.width} height="97" alt={`${discount.percent}%`} loading="lazy" decoding="async" />
                  <p className="corporate-discount__description">{typograf(discount.description)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <form id={FORM_ID} name={FORM_ID} className="corporate-packages__form" onSubmit={handleSubmit} aria-labelledby="corporate-form-title">
          <h3 className="corporate-packages__form-title" id="corporate-form-title">Узнайте стоимость<br />корпоративного участия</h3>
          {status === 'success' ? (
            <div className="corporate-packages__success" role="status">
              <strong>Спасибо! Заявка отправлена</strong>
              <p>Мы получили ваши данные и свяжемся с вами в ближайшее время.</p>
            </div>
          ) : (
            <>
              <input type="hidden" name="form_id" value={FORM_ID} readOnly />
              <input type="hidden" name="event_id" value={config?.eventId ?? 'debt-tech-2026'} readOnly />
              <label className="corporate-packages__honeypot" aria-hidden="true">
                <span>Сайт</span>
                <input name="website" type="text" tabIndex="-1" autoComplete="off" />
              </label>
              <div className="corporate-packages__fields">
                <div className="corporate-packages__row">
                  <label className="corporate-packages__field">
                    <span>Количество участников</span>
                    <input name="participants_count" type="number" min="1" max={MAX_CORPORATE_PARTICIPANTS} step="1" inputMode="numeric" required value={participants} onChange={event => { setParticipants(event.target.value); resetStatus(); }} />
                  </label>
                  <label className="corporate-packages__field">
                    <span>Выберите тариф</span>
                    <select name="tariff_id" required value={tariffId} onChange={event => { setTariffId(event.target.value); resetStatus(); }}>
                      {items.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}
                    </select>
                  </label>
                </div>
                <label className="corporate-packages__field">
                  <span>Ваше ФИО</span>
                  <input name="full_name" type="text" autoComplete="name" placeholder="Иванов Иван Иванович" maxLength="150" required onInput={resetStatus} />
                </label>
                <label className="corporate-packages__field">
                  <span>Номер телефона</span>
                  <input
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="+7 999 999 99 99"
                    maxLength="24"
                    required
                    onInput={(event) => {
                      event.currentTarget.setCustomValidity('');
                      event.currentTarget.value = formatPhoneValue(event.currentTarget.value);
                      resetStatus();
                    }}
                  />
                </label>
              </div>
              <label className="corporate-packages__consent">
                <input type="checkbox" name="consent" value="yes" required onChange={resetStatus} />
                <span>Заполняя форму заявки, я соглашаюсь с <a href={privacyHref} target="_blank" rel="noreferrer">политикой обработки персональных данных</a>.</span>
              </label>
              <button className="corporate-packages__submit" type="submit" disabled={status === 'sending'}>
                <span>{status === 'sending' ? 'Отправляем…' : 'Рассчитать стоимость'}</span>
                <img src={assetUrl('assets/icons/arrow-up.svg')} width="16" height="16" alt="" aria-hidden="true" />
              </button>
              <div className="corporate-packages__feedback" aria-live="polite" aria-atomic="true">
                {message ? <p className="corporate-packages__error" role="status">{message}</p> : null}
              </div>
            </>
          )}
        </form>
      </div>
    </section>
  );
}
