import { trackCTA } from '../../lib/analytics';
import { SECONDARY_CTA_HREF, SECONDARY_CTA_LABEL } from '../../lib/site';

const TESTIMONIALS = [
  {
    quote: 'เมื่อก่อนลูกค้าทักมานอกเวลาแล้วหลุดบ่อย ตอนนี้อย่างน้อยระบบช่วยรับคำถามและเก็บเรื่องไว้ให้ทีมตามต่อได้',
    role: 'ร้านอาหาร / เดลิเวอรี',
  },
  {
    quote: 'จุดที่ชอบคือเวลาส่งต่อให้แอดมิน ทีมไม่ต้องเริ่มถามลูกค้าใหม่ทั้งหมด เพราะมีสรุปสิ่งที่คุยไว้แล้ว',
    role: 'คลินิก / นัดหมาย',
  },
  {
    quote: 'มันไม่ใช่แค่ตอบแชทไวขึ้น แต่ทำให้ร้านรู้ว่าต้องตามลูกค้าคนไหนต่อก่อนหลัง',
    role: 'ร้านค้าออนไลน์ / ปิดการขาย',
  },
];

export default function Reviews() {
  return (
    <section id="reviews" className="py-28 md:py-32 max-w-6xl mx-auto px-4">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="eyebrow mb-4">สิ่งที่ทำให้ตัดสินใจง่ายขึ้น</div>
        <h2 className="text-3xl md:text-5xl font-black leading-tight mb-4 text-white">
          ร้านไม่ได้ต้องการแค่ AI ที่ดูเก่ง
          <span className="block text-white/56">แต่ต้องการระบบที่ช่วยให้ทีมทำงานต่อได้จริง</span>
        </h2>
        <p className="text-white/60 text-lg leading-8">
          ด้านล่างนี้คือรูปแบบคุณค่าที่เจ้าของร้านมักมองหา เมื่อเริ่มใช้ LINE OA ให้ช่วยงานขายและบริการอย่างเป็นระบบมากขึ้น
        </p>
      </div>

      <div className="grid lg:grid-cols-[0.92fr_1.08fr] gap-8 items-start">
        <div className="rounded-[30px] border border-white/8 bg-white/[0.04] p-7 md:p-8 card-glow">
          <div className="text-sm font-bold text-brand-peach uppercase tracking-[0.16em] mb-4">มุมที่ช่วยปิดการตัดสินใจ</div>
          <div className="space-y-4 text-white/68 text-base md:text-lg leading-7 md:leading-8">
            <p>ลูกค้าควรรู้สึกว่า “ร้านนี้ตอบไวขึ้น” โดยที่เจ้าของร้านยังรู้สึกว่า “ทีมเรายังคุมการขายและการบริการได้เหมือนเดิม”</p>
            <p>MeowChat จึงไม่ได้พยายามแทนคนทั้งหมด แต่ช่วยรับหน้าแรก จัดข้อมูล และทำให้ทีมรับต่อได้ง่ายขึ้นในจังหวะที่สำคัญ</p>
          </div>
          <a
            href={SECONDARY_CTA_HREF}
            onClick={() => trackCTA({ location: 'proof_section', label: SECONDARY_CTA_LABEL, destination: SECONDARY_CTA_HREF, variant: 'secondary' })}
            className="inline-flex items-center gap-2 mt-7 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
          >
            {SECONDARY_CTA_LABEL}
          </a>
        </div>

        <div className="grid gap-4">
          {TESTIMONIALS.map((item, index) => (
            <div key={index} className="rounded-[24px] border border-white/8 bg-[#111827]/55 p-6 md:p-7 card-glow">
              <div className="text-brand-peach text-xl mb-3">“</div>
              <p className="text-white/84 text-base md:text-lg leading-8 mb-4">{item.quote}</p>
              <div className="text-sm md:text-base text-white/42">{item.role}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
