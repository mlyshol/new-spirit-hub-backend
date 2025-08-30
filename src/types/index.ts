export type Accent =
  | 'watch'
  | 'listen'
  | 'read'
  | 'search'
  | 'about'
  | 'support';

export interface Item {
  title: string;
  shortDescription: string;
  description: string;
  image?: string;
  href: string;
  sourceUrl?: string;
  type: string;
  category?: string;
  accent: Accent;
  originalDate?: string;
  publishedDate?: string;
  date?: string;
  source?: string;
  embedCode?: string;
}