const SHOWCASES = [
  {
    eyebrow: 'ตัวอย่างการใช้งานกับลูกค้า',
    title: 'ให้ LINE OA ช่วยตอบลูกค้าก่อน แล้วค่อยส่งต่อให้ทีมเมื่อถึงจังหวะปิดงาน',
    desc: 'เหมาะกับร้านที่มีคำถามเดิม ๆ เข้ามาซ้ำบ่อย แต่ยังอยากให้ทีมรับต่อในเคสสำคัญ เช่น ลูกค้าที่พร้อมซื้อ เคสสั่งพิเศษ หรือคำถามที่ต้องให้คนตัดสินใจ',
    bullets: ['ตอบคำถามเบื้องต้นและเก็บข้อมูลก่อน', 'สรุปสิ่งที่ลูกค้าต้องการให้ทีมอ่านต่อได้ทันที', 'ช่วยให้ลูกค้าไม่หลุดเพราะร้านตอบช้า'],
    stats: [
      { label: 'ลูกค้าเห็น', value: 'ตอบไวขึ้น' },
      { label: 'ทีมร้านได้', value: 'บริบทครบ' },
      { label: 'งานขาย', value: 'ตามต่อได้ง่าย' },
    ],
  },
  {
    eyebrow: 'ตัวอย่างมุมมองของทีมร้าน',
    title: 'เมื่อแชทเริ่มกลายเป็นงานจริง ทีมควรเห็นว่าใครต้องตามต่อ และต้องทำอะไรก่อน',
    desc: 'หน้าสรุปงานช่วยให้ทีมร้านเห็นลูกค้าที่ต้องติดตาม ออเดอร์ที่ค้าง และเคสที่ต้องรีบดูแล โดยไม่ต้องไล่อ่านแชทย้อนใหม่ทุกครั้ง',
    bullets: ['เห็นว่าใครพร้อมซื้อหรือพร้อมนัดหมาย', 'ตามงานต่อได้โดยไม่เริ่มใหม่จากศูนย์', 'ช่วยให้ร้านเล็กก็ทำงานเป็นระบบขึ้นได้'],
    stats: [
      { label: 'สถานะลูกค้า', value: 'ดูง่าย' },
      { label: 'งานค้าง', value: 'ไม่หลุดมือ' },
      { label: 'การส่งต่อ', value: 'ต่อเนื่อง' },
    ],
  },
];

