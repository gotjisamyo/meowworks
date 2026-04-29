import Head from 'next/head';
import SEO from '../components/SEO';
import HomePage from '../components/home/HomePage';
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, SITE_URL } from '../lib/site';

export default function Home() {
  return (
    <>
      <SEO title={DEFAULT_TITLE} description={DEFAULT_DESCRIPTION} canonical={SITE_URL} />
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </Head>
      <HomePage />
    </>
  );
}
