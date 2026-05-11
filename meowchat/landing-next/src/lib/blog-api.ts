import { Article } from '../data/articles';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.meowchat.store';

export interface DbArticle {
  id: number;
  slug: string;
  title: string;
  meta_title: string;
  meta_description: string;
  category: string;
  reading_time: string;
  excerpt: string;
  content: string;
  keywords: string[];
  published: boolean;
  created_at: string;
  updated_at: string;
}

export async function fetchPublishedArticles(): Promise<DbArticle[]> {
  try {
    const res = await fetch(`${API_URL}/api/blog`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.articles || [];
  } catch {
    return [];
  }
}

export async function fetchArticleBySlug(slug: string): Promise<DbArticle | null> {
  try {
    const res = await fetch(`${API_URL}/api/blog/${encodeURIComponent(slug)}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.article || null;
  } catch {
    return null;
  }
}

export function dbArticleToArticle(a: DbArticle): Article {
  return {
    slug: a.slug,
    title: a.title,
    metaTitle: a.meta_title || a.title,
    metaDescription: a.meta_description || a.excerpt || '',
    date: a.created_at?.split('T')[0] || '2026-01-01',
    category: a.category as Article['category'],
    readingTime: a.reading_time || '5 นาที',
    excerpt: a.excerpt || '',
    keywords: Array.isArray(a.keywords) ? a.keywords : [],
  };
}
