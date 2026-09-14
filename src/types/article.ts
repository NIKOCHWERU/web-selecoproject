export type BlockType = 
  | 'heading' 
  | 'paragraph' 
  | 'image' 
  | 'quote' 
  | 'list' 
  | 'callout' 
  | 'divider'
  | 'code';

export interface GutenbergBlock {
  id: string;
  type: BlockType;
  content: {
    level?: 1 | 2 | 3 | 4;
    text?: string;
    align?: 'left' | 'center' | 'right' | 'justify';
    url?: string;
    caption?: string;
    alt?: string;
    author?: string;
    cite?: string;
    code?: string;
    items?: string[];
    listType?: 'bullet' | 'ordered';
    calloutType?: 'info' | 'warning' | 'tip' | 'success';
    title?: string;
    [key: string]: any;
  };
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: string;
  tags: string[];
  author: string;
  authorRole?: string;
  publishedAt: string;
  readTime: string;
  status: 'published' | 'draft';
  featured?: boolean;
  blocks: GutenbergBlock[];
  createdAt: string;
  updatedAt: string;
}
