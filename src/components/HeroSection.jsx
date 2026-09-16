import { SidebarInfo } from './FixedMenu.jsx';
import { useCountdown } from '../hooks/useCountdown.js';
import { typograf } from '../lib/typography.js';

export function HeroSection({ content, onOpenApplication }) {
  const countdown = useCountdown(content.hero.countdownTarget, content.hero.countdown);

  return (
    <section
      className="hero-placeholder"
      id="top"
      style={{
        '--hero-image': `url("${content.hero.backgroundImage}")`,
        '--hero-image-adaptive': `url("${content.hero.backgroundImageAdaptive ?? content.hero.backgroundImage}")`,
      }}
    >
      <h1 className="visually-hidden">{content.hero.title}</h1>
      <div className="hero-placeholder__meta">
        <span>{content.site.date}</span>
        <span>{typograf(content.site.city)}</span>
      </div>
      <div className="hero-bottom">
        <div className="hero-bottom__content desktop-content-area content-grid">
          <p>{typograf(content.hero.bottomTitle)}</p>
          <div className="countdown" aria-label={content.hero.countdownLabel}>
            <span className="countdown__label">{typograf(content.hero.countdownLabel)}</span>
            <div className="countdown__items">
              {countdown.map((item) => (
                <span className="countdown__item" key={item.label}>
                  <strong>{item.value}</strong>
                  <span>{typograf(item.label)}</span>
                </span>
              ))}
            </div>
          </div>
          <SidebarInfo
            className="mobile-hero-info"
            menu={content.menu}
            video={content.heroVideo}
            onOpenApplication={onOpenApplication}
          />
        </div>
      </div>
    </section>
  );
}
