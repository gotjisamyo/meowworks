import { GetStaticPaths, GetStaticProps } from 'next';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import Pricing from '../components/sections/Pricing';
import Contact from '../components/sections/Contact';
import INDUSTRIES, { Industry } from '../data/industries';

interface Props {
  industry: Industry;
}

export default function IndustryPage({ industry }: Props) {
  const faqSchema = industry.faq;
  const canonical = `https://meowchat.store/${industry.slug}`;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'MeowChat', item: 'https://meowchat.store' },
      { '@type': 'ListItem', position: 2, name: industry.industry, item: canonical },
    ],
  };

  return (
    <Layout>
      <SEO
        title={industry.metaTitle}
        description={industry.metaDescription}
        canonical={canonical}
        faqSchema={faqSchema}
      />

      {/* Breadcrumb structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-dark min-h-[70vh] flex items-center">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-brand-orange/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 py-16 text-center relative z-10">
          <nav className="text-xs text-white/30 mb-6">
            <a href="/" className="hover:text-white/60">MeowChat</a>
            <span className="mx-2">›</span>
            <span>{industry.industry}</span>
          </nav>
          <div className="inline-flex items-center gap-2 bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-sm font-bold px-4 py-2 rounded-full mb-6">
            🐾 LINE Bot สำหรับ{industry.industry}
          </div>
          <h1 className="text-3xl md:text-5xl font-black leading-tight mb-6">{industry.h1}</h1>
          <p className="text-white/60 text-lg mb-8 max-w-2xl mx-auto">{industry.heroSubtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://my.meowchat.store/register"
              className="bg-brand-orange text-white font-black text-lg px-8 py-4 rounded-2xl hover:opacity-90 transition-opacity shadow-lg shadow-brand-orange/20"
            >
              ทดลองฟรี 14 วัน — ไม่ต้องใช้บัตร 🐾
            </a>
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-16 max-w-4xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-black text-center mb-10">
          ปัญหาที่{industry.industry}เจอบ่อย — MeowChat แก้ได้ทั้งหมด
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {industry.painPoints.map((p, i) => (
            <div key={i} className="bg-brand-card rounded-2xl p-5 border border-white/5">
              <div className="w-8 h-8 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center text-red-400 font-bold text-sm mb-3">
                !
              </div>
              <p className="text-white/70 text-sm leading-relaxed">{p}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-brand-card/30">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-black text-center mb-10">
            ฟีเจอร์ที่ออกแบบมาสำหรับ{industry.industry}โดยเฉพาะ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {industry.features.map((f) => (
              <div key={f.title} className="bg-brand-card rounded-2xl p-6 border border-white/5 hover:border-brand-orange/20 transition-colors">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo conversation */}
      <section className="py-16 max-w-2xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-black text-center mb-10">
          ดูตัวอย่างการสนทนาจริง
        </h2>
        <div className="bg-brand-card rounded-2xl border border-white/5 overflow-hidden">
          <div className="bg-[#151520] px-4 py-3 flex items-center gap-3 border-b border-white/5">
            <div className="w-8 h-8 bg-brand-orange/10 rounded-full flex items-center justify-center text-lg">🐱</div>
            <div>
              <div className="font-bold text-sm">MeowChat AI</div>
              <div className="text-xs text-[#00B900]">● ออนไลน์ 24/7</div>
            </div>
          </div>
          <div className="p-4 space-y-3">
            {industry.demo.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.from === 'customer' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm leading-relaxed ${
                    msg.from === 'customer'
                      ? 'bg-brand-orange text-white'
                      : 'bg-white/5 text-white/80'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <Pricing />

      {/* FAQ */}
      {industry.faq.length > 0 && (
        <section className="py-16 max-w-3xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-black text-center mb-10">
            คำถามที่พบบ่อยสำหรับ{industry.industry}
          </h2>
          <div className="space-y-3">
            {industry.faq.map((item, i) => (
              <details key={i} className="bg-brand-card border border-white/5 rounded-xl group">
                <summary className="px-5 py-4 font-semibold text-sm cursor-pointer list-none flex justify-between items-center hover:text-brand-orange transition-colors">
                  {item.q}
                  <span className="text-brand-orange group-open:rotate-45 transition-transform text-lg">+</span>
                </summary>
                <div className="px-5 pb-4 text-white/50 text-sm leading-relaxed border-t border-white/5">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Keywords footer for SEO */}
      <div className="max-w-4xl mx-auto px-4 pb-8 text-center">
        <div className="flex flex-wrap justify-center gap-2">
          {industry.keywords.slice(0, 8).map((kw) => (
            <span key={kw} className="text-xs bg-white/5 text-white/30 px-3 py-1 rounded-full">
              {kw}
            </span>
          ))}
        </div>
      </div>

      {/* Contact — never removed */}
      <Contact />
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = INDUSTRIES.map((ind) => ({ params: { industry: ind.slug } }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const industry = INDUSTRIES.find((ind) => ind.slug === params?.industry);
  if (!industry) return { notFound: true };
  return { props: { industry } };
};
