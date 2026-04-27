import Layout from '../components/Layout';
import SEO from '../components/SEO';
import Hero from '../components/sections/Hero';
import TrustStrip from '../components/sections/TrustStrip';
import Features from '../components/sections/Features';
import ProductShowcase from '../components/sections/ProductShowcase';
import UseCases from '../components/sections/UseCases';
import HowItWorks from '../components/sections/HowItWorks';
import Pricing from '../components/sections/Pricing';
import Reviews from '../components/sections/Reviews';
import FAQ, { FAQ_ITEMS } from '../components/sections/FAQ';
import Contact from '../components/sections/Contact';
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, SITE_URL } from '../lib/site';

export default function Home() {
  return (
    <Layout>
      <SEO title={DEFAULT_TITLE} description={DEFAULT_DESCRIPTION} canonical={SITE_URL} faqSchema={FAQ_ITEMS} />
      <Hero />
      <TrustStrip />
      <ProductShowcase />
      <Features />
      <UseCases />
      <HowItWorks />
      <Pricing />
      <Reviews />
      <FAQ />
      <Contact />
    </Layout>
  );
}
