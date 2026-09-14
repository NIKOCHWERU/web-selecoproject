import fs from 'fs';
import path from 'path';
import { Article } from '@/types/article';

const articlesFilePath = path.join(process.cwd(), 'src', 'data', 'articles.json');

export function getArticles(status?: 'published' | 'draft' | 'all'): Article[] {
  try {
    if (fs.existsSync(articlesFilePath)) {
      const fileData = fs.readFileSync(articlesFilePath, 'utf8');
      const articles: Article[] = JSON.parse(fileData);
      if (!status || status === 'all') {
        return articles.sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime());
      }
      return articles
        .filter(a => a.status === status)
        .sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime());
    }
  } catch (error) {
    console.error('Error reading articles.json:', error);
  }
  return [];
}

export function getArticleBySlug(slug: string): Article | null {
  const articles = getArticles('all');
  return articles.find(a => a.slug === slug) || null;
}

export function getArticleById(id: string): Article | null {
  const articles = getArticles('all');
  return articles.find(a => a.id === id) || null;
}

export function saveArticle(articleData: Partial<Article>): Article {
  const articles = getArticles('all');
  const now = new Date().toISOString();

  let finalArticle: Article;

  if (articleData.id) {
    const index = articles.findIndex(a => a.id === articleData.id);
    if (index !== -1) {
      finalArticle = {
        ...articles[index],
        ...articleData,
        updatedAt: now,
      } as Article;
      articles[index] = finalArticle;
    } else {
      finalArticle = {
        id: articleData.id,
        slug: articleData.slug || `artikel-${Date.now()}`,
        title: articleData.title || 'Artikel Baru',
        excerpt: articleData.excerpt || '',
        coverImage: articleData.coverImage || 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80',
        category: articleData.category || 'Perizinan OSS',
        tags: articleData.tags || [],
        author: articleData.author || 'Tim Redaksi SELECO',
        authorRole: articleData.authorRole || 'Corporate Consultant',
        publishedAt: articleData.publishedAt || now.split('T')[0],
        readTime: articleData.readTime || '5 menit baca',
        status: articleData.status || 'draft',
        blocks: articleData.blocks || [],
        createdAt: now,
        updatedAt: now,
      };
      articles.unshift(finalArticle);
    }
  } else {
    finalArticle = {
      id: `art-${Date.now()}`,
      slug: articleData.slug || `artikel-${Date.now()}`,
      title: articleData.title || 'Artikel Baru',
      excerpt: articleData.excerpt || '',
      coverImage: articleData.coverImage || 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80',
      category: articleData.category || 'Perizinan OSS',
      tags: articleData.tags || [],
      author: articleData.author || 'Tim Redaksi SELECO',
      authorRole: articleData.authorRole || 'Corporate Consultant',
      publishedAt: articleData.publishedAt || now.split('T')[0],
      readTime: articleData.readTime || '5 menit baca',
      status: articleData.status || 'draft',
      blocks: articleData.blocks || [],
      createdAt: now,
      updatedAt: now,
    };
    articles.unshift(finalArticle);
  }

  try {
    const dir = path.dirname(articlesFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(articlesFilePath, JSON.stringify(articles, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing articles.json:', error);
  }

  return finalArticle;
}

export function deleteArticle(id: string): boolean {
  try {
    const articles = getArticles('all');
    const filtered = articles.filter(a => a.id !== id);
    if (filtered.length === articles.length) return false;

    fs.writeFileSync(articlesFilePath, JSON.stringify(filtered, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error deleting article:', error);
    return false;
  }
}
