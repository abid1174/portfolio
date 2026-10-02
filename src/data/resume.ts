/**
 * Career data for the About page. Copy is rewritten for the web rather than lifted from the
 * PDF resume, but every claim here should still be traceable to it.
 */

export interface Role {
  company: string;
  title: string;
  employment: 'Full-time' | 'Part-time';
  /** `YYYY-MM`. */
  start: string;
  /** `YYYY-MM`, or omitted while the role is current. */
  end?: string;
  /** One sentence on what the role was about, read before the bullets. */
  summary: string;
  highlights: string[];
  /** A single headline outcome, shown beside the role when there is one worth showing. */
  metric?: { value: string; label: string };
  stack: string[];
}

export interface FocusArea {
  title: string;
  body: string;
  /** Where in the timeline this shows up, so the claim has evidence next to it. */
  proof: string;
}

export interface ToolGroup {
  label: string;
  items: string[];
}

export const location = 'Dhaka, Bangladesh';

export const roles: Role[] = [
  {
    company: 'Technovative Solutions',
    title: 'Senior Software Engineer',
    employment: 'Full-time',
    start: '2024-04',
    summary:
      'Leading the frontend team while owning backend architecture and the delivery platform underneath it.',
    highlights: [
      'Built a GitOps pipeline — GitHub Actions, Helm and Argo CD on Kubernetes — that cut deployment time by 40%.',
      'Wrote a graph query engine on top of the ORM, so clients can fetch deeply nested, relational data in a single query.',
      'Designed a Node.js backend on Clean Architecture, keeping business logic independent of infrastructure.',
      'Set up Prometheus and Grafana monitoring with alerting rules, shortening time to recovery in production.',
    ],
    metric: { value: '40%', label: 'faster deploys' },
    stack: [
      'Node.js',
      'Kubernetes',
      'Helm',
      'Argo CD',
      'GitHub Actions',
      'Prometheus',
      'Grafana',
    ],
  },
  {
    company: 'Lookarond GmbH (Eaaasy)',
    title: 'Software Engineering Lead',
    employment: 'Part-time',
    start: '2022-12',
    end: '2024-04',
    summary: 'Led both the frontend and the core backend teams for a video-first product.',
    highlights: [
      'Moved video uploads to an event-driven pipeline — S3, SQS and ECS workers — so encoding and transcoding run asynchronously.',
      'Replaced static MP4 playback with HLS adaptive-bitrate streaming that holds up on unreliable networks.',
      'Drove backend architecture decisions and built the NestJS APIs; set the Next.js, Redux and RTK Query frontend architecture.',
      'Shipped the backend in Docker on EC2 and the frontend on Amplify, both with automated CI/CD.',
    ],
    stack: ['NestJS', 'Next.js', 'AWS S3', 'SQS', 'ECS', 'HLS', 'Docker'],
  },
  {
    company: 'Venturas',
    title: 'Software Engineer',
    employment: 'Full-time',
    start: '2022-09',
    end: '2024-04',
    summary: 'Full-stack engineering across several real-estate platforms.',
    highlights: [
      'Built around 60 Python crawlers and the pipelines behind them, collecting over 2 million records.',
      'Designed backend APIs, database schemas and scheduled jobs with NestJS and MySQL.',
      'Built Next.js frontends with Google Maps integration, plus a CV portal in React and Express.',
    ],
    metric: { value: '2M+', label: 'records collected' },
    stack: ['Python', 'NestJS', 'MySQL', 'Next.js', 'Redux Toolkit', 'Tailwind CSS'],
  },
  {
    company: 'Bevy Commerce',
    title: 'Software Engineer',
    employment: 'Full-time',
    start: '2022-04',
    end: '2022-08',
    summary: 'Worked on a Shopify app built to handle millions of product records.',
    highlights: [
      'Designed and built storefront pages in Next.js, including an ETA feature for running campaigns.',
    ],
    stack: ['Next.js', 'Shopify', 'Bootstrap'],
  },
  {
    company: 'Audiohook',
    title: 'Frontend Engineer',
    employment: 'Full-time',
    start: '2021-04',
    end: '2022-03',
    summary: 'Built the CMS the team used to run campaigns, subscriptions and authentication.',
    highlights: [
      'React and Redux throughout, with unit tests as part of the definition of done.',
    ],
    stack: ['React', 'Redux'],
  },
  {
    company: 'ELO',
    title: 'Software Engineer',
    employment: 'Full-time',
    start: '2019-09',
    end: '2021-03',
    summary:
      'Where it started: APIs and frontends for test automation, EdTech and food delivery.',
    highlights: [
      'NestJS APIs for a test-automation product.',
      'Django and Django REST Framework backends for an EdTech platform and a food-delivery app.',
      'Frontends in React, Redux, MUI and TypeScript.',
    ],
    stack: ['NestJS', 'Django', 'React', 'TypeScript'],
  },
];

export const focusAreas: FocusArea[] = [
  {
    title: 'Backend architecture',
    body: 'Services with clear boundaries — business logic that does not know about the database, and APIs shaped around what clients actually ask for.',
    proof: 'Clean Architecture backend · graph query engine',
  },
  {
    title: 'Event-driven systems',
    body: 'Taking slow work off the request path with queues and workers, and designing for the retries and partial failures that come with it.',
    proof: 'S3 → SQS → ECS video pipeline',
  },
  {
    title: 'Platform and delivery',
    body: 'Deploys that are boring and repeatable, and production that tells you when something is wrong before you go looking.',
    proof: 'GitOps on Kubernetes · Prometheus alerting',
  },
  {
    title: 'Leading teams',
    body: 'Setting the architecture a team builds on, then keeping it maintainable as the product and the team grow.',
    proof: 'Frontend and backend team lead',
  },
  {
    title: 'Applied AI',
    body: 'RAG, LLMs and MCP — and how they fit into a backend that already has to be reliable, observable and cheap to run.',
    proof: 'The AI section of this site',
  },
];

export const toolkit: ToolGroup[] = [
  { label: 'Languages', items: ['TypeScript', 'Python', 'Go'] },
  { label: 'Backend', items: ['Node.js', 'NestJS', 'Django', 'Express', 'MySQL'] },
  { label: 'Frontend', items: ['React', 'Next.js', 'Redux', 'RTK Query', 'Tailwind CSS'] },
  {
    label: 'Cloud & infra',
    items: ['AWS EC2', 'S3', 'ECS', 'SQS', 'Amplify', 'Cloudflare', 'Docker', 'Kubernetes'],
  },
  {
    label: 'Delivery',
    items: ['GitHub Actions', 'Helm', 'Argo CD', 'Prometheus', 'Grafana'],
  },
  { label: 'AI', items: ['RAG', 'LLMs', 'MCP'] },
];

export const education = {
  degree: 'BSc in Computer Science & Engineering',
  school: 'Daffodil International University',
  start: '2015',
  end: '2019',
};

export const certifications = ['Database for Software Developers'];
