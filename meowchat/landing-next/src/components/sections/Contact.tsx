import { trackCTA } from '../../lib/analytics';
import {
  BRAND_COMPANY,
  LINE_HANDLE,
  PRIMARY_CTA_HREF,
  PRIMARY_CTA_LABEL,
  PRIVACY_EMAIL,
  SECONDARY_CTA_HREF,
  SECONDARY_CTA_LABEL,
  SUPPORT_EMAIL,
} from '../../lib/site';

const CHECKLIST = [
  'ทดลองใช้ฟรี 14 วัน',
  'ใช้กับ LINE OA เดิมของคุณ',
  'คุยรูปแบบการใช้งานกับทีมได้ก่อน',
  'ทีมซัพพอร์ตภาษาไทยช่วยเริ่มต้นใช้งานได้',
];

const TRUST_POINTS = [
  {
    title: 'มีทีมคุยงานจริงก่อนเริ่ม',
    body: 'หากต้องการเช็กว่าร้านของคุณเหมาะกับแพ็กเกจไหน สามารถคุยกับทีมทาง LINE หรืออีเมลก่อนเริ่มใช้งานได้',
  },
  {
    title: 'ซัพพอร์ตและการเริ่มต้นใช้งานภาษาไทย',
    body: 'ทีมงานช่วยอธิบายการเชื่อม LINE OA การตั้งค่าพื้นฐาน และจุดที่ควรส่งต่อให้ทีมดูแลในเคสสำคัญ',
  },
  {
    title: 'มีช่องทางติดต่อและเอกสารกำกับชัดเจน',
    body: 'MeowChat ให้บริการโดย Mawsom Company Limited พร้อมช่องทางติดต่อด้าน support และ privacy บนเว็บไซต์',
  },
];

export default function Contact() {
  return (
    <section id="contact" className="py-28 max-w-5xl mx-auto px-4 text-center">
      <div className="rounded-[34px] border border-white/8 bg-white/[0.04] p-8 md:p-14 card-glow-strong relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,rgba(255,193,216,0.16),transparent_45%)]" />
        <div className="relative z-10">
          <div className="eyebrow mb-5">พร้อมเริ่มต้นกับ MeowChat</div>
          <h2 className="text-3xl md:text-5xl font-black mb-5 leading-tight text-white">
            ถ้าธุรกิจของคุณขายผ่าน LINE อยู่แล้ว
            <span className="block text-gradient mt-2">นี่คือเวลาที่ควรทำให้มันเป็นระบบขึ้น</span>
          </h2>
          <p className="text-white/64 text-lg md:text-xl mb-10 max-w-3xl mx-auto leading-8">
            เริ่มจากทดลองใช้ฟรี 14 วัน หรือคุยกับทีมก่อนเพื่อเช็กว่าร้านของคุณควรเริ่มจากจุดไหน
            แล้วค่อยขยายการใช้งานต่อหลังจากเห็นรูปแบบจริง
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left mb-10">
            {TRUST_POINTS.map((point) => (
              <div key={point.title} className="rounded-[24px] border border-white/10 bg-[#111827]/55 p-5 md:p-6">
                <div className="text-white font-bold text-base mb-2">{point.title}</div>
                <p className="text-sm md:text-base text-white/60 leading-7">{point.body}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a
              href={PRIMARY_CTA_HREF}
              onClick={() => trackCTA({ location: 'final_cta', label: PRIMARY_CTA_LABEL, destination: PRIMARY_CTA_HREF, variant: 'primary' })}
              className="bg-brand-green text-white font-bold text-xl px-10 py-5 rounded-2xl hover:opacity-95 transition-opacity shadow-lg shadow-brand-green/20"
            >
              {PRIMARY_CTA_LABEL}
            </a>
            <a
              href={SECONDARY_CTA_HREF}
              onClick={() => trackCTA({ location: 'final_cta', label: SECONDARY_CTA_LABEL, destination: SECONDARY_CTA_HREF, variant: 'secondary' })}
              className="border border-white/10 bg-white/5 text-white font-semibold text-xl px-10 py-5 rounded-2xl hover:bg-white/10 transition-colors"
            >
              {SECONDARY_CTA_LABEL}
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-3 text-sm md:text-base text-white/60 mb-10">
            {CHECKLIST.map((item) => (
              <div key={item} className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5">
                {item}
              </div>
            ))}
          </div>

          <div className="rounded-[24px] border border-white/10 bg-[#0f1524]/80 px-5 py-5 md:px-7 md:py-6 text-left max-w-3xl mx-auto">
            <div className="text-sm uppercase tracking-[0.16em] text-white/38 mb-3">ช่องทางติดต่อและความมั่นใจ</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm md:text-base text-white/62 leading-7">
              <div>
                <div className="font-semibold text-white mb-1">ช่องทางติดต่อหลัก</div>
                <p>LINE Official: {LINE_HANDLE}</p>
                <p>Support: <a href={`mailto:${SUPPORT_EMAIL}`} className="text-[#ffc1d8] hover:text-white transition-colors">{SUPPORT_EMAIL}</a></p>
                <p>Privacy: <a href={`mailto:${PRIVACY_EMAIL}`} className="text-[#ffc1d8] hover:text-white transition-colors">{PRIVACY_EMAIL}</a></p>
              </div>
              <div>
                <div className="font-semibold text-white mb-1">สำหรับธุรกิจที่ต้องการความมั่นใจเพิ่ม</div>
                <p>ทีมงานตอบกลับเป็นภาษาไทยและช่วยแนะนำการเริ่มต้นใช้งานเบื้องต้นได้</p>
                <p>ให้บริการโดย {BRAND_COMPANY}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
