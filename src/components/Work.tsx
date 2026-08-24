import { useState } from 'react';
import Reveal from './Reveal';

type Project = {
  no: string;
  title: string;
  year: string;
  tags: string[];
  blurb: string;
  href: string;
};

export default function Work({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section className="section" id="work">
      <div className="wrap">
        <Reveal>
          <p className="eyebrow">Selected work</p>
        </Reveal>

        <ul className="work" onMouseLeave={() => setActive(null)}>
          {projects.map((project, i) => (
            <Reveal as="li" key={project.no} delay={i * 80} className="work__row">
              <a
                className={`work__link ${active && active !== project.no ? 'is-dim' : ''}`}
                href={project.href}
                onMouseEnter={() => setActive(project.no)}
                onFocus={() => setActive(project.no)}
                onBlur={() => setActive(null)}
              >
                <span className="work__no muted">{project.no}</span>

                <span className="work__body">
                  <span className="work__head">
                    <h3 className="work__title serif">{project.title}</h3>
                    <span className="work__year muted">{project.year}</span>
                  </span>
                  <span className="work__blurb muted">{project.blurb}</span>
                  <span className="work__tags">
                    {project.tags.map((tag) => (
                      <span className="tag" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </span>
                </span>

                <span className="work__arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
