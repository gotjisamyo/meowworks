import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import { ComponentType } from 'react';
import BlogLayout from '../../components/BlogLayout';
import SEO from '../../components/SEO';
import { getArticleBySlug, getAllSlugs, Article } from '../../data/articles';
import { PRIMARY_CTA_HREF } from '../../lib/site';
import { fetchArticleBySlug, fetchPublishedArticles, dbArticleToArticle, DbArticle } from '../../lib/blog-api';

// Static content map for legacy TSX articles
import ArticleAiChatbot from '../../content/blog/ai-chatbot-line-oa';
import ArticleLineBotRestaurant from '../../content/blog/line-bot-restaurant-setup';
import ArticleChatbotComparison from '../../content/blog/chatbot-comparison-thai-2026';
import ArticleChatbotQueue from '../../content/blog/chatbot-queue-clinic';
import ArticleLineOaAutoReply from '../../content/blog/line-oa-auto-reply-system';
import ArticleChatbotPricing from '../../content/blog/chatbot-line-oa-pricing';
import ArticleLineReplySlowFix from '../../content/blog/line-chat-reply-slow-fix';

const CONTENT_MAP: Record<string, ComponentType> = {
  'ai-chatbot-line-oa-คืออะไร': ArticleAiChatbot,
  'line-bot-ร้านอาหาร-setup': ArticleLineBotRestaurant,
  'โปรแกรมตอบแชทลูกค้า-เปรียบเทียบ-2026': ArticleChatbotComparison,
  'chatbot-จองคิวออนไลน์-คลินิก': ArticleChatbotQueue,
  'ระบบตอบแชท-line-oa-อัตโนมัติ': ArticleLineOaAutoReply,
  'chatbot-line-oa-ราคา-2026': ArticleChatbotPricing,
  'ตอบแชท-line-ไม่ทัน-วิธีแก้': ArticleLineReplySlowFix,
};

interface Props {
  article: Article;
  dbContent?: string | null; // HTML from DB (new articles)
}

export default function BlogPost({ article, dbContent }: Props) {
  const StaticContent = CONTENT_MAP[article.slug];

  return (
    <BlogLayout>
      <SEO
        title={article.metaTitle}
        description={article.metaDescription}
        canonical={`https://meowchat.store/blog/${article.slug}`}
        articleSchema={{ headline: article.title, description: article.excerpt, datePublished: article.date }}
      />
      <div className="bg-white">
        <div className="max-w-3xl mx-auto px-4 pt-8">
          <nav className="text-xs text-slate-500 flex items-center gap-2">
            <Link href="/" className="hover:text-slate-700">MeowChat</Link>
            <span>›</span>
            <Link href="/blog" className="hover:text-slate-700">บล็อก</Link>
            <span>›</span>
            <span className="text-slate-400 truncate max-w-xs">{article.title}</span>
          </nav>
        </div>

        <article className="max-w-3xl mx-auto px-4 py-10">
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-xs font-bold">{article.category}</span>
              <span className="text-slate-500 text-sm">{article.readingTime}</span>
              <span className="text-slate-400 text-sm ml-auto">
                {new Date(article.date).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black leading-tight mb-4 text-slate-900">{article.title}</h1>
            <p className="text-slate-600 text-lg leading-relaxed">{article.excerpt}</p>
          </header>

          <div className="article-body">
            {/* DB article: render HTML from Tiptap */}
            {dbContent ? (
              <div className="prose-meow" dangerouslySetInnerHTML={{ __html: dbContent }} />
            ) : StaticContent ? (
              <StaticContent />
            ) : null}
          </div>

          <div className="mt-12 bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
            <p className="font-bold text-lg mb-1 text-slate-900">✨ ทดลองใช้ MeowChat ฟรี 14 วัน</p>
            <p className="text-slate-500 text-sm mb-4">ไม่ต้องใส่บัตรเครดิต — เริ่มได้ทันที</p>
            <a href={PRIMARY_CTA_HREF} className="inline-block bg-emerald-500 text-white font-black px-6 py-3 rounded-xl hover:opacity-90 transition-opacity">
              เริ่มใช้งานเลย →
            </a>
          </div>

          <div className="mt-10 pt-10 border-t border-slate-100">
            <Link href="/blog" className="text-emerald-600 hover:text-emerald-700 text-sm font-semibold">← กลับไปหน้าบล็อก</Link>
          </div>
        </article>
      </div>
    </BlogLayout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const dbArticles = await fetchPublishedArticles();
  const dbSlugs = dbArticles.map(a => a.slug);
  const staticSlugs = getAllSlugs();
  const allSlugs = [...new Set([...dbSlugs, ...staticSlugs])];
  return {
    paths: allSlugs.map(slug => ({ params: { slug } })),
    fallback: 'blocking', // new DB articles appear without rebuild
  };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = params?.slug as string;

  // Try DB first
  const dbArticle = await fetchArticleBySlug(slug);
  if (dbArticle) {
    return {
      props: { article: dbArticleToArticle(dbArticle), dbContent: dbArticle.content || null },
      revalidate: 300,
    };
  }

  // Fall back to static articles
  const article = getArticleBySlug(slug);
  if (!article) return { notFound: true };
  return { props: { article, dbContent: null }, revalidate: 300 };
};
