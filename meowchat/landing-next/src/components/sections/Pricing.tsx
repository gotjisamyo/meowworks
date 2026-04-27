import { trackCTA } from '../../lib/analytics';
import {
  PRIMARY_CTA_HREF,
  PRIMARY_CTA_LABEL,
  SECONDARY_CTA_HREF,
  SECONDARY_CTA_LABEL,
} from '../../lib/site';

type Plan = {
  icon: string;
  name: string;
  tag: string;
  hint: string;
  price: string;
  period?: string;
  features: string[];
  fit: string;
  setup: string;
  cta: string;
  ctaHref: string;
  popular?: boolean;
  variant?: 'primary' | 'secondary';
};

const PLANS: Plan[] = [
  {
    icon: '🌱',
    name: 'Starter',
    tag: 'เริ่มจากงานหลักของร้าน',
    hint: 'สำหรับร้านที่อยากเริ่มให้ LINE OA ช่วยตอบลูกค้า รับออเดอร์ หรือเก็บข้อมูลลูกค้าแบบง่าย ๆ ก่อน',
    price: '490',
    period: '/เดือน',
    features: [
      'LINE OA 1 บัญชี',
      'ตอบลูกค้าอัตโนมัติ 24/7',
      'รับออเดอร์ จองคิว หรือเก็บลีดเบื้องต้น',
      'ส่งต่อให้ทีมร้านเมื่อเคสต้องใช้คนดูแล',
    ],
    fit: 'เหมาะกับร้านที่อยากเริ่มจากสิ่งที่ทำอยู่ทุกวัน โดยไม่ต้องตั้งค่าซับซ้อนเกินไป',
    setup: 'เริ่มจากทดลองใช้ฟรี 14 วัน เพื่อดู flow จริงของร้านก่อน',
    cta: PRIMARY_CTA_LABEL,
    ctaHref: PRIMARY_CTA_HREF,
    popular: true,
    variant: 'primary',
  },
  {
    icon: '🚀',
    name: 'Pro',
    tag: 'เมื่อร้านเริ่มมีหลาย flow',
    hint: 'เหมาะกับธุรกิจที่มีคำถามหลายแบบ งานหลายขั้น หรืออยากให้ทีมเห็นข้อมูลที่สรุปละเอียดขึ้นก่อนรับต่อ',
    price: '990',
    period: '/เดือน',
    features: [
      'รองรับหลายรูปแบบการทำงานมากขึ้น',
      'สรุปข้อมูลลูกค้าและสถานะงานละเอียดขึ้น',
      'ช่วยให้ทีมติดตามต่อได้ง่ายกว่าเดิม',
      'เหมาะกับร้านที่ใช้ LINE OA เป็นช่องทางหลักอยู่แล้ว',
    ],
    fit: 'เหมาะกับร้านที่เริ่มเห็นว่าการตอบแชทเริ่มกลายเป็นงานจริงหลายแบบในแต่ละวัน',
    setup: 'เริ่มจาก trial เหมือนกัน แล้วค่อยปรับ flow ตามงานจริงของร้าน',
    cta: PRIMARY_CTA_LABEL,
    ctaHref: PRIMARY_CTA_HREF,
    variant: 'primary',
  },
  {
    icon: '🤝',
    name: 'Business',
    tag: 'คุยกับทีมก่อนเริ่ม',
    hint: 'สำหรับหลายสาขา เคสเฉพาะทาง หรือทีมที่ต้องการคุยรายละเอียดการใช้งานก่อนตัดสินใจ',
    price: 'คุยราคา',
    features: [
      'วางรูปแบบการทำงานให้เหมาะกับธุรกิจ',
      'ดูเรื่องหลายสาขา ทีม และการเชื่อมต่อเพิ่มเติม',
      'เหมาะกับเคสที่ไม่ใช่แพ็กมาตรฐาน',
    ],
    fit: 'เหมาะกับธุรกิจที่อยากให้ทีมช่วยประเมินก่อนว่าแบบไหนเหมาะสุด',
    setup: 'คุย use case จริงทาง LINE ก่อน แล้วค่อยสรุปแนวทางเริ่มต้น',
    cta: SECONDARY_CTA_LABEL,
    ctaHref: SECONDARY_CTA_HREF,
    variant: 'secondary',
  },
];

