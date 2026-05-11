import Link from 'next/link';
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
import SiteNav from './SiteNav';

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteNav />

      <main className="pt-16 bg-white min-h-screen">{children}</main>

      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-6 py-7 md:px-8 md:py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-10">
            <div className="max-w-2xl">
              <div className="text-sm font-bold text-emerald-700 uppercase tracking-[0.16em] mb-2">พร้อมเริ่มใช้งาน</div>
              <p className="text-xl md:text-2xl font-semibold text-slate-900 mb-2">เริ่มจาก trial ก่อน แล้วค่อยคุย use case ที่เหมาะกับร้านของคุณ</p>
              <p className="text-sm md:text-base text-slate-500 leading-7">
                ทีมงานตอบเป็นภาษาไทย ช่วยดู flow เบื้องต้น การเชื่อมช่องทางแชตที่ร้านใช้อยู่ และแนวทางเริ่มต้นที่ไม่ซับซ้อนเกินไปสำหรับร้าน
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <a
                href={SECONDARY_CTA_HREF}
                onClick={() => trackCTA({ location: 'footer_cta', label: SECONDARY_CTA_LABEL, destination: SECONDARY_CTA_HREF, variant: 'secondary' })}
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors text-center"
              >
                {SECONDARY_CTA_LABEL}
              </a>
              <a
                href={PRIMARY_CTA_HREF}
                className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors text-center shadow-sm"
              >
                {PRIMARY_CTA_LABEL}
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="font-black text-xl mb-3 text-slate-900">MeowChat</div>
              <p className="text-slate-500 text-sm leading-relaxed">
                {BRAND_TAGLINE}<br />
                ตอบลูกค้า รับออเดอร์ จองคิว และส่งต่อทีมเมื่อจำเป็น<br />
                by {BRAND_COMPANY}
              </p>
              <div className="mt-4 inline-flex rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-500">
                LINE: {LINE_HANDLE}
              </div>
            </div>

            <div>
              <div className="font-bold text-sm text-slate-400 mb-3 uppercase tracking-wider">ผลิตภัณฑ์</div>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><Link href="/#features" className="hover:text-slate-800 transition-colors">ฟีเจอร์ทั้งหมด</Link></li>
                <li><Link href="/pricing" className="hover:text-slate-800 transition-colors">ราคา</Link></li>
                <li><a href={PRIMARY_CTA_HREF} className="hover:text-slate-800 transition-colors">เริ่มใช้ฟรี 14 วัน</a></li>
                <li><a href={LOGIN_HREF} className="hover:text-slate-800 transition-colors">เข้าสู่ระบบ</a></li>
              </ul>
            </div>

            <div>
              <div className="font-bold text-sm text-slate-400 mb-3 uppercase tracking-wider">ธุรกิจ</div>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><Link href="/line-bot-restaurant" className="hover:text-slate-800 transition-colors">LINE Bot ร้านอาหาร</Link></li>
                <li><Link href="/line-bot-clothing" className="hover:text-slate-800 transition-colors">LINE Bot ร้านค้าออนไลน์</Link></li>
                <li><Link href="/line-bot-clinic" className="hover:text-slate-800 transition-colors">LINE Bot คลินิก</Link></li>
                <li><Link href="/line-bot-beauty" className="hover:text-slate-800 transition-colors">LINE Bot ความงาม</Link></li>
              </ul>
            </div>

            <div>
              <div className="font-bold text-sm text-slate-400 mb-3 uppercase tracking-wider">ความน่าเชื่อถือ</div>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href={SECONDARY_CTA_HREF} className="hover:text-slate-800 transition-colors">คุยกับทีมทาง LINE</a></li>
                <li><a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-slate-800 transition-colors">Support: {SUPPORT_EMAIL}</a></li>
                <li><a href={`mailto:${PRIVACY_EMAIL}`} className="hover:text-slate-800 transition-colors">Privacy: {PRIVACY_EMAIL}</a></li>
                <li><Link href="/privacy" className="hover:text-slate-800 transition-colors">นโยบายความเป็นส่วนตัว</Link></li>
                <li><Link href="/terms" className="hover:text-slate-800 transition-colors">ข้อกำหนดการใช้งาน</Link></li>
                <li><Link href="/dpa" className="hover:text-slate-800 transition-colors">ข้อตกลงการประมวลผลข้อมูล</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-8 flex justify-center">
            <img
              src="/assets/footer-cats.png"
              alt="MeowChat mascots"
              width={180}
              height={60}
              className="opacity-40"
              loading="lazy"
            />
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-4 pb-6 text-xs text-slate-400">
            <p>© 2026 {BRAND_COMPANY}. All rights reserved.</p>
            <p className="text-center md:text-right max-w-xl">
              รองรับการใช้งานสำหรับ workflow แชตขายของธุรกิจ พร้อมช่องทาง support ({SUPPORT_EMAIL}), privacy ({PRIVACY_EMAIL}), legal ({LEGAL_EMAIL}) และ DPA ({DPA_EMAIL})
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
