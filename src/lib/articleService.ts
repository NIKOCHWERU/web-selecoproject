import fs from 'fs';
import path from 'path';
import { Article } from '@/types/article';

const articlesFilePath = path.join(process.cwd(), 'src', 'data', 'articles.json');

// Check if string contains suspicious XSS / injection / probe patterns
export function isSuspiciousString(str?: string): boolean {
  if (!str || typeof str !== 'string') return false;
  return /<script|<img|<svg|<iframe|<object|onerror|onload|javascript:|alert\(|metaprobe|probe|xss6535|rptchain|blockprobe|attrx|chain6609/i.test(str);
}

export function sanitizePlainText(str?: string): string {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/<[^>]*>?/gm, '').trim();
}

export function isMaliciousArticle(a: Partial<Article>): boolean {
  if (!a) return true;
  if (isSuspiciousString(a.id) || isSuspiciousString(a.slug) || isSuspiciousString(a.title)) {
    return true;
  }
  if (isSuspiciousString(a.excerpt) || isSuspiciousString(a.author) || isSuspiciousString(a.category)) {
    return true;
  }
  return false;
}

export function getArticles(status?: 'published' | 'draft' | 'all'): Article[] {
  try {
    if (fs.existsSync(articlesFilePath)) {
      const fileData = fs.readFileSync(articlesFilePath, 'utf8');
      const rawArticles: Article[] = JSON.parse(fileData);
      
      // Auto-filter and auto-purge any probe or XSS articles
      const cleanArticles = rawArticles.filter(a => !isMaliciousArticle(a));
      
      // If malicious probe articles were found in the file, immediately overwrite with clean list
      if (cleanArticles.length !== rawArticles.length) {
        try {
          fs.writeFileSync(articlesFilePath, JSON.stringify(cleanArticles, null, 2), 'utf8');
        } catch (cleanErr) {
          console.error('Error auto-cleaning articles.json:', cleanErr);
        }
      }

      if (!status || status === 'all') {
        return cleanArticles.sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime());
      }
      return cleanArticles
        .filter(a => a.status === status)
        .sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime());
    }
  } catch (error) {
    console.error('Error reading articles.json:', error);
  }
  return [];
}

export function getArticleBySlug(slug: string): Article | null {
  if (isSuspiciousString(slug)) return null;
  const articles = getArticles('all');
  return articles.find(a => a.slug === slug) || null;
}

export function getArticleById(id: string): Article | null {
  if (isSuspiciousString(id)) return null;
  const articles = getArticles('all');
  return articles.find(a => a.id === id) || null;
}

export function saveArticle(articleData: Partial<Article>): Article {
  // Reject any article with malicious payloads
  if (isMaliciousArticle(articleData)) {
    throw new Error('Payload artikel ditolak: terdeteksi skrip atau karakter berbahaya (XSS Protection).');
  }

  const articles = getArticles('all');
  const now = new Date().toISOString();

  // Sanitize fields
  const cleanTitle = sanitizePlainText(articleData.title) || 'Artikel Baru';
  const cleanSlug = sanitizePlainText(articleData.slug)
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-') || `artikel-${Date.now()}`;
  const cleanExcerpt = sanitizePlainText(articleData.excerpt);
  const cleanCategory = sanitizePlainText(articleData.category) || 'Perizinan OSS';
  const cleanAuthor = sanitizePlainText(articleData.author) || 'Tim Redaksi SELECO';
  const cleanAuthorRole = sanitizePlainText(articleData.authorRole) || 'Corporate Consultant';
  const cleanTags = (articleData.tags || []).map(t => sanitizePlainText(t)).filter(Boolean);

  let finalArticle: Article;

  if (articleData.id) {
    const index = articles.findIndex(a => a.id === articleData.id);
    if (index !== -1) {
      finalArticle = {
        ...articles[index],
        ...articleData,
        title: cleanTitle,
        slug: cleanSlug,
        excerpt: cleanExcerpt,
        category: cleanCategory,
        author: cleanAuthor,
        authorRole: cleanAuthorRole,
        tags: cleanTags,
        updatedAt: now,
      } as Article;
      articles[index] = finalArticle;
    } else {
      finalArticle = {
        id: articleData.id,
        slug: cleanSlug,
        title: cleanTitle,
        excerpt: cleanExcerpt,
        coverImage: articleData.coverImage || 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80',
        category: cleanCategory,
        tags: cleanTags,
        author: cleanAuthor,
        authorRole: cleanAuthorRole,
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
      slug: cleanSlug,
      title: cleanTitle,
      excerpt: cleanExcerpt,
      coverImage: articleData.coverImage || 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80',
      category: cleanCategory,
      tags: cleanTags,
      author: cleanAuthor,
      authorRole: cleanAuthorRole,
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
