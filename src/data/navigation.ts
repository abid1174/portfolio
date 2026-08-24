import { BookOpen, Bookmark, Brain, Home, Network, Search, User } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Optional pillar class, used to tint the active state. */
  pillar?: 'concepts' | 'system-design' | 'ai';
  /** `true` when the item opens an overlay instead of navigating. */
  action?: 'search';
  description?: string;
}

/**
 * The single source of truth for primary navigation. The sidebar,
 * the mobile drawer, the footer and the command palette all read
 * from this array — adding an item here adds it everywhere.
 */
export const navigation: NavItem[] = [
  { label: 'Home', href: '/', icon: Home },
  {
    label: 'Concepts',
    href: '/concepts',
    icon: BookOpen,
    pillar: 'concepts',
    description: 'Understand the building blocks of modern software.',
  },
  {
    label: 'System Design',
    href: '/system-design',
    icon: Network,
    pillar: 'system-design',
    description: 'Design scalable, reliable and efficient systems.',
  },
  {
    label: 'AI Learning',
    href: '/ai',
    icon: Brain,
    pillar: 'ai',
    description: 'Explore AI concepts, tools and real-world applications.',
  },
  { label: 'Bookmarks', href: '/bookmarks', icon: Bookmark },
  { label: 'About', href: '/about', icon: User },
  { label: 'Search', href: '/search', icon: Search, action: 'search' },
];

/** Matches the current URL to a nav item, longest prefix wins. */
export function isActiveRoute(itemHref: string, pathname: string): boolean {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (itemHref === '/') return path === '/';
  return path === itemHref || path.startsWith(`${itemHref}/`);
}