export default function ProductShowcase() {
  return (
    <section className="py-24 max-w-6xl mx-auto px-4">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="eyebrow mb-4">เห็นภาพการใช้งานจริง</div>
        <h2 className="text-3xl md:text-5xl font-black mb-4 leading-tight text-white">
          ไม่ได้เป็นแค่บอทตอบแชท
          <span className="block text-gradient mt-2">แต่เป็นผู้ช่วยที่ทำให้การคุยบน LINE ต่อเป็นงานขายได้จริง</span>
        </h2>
        <p className="text-white/60 text-lg leading-8">
          ดูตัวอย่างว่าลูกค้าจะคุยกับร้านอย่างไร ระบบช่วยตรงไหน และทีมร้านเห็นข้อมูลอะไรบ้างก่อนรับช่วงต่อ
        </p>
      </div>

      <div className="space-y-10">
        {SHOWCASES.map((item, index) => (
          <div key={item.title} className="grid lg:grid-cols-[0.95fr_1.05fr] gap-8 items-center">
            <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
              <div className="eyebrow mb-4">{item.eyebrow}</div>
              <h3 className="text-3xl md:text-4xl font-black leading-tight mb-4 text-white">{item.title}</h3>
              <p className="text-white/60 text-lg leading-8 mb-6">{item.desc}</p>
              <div className="space-y-3 mb-8">
                {item.bullets.map((bullet) => (
                  <div key={bullet} className="flex items-start gap-3 text-white/72 text-sm leading-7">
                    <span className="mt-1 text-brand-peach">✦</span>
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                {item.stats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-4 card-glow">
                    <div className="text-xs uppercase tracking-[0.16em] text-white/30 mb-1">{stat.label}</div>
                    <div className="text-base font-semibold text-white/90">{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
              <div className="rounded-[30px] border border-white/8 bg-[#101827]/94 p-5 md:p-6 card-glow-strong">
                {index === 0 ? (
                  <div className="grid gap-4 md:grid-cols-[1fr_0.95fr]">
                    <div className="rounded-[24px] border border-white/8 bg-[#0d1422] p-4 space-y-3">
                      <div className="text-xs uppercase tracking-[0.16em] text-white/30">ลูกค้าคุยกับร้านใน LINE</div>
                      <div className="rounded-2xl bg-white/[0.06] px-4 py-3 text-sm text-white/78">ลูกค้า: มีโปรทำผมกับจองคิวเสาร์นี้ไหมคะ</div>
                      <div className="rounded-2xl bg-brand-green px-4 py-3 text-sm text-white">MeowChat: มีโปรตัด + ทรีตเมนต์ค่ะ และมีคิวว่างช่วงบ่ายวันเสาร์ ต้องการให้สรุปตัวเลือกให้เลยไหมคะ</div>
                      <div className="rounded-2xl bg-white/[0.06] px-4 py-3 text-sm text-white/78">ลูกค้า: ขอคิวบ่ายสองค่ะ</div>
                      <div className="rounded-2xl bg-brand-green px-4 py-3 text-sm text-white">MeowChat: รับทราบค่ะ กำลังเก็บชื่อและเบอร์ติดต่อ พร้อมส่งต่อให้ทีมยืนยันนัดให้นะคะ</div>
                    </div>
                    <div className="rounded-[24px] border border-white/8 bg-white/[0.04] p-4">
                      <div className="text-xs uppercase tracking-[0.16em] text-white/30 mb-3">สิ่งที่ทีมเห็นก่อนรับต่อ</div>
                      <div className="rounded-2xl bg-[#0f1728] border border-white/8 p-4 mb-3">
                        <div className="text-sm font-semibold text-white mb-2">เคสพร้อมยืนยันนัด</div>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className="rounded-full bg-white/8 px-3 py-1 text-xs text-white/72">บริการทำผม</span>
                          <span className="rounded-full bg-white/8 px-3 py-1 text-xs text-white/72">วันเสาร์ 14:00</span>
                          <span className="rounded-full bg-brand-peach/12 px-3 py-1 text-xs text-brand-peach">พร้อมติดต่อกลับ</span>
                        </div>
                        <p className="text-sm text-white/55 leading-6">ร้านไม่ต้องไล่อ่านแชทย้อน เพราะระบบสรุปสิ่งที่ลูกค้าต้องการไว้แล้ว</p>
                      </div>
                      <div className="space-y-2 text-sm text-white/66">
                        <div className="flex justify-between rounded-xl bg-white/[0.03] px-3 py-2"><span>บริการที่สนใจ</span><span>ทำผม + ทรีตเมนต์</span></div>
                        <div className="flex justify-between rounded-xl bg-white/[0.03] px-3 py-2"><span>เวลาที่ต้องการ</span><span>เสาร์ 14:00</span></div>
                        <div className="flex justify-between rounded-xl bg-white/[0.03] px-3 py-2"><span>สถานะ</span><span>รอทีมยืนยัน</span></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    <div className="grid md:grid-cols-3 gap-3">
                      <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-4"><div className="text-xs text-white/35 mb-1">ลูกค้าที่ต้องตาม</div><div className="text-2xl font-semibold text-white">12</div></div>
                      <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-4"><div className="text-xs text-white/35 mb-1">จองคิวรอยืนยัน</div><div className="text-2xl font-semibold text-white">7</div></div>
                      <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-4"><div className="text-xs text-white/35 mb-1">ออเดอร์พร้อมปิด</div><div className="text-2xl font-semibold text-white">5</div></div>
                    </div>
                    <div className="rounded-[24px] border border-white/8 bg-[#0f1728] p-4">
                      <div className="text-xs uppercase tracking-[0.16em] text-white/30 mb-3">ตัวอย่างมุมมองของทีมร้าน</div>
                      <div className="space-y-3">
                        {[
                          ['ลูกค้าใหม่ทักเรื่องราคา', 'รอระบบเก็บข้อมูล'],
                          ['เคสพร้อมจองคิว', 'ให้ทีมยืนยัน'],
                          ['ลูกค้าเก่ากลับมาซื้อซ้ำ', 'ติดตามต่อได้ทันที'],
                        ].map(([left, right]) => (
                          <div key={left} className="flex items-center justify-between rounded-2xl bg-white/[0.04] px-4 py-3 text-sm text-white/68">
                            <span>{left}</span>
                            <span className="text-white/46">{right}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}