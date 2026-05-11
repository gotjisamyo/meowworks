import { GetServerSideProps } from 'next';
import { fetchPublishedArticles } from '../lib/blog-api';
import { getAllSlugs } from '../data/articles';

const SITE = 'https://meowchat.store';
const TODAY = new Date().toISOString().split('T')[0];

const STATIC_PAGES = [
  { loc: '/', priority: '1.0', changefreq: 'weekly' },
  { loc: '/pricing', priority: '0.9', changefreq: 'monthly' },
  { loc: '/blog', priority: '0.9', changefreq: 'weekly' },
  { loc: '/line-bot-restaurant', priority: '0.8', changefreq: 'monthly' },
  { loc: '/line-bot-clinic', priority: '0.8', changefreq: 'monthly' },
  { loc: '/line-bot-clothing', priority: '0.8', changefreq: 'monthly' },
  { loc: '/line-bot-beauty', priority: '0.8', changefreq: 'monthly' },
  { loc: '/line-bot-cafe', priority: '0.8', changefreq: 'monthly' },
  { loc: '/line-bot-hotel', priority: '0.8', changefreq: 'monthly' },
  { loc: '/line-bot-fitness', priority: '0.8', changefreq: 'monthly' },
  { loc: '/line-bot-realestate', priority: '0.8', changefreq: 'monthly' },
  { loc: '/line-bot-car-service', priority: '0.8', changefreq: 'monthly' },
  { loc: '/line-bot-pet', priority: '0.8', changefreq: 'monthly' },
  { loc: '/line-bot-tutor', priority: '0.8', changefreq: 'monthly' },
  { loc: '/line-bot-insurance', priority: '0.8', changefreq: 'monthly' },
  { loc: '/line-bot-pharmacy', priority: '0.8', changefreq: 'monthly' },
  { loc: '/line-bot-laundry', priority: '0.8', changefreq: 'monthly' },
  { loc: '/line-bot-travel', priority: '0.8', changefreq: 'monthly' },
  { loc: '/line-bot-freelance', priority: '0.8', changefreq: 'monthly' },
  { loc: '/line-bot-ecommerce', priority: '0.8', changefreq: 'monthly' },
  { loc: '/privacy', priority: '0.3', changefreq: 'yearly' },
  { loc: '/terms', priority: '0.3', changefreq: 'yearly' },
  { loc: '/dpa', priority: '0.3', changefreq: 'yearly' },
];

function generateSitemap(urls: { loc: string; lastmod: string; priority: string; changefreq: string }[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  // Fetch DB articles
  const dbArticles = await fetchPublishedArticles();
  const dbSlugs = new Set(dbArticles.map(a => a.slug));

  // Static article slugs (exclude any that are already in DB)
  const staticSlugs = getAllSlugs().filter(s => !dbSlugs.has(s));

  const urls = [
    // Static pages
    ...STATIC_PAGES.map(p => ({ ...p, loc: `${SITE}${p.loc}`, lastmod: TODAY })),
    // DB articles
    ...dbArticles.map(a => ({
      loc: `${SITE}/blog/${encodeURIComponent(a.slug)}`,
      lastmod: a.updated_at?.split('T')[0] || TODAY,
      priority: '0.8',
      changefreq: 'monthly',
    })),
    // Static articles
    ...staticSlugs.map(slug => ({
      loc: `${SITE}/blog/${encodeURIComponent(slug)}`,
      lastmod: TODAY,
      priority: '0.8',
      changefreq: 'monthly',
    })),
  ];

  const xml = generateSitemap(urls);

  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
  res.write(xml);
  res.end();

  return { props: {} };
};

export default function Sitemap() {
  return null;
}
