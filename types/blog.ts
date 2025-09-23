export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  author_id: string;
  category: string;
  tags: string[];
  published_at: string; // ISO string
}
