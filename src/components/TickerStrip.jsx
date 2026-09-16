import { typograf } from '../lib/typography.js';

export function TickerStrip({ items = [] }) {
  const normalizedItems = items.filter(Boolean);
  if (normalizedItems.length === 0) return null;

  const renderedItems = [...normalizedItems, ...normalizedItems, ...normalizedItems];

  return (
    <section className="ticker-strip" aria-label="Ключевые преимущества форума">
      <div className="ticker-strip__viewport">
        <div className="ticker-strip__track">
          {renderedItems.map((item, index) => (
            <span className="ticker-strip__unit" key={`${item}-${index}`} aria-hidden={index >= normalizedItems.length}>
              <span className="ticker-strip__item">[ {typograf(item)} ]</span>
              <span className="ticker-strip__separator">//</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
