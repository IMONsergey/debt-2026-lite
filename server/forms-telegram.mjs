import http from 'node:http';

const PORT = Number(process.env.PORT || 32026);
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const THREAD_ID = process.env.TELEGRAM_THREAD_ID;
const BITRIX_WEBHOOK_URL = (process.env.BITRIX_WEBHOOK_URL || '').trim().replace(/\/+$/, '');
const BITRIX_ENTITY_TYPE_ID = Number(process.env.BITRIX_ENTITY_TYPE_ID || 1);
const BITRIX_ASSIGNED_BY_ID = process.env.BITRIX_ASSIGNED_BY_ID ? Number(process.env.BITRIX_ASSIGNED_BY_ID) : null;
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGIN || process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const MAX_BODY_BYTES = Number(process.env.MAX_BODY_BYTES || 32_768);
const RATE_WINDOW_MS = Number(process.env.RATE_WINDOW_MS || 10 * 60 * 1000);
const RATE_LIMIT = Number(process.env.RATE_LIMIT || 8);
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TELEGRAM_RETRY_DELAYS_MS = [600, 1_600];
const BITRIX_TIMEOUT_MS = Number(process.env.BITRIX_TIMEOUT_MS || 8_000);

const rateBuckets = new Map();

function jsonResponse(response, status, payload, extraHeaders = {}) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...extraHeaders,
  });
  response.end(JSON.stringify(payload));
}

function getOriginHeaders(request) {
  const origin = request.headers.origin;
  if (!origin) return {};
  if (ALLOWED_ORIGINS.length > 0 && !ALLOWED_ORIGINS.includes(origin)) return {};
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    Vary: 'Origin',
  };
}

function clientIp(request) {
  const forwarded = request.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) return forwarded.split(',')[0].trim();
  return request.socket.remoteAddress || 'unknown';
}

function isRateLimited(ip) {
  const now = Date.now();
  const bucket = (rateBuckets.get(ip) || []).filter((time) => now - time < RATE_WINDOW_MS);
  bucket.push(now);
  rateBuckets.set(ip, bucket);

  if (rateBuckets.size > 2000) {
    for (const [key, values] of rateBuckets.entries()) {
      if (values.every((time) => now - time >= RATE_WINDOW_MS)) rateBuckets.delete(key);
    }
  }

  return bucket.length > RATE_LIMIT;
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    let size = 0;
    let body = '';

    request.setEncoding('utf8');
    request.on('data', (chunk) => {
      size += Buffer.byteLength(chunk);
      if (size > MAX_BODY_BYTES) {
        reject(new Error('payload_too_large'));
        request.destroy();
        return;
      }
      body += chunk;
    });
    request.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'));
      } catch {
        reject(new Error('invalid_json'));
      }
    });
    request.on('error', reject);
  });
}

