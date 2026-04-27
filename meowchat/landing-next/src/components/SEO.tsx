import Head from 'next/head';
import { BRAND_NAME, DEFAULT_DESCRIPTION, DEFAULT_TITLE, LINE_HANDLE, SITE_URL, SUPPORT_EMAIL } from '../lib/site';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  faqSchema?: { q: string; a: string }[];
  noindex?: boolean;
}

const DEFAULT_OG = `${SITE_URL}/assets/og-image.svg`;

export default function SEO({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  canonical = SITE_URL,
  ogImage = DEFAULT_OG,
  faqSchema,
  noindex = false,
}: SEOProps) {
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: BRAND_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/assets/hero-cat.png`,
    description,
    address: { '@type': 'PostalAddress', addressCountry: 'TH' },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      availableLanguage: ['Thai'],
      email: SUPPORT_EMAIL,
      url: 'https://line.me/ti/p/@960xboyt',
    },
    sameAs: ['https://line.me/ti/p/@960xboyt'],
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: BRAND_NAME,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: [
      { '@type': 'Offer', price: '490', priceCurrency: 'THB', name: 'Starter' },
      { '@type': 'Offer', price: '990', priceCurrency: 'THB', name: 'Pro' },
    ],
    description,
    url: canonical,
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: BRAND_NAME,
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
      <meta name="robots" content={noindex ? 'noindex, follow' : 'index, follow'} />
      <meta name="language" content="Thai" />
      <meta name="geo.region" content="TH" />
      <meta name="theme-color" content="#0D0D14" />
      <link rel="canonical" href={canonical} />
      <link rel="alternate" hrefLang="th" href={canonical} />
      <link rel="alternate" hrefLang="x-default" href={SITE_URL} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={BRAND_NAME} />
      <meta property="og:locale" content="th_TH" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content={LINE_HANDLE} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}
    </Head>
  );
}
