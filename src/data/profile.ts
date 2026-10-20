export interface ContactLink {
  label: string;
  href: string;
}

/** Edit profile content here. Leave unknown contact details out. */
export const profile = {
  name: 'Magnus Karlsen',
  education: 'MSc in Physics and Mathematics',
  introduction: '[Write a short introduction about yourself and what you would like to share through your projects.]',
  description: 'Magnus Karlsen’s personal project portfolio.',
  about: [
    '[Write a little about your background, interests and the things you enjoy working on.]',
    '[You can also describe how you approach practical and technical problems. Use examples from your own experience.]',
  ],
  interests: ['3D printing', 'Electronics', 'Soldering', 'Mechanics', 'Programming'],
  // Add { label: 'GitHub', href: 'https://...' } or a mailto: link.
  // Use real addresses only. An empty list displays a clear placeholder.
  contactLinks: [] as ContactLink[],
};