function clean(value, maxLength = 800) {
  if (value === null || value === undefined) return '';
  return String(value).replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

function escapeHtml(value) {
  return clean(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function formTitle(formId) {
  if (formId === 'stand-booking-form') return 'Бронирование стенда';
  if (formId === 'early-registration-form') return 'Ранняя регистрация';
  return clean(formId || 'Заявка');
}

function splitFullName(value) {
  const parts = clean(value, 160).split(' ').filter(Boolean);
  if (parts.length === 0) return { name: '', lastName: '' };
  if (parts.length === 1) return { name: parts[0], lastName: '' };
  return {
    lastName: parts[0],
    name: parts.slice(1).join(' '),
  };
}

function formatLeadComments(payload) {
  const rows = [
    ['Форма', formTitle(payload.form_id)],
    ['Участников', payload.participants_count],
    ['Промокод', payload.promo_code],
    ['Должность', payload.job_title],
    ['Комментарий', payload.comment],
    ['Страница', payload.source_page],
    ['UTM source', payload.utm_source],
    ['UTM medium', payload.utm_medium],
    ['UTM campaign', payload.utm_campaign],
    ['UTM content', payload.utm_content],
    ['UTM term', payload.utm_term],
  ].filter(([, value]) => clean(value));

  return rows.map(([label, value]) => `${label}: ${clean(value, 1000)}`).join('\n');
}

function buildBitrixLeadPayload(payload) {
  const { name, lastName } = splitFullName(payload.full_name);
  const companyTitle = clean(payload.company, 255);
  const titleParts = [`DEBT TECH 2026: ${formTitle(payload.form_id)}`];
  if (clean(payload.full_name)) titleParts.push(clean(payload.full_name, 160));
  if (companyTitle) titleParts.push(companyTitle);

  const fm = [];
  if (clean(payload.phone, 60)) {
    fm.push({ typeId: 'PHONE', valueType: 'WORK', value: clean(payload.phone, 60) });
  }
  if (clean(payload.email, 160)) {
    fm.push({ typeId: 'EMAIL', valueType: 'WORK', value: clean(payload.email, 160) });
  }

  const fields = {
    title: titleParts.join(' — '),
    name,
    lastName,
    companyTitle,
    fm,
    comments: formatLeadComments(payload),
  };

  if (Number.isInteger(BITRIX_ASSIGNED_BY_ID) && BITRIX_ASSIGNED_BY_ID > 0) {
    fields.assignedById = BITRIX_ASSIGNED_BY_ID;
  }

  return {
    entityTypeId: BITRIX_ENTITY_TYPE_ID,
    fields,
  };
}

async function callBitrix(method, params) {
  if (!BITRIX_WEBHOOK_URL) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), BITRIX_TIMEOUT_MS);

  try {
    const response = await fetch(`${BITRIX_WEBHOOK_URL}/${method}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(params),
      signal: controller.signal,
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.error) {
      throw new Error(`bitrix_error_${response.status}:${clean(result.error_description || result.error || 'unknown', 240)}`);
    }

    return result;
  } finally {
    clearTimeout(timeout);
  }
}

async function createBitrixLead(payload) {
  if (!BITRIX_WEBHOOK_URL) return null;

  const result = await callBitrix('crm.item.add', buildBitrixLeadPayload(payload));
  const leadId = result?.result?.item?.id;
  if (!leadId) throw new Error('bitrix_error_no_lead_id');
  return leadId;
}

function formatMessage(payload) {
  const rows = [
    ['Форма', formTitle(payload.form_id)],
    ['ФИО', payload.full_name],
    ['Компания', payload.company],
    ['Должность', payload.job_title],
    ['Участников', payload.participants_count],
    ['Промокод', payload.promo_code],
    ['Телефон', payload.phone],
    ['E-mail', payload.email],
    ['Комментарий', payload.comment],
    ['Страница', payload.source_page],
    ['UTM source', payload.utm_source],
    ['UTM medium', payload.utm_medium],
    ['UTM campaign', payload.utm_campaign],
    ['UTM content', payload.utm_content],
    ['UTM term', payload.utm_term],
  ].filter(([, value]) => clean(value));

  const lines = rows.map(([label, value]) => `<b>${escapeHtml(label)}:</b> ${escapeHtml(value)}`);
  return [`<b>DEBT TECH 2026</b>`, ...lines].join('\n');
}

async function sendTelegram(payload) {
  if (!BOT_TOKEN || !CHAT_ID) {
    throw new Error('telegram_not_configured');
  }

  const body = {
    chat_id: CHAT_ID,
    text: formatMessage(payload),
    parse_mode: 'HTML',
    disable_web_page_preview: true,
  };

  if (THREAD_ID) body.message_thread_id = THREAD_ID;

  for (let attempt = 0; attempt <= TELEGRAM_RETRY_DELAYS_MS.length; attempt += 1) {
    try {
      const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) return;

      const errorBody = await response.text().catch(() => '');
      const shouldRetry = response.status === 429 || response.status >= 500;
      if (!shouldRetry || attempt === TELEGRAM_RETRY_DELAYS_MS.length) {
        throw new Error(`telegram_error_${response.status}:${errorBody.slice(0, 200)}`);
      }
    } catch (error) {
      if (attempt === TELEGRAM_RETRY_DELAYS_MS.length) throw error;
    }

    await new Promise((resolve) => setTimeout(resolve, TELEGRAM_RETRY_DELAYS_MS[attempt]));
  }
}

function validatePayload(payload) {
  if (clean(payload.website)) return 'spam';
  if (payload.consent !== true) return 'consent_required';

  const formId = clean(payload.form_id);
  if (!['early-registration-form', 'stand-booking-form'].includes(formId)) return 'invalid_form';

  const required = ['full_name', 'company', 'phone', 'email'];
  if (formId === 'early-registration-form') required.push('participants_count');
  for (const field of required) {
    if (!clean(payload[field])) return 'required_fields';
  }

  const phoneDigits = clean(payload.phone, 40).replace(/\D/g, '');
  if (phoneDigits.length < 10 || phoneDigits.length > 15) return 'invalid_phone';

  if (!EMAIL_PATTERN.test(clean(payload.email, 160))) return 'invalid_email';

  return null;
}

const server = http.createServer(async (request, response) => {
  const corsHeaders = getOriginHeaders(request);
  const requestUrl = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`);

  if (request.method === 'OPTIONS') {
    jsonResponse(response, 204, {}, corsHeaders);
    return;
  }

  if (request.method === 'GET' && requestUrl.pathname === '/health') {
    jsonResponse(response, 200, { ok: true });
    return;
  }

  if (request.method !== 'POST' || requestUrl.pathname !== '/api/lead') {
    jsonResponse(response, 404, { success: false, message: 'Not found' }, corsHeaders);
    return;
  }

  const ip = clientIp(request);
  if (isRateLimited(ip)) {
    jsonResponse(response, 429, { success: false, message: 'Слишком много отправок. Попробуйте позже.' }, corsHeaders);
    return;
  }

  try {
    const payload = await readJson(request);
    const validationError = validatePayload(payload);
    if (validationError === 'spam') {
      jsonResponse(response, 200, { success: true }, corsHeaders);
      return;
    }
    if (validationError) {
      jsonResponse(response, 400, { success: false, message: 'Проверьте обязательные поля формы.' }, corsHeaders);
      return;
    }

    const bitrixLeadId = await createBitrixLead(payload);
    jsonResponse(response, 200, { success: true, lead_id: bitrixLeadId || undefined }, corsHeaders);
    setImmediate(() => {
      sendTelegram(payload).catch((error) => {
        console.error(new Date().toISOString(), `telegram_async_error:${error.message}`);
      });
    });
  } catch (error) {
    const status = error.message === 'payload_too_large' ? 413 : 502;
    console.error(new Date().toISOString(), error.message);
    jsonResponse(response, status, { success: false, message: 'Не удалось отправить заявку. Попробуйте ещё раз.' }, corsHeaders);
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`forms handler listening on 127.0.0.1:${PORT}`);
});
