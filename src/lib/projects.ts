import { getCollection } from 'astro:content';

/** Drafts never receive a route or a gallery entry, including in development. */
export async function getPublishedProjects() {
  const projects = await getCollection('projects', ({ data }) => !data.draft);
  return projects.sort((a, b) =>
    Number(a.data.example) - Number(b.data.example)
    || Number(a.data.placeholder) - Number(b.data.placeholder)
    || (b.data.date ?? '').localeCompare(a.data.date ?? '')
    || a.id.localeCompare(b.id, 'en', { numeric: true }),
  );
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`));
}
