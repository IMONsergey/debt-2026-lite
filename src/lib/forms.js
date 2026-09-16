const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function createLeadPayload(formData, { formId, eventId, tariff, sourceUrl }) {
  const payload = {
    ...Object.fromEntries(formData.entries()),
    form_id: formId,
    event_id: eventId,
    consent: formData.get('consent') === 'yes',
    source_page: sourceUrl,
    submitted_at: new Date().toISOString(),
  };
  if (tariff) {
    payload.tariff_id = tariff.id;
    payload.tariff_name = tariff.title;
    payload.tariff_price = tariff.price;
  }
  const searchParams = new URL(sourceUrl).searchParams;
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) {
    if (searchParams.has(key)) payload[key] = searchParams.get(key);
  }
  return payload;
}

export async function sendLead(payload, { endpoint, fetchImpl = fetch, timeoutMs = 20000 }) {
  if (!endpoint) throw new Error('Форма временно недоступна. Свяжитесь с организатором.');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const result = await response.json().catch(() => null);
    // A 200 HTML fallback or malformed response is not an accepted lead.
    if (!response.ok || result?.success !== true) {
      throw new Error(result?.message || 'Не удалось отправить заявку. Попробуйте ещё раз.');
    }
    return result;
  } catch (error) {
    if (controller.signal.aborted) throw new Error('Сервер не ответил. Попробуйте отправить заявку ещё раз.');
    if (error instanceof TypeError) throw new Error('Не удалось связаться с сервером. Проверьте подключение и попробуйте ещё раз.');
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

export function validateContactFields(form) {
  const phoneInput = form.elements.phone;
  const emailInput = form.elements.email;
  const phoneDigits = phoneInput?.value.replace(/\D/g, '') ?? '';
  const email = emailInput?.value.trim() ?? '';

  phoneInput?.setCustomValidity('');
  emailInput?.setCustomValidity('');

  if (phoneInput && (phoneDigits.length < 10 || phoneDigits.length > 15)) {
    phoneInput.setCustomValidity('Введите корректный телефон: от 10 до 15 цифр.');
    phoneInput.reportValidity();
    return false;
  }

  if (emailInput && !EMAIL_PATTERN.test(email)) {
    emailInput.setCustomValidity('Введите корректный e-mail.');
    emailInput.reportValidity();
    return false;
  }

  return true;
}

export function formatPhoneValue(value) {
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
