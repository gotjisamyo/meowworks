import Layout from '../components/Layout';
import SEO from '../components/SEO';
import Hero from '../components/sections/Hero';
import Features from '../components/sections/Features';
import UseCases from '../components/sections/UseCases';
import HowItWorks from '../components/sections/HowItWorks';
import Pricing from '../components/sections/Pricing';
import Reviews from '../components/sections/Reviews';
import FAQ, { FAQ_ITEMS } from '../components/sections/FAQ';
import Contact from '../components/sections/Contact';

export default function Home() {
  return (
    <Layout>
      <SEO
        title="MeowChat - AI Chatbot สำหรับธุรกิจไทย | LINE Bot ตอบแชทอัตโนมัติ 24/7"
        description="MeowChat AI Chatbot สำหรับธุรกิจไทย ตอบแชท LINE อัตโนมัติ ปิดการขาย จัดการออเดอร์ อัพเดทสต็อก ดูยอดขาย พร้อม 24 ชม. ทดลองใช้ฟรี 14 วัน ไม่ต้องใช้บัตรเครดิต"
        canonical="https://meowchat.store"
        faqSchema={FAQ_ITEMS}
      />
      <Hero />
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
