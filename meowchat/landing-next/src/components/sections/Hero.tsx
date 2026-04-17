export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand-dark min-h-[90vh] flex items-center">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-orange/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-20 text-center relative z-10">
        <div className="inline-flex items-center gap-2 bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-sm font-bold px-4 py-2 rounded-full mb-6">
          🐾 AI Chatbot สำหรับธุรกิจไทย
        </div>

        <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6">
          ไม่ต้องตอบแชทเอง<br />
          อีกต่อไป ให้{' '}
          <span className="text-gradient">MeowChat</span>
          <br />
          ช่วยตอบลูกค้าอัตโนมัติ
        </h1>

        <p className="text-white/60 text-lg mb-2">
          AI Chatbot for Thai Business · Auto-reply 24/7 · LINE OA Integration
        </p>
        <p className="text-white/70 text-lg mb-10">
          ประหยัดเวลา ลดภาระงาน ดูแลร้านได้ 24 ชม.<br />
          AI ตอบแชท · ปิดการขาย · อัพเดทสต็อก · ดูยอดขาย ครบในที่เดียว
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <a
            href="https://my.meowchat.store/register"
            className="bg-brand-orange text-white font-black text-lg px-8 py-4 rounded-2xl hover:opacity-90 transition-opacity shadow-lg shadow-brand-orange/20"
          >
            สมัครฟรี — ทดลอง 14 วัน 🐾
          </a>
          <a
            href="#features"
            className="border border-white/20 text-white font-bold text-lg px-8 py-4 rounded-2xl hover:border-white/40 hover:bg-white/5 transition-all"
          >
            ดูฟีเจอร์ทั้งหมด
          </a>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8">
          {[
            { icon: '🐾', value: 'Beta', label: 'รับ 100 คนแรก' },
            { icon: '🏪', value: '10+', label: 'ประเภทธุรกิจ' },
            { icon: '💬', value: '24/7', label: 'ตอบแชทอัตโนมัติ' },
            { icon: '⭐', value: '4.9/5', label: 'ความพึงพอใจ' },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <span className="text-2xl">{s.icon}</span>
              <div className="text-left">
                <div className="font-black text-xl">{s.value}</div>
                <div className="text-white/50 text-sm">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
