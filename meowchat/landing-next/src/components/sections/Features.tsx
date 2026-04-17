const FEATURES = [
  {
    icon: '💬',
    title: 'ตอบแชทอัตโนมัติ',
    desc: 'ตอบลูกค้าทุกข้อความทันที พร้อม 24 ชม. เข้าใจภาษาไทยได้ดี',
    tags: ['ตอบทันที', '24/7', 'ภาษาไทย'],
  },
  {
    icon: '💳',
    title: 'จัดการชำระเงินและออเดอร์',
    desc: 'ปิดยอดขาย รับชำระเงิน และจัดการออเดอร์อัตโนมัติ ไม่พลาดทุกคำสั่งซื้อ',
    tags: ['ปิดการขาย', 'อัตโนมัติ'],
  },
  {
    icon: '📦',
    title: 'จัดการสต็อกสินค้า',
    desc: 'อัพเดทสต็อกอัตโนมัติ เชื่อม POS แจ้งเตือนสินค้าใกล้หมดแบบเรียลไทม์',
    tags: ['POS', 'เรียลไทม์', 'แจ้งเตือน'],
  },
  {
    icon: '📊',
    title: 'แดชบอร์ดยอดขาย',
    desc: 'ดูยอดขาย สถิติลูกค้า และออกรายงานได้ตลอดเวลา เพื่อช่วยตัดสินใจเร็วขึ้น',
    tags: ['เรียลไทม์', 'วิเคราะห์', 'รายงาน'],
  },
  {
    icon: '🛒',
    title: 'รับออเดอร์ผ่านแชท',
    desc: 'รับออเดอร์ผ่านแชท ยืนยันอัตโนมัติ และส่งต่อทีมจัดส่งได้ทันที',
    tags: ['รับออเดอร์', 'ยืนยันทันที'],
  },
  {
    icon: '👥',
    title: 'จัดการฐานลูกค้า',
    desc: 'เก็บข้อมูลลูกค้า แบ่งกลุ่ม และส่ง Broadcast โปรโมชั่นได้อย่างแม่นยำ',
    tags: ['ฐานลูกค้า', 'แบ่งกลุ่ม', 'บรอดแคสต์'],
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 max-w-6xl mx-auto px-4">
      <div className="text-center mb-14">
        <div className="inline-block bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-sm font-bold px-4 py-1.5 rounded-full mb-4">
          🐱 ฟีเจอร์
        </div>
        <h2 className="text-3xl md:text-4xl font-black mb-3">ทำได้ทุกอย่าง</h2>
        <p className="text-white/50 text-lg">ไม่ใช่แค่แชทบอท คือพนักงานอัจฉริยะ 24 ชั่วโมง</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="bg-brand-card rounded-2xl p-6 border border-white/5 hover:border-brand-orange/20 transition-colors card-glow"
          >
            <div className="text-3xl mb-4">{f.icon}</div>
            <h3 className="font-bold text-lg mb-2">{f.title}</h3>
            <p className="text-white/50 text-sm mb-4 leading-relaxed">{f.desc}</p>
            <div className="flex flex-wrap gap-2">
              {f.tags.map((t) => (
                <span
                  key={t}
                  className="text-xs bg-brand-orange/10 text-brand-orange font-semibold px-2 py-1 rounded-lg"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
