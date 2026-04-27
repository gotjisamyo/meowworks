import { trackCTA } from '../../lib/analytics';
import {
  PRIMARY_CTA_HREF,
  PRIMARY_CTA_LABEL,
  SECONDARY_CTA_HREF,
  SECONDARY_CTA_LABEL,
} from '../../lib/site';

const TRUST_POINTS = ['ใช้ฟรี 14 วัน', 'ใช้กับ LINE OA เดิมได้', 'ทีมไทยช่วยเริ่มต้นได้'];

const OUTCOME_BULLETS = [
  'ตอบลูกค้าไวขึ้น โดยไม่ต้องให้แอดมินพิมพ์ซ้ำทั้งวัน',
  'รับออเดอร์ จองคิว และเก็บข้อมูลลูกค้าได้ในแชทเดียว',
  'ถ้าเคสซับซ้อน ระบบส่งต่อให้ทีมพร้อมบริบทเดิมทันที',
];

const CHAT_FLOW = [
  { from: 'customer', text: 'สวัสดีค่ะ ร้านเปิดกี่โมงคะ แล้วมีโปรข้าวกล่องไหม' },
  { from: 'bot', text: 'สวัสดีค่ะ ร้านเปิด 10:00–20:00 นะคะ วันนี้มีโปรข้าวกล่อง 3 กล่อง 199 บาทด้วยค่ะ สนใจรับกลับหรือเดลิเวอรีคะ?' },
  { from: 'customer', text: 'ขอเดลิเวอรี 3 กล่องค่ะ' },
  { from: 'bot', text: 'ได้เลยค่ะ กำลังเก็บที่อยู่และสรุปออเดอร์ให้ทีมร้านดูแลต่อให้นะคะ' },
];

const OPS_LIST = ['ตอบคำถามที่ลูกค้าถามบ่อย', 'รับออเดอร์หรือจองคิว', 'สรุปข้อมูลก่อนส่งต่อทีม'];

