/* Contact section — ALWAYS included in index.tsx, never removed */
import { useState } from 'react';

function LeadForm() {
  const [value, setValue] = useState('');
  const [sent, setSent] = useState(false);

  const submit = () => {
    if (!value.trim()) return;
    setSent(true);
  };

  if (sent) {
    return (
      <div className="text-brand-orange font-semibold py-3">
        ✅ บันทึกแล้ว! เราจะแจ้งคุณเมื่อมีโปรโมชั่น
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="อีเมลหรือเบอร์โทรศัพท์"
        className="flex-1 bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-orange/50"
      />
      <button
        onClick={submit}
        className="bg-brand-orange text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity whitespace-nowrap"
      >
        แจ้งเตือนฉัน 🔔
      </button>
    </div>
  );
}

export default function Contact() {
  return (
    <section id="contact" className="py-24 max-w-4xl mx-auto px-4 text-center">
      {/* CTA block */}
      <div className="bg-gradient-to-br from-brand-orange/10 to-transparent border border-brand-orange/20 rounded-3xl p-10 md:p-14 mb-12">
        <div className="text-5xl mb-4">😺🐱😸</div>
        <h2 className="text-3xl md:text-5xl font-black mb-4">พร้อมเริ่มต้นแล้วหรือยัง?</h2>
        <p className="text-white/60 text-lg mb-8">
          ทดลองใช้ฟรีวันนี้ ไม่ต้องใช้บัตรเครดิต เริ่มได้ใน 3 นาที
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://my.meowchat.store/register"
            className="bg-brand-orange text-white font-black text-xl px-10 py-5 rounded-2xl hover:opacity-90 transition-opacity shadow-xl shadow-brand-orange/20"
          >
            🐾 สมัครใช้งานฟรี
          </a>
          <a
            href="#features"
            className="border border-white/20 text-white font-bold text-xl px-10 py-5 rounded-2xl hover:border-white/40 hover:bg-white/5 transition-all"
          >
            ดูฟีเจอร์ทั้งหมด
          </a>
        </div>
      </div>

      {/* Lead capture */}
      <div className="bg-brand-card rounded-2xl border border-white/5 p-8">
        <h3 className="text-xl font-black mb-2">สนใจแต่ยังไม่พร้อมสมัคร? 💌</h3>
        <p className="text-white/50 text-sm mb-6">
          รับข่าวสารและโปรโมชั่นก่อนใคร ไม่มี spam แจ้งเตือนเฉพาะโปรพิเศษเท่านั้น
        </p>
        <LeadForm />
        <p className="text-white/30 text-xs mt-3">🔒 ข้อมูลของคุณปลอดภัย ไม่ถูกแชร์กับบุคคลภายนอก</p>
      </div>

      {/* Direct LINE contact */}
      <div className="mt-8">
        <p className="text-white/40 text-sm mb-3">หรือติดต่อเราโดยตรงผ่าน LINE</p>
        <a
          href="https://line.me/ti/p/@960xboyt"
          className="inline-flex items-center gap-2 bg-[#00B900]/10 border border-[#00B900]/30 text-[#4CAF50] font-bold px-6 py-3 rounded-xl hover:bg-[#00B900]/20 transition-colors"
        >
          💬 LINE Official: @MeowChat
        </a>
      </div>
    </section>
  );
}
