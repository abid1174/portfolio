/** Site-wide constants. Nothing here should be duplicated in a component. */
export const site = {
  name: 'Abid Al Amin',
  role: 'Senior Software Engineer',
  /** Used in <title> suffixes and structured data. */
  title: 'Abid Al Amin — Engineering Notes',
  tagline: 'Clear concepts. Scalable systems. Smarter with AI.',
  description:
    'A personal engineering knowledge base: software concepts, system design practices and AI notes, written from real engineering experience.',
  url: 'https://abidalamin.dev',
  locale: 'en_US',
  email: 'abidalamin9@gmail.com',
  avatarInitials: 'AA',
  bio: 'I write down what I learn while building backend systems — the concepts underneath, the trade-offs behind the architecture, and how AI actually fits in.',
  intro:
    'Backend and distributed systems engineer. I keep notes in public so the explanations stay honest.',
  /** Short line, shown in the sidebar footer. */
  learningStatement:
    'Everything here started as a note to myself. Pages get revised as often as they get written.',
  /** Longer statement, shown once on the homepage. */
  manifesto:
    'If I cannot explain it clearly, I have not understood it well enough yet. That is the whole editorial policy — write it down, find the gap, rewrite it.',
  social: [
    { label: 'GitHub', href: 'https://github.com/abidalamin', handle: '@abidalamin' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/abidalamin', handle: 'abidalamin' },
  ],
} as const;

export type Site = typeof site;
