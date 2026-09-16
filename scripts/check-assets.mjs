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
const images = JSON.parse(fs.readFileSync(path.join(root, 'src/data/images.json'), 'utf8'));
for (const [url, image] of Object.entries(images)) {
  assert.ok(image.width > 0 && image.height > 0, `Invalid dimensions: ${url}`);
  expected.add(path.join(root, 'public', url));
  let previous = 0;
  for (const width of image.variants) {
    assert.ok(width > previous && width < image.width, `Invalid responsive width: ${url} ${width}`);
    expected.add(path.join(root, 'public', url.replace(/\.webp$/, `-${width}w.webp`)));
    previous = width;
  }
}
const server = await createServer({ root, server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
try {
  const { content } = await server.ssrLoadModule('/src/data/content.js');
  function collect(value) {
    if (typeof value === 'string' && value.startsWith(`${server.config.base}assets/`)) {
      expected.add(path.join(root, 'public', value.slice(server.config.base.length)));
    }
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
for (const file of expected) {
  assert.ok(fs.existsSync(file), `Missing asset: ${path.relative(root, file)}`);
  const data = fs.readFileSync(file);
  assert.ok(data.length > 0, `Empty asset: ${file}`);
  if (file.endsWith('.webp')) {
    assert.equal(data.toString('ascii', 0, 4), 'RIFF', `Invalid WebP header: ${file}`);
    assert.equal(data.toString('ascii', 8, 12), 'WEBP', `Invalid WebP format: ${file}`);
    assert.equal(data.readUInt32LE(4) + 8, data.length, `Truncated WebP: ${file}`);
  }
}
const publicFiles = walk(path.join(root, 'public/assets'));
const total = publicFiles.reduce((sum, file) => sum + fs.statSync(file).size, 0);
assert.ok(total < 14_000_000, `Public assets exceed the 14 MB budget: ${total} bytes`);
console.log(`PASS: ${expected.size} referenced assets and responsive variants; public assets ${(total / 1e6).toFixed(2)} MB / 14 MB budget.`);
