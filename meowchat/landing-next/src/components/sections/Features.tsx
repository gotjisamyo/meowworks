const FEATURE_PILLARS = [
  {
    title: 'รับหน้าแรกแทนทีม',
    desc: 'ตอบคำถามซ้ำ ๆ และข้อความนอกเวลาทำการได้เร็วขึ้น โดยยังคุมรูปแบบการตอบของธุรกิจได้',
    points: ['ตอบคำถามที่พบบ่อยและข้อมูลสินค้า', 'ปรับการทำงานให้ตรงกับร้านได้', 'ส่งต่อเมื่อเกินขอบเขต'],
  },
  {
    title: 'เก็บออเดอร์ จองคิว และลีด',
    desc: 'ช่วยเปลี่ยนการคุยใน LINE ให้เป็น flow ที่ทำงานได้จริงมากขึ้น ไม่ใช่แค่ตอบกลับสวย ๆ',
    points: ['รับออเดอร์หรือจองคิว', 'เก็บข้อมูลลูกค้าเบื้องต้น', 'สรุปงานให้แอดมินต่อได้ง่าย'],
  },
  {
    title: 'ทำให้ทีมเห็นภาพรวม',
    desc: 'ช่วยให้ทีมตามงานต่อจากหน้าสรุปข้อมูลลูกค้าและสถานะล่าสุดได้ง่ายขึ้นเมื่อเคสต้องใช้คนดูแล',
    points: ['จัดกลุ่มลูกค้าและข้อมูลสำคัญ', 'ดูสถานะการคุยและการส่งต่อ', 'ขยายขั้นตอนการทำงานได้ภายหลัง'],
  },
];

export default function Features() {
  return (
    <section id="features" className="py-28 max-w-6xl mx-auto px-4">
      <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 items-start mb-16">
        <div>
          <div className="eyebrow mb-4">ความสามารถหลัก</div>
          <h2 className="text-3xl md:text-5xl font-black mb-5 leading-tight text-white">
            ไม่ใช่แค่บอทตอบแชท
            <span className="block text-white/56">แต่เป็นโครงงานขายและบริการบน LINE ที่ทีมใช้ต่อได้</span>
          </h2>
          <p className="text-white/60 text-lg leading-8 max-w-xl">
            MeowChat ช่วยให้ร้านคุณตอบลูกค้าเร็วขึ้น เก็บงานต่อได้เป็นระบบ และให้ทีมรับช่วงต่อได้โดยไม่ต้องเริ่มคุยใหม่
          </p>
        </div>

        <div className="rounded-[30px] border border-white/8 bg-white/[0.04] p-6 md:p-8 card-glow">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-white/8 bg-[#111827]/55 p-5">
              <div className="text-xs uppercase tracking-[0.16em] text-white/32 mb-2">ฝั่งลูกค้า</div>
              <div className="text-2xl font-semibold mb-2 text-white">ตอบเร็วขึ้น</div>
              <p className="text-sm text-white/54 leading-6">ลูกค้าเห็นการตอบกลับที่สม่ำเสมอ และไม่หลุดเพราะร้านตอบช้า</p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-[#111827]/55 p-5">
              <div className="text-xs uppercase tracking-[0.16em] text-white/32 mb-2">ฝั่งทีมงาน</div>
              <div className="text-2xl font-semibold mb-2 text-white">ส่งต่อง่ายขึ้น</div>
              <p className="text-sm text-white/54 leading-6">เมื่อเคสซับซ้อน ทีมยังรับช่วงต่อจากข้อมูลเดิมได้ ไม่ต้องเริ่มใหม่</p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-[#111827]/55 p-5">
              <div className="text-xs uppercase tracking-[0.16em] text-white/32 mb-2">ฝั่งการเติบโต</div>
              <div className="text-2xl font-semibold mb-2 text-white">ขยายต่อได้</div>
              <p className="text-sm text-white/54 leading-6">เริ่มจากงานหลักของร้านก่อน แล้วค่อยขยายไปยังออเดอร์ การจอง และการติดตามลูกค้า</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        {/* Mascot floats above center card on desktop */}
        <div className="hidden lg:flex absolute -top-10 left-1/2 -translate-x-1/2 flex-col items-center z-10 pointer-events-none">
          <div className="text-4xl mascot-peek">🐱</div>
          <div className="w-px h-6 bg-gradient-to-b from-brand-mascot/40 to-transparent" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {FEATURE_PILLARS.map((item, index) => (
            <div
              key={item.title}
              className={`rounded-[28px] border bg-white/[0.04] p-6 md:p-7 card-glow transition-colors ${
                index === 1
                  ? 'border-brand-mascot/30 bg-brand-mascot/[0.04]'
                  : 'border-white/8'
              }`}
            >
              <div className="text-xs uppercase tracking-[0.16em] text-brand-peach mb-3">จุดเด่นของระบบ</div>
              <h3 className="text-2xl font-semibold mb-3 leading-tight text-white">{item.title}</h3>
              <p className="text-white/58 text-sm leading-7 mb-7">{item.desc}</p>
              <div className="space-y-3">
                {item.points.map((point) => (
                  <div key={point} className="flex items-start gap-3 text-sm text-white/70 leading-6">
                    <span className="mt-1 text-brand-peach">✦</span>
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
