import assert from 'node:assert/strict';
import fs from 'node:fs';
import postcss from 'postcss';

// Focused static cascade checks, not a substitute for viewport screenshots.
const assets = new URL('../dist/assets/', import.meta.url);
const css = fs.readdirSync(assets).find(name => name.endsWith('.css'));
const root = postcss.parse(fs.readFileSync(new URL(css, assets), 'utf8'));
const widths = [320, 360, 390, 430, 479, 480, 599, 600, 639, 640, 662, 699, 700, 705, 768, 860, 861, 899, 900, 901, 1024, 1180, 1181, 1280, 1320, 1321, 1440, 1920];
const heights = [568, 760, 900, 1080];
let assertions = 0;

function mediaMatches(query, width, height) {
  return [...query.matchAll(/\(([^:]+):([^)]*)\)/g)].every(([, key, value]) => {
    const n = parseFloat(value);
    if (key === 'min-width') return width >= n;
    if (key === 'max-width') return width <= n;
    if (key === 'min-height') return height >= n;
    if (key === 'max-height') return height <= n;
    if (key === 'prefers-reduced-motion') return value === 'no-preference';
    if (key === 'hover') return value === 'hover';
    if (key === 'pointer') return value === 'fine';
    throw new Error(`Unhandled media feature: ${key}`);
  });
}

function value(selectors, property, width, height) {
  let winner;
  root.walkRules(rule => {
    for (let parent = rule.parent; parent; parent = parent.parent) {
      if (parent.type !== 'atrule') continue;
      if (parent.name !== 'media' || !mediaMatches(parent.params, width, height)) return;
    }
    for (const selector of rule.selectors) {
      if (!selectors.includes(selector)) continue;
      const specificity = (selector.match(/\.[\w-]+|:(?!:)[\w-]+/g) || []).length;
      rule.walkDecls(property, decl => {
        const rank = (decl.important ? 1000 : 0) + specificity;
        if (!winner || rank >= winner.rank) winner = { rank, value: decl.value };
      });
    }
  });
  return winner?.value;
}

function check(actual, expected, message) {
  assert.equal(actual, expected, message);
  assertions++;
}

for (const width of widths) for (const height of heights) {
  const primary = ['.ui-button', '.fixed-menu__cta', '.hero-only-view .fixed-menu__cta', '.mobile-hero-info .fixed-menu__cta', '.hero-only-view .mobile-hero-info .fixed-menu__cta'];
  const secondary = [...primary, '.hero-only-view .fixed-menu__cta--secondary', '.mobile-hero-info .fixed-menu__cta--secondary', '.hero-only-view .mobile-hero-info .fixed-menu__cta--secondary'];
  if (width <= 1180) {
    check(value(primary, 'min-height', width, height), 'var(--ui-cta-height)', `${width}: primary height`);
    check(value(secondary, 'grid-row', width, height), width >= 700 ? '3' : 'auto', `${width}: secondary row`);
    check(value(primary, 'grid-row', width, height), width >= 700 ? '3' : 'auto', `${width}: primary row`);
    check(value(['.mobile-registration', '.mobile-registration:hover', '.mobile-registration:focus-visible'], 'transform', width, height), 'translate(-50%)', `${width}: fixed CTA remains centered`);
  }
  for (const cls of ['.venue-section__route', '.gallery-section__link', '.tariff-card__button']) {
    check(value(['.ui-button', cls], 'min-height', width, height), 'var(--ui-cta-height)', `${width}: ${cls} height`);
    check(value(['.ui-button', cls], 'border-radius', width, height), 'var(--ui-cta-radius)', `${width}: ${cls} radius`);
    check(value([`${cls} img`], 'width', width, height), '16px', `${width}: ${cls} icon`);
    check(value([cls, `${cls}:hover`, `.hero-only-view ${cls}:hover`], 'transform', width, height), undefined, `${width}: ${cls} hover movement`);
  }
  for (const cls of ['.gallery-carousel__arrow', '.other-conferences-carousel__control', '.application-modal__close', '.ticket-offer-modal__close']) {
    check(value([cls], 'width', width, height), '44px', `${width}: ${cls} touch target`);
    check(value([cls], 'height', width, height), '44px', `${width}: ${cls} touch target`);
  }
  if (width <= 1180) {
    check(value(primary, 'grid-column', width, height), '1', `${width}: first CTA in left column`);
    check(value(secondary, 'grid-column', width, height), width >= 700 ? '2' : '1', `${width}: second CTA shares row or stacks`);
    check(value(['.organizer-layout'], 'grid-template-columns', width, height), width >= 640 ? 'repeat(2,minmax(0,1fr))' : 'minmax(0,1fr)', `${width}: organizer uses appropriate columns`);
    check(value(['.organizer-card'], 'aspect-ratio', width, height), 'auto', `${width}: organizer grows with content`);
    check(value(['.organizer-card--brand p'], 'white-space', width, height), 'normal', `${width}: license can wrap`);
    check(value(['.about-tags__pill'], 'pointer-events', width, height), 'auto', `${width}: topic hover can receive a pointer`);
  }
  const columns = value(['.about-forum-section__content'], 'grid-template-columns', width, height);
  if (width <= 860) check(columns, '1fr', `${width}: stacked about section`);
  else {
    const edge = Math.max(28, Math.min(width * .022, 42));
    const gap = Math.max(10, Math.min(width * .01, 16));
    const column = (width - 2 * edge - 14 * gap) / 15;
    const available = width <= 1180 ? width - 2 * Math.max(18, Math.min(width * .04, 42)) : width - 2 * edge - 3 * column - 3 * gap;
    const gridGap = Math.max(14, Math.min(width * .0135, 24));
    const minimum = width <= 1320 ? 300 + 440 + gridGap : 330 + 420 + 170 + gridGap * 2;
    assert.ok(available >= minimum, `${width}: about grid needs ${minimum}px, has ${available}px`);
    assertions++;
  }
}
console.log(`PASS: ${assertions} static CSS cascade/geometry assertions; ${widths.length} widths × ${heights.length} heights.`);
