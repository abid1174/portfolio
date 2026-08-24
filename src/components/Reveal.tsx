import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  delay?: number;
  as?: ElementType;
  className?: string;
};

export default function Reveal({ children, delay = 0, as: Tag = 'div', className = '' }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`.trim()}
      style={{ '--delay': `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}
