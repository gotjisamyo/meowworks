import Head from 'next/head';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  faqSchema?: { q: string; a: string }[];
  articleSchema?: object;
}

const SITE_URL = 'https://meowchat.store';
const DEFAULT_OG = `${SITE_URL}/assets/og-image.png`;

export default function SEO({
  title = 'MeowChat - AI Chatbot สำหรับธุรกิจไทย | LINE Bot ตอบแชทอัตโนมัติ 24/7',
  description = 'MeowChat AI Chatbot สำหรับธุรกิจไทย ตอบแชท LINE อัตโนมัติ ปิดการขาย จัดการออเดอร์ อัพเดทสต็อก ดูยอดขาย พร้อม 24 ชม. ทดลองใช้ฟรี 14 วัน ไม่ต้องใช้บัตรเครดิต',
  canonical = SITE_URL,
  ogImage = DEFAULT_OG,
  faqSchema,
}: SEOProps) {
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'MeowChat',
    url: SITE_URL,
    logo: `${SITE_URL}/assets/logo.png`,
    description: 'AI Chatbot สำหรับธุรกิจไทย',
    foundingDate: '2024',
    address: { '@type': 'PostalAddress', addressLocality: 'Bangkok', addressCountry: 'TH' },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: 'Thai',
      url: 'https://line.me/ti/p/@960xboyt',
    },
    sameAs: ['https://line.me/ti/p/@960xboyt'],
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'MeowChat',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '490',
      priceCurrency: 'THB',
      priceSpecification: { '@type': 'UnitPriceSpecification', billingDuration: 'P1M' },
    },
    description,
    url: SITE_URL,
  };

  const faqJsonLd = faqSchema
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqSchema.map(({ q, a }) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      }
    : null;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="Thai" />
      <meta name="geo.region" content="TH" />
      <link rel="canonical" href={canonical} />
      <link rel="alternate" hrefLang="th" href={canonical} />
      <link rel="alternate" hrefLang="x-default" href={SITE_URL} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="MeowChat" />
      <meta property="og:locale" content="th_TH" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
    </Head>
  );
}
