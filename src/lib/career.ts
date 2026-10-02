import type { Role } from '../data/resume';

/**
 * Date arithmetic for the career timeline. "Now" is the build time, which is fine for a static
 * site that redeploys often; durations on a current role drift by at most one deploy.
 */

const monthFormat = new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' });

function parseMonth(value: string): Date {
  const [year, month] = value.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, 1));
}

function monthsBetween(start: Date, end: Date): number {
  return (
    (end.getUTCFullYear() - start.getUTCFullYear()) * 12 +
    (end.getUTCMonth() - start.getUTCMonth())
  );
}

/** Resume dates are inclusive of the end month, so a role from Apr to Aug is five months. */
export function roleMonths(role: Role, now = new Date()): number {
  const end = role.end ? parseMonth(role.end) : now;
  return monthsBetween(parseMonth(role.start), end) + (role.end ? 1 : 0);
}

export function formatDuration(months: number): string {
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const parts = [];
  if (years) parts.push(`${years} yr${years > 1 ? 's' : ''}`);
  if (rest) parts.push(`${rest} mo${rest > 1 ? 's' : ''}`);
  return parts.join(' ') || '1 mo';
}

export function formatPeriod(role: Role): string {
  const start = monthFormat.format(parseMonth(role.start));
  return `${start} — ${role.end ? monthFormat.format(parseMonth(role.end)) : 'Present'}`;
}

/**
 * Whole years since the earliest start date. Measured as elapsed calendar time rather than a sum
 * of role lengths, because overlapping part-time roles would otherwise double-count.
 */
export function yearsOfExperience(roles: Role[], now = new Date()): number {
  const first = roles.map((role) => parseMonth(role.start)).sort((a, b) => +a - +b)[0];
  return first ? Math.floor(monthsBetween(first, now) / 12) : 0;
}
