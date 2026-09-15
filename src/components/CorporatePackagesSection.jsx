import { useState } from 'react';
import { assetUrl } from '../lib/assets.js';
import { typograf } from '../lib/typography.js';
import { calculateCorporatePrice, MAX_CORPORATE_PARTICIPANTS } from '../lib/corporate-pricing.js';
import '../styles/corporate-packages.css';

const discounts = [
  { percent: 10, description: 'На третьего и четвертого участника', width: 180 },
  { percent: 20, description: 'На пятого и последующих участников', width: 196 },
];
const currency = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 });

export function CorporatePackagesSection({ tariffs, privacyHref }) {
  const items = tariffs?.items ?? [];
  const [tariffId, setTariffId] = useState(() => items.find(item => item.id === 'full-plus')?.id ?? items[0]?.id ?? '');
  const [participants, setParticipants] = useState('3');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  if (!items.length) return null;

  function resetResult() {
    setResult(null);
    setError('');
  }

  function handleSubmit(event) {
    event.preventDefault();
    const tariff = items.find(item => item.id === tariffId);
    try {
      const calculation = calculateCorporatePrice(tariff?.price, participants);
      setResult({ ...calculation, tariff: tariff.title });
      setError('');
    } catch (calculationError) {
      setResult(null);
      setError(calculationError.message);
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

        <form className="corporate-packages__form" onSubmit={handleSubmit} aria-labelledby="corporate-form-title">
          <h3 className="corporate-packages__form-title" id="corporate-form-title">Узнайте стоимость<br />корпоративного участия</h3>
          <div className="corporate-packages__fields">
            <div className="corporate-packages__row">
              <label className="corporate-packages__field">
                <span>Количество участников</span>
                <input name="participant_count" type="number" min="1" max={MAX_CORPORATE_PARTICIPANTS} step="1" inputMode="numeric" required value={participants} onChange={event => { setParticipants(event.target.value); resetResult(); }} />
              </label>
              <label className="corporate-packages__field">
                <span>Выберите тариф</span>
                <select name="tariff" value={tariffId} onChange={event => { setTariffId(event.target.value); resetResult(); }}>
                  {items.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}
                </select>
              </label>
            </div>
            <label className="corporate-packages__field">
              <span>Ваше ФИО</span>
              <input name="full_name" type="text" autoComplete="name" placeholder="Иванов Иван Иванович" maxLength="150" />
            </label>
            <label className="corporate-packages__field">
              <span>Номер телефона</span>
              <input name="phone" type="tel" autoComplete="tel" placeholder="+7 999 999 99 99" maxLength="25" />
            </label>
          </div>
          <label className="corporate-packages__consent">
            <input type="checkbox" name="consent" required />
            <span>Заполняя форму заявки, я соглашаюсь с <a href={privacyHref} target="_blank" rel="noreferrer">политикой обработки персональных данных</a>.</span>
          </label>
          <button className="corporate-packages__submit" type="submit">
            <span>Рассчитать стоимость</span>
            <img src={assetUrl('assets/icons/arrow-up.svg')} width="16" height="16" alt="" aria-hidden="true" />
          </button>
          <div className="corporate-packages__feedback" aria-live="polite" aria-atomic="true">
            {result && (
              <div className="corporate-packages__result">
                <span>Стоимость участия · {result.tariff}</span>
                <strong>{currency.format(result.total)}</strong>
                <span>Экономия: {currency.format(result.discount)}</span>
                <small>{tariffs.note}</small>
              </div>
            )}
            {error && <p className="corporate-packages__error">{error}</p>}
          </div>
        </form>
      </div>
    </section>
  );
}
