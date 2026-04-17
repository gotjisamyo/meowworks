const STEPS = [
  { num: 1, icon: '🐾', title: 'สมัครฟรี', desc: 'ลงทะเบียนใน 2 นาที ไม่ต้องใช้บัตรเครดิต เริ่มใช้งานได้ทันที' },
  { num: 2, icon: '🔗', title: 'เชื่อม LINE OA', desc: 'นำ Channel Access Token มาวางในระบบ ใช้เวลาเพียง 5 นาที' },
  { num: 3, icon: '🧠', title: 'สอน AI', desc: 'เพิ่มสินค้า FAQ และตั้งค่าบุคลิก AI ให้ตอบแทนได้อย่างเป็นธรรมชาติ' },
  { num: 4, icon: '💰', title: 'รอรับเงิน', desc: 'เปิดร้าน AI ตอบแชทแทนคุณ 24/7 คุณมีเวลาไปโฟกัสสิ่งสำคัญกว่า' },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 max-w-6xl mx-auto px-4">
      <div className="text-center mb-14">
        <div className="inline-block bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-sm font-bold px-4 py-1.5 rounded-full mb-4">
          🚀 วิธีการใช้งาน
        </div>
        <h2 className="text-3xl md:text-4xl font-black mb-3">เริ่มต้นง่าย ใน 4 ขั้นตอน</h2>
        <p className="text-white/50 text-lg">ไม่ต้องเขียน code ไม่ต้องมีความรู้เทคนิค ตั้งค่าเสร็จในชั่วโมงเดียว</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STEPS.map((s, i) => (
          <div key={s.num} className="relative">
            {i < STEPS.length - 1 && (
              <div className="hidden lg:block absolute top-10 left-full w-full h-px border-t border-dashed border-white/10 z-0" />
            )}
            <div className="bg-brand-card rounded-2xl p-6 border border-white/5 hover:border-brand-orange/20 transition-colors relative z-10 text-center">
              <div className="w-10 h-10 rounded-full bg-brand-orange/10 border border-brand-orange/30 text-brand-orange font-black text-lg flex items-center justify-center mx-auto mb-4">
                {s.num}
              </div>
              <div className="text-3xl mb-3">{s.icon}</div>
              <h3 className="font-bold text-lg mb-2">{s.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <a
          href="https://my.meowchat.store/register"
          className="inline-flex items-center gap-2 bg-brand-orange text-white font-black text-lg px-8 py-4 rounded-2xl hover:opacity-90 transition-opacity shadow-lg shadow-brand-orange/20"
        >
          เริ่มตอนนี้ฟรี — ไม่ต้องใช้บัตร 🐾
        </a>
      </div>
    </section>
  );
}
