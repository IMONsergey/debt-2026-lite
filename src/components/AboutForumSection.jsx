import { typograf } from '../lib/typography.js';

export function AboutForumSection({ about }) {
  const tags = about?.tags ?? [];

  if (!about) return null;

  return (
    <section
      className="about-forum-section"
      id="about-forum"
      aria-labelledby="about-forum-title"
    >
      <div className="about-forum-section__content">
        <div className="about-forum-section__copy">
          <span className="about-forum-section__eyebrow">{typograf(about.eyebrow)}</span>
          <h2 id="about-forum-title">
            {(about.titleLines ?? [about.description]).map((line) => (
              <span key={line}>{typograf(line)}</span>
            ))}
          </h2>

          <div className="about-forum-section__features">
            {(about.features ?? []).map((feature) => (
              <div className="about-forum-section__feature" key={feature}>
                <span aria-hidden="true" />
                <p>{typograf(feature)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="about-tags" aria-label="Темы форума">
          <div className="about-tags__planet-wrap" aria-hidden="true">
            <img className="about-tags__planet" src={about.planetImage} alt="" loading="eager" fetchPriority="high" />
            <img className="about-tags__logo" src={about.logoImage} alt="" loading="eager" fetchPriority="high" />
          </div>

          <div className="about-tags__orbit" role="list">
            {tags.map((tag) => (
              <span className={`about-tags__pill about-tags__pill--${tag.id}`} role="listitem" key={tag.id}>
                {typograf(tag.label)}
              </span>
            ))}
          </div>

          <div className="about-forum-section__launch">
            <p>
              {(about.meetingLines ?? []).map((line) => <span key={line}>{typograf(line)}</span>)}
            </p>
            <img className="about-forum-section__shuttle" src={about.shuttleImage} alt="" aria-hidden="true" loading="eager" />
            <img className="about-forum-section__launch-logo" src={about.logoImage} alt="DEBT TECH 2026" loading="eager" />
          </div>
        </div>

        <div className="about-forum-section__stats" aria-label="Ключевые показатели форума">
          {(about.stats ?? []).map((item) => (
            <div className="about-forum-section__stat" key={item.label}>
              <strong>{typograf(item.value)}</strong>
              <span>{typograf(item.label)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
