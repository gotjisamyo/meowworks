const USE_CASES = [
  { emoji: '🍱', name: 'ร้านอาหาร', desc: 'รับออเดอร์ เมนู และคิวเดลิเวอรีในแชทเดียว', slug: '/line-bot-restaurant' },
  { emoji: '👗', name: 'ร้านค้าออนไลน์', desc: 'ตอบสินค้า ราคา และสถานะคำสั่งซื้อได้ไวขึ้น', slug: '/line-bot-clothing' },
  { emoji: '💆', name: 'ความงาม / นัดหมาย', desc: 'จองคิว ยืนยันนัด และติดตามลูกค้าได้เป็นระบบ', slug: '/line-bot-beauty' },
  { emoji: '🏥', name: 'คลินิก', desc: 'คัดกรองคำถามเบื้องต้นและช่วยจัดการนัดหมาย', slug: '/line-bot-clinic' },
  { emoji: '🏨', name: 'โรงแรม / ที่พัก', desc: 'ตอบคำถามห้องพัก โปรโมชั่น และรับจองโดยตรง', slug: '/line-bot-hotel' },
  { emoji: '🏠', name: 'อสังหาฯ', desc: 'เก็บลีด นัดดูโครงการ และส่งต่อให้ทีมขายได้ครบ', slug: '/line-bot-realestate' },
];

export default function UseCases() {
  return (
    <section id="usecases" className="py-24">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 items-start mb-10">
          <div>
            <div className="eyebrow mb-4">เหมาะกับหลายประเภทธุรกิจ</div>
            <h2 className="text-3xl md:text-5xl font-black mb-4 leading-tight text-white">
              เริ่มจากงานที่ร้านคุณทำอยู่ทุกวัน
              <span className="block text-gradient mt-2">แล้วให้ LINE OA ช่วยตอบแทนอย่างเป็นธรรมชาติ</span>
            </h2>
            <p className="text-white/62 text-lg leading-8 max-w-xl">
              ไม่ว่าจะขายของ รับจองคิว หรือคอยตอบลูกค้าซ้ำ ๆ หน้าร้านสามารถเริ่มจาก use case ที่ใกล้ตัวก่อน
              แล้วค่อยขยายการใช้งานเมื่อทีมเริ่มเห็นผลจริง
            </p>
          </div>

          <div className="rounded-[28px] border border-white/8 bg-white/[0.04] p-6 md:p-7 card-glow">
            <div className="grid sm:grid-cols-2 gap-4">
              {USE_CASES.map((uc) => (
                <a
                  key={uc.name}
                  href={uc.slug}
                  className="rounded-2xl border border-white/8 bg-[#111827]/55 p-5 hover:border-brand-rose/30 hover:bg-white/[0.07] transition-all group"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="text-3xl">{uc.emoji}</div>
                    <div className="text-white/24 group-hover:text-brand-rose transition-colors">↗</div>
                  </div>
                  <div className="text-lg font-semibold mb-2 text-white group-hover:text-white">{uc.name}</div>
                  <p className="text-sm text-white/54 leading-6">{uc.desc}</p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
