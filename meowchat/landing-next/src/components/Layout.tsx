import Link from 'next/link';
import { useState } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-brand-dark/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-black text-xl">
            🐾 <span className="text-gradient">MeowChat</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-white/70">
            <a href="#features" className="hover:text-white transition-colors">ฟีเจอร์</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">วิธีใช้</a>
            <a href="#pricing" className="hover:text-white transition-colors">ราคา</a>
            <a href="#reviews" className="hover:text-white transition-colors">รีวิว</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://my.meowchat.store"
              className="text-sm font-semibold text-white/70 hover:text-white transition-colors"
            >
              เข้าสู่ระบบ
            </a>
            <a
              href="https://my.meowchat.store/register"
              className="bg-brand-orange text-white text-sm font-bold px-4 py-2 rounded-xl hover:opacity-90 transition-opacity"
            >
              สมัครฟรี 🐾
            </a>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-white/70 hover:text-white"
            onClick={() => setOpen(!open)}
            aria-label="เมนู"
          >
            {open ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile nav */}
        {open && (
          <div className="md:hidden bg-brand-card border-t border-white/5 px-4 py-4 flex flex-col gap-4 text-sm font-semibold">
            <a href="#features" onClick={() => setOpen(false)} className="text-white/70 hover:text-white">ฟีเจอร์</a>
            <a href="#how-it-works" onClick={() => setOpen(false)} className="text-white/70 hover:text-white">วิธีใช้</a>
            <a href="#pricing" onClick={() => setOpen(false)} className="text-white/70 hover:text-white">ราคา</a>
            <a href="#reviews" onClick={() => setOpen(false)} className="text-white/70 hover:text-white">รีวิว</a>
            <a href="#faq" onClick={() => setOpen(false)} className="text-white/70 hover:text-white">FAQ</a>
            <a
              href="https://my.meowchat.store/register"
              className="bg-brand-orange text-white font-bold px-4 py-2 rounded-xl text-center"
            >
              สมัครฟรี 🐾
            </a>
          </div>
        )}
      </header>

      <main className="pt-16">{children}</main>

      <footer className="bg-brand-card border-t border-white/5 mt-20">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="font-black text-xl mb-3">🐾 <span className="text-gradient">MeowChat</span></div>
              <p className="text-white/50 text-sm leading-relaxed">
                AI Chatbot สำหรับธุรกิจไทย<br />
                ตอบแชท LINE อัตโนมัติ 24/7<br />
                by Mawsom Company Limited
              </p>
            </div>

            <div>
              <div className="font-bold text-sm text-white/60 mb-3 uppercase tracking-wider">ผลิตภัณฑ์</div>
              <ul className="space-y-2 text-sm text-white/50">
                <li><a href="#features" className="hover:text-white transition-colors">ฟีเจอร์ทั้งหมด</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">ราคา</a></li>
                <li><a href="https://my.meowchat.store/register" className="hover:text-white transition-colors">ทดลองใช้ฟรี</a></li>
                <li><a href="https://app.meowchat.store" className="hover:text-white transition-colors">Admin Dashboard</a></li>
              </ul>
            </div>

            <div>
              <div className="font-bold text-sm text-white/60 mb-3 uppercase tracking-wider">ธุรกิจ</div>
              <ul className="space-y-2 text-sm text-white/50">
                <li><a href="/line-bot-restaurant" className="hover:text-white transition-colors">LINE Bot ร้านอาหาร</a></li>
                <li><a href="/line-bot-clothing" className="hover:text-white transition-colors">LINE Bot แฟชั่น</a></li>
                <li><a href="/line-bot-clinic" className="hover:text-white transition-colors">LINE Bot คลินิก</a></li>
                <li><a href="/line-bot-beauty" className="hover:text-white transition-colors">LINE Bot สปา/ความงาม</a></li>
              </ul>
            </div>

            <div>
              <div className="font-bold text-sm text-white/60 mb-3 uppercase tracking-wider">ติดต่อ</div>
              <ul className="space-y-2 text-sm text-white/50">
                <li>
                  <a
                    href="https://line.me/ti/p/@960xboyt"
                    className="hover:text-white transition-colors"
                  >
                    💬 LINE Official: @MeowChat
                  </a>
                </li>
                <li><a href="/privacy.html" className="hover:text-white transition-colors">นโยบายความเป็นส่วนตัว</a></li>
                <li><a href="/terms.html" className="hover:text-white transition-colors">ข้อกำหนดการใช้งาน</a></li>
                <li><a href="/dpa.html" className="hover:text-white transition-colors">ข้อตกลงการประมวลผลข้อมูล</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/30">
            <p>© 2024 Mawsom Company Limited. All rights reserved.</p>
            <p>🔒 ปฏิบัติตาม พ.ร.บ. PDPA 2562 · ข้อมูลปลอดภัย 100%</p>
          </div>
        </div>
      </footer>
    </>
  );
}
