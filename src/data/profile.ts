import portrait from '../assets/profile/portrait.jpg';

export interface ContactLink {
  label: string;
  href: string;
}

/** Edit profile content here. Leave unknown contact details out. */
export const profile = {
  name: 'Magnus Karlsen',
  education: 'MSc in Physics and Mathematics',
  portrait: { src: portrait, alt: 'Portrait of Magnus Karlsen' },
  introduction: 'Here I document my hobby projects in 3D printing, electronics, soldering, mechanics and programming. More photos and project notes will follow.',
  description: 'Magnus Karlsen’s personal project portfolio.',
  about: [
    '[Write a little about your background, interests and the things you enjoy working on.]',
    '[You can also describe how you approach practical and technical problems. Use examples from your own experience.]',
  ],
  interests: ['3D printing', 'Electronics', 'Soldering', 'Mechanics', 'Programming'],
  // Add { label: 'GitHub', href: 'https://...' } or a mailto: link.
  // Use real addresses only. An empty list is hidden on the website.
  contactLinks: [] as ContactLink[],
};
