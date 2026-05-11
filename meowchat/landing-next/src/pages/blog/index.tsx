import { GetStaticProps } from 'next';
import Link from 'next/link';
import BlogLayout from '../../components/BlogLayout';
import SEO from '../../components/SEO';
import STATIC_ARTICLES, { Article } from '../../data/articles';
import { PRIMARY_CTA_HREF } from '../../lib/site';
import { fetchPublishedArticles, dbArticleToArticle } from '../../lib/blog-api';

const CATEGORY_COLORS: Record<string, string> = {
  'คู่มือ': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'เปรียบเทียบ': 'bg-blue-50 text-blue-700 border-blue-200',
  'เคสจริง': 'bg-orange-50 text-orange-700 border-orange-200',
  'วิธีทำ': 'bg-purple-50 text-purple-700 border-purple-200',
};

interface Props { articles: Article[] }

export default function BlogIndex({ articles }: Props) {
  return (
    <BlogLayout>
      <SEO
        title="บล็อก MeowChat — คู่มือ LINE OA และ AI Chatbot สำหรับร้านค้าไทย"
        description="บทความ คู่มือ และเคสจริงจากร้านค้าที่ใช้ AI Chatbot LINE OA เพิ่มยอดขายและประหยัดเวลา — สำหรับเจ้าของร้าน SME ไทย"
        canonical="https://meowchat.store/blog"
      />
      <div className="bg-white min-h-screen">
        <section className="bg-white py-16 border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-emerald-600 font-bold text-sm uppercase tracking-widest mb-4">MeowChat Blog</p>
            <h1 className="text-3xl md:text-4xl font-black mb-4 text-slate-900">
              คู่มือ LINE OA และ AI Chatbot<br />
              <span className="text-slate-500">สำหรับร้านค้าไทย</span>
            </h1>
            <p className="text-slate-500 text-lg">บทความที่เจ้าของร้านอ่านแล้วนำไปใช้ได้จริง — ไม่ใช่แค่ทฤษฎี</p>
          </div>
        </section>

        <section className="bg-white max-w-4xl mx-auto px-4 py-16">
          {articles.length === 0 ? (
            <p className="text-center text-slate-400 py-20">กำลังเตรียมบทความ — กลับมาเร็วๆ นี้</p>
          ) : (
            <div className="grid gap-6">
              {articles.map((article) => (
                <Link key={article.slug} href={`/blog/${article.slug}`}
                  className="group block bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${CATEGORY_COLORS[article.category] ?? 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                      {article.category}
                    </span>
                    <span className="text-slate-400 text-xs">{article.readingTime}</span>
                    <span className="text-slate-300 text-xs ml-auto">
                      {new Date(article.date).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold mb-2 text-slate-900 group-hover:text-emerald-700 transition-colors">{article.title}</h2>
                  <p className="text-slate-500 text-sm leading-relaxed">{article.excerpt}</p>
                  <div className="mt-4 text-emerald-600 text-sm font-semibold flex items-center gap-1">
                    อ่านต่อ <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="bg-slate-50 border-t border-slate-100 py-16">
          <div className="max-w-xl mx-auto px-4 text-center">
            <p className="text-slate-500 mb-2 text-sm">พร้อมลองแล้ว?</p>
            <h2 className="text-2xl font-black mb-6 text-slate-900">ทดลองใช้ MeowChat ฟรี 14 วัน</h2>
            <a href={PRIMARY_CTA_HREF} className="inline-block bg-emerald-500 text-white font-black text-lg px-8 py-4 rounded-2xl hover:opacity-90 transition-opacity">
              เริ่มทดลองฟรีเลย →
            </a>
            <p className="text-slate-400 text-xs mt-3">ไม่ต้องใส่บัตรเครดิต</p>
          </div>
        </section>
      </div>
    </BlogLayout>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const dbArticles = await fetchPublishedArticles();
  const dbSlugs = new Set(dbArticles.map(a => a.slug));

  // DB articles first, then static articles not already in DB
  const merged: Article[] = [
    ...dbArticles.map(dbArticleToArticle),
    ...STATIC_ARTICLES.filter(a => !dbSlugs.has(a.slug)),
  ];

  return { props: { articles: merged }, revalidate: 300 };
};
