import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createServer } from 'vite';

const root = path.resolve(import.meta.dirname, '..');
const walk = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
  const file = path.join(directory, entry.name);
  return entry.isDirectory() ? walk(file) : [file];
});
const expected = new Set();
const server = await createServer({ root, server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
try {
  const { content } = await server.ssrLoadModule('/src/data/content.js');
  function collect(value) {
    if (typeof value === 'string' && value.startsWith('/assets/')) expected.add(path.join(root, 'public', value));
    else if (value && typeof value === 'object') Object.values(value).forEach(collect);
  }
  collect(content);
} finally {
  await server.close();
}

const sources = [...walk(path.join(root, 'src')).filter(file => /\.(css|jsx?)$/.test(file)), path.join(root, 'index.html')];
for (const file of sources) {
  const source = fs.readFileSync(file, 'utf8');
  for (const [url] of source.matchAll(/(?:\/?assets\/[\w./-]+\.(?:svg|png|jpg|webp|ico))/g)) {
    expected.add(path.join(root, 'public', url));
  }
  if (file.endsWith('.css')) {
    for (const [, url] of source.matchAll(/url\(['"]?(\.\.\/[^)'"\s]+)['"]?\)/g)) {
      expected.add(path.resolve(path.dirname(file), url));
    }
  }
}
// Dynamic asset families must be complete, including variants not visible initially.
for (const percent of [10, 20]) expected.add(path.join(root, `public/assets/images/corporate-packages/discount-${percent}.svg`));
for (const name of ['telegram', 'max', 'whatsapp']) expected.add(path.join(root, `public/assets/icons/${name}-contact.svg`));
for (const file of expected) assert.ok(fs.existsSync(file), `Missing asset: ${path.relative(root, file)}`);
console.log(`PASS: ${expected.size} referenced assets exist, including all gallery images, tariff variants and fonts.`);