const TRIAL_POINTS = [
  'ใช้ฟรี 14 วัน และไม่ต้องใช้บัตรเครดิต',
  'เริ่มจาก LINE OA เดิมของร้านได้เลย',
  'ยังไม่ต้องทำทุกอย่างในวันแรก ค่อย ๆ เริ่มจากงานหลักก่อน',
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 section-shell">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <div className="eyebrow mb-4">เริ่มง่าย และค่อยเลือกแพ็กที่พอดีกับร้าน</div>
          <h2 className="text-3xl md:text-5xl font-black mb-4 leading-tight text-white">
            ลองใช้ฟรีก่อน
            <span className="block text-white/56">แล้วค่อยเลือกว่าแบบไหนเหมาะกับการทำงานของร้านคุณ</span>
          </h2>
          <p className="text-white/60 text-lg leading-8">
            เราออกแบบแพ็กให้เข้าใจง่ายสำหรับธุรกิจไทย เริ่มจากงานที่ทำอยู่ทุกวันก่อน แล้วค่อยขยายเมื่อร้านพร้อม
          </p>
        </div>

        <div className="rounded-[30px] border border-white/8 bg-white/[0.04] p-6 md:p-7 mb-8 max-w-5xl mx-auto card-glow">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-6 items-center">
            <div>
              <div className="text-sm font-bold text-brand-peach mb-3 uppercase tracking-[0.16em]">ทดลองใช้ฟรี 14 วัน</div>
              <div className="text-2xl md:text-3xl font-black text-white mb-3">เริ่มดูของจริงกับร้านคุณก่อน โดยไม่ต้องรีบตัดสินใจ</div>
              <p className="text-white/58 leading-7">ช่วงทดลองเหมาะสำหรับดูว่า LINE OA ของร้านคุณควรเริ่มจากการตอบคำถาม, รับออเดอร์, จองคิว หรือเก็บข้อมูลลูกค้าตรงไหนก่อน</p>
            </div>
            <div className="grid gap-3">
              {TRIAL_POINTS.map((item) => (
                <div key={item} className="rounded-2xl border border-white/8 bg-[#111827]/55 px-4 py-4 text-sm text-white/68 leading-7">
                  <span className="mr-2 text-brand-peach">✦</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-[30px] p-6 md:p-7 border flex flex-col ${plan.popular ? 'bg-white text-slate-950 border-white card-glow-strong scale-[1.01]' : 'border-white/8 bg-white/[0.04] card-glow'}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-green text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-brand-green/20">
                  เริ่มต้นง่ายที่สุด
                </div>
              )}

              <div className="text-4xl mb-4">{plan.icon}</div>
              <div className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold mb-3 ${plan.popular ? 'bg-slate-100 text-slate-600' : 'border border-white/10 bg-white/[0.04] text-white/60'}`}>
                {plan.tag}
              </div>
              <div className={`font-black text-2xl mb-2 ${plan.popular ? 'text-slate-950' : 'text-white'}`}>{plan.name}</div>
              <div className={`${plan.popular ? 'text-slate-600' : 'text-white/54'} text-sm mb-5 leading-6 min-h-[4rem]`}>{plan.hint}</div>

              <div className="mb-6 min-h-[64px] flex items-end gap-1">
                {plan.period ? (
                  <>
                    <span className={`${plan.popular ? 'text-slate-500' : 'text-white/45'} text-base`}>฿</span>
                    <span className={`text-5xl font-black leading-none ${plan.popular ? 'text-slate-950' : 'text-white'}`}>{plan.price}</span>
                    <span className={`${plan.popular ? 'text-slate-500' : 'text-white/45'} text-base mb-1`}>{plan.period}</span>
                  </>
                ) : (
                  <span className={`text-4xl font-black ${plan.popular ? 'text-slate-950' : 'text-white'}`}>{plan.price}</span>
                )}
              </div>

              <ul className="flex-1 space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className={`text-sm flex gap-3 leading-7 ${plan.popular ? 'text-slate-700' : 'text-white/68'}`}>
                    <span className={`${plan.popular ? 'text-slate-950' : 'text-brand-peach'} mt-1 shrink-0`}>✦</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="space-y-3 mb-7 text-sm">
                <div className={`rounded-2xl px-4 py-3 leading-7 ${plan.popular ? 'bg-slate-50 text-slate-700' : 'border border-white/8 bg-white/[0.03] text-white/66'}`}>
                  <span className={`${plan.popular ? 'text-slate-950' : 'text-white'} font-semibold`}>เหมาะกับร้านแบบไหน:</span> {plan.fit}
                </div>
                <div className={`rounded-2xl px-4 py-3 leading-7 ${plan.popular ? 'bg-slate-50 text-slate-700' : 'border border-white/8 bg-white/[0.03] text-white/66'}`}>
                  <span className={`${plan.popular ? 'text-slate-950' : 'text-white'} font-semibold`}>วิธีเริ่มต้น:</span> {plan.setup}
                </div>
              </div>

              <a
                href={plan.ctaHref}
                onClick={() =>
                  trackCTA({
                    location: `pricing_${plan.name.toLowerCase()}`,
                    label: plan.cta,
                    destination: plan.ctaHref,
                    variant: plan.variant || 'primary',
                  })
                }
                className={`block text-center font-semibold py-3.5 rounded-2xl transition-colors ${
                  plan.variant === 'secondary'
                    ? 'border border-white/10 bg-white/5 text-white hover:bg-white/10'
                    : plan.popular
                    ? 'bg-slate-950 text-white hover:bg-slate-800'
                    : 'bg-brand-green text-white hover:opacity-95'
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}