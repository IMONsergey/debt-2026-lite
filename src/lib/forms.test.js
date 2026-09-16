import test from 'node:test';
import assert from 'node:assert/strict';
import { createLeadPayload, formatPhoneValue, sendLead } from './forms.js';

test('all forms retain consent, tariff, corporate quantity and attribution', () => {
  const form = new FormData();
  form.set('participants_count', '5');
  form.set('full_name', 'Тест');
  form.set('consent', 'yes');
  const payload = createLeadPayload(form, {
    formId: 'corporate-package-form', eventId: 'debt-tech-2026',
    tariff: { id: 'full-plus', title: 'Полный PLUS', price: '66 000 ₽' },
    sourceUrl: 'https://example.test/?utm_source=test&utm_campaign=forum',
  });
  assert.equal(payload.form_id, 'corporate-package-form');
  assert.equal(payload.participants_count, '5');
  assert.equal(payload.tariff_id, 'full-plus');
  assert.equal(payload.tariff_price, '66 000 ₽');
  assert.equal(payload.consent, true);
  assert.equal(payload.utm_source, 'test');
  assert.equal(payload.utm_campaign, 'forum');
});

test('success requires an explicit server acknowledgement; no network is used', async () => {
  const response = (ok, data) => async () => ({ ok, json: async () => data });
  await assert.rejects(sendLead({}, { endpoint: '', fetchImpl: () => assert.fail('No endpoint must not send') }));
  for (const [ok, data] of [[true, null], [true, {}], [true, {success:false}], [false, {success:true}]]) {
    await assert.rejects(sendLead({}, {endpoint:'/api/lead',fetchImpl:response(ok,data)}));
  }
  await assert.rejects(sendLead({}, {endpoint:'/api/lead',fetchImpl:async()=>({ok:true,json:async()=>{throw new Error('HTML');}})}));
  assert.deepEqual(await sendLead({}, {endpoint:'/api/lead',fetchImpl:response(true,{success:true})}),{success:true});
});

test('a stalled request times out and can be retried', async () => {
  const fetchImpl = (_, { signal }) => new Promise((resolve, reject) => {
    signal.addEventListener('abort', () => reject(new Error('aborted')), {once:true});
  });
  await assert.rejects(sendLead({}, {endpoint:'/api/lead',fetchImpl,timeoutMs:5}), /Сервер не ответил/);
});

test('phone formatting supports local and international numbers', () => {
  assert.equal(formatPhoneValue(''), '');
  assert.equal(formatPhoneValue('89991234567'), '+7 999 123-45-67');
  assert.equal(formatPhoneValue('9991234567'), '+7 999 123-45-67');
  assert.equal(formatPhoneValue('+44 20 1234 5678'), '+442012345678');
});