export default function Hero() {
  return (
    <section className="relative overflow-hidden section-shell">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 h-[380px] w-[680px] rounded-full bg-brand-rose/14 blur-3xl" />
        <div className="absolute top-8 right-[-3rem] h-[240px] w-[240px] rounded-full bg-brand-orange/12 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 pt-24 pb-20 md:pt-28 md:pb-24">
        <div className="grid lg:grid-cols-[0.98fr_1.02fr] gap-10 items-center">
          <div>
            <div className="eyebrow mb-5">ผู้ช่วย LINE OA สำหรับธุรกิจไทย</div>

            <h1 className="text-4xl md:text-6xl font-black leading-[1.04] mb-5 max-w-4xl text-white">
              ให้ LINE OA ของร้านคุณ
              <span className="block text-gradient mt-2">ตอบลูกค้าไวขึ้น ขายง่ายขึ้น และไม่หลุดมือ</span>
            </h1>

            <p className="text-white/68 text-lg md:text-xl leading-8 max-w-2xl mb-4">
              MeowChat คือ AI ผู้ช่วยที่ช่วยร้านไทยตอบแชท รับออเดอร์ จองคิว และส่งต่อให้ทีมเมื่อจำเป็น
              โดยเริ่มจาก LINE OA เดิมที่ร้านใช้อยู่ได้เลย
            </p>

            <p className="text-white/52 text-base leading-7 max-w-2xl mb-7">
              เหมาะกับร้านที่อยากให้ลูกค้ารู้สึกว่าตอบเร็วขึ้น แต่ทีมยังคุมการขายและการบริการได้เหมือนเดิม
            </p>

            <div className="space-y-3 mb-7 max-w-2xl">
              {OUTCOME_BULLETS.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3 text-white/80 card-glow">
                  <span className="mt-0.5 text-brand-peach">✦</span>
                  <span className="text-sm md:text-base leading-6">{item}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <a
                href={PRIMARY_CTA_HREF}
                onClick={() => trackCTA({ location: 'hero', label: PRIMARY_CTA_LABEL, destination: PRIMARY_CTA_HREF, variant: 'primary' })}
                className="rounded-2xl bg-brand-green text-white font-bold text-lg px-8 py-4 hover:opacity-95 transition-opacity text-center shadow-lg shadow-brand-green/20"
              >
                {PRIMARY_CTA_LABEL}
              </a>
              <a
                href={SECONDARY_CTA_HREF}
                onClick={() => trackCTA({ location: 'hero', label: SECONDARY_CTA_LABEL, destination: SECONDARY_CTA_HREF, variant: 'secondary' })}
                className="rounded-2xl border border-white/10 bg-white/5 text-white/88 font-semibold text-lg px-8 py-4 hover:bg-white/10 transition-colors text-center"
              >
                {SECONDARY_CTA_LABEL}
              </a>
            </div>

            <div className="flex flex-wrap gap-3 mb-8">
              {TRUST_POINTS.map((item) => (
                <div key={item} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/60">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[30px] border border-white/8 bg-[#101827]/94 p-5 md:p-6 card-glow-strong">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-brand-blush/12 border border-brand-blush/20 flex items-center justify-center text-xl">🐱</div>
                  <div>
                    <div className="font-semibold text-sm text-white">MeowChat</div>
                    <div className="text-xs text-white/42">ตัวอย่างแชทที่ร้านและทีมใช้ต่อได้จริง</div>
                  </div>
                </div>
                <div className="rounded-full bg-brand-green/12 border border-brand-green/20 px-3 py-1 text-xs font-semibold text-brand-green">พร้อมใช้งาน</div>
              </div>

              <div className="grid gap-4 md:grid-cols-[1.02fr_0.98fr]">
                <div className="rounded-[24px] border border-white/8 bg-[#0d1422] p-4 space-y-3">
                  <div className="text-xs uppercase tracking-[0.16em] text-white/30">ตัวอย่างแชทกับลูกค้า</div>
                  {CHAT_FLOW.map((msg, index) => (
                    <div key={index} className={`flex ${msg.from === 'customer' ? 'justify-start' : 'justify-end'}`}>
                      <div className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-6 ${msg.from === 'customer' ? 'bg-white/8 text-white/78' : 'bg-brand-green text-white'}`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-[24px] border border-white/8 bg-white/[0.04] p-4">
                  <div className="text-xs uppercase tracking-[0.16em] text-white/30 mb-3">สรุปให้ทีมร้าน</div>
                  <div className="rounded-2xl bg-[#0f1728] border border-white/8 p-4 mb-3">
                    <div className="text-sm font-semibold text-white mb-2">ลูกค้าพร้อมสั่งซื้อ</div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="rounded-full bg-white/8 px-3 py-1 text-xs text-white/72">ข้าวกล่อง</span>
                      <span className="rounded-full bg-white/8 px-3 py-1 text-xs text-white/72">เดลิเวอรี</span>
                      <span className="rounded-full bg-brand-peach/12 px-3 py-1 text-xs text-brand-peach">พร้อมส่งต่อ</span>
                    </div>
                    <p className="text-sm text-white/55 leading-6">ระบบเก็บคำถาม, โปรที่สนใจ, และออเดอร์เบื้องต้นไว้ให้ทีมรับต่อได้ทันที</p>
                  </div>

                  <div className="text-sm font-semibold text-white/88 mb-3">งานที่ระบบช่วยรับหน้าแรก</div>
                  <div className="space-y-2">
                    {OPS_LIST.map((item) => (
                      <div key={item} className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3 py-2 text-sm text-white/64">
                        <span>{item}</span>
                        <span className="text-brand-peach">✓</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 left-6 hidden md:flex items-center gap-2 rounded-full border border-white/10 bg-[#111a2b]/92 px-4 py-2 text-xs text-white/58 backdrop-blur">
              <span className="text-brand-peach">✦</span>
              เริ่มจากงานหลักของร้านก่อน แล้วค่อยขยายทีหลัง
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}