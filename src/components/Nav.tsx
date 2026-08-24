import { useEffect, useState } from 'react';

const sections = [
  { id: 'work', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];

export default function Nav({ name }: { name: string }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [progress, setProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
      setScrolled(window.scrollY > 24);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* storage unavailable — theme still applies for this visit */
    }
  };

  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="nav__inner wrap">
        <a className="nav__brand" href="#top">
          {name}
        </a>

        <nav className="nav__links" aria-label="Sections">
          {sections.map((section) => (
            <a key={section.id} href={`#${section.id}`}>
              {section.label}
            </a>
          ))}
        </nav>

        <button
          className="nav__toggle"
          onClick={toggle}
          type="button"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        >
          <span className="nav__dot" data-on={theme === 'dark'} />
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
      </div>

      <div className="nav__progress" style={{ transform: `scaleX(${progress})` }} />
    </header>
  );
}
