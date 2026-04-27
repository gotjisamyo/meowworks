import Link from 'next/link';
import { useState } from 'react';
import { trackCTA } from '../lib/analytics';
import {
  BRAND_COMPANY,
  BRAND_TAGLINE,
  DPA_EMAIL,
  LEGAL_EMAIL,
  LINE_HANDLE,
  LOGIN_HREF,
  PRIMARY_CTA_HREF,
  PRIMARY_CTA_LABEL,
  PRIVACY_EMAIL,
  SECONDARY_CTA_HREF,
  SECONDARY_CTA_LABEL,
  SUPPORT_EMAIL,
} from '../lib/site';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/8 bg-[#0f1524]/78 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 text-white">
            <img src="/assets/hero-cat.png" alt="MeowChat" width={32} height={32} className="rounded-full ring-1 ring-white/10" />
            <div>
              <div className="font-black text-lg leading-none">MeowChat</div>
              <div className="hidden sm:block text-[11px] text-white/42 mt-1">AI ผู้ช่วยตอบแชทบน LINE OA</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-white/58">
            <a href="#features" className="hover:text-white transition-colors">ฟีเจอร์</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">วิธีใช้</a>
            <a href="#pricing" className="hover:text-white transition-colors">ราคา</a>
            <a href="#reviews" className="hover:text-white transition-colors">ตัวอย่างการใช้งาน</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <a href={LOGIN_HREF} className="text-sm font-medium text-white/55 hover:text-white transition-colors">
              เข้าสู่ระบบ
            </a>
            <a
              href={PRIMARY_CTA_HREF}
              onClick={() => trackCTA({ location: 'header', label: PRIMARY_CTA_LABEL, destination: PRIMARY_CTA_HREF, variant: 'primary' })}
              className="rounded-xl bg-brand-green text-white px-4 py-2 text-sm font-semibold hover:opacity-95 transition-opacity shadow-lg shadow-brand-green/20"
            >
              {PRIMARY_CTA_LABEL}
            </a>
          </div>

          <button className="md:hidden text-white/70 hover:text-white" onClick={() => setOpen(!open)} aria-label="เมนู">
            {open ? '✕' : '☰'}
          </button>
        </div>

        {open && (
          <div className="md:hidden border-t border-white/8 bg-[#0f1524] px-4 py-4 flex flex-col gap-4 text-sm font-medium">
            <a href="#features" onClick={() => setOpen(false)} className="text-white/62 hover:text-white">ฟีเจอร์</a>
            <a href="#how-it-works" onClick={() => setOpen(false)} className="text-white/62 hover:text-white">วิธีใช้</a>
            <a href="#pricing" onClick={() => setOpen(false)} className="text-white/62 hover:text-white">ราคา</a>
            <a href="#reviews" onClick={() => setOpen(false)} className="text-white/62 hover:text-white">ตัวอย่างการใช้งาน</a>
            <a href="#faq" onClick={() => setOpen(false)} className="text-white/62 hover:text-white">FAQ</a>
            <a
              href={PRIMARY_CTA_HREF}
              onClick={() => trackCTA({ location: 'mobile_menu', label: PRIMARY_CTA_LABEL, destination: PRIMARY_CTA_HREF, variant: 'primary' })}
              className="rounded-xl bg-brand-green text-white px-4 py-3 text-center font-semibold"
            >
              {PRIMARY_CTA_LABEL}
            </a>
          </div>
        )}
      </header>

      <main className="pt-16">{children}</main>

      <footer className="mt-20 border-t border-white/6 bg-[#0d1422]">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="rounded-[28px] border border-white/8 bg-white/[0.03] px-6 py-7 md:px-8 md:py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-10 card-glow">
            <div className="max-w-2xl">
              <div className="text-sm font-bold text-brand-peach uppercase tracking-[0.16em] mb-2">พร้อมเริ่มใช้งาน</div>
              <p className="text-xl md:text-2xl font-semibold text-white mb-2">เริ่มจาก trial ก่อน แล้วค่อยคุย use case ที่เหมาะกับร้านของคุณ</p>
              <p className="text-sm md:text-base text-white/58 leading-7">
                ทีมงานตอบเป็นภาษาไทย ช่วยดู flow เบื้องต้น การเชื่อม LINE OA และแนวทางเริ่มต้นที่ไม่ซับซ้อนเกินไปสำหรับร้าน
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <a
                href={SECONDARY_CTA_HREF}
                onClick={() => trackCTA({ location: 'footer_cta', label: SECONDARY_CTA_LABEL, destination: SECONDARY_CTA_HREF, variant: 'secondary' })}
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors text-center"
              >
                {SECONDARY_CTA_LABEL}
              </a>
              <a href={PRIMARY_CTA_HREF} className="rounded-xl bg-brand-green px-5 py-3 text-sm font-semibold text-white hover:opacity-95 transition-opacity text-center shadow-lg shadow-brand-green/20">
                {PRIMARY_CTA_LABEL}
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="font-black text-xl mb-3 text-white">MeowChat</div>
              <p className="text-white/50 text-sm leading-relaxed">
                {BRAND_TAGLINE}<br />
                ตอบลูกค้า รับออเดอร์ จองคิว และส่งต่อทีมเมื่อจำเป็น<br />
                by {BRAND_COMPANY}
              </p>
              <div className="mt-4 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/66">
                LINE: {LINE_HANDLE}
              </div>
            </div>

            <div>
              <div className="font-bold text-sm text-white/38 mb-3 uppercase tracking-wider">ผลิตภัณฑ์</div>
              <ul className="space-y-2 text-sm text-white/54">
                <li><a href="#features" className="hover:text-white transition-colors">ฟีเจอร์ทั้งหมด</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">ราคา</a></li>
                <li><a href={PRIMARY_CTA_HREF} className="hover:text-white transition-colors">เริ่มใช้ฟรี 14 วัน</a></li>
                <li><a href={LOGIN_HREF} className="hover:text-white transition-colors">เข้าสู่ระบบ</a></li>
              </ul>
            </div>

            <div>
              <div className="font-bold text-sm text-white/38 mb-3 uppercase tracking-wider">ธุรกิจ</div>
              <ul className="space-y-2 text-sm text-white/54">
                <li><a href="/line-bot-restaurant" className="hover:text-white transition-colors">LINE Bot ร้านอาหาร</a></li>
                <li><a href="/line-bot-clothing" className="hover:text-white transition-colors">LINE Bot ร้านค้าออนไลน์</a></li>
                <li><a href="/line-bot-clinic" className="hover:text-white transition-colors">LINE Bot คลินิก</a></li>
                <li><a href="/line-bot-beauty" className="hover:text-white transition-colors">LINE Bot ความงาม</a></li>
              </ul>
            </div>

            <div>
              <div className="font-bold text-sm text-white/38 mb-3 uppercase tracking-wider">ความน่าเชื่อถือ</div>
              <ul className="space-y-2 text-sm text-white/54">
                <li><a href={SECONDARY_CTA_HREF} className="hover:text-white transition-colors">คุยกับทีมทาง LINE</a></li>
                <li><a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-white transition-colors">Support: {SUPPORT_EMAIL}</a></li>
                <li><a href={`mailto:${PRIVACY_EMAIL}`} className="hover:text-white transition-colors">Privacy: {PRIVACY_EMAIL}</a></li>
                <li><a href="/privacy" className="hover:text-white transition-colors">นโยบายความเป็นส่วนตัว</a></li>
                <li><a href="/terms" className="hover:text-white transition-colors">ข้อกำหนดการใช้งาน</a></li>
                <li><a href="/dpa" className="hover:text-white transition-colors">ข้อตกลงการประมวลผลข้อมูล</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/6 pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-white/34">
            <div className="flex items-center gap-3">
              <img src="/assets/footer-cats.png" alt="MeowChat cats" height={32} className="opacity-50" />
              <p>© 2026 {BRAND_COMPANY}. All rights reserved.</p>
            </div>
            <p className="max-w-3xl">รองรับการใช้งานบน LINE OA พร้อมช่องทาง support ({SUPPORT_EMAIL}), privacy ({PRIVACY_EMAIL}), legal ({LEGAL_EMAIL}) และ DPA ({DPA_EMAIL})</p>
          </div>
        </div>
      </footer>
    </>
  );
}