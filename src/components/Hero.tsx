import { useEffect, useState } from 'react';

type Props = {
  name: string;
  role: string;
  intro: string;
  location: string;
};

export default function Hero({ name, role, intro, location }: Props) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const words = name.split(' ');

  return (
    <section className={`hero ${ready ? 'is-ready' : ''}`} id="top">
      <div className="wrap hero__inner">
        <p className="hero__role stagger" style={{ '--i': 0 } as React.CSSProperties}>
          {role}
        </p>

        <h1 className="hero__title serif">
          {words.map((word, i) => (
            <span className="hero__word" key={word + i}>
              <span className="hero__word-inner" style={{ '--i': i + 1 } as React.CSSProperties}>
                {word}
              </span>
            </span>
          ))}
        </h1>

        <p className="hero__intro stagger" style={{ '--i': words.length + 1 } as React.CSSProperties}>
          {intro}
        </p>

        <div className="hero__meta stagger" style={{ '--i': words.length + 2 } as React.CSSProperties}>
          <span className="hero__pulse" aria-hidden="true" />
          <span className="muted">{location}</span>
        </div>
      </div>

      <div className="hero__scroll stagger" style={{ '--i': words.length + 3 } as React.CSSProperties}>
        <span>Scroll</span>
        <span className="hero__line" aria-hidden="true" />
      </div>
    </section>
  );
}
