import { trackCTA } from '../../lib/analytics';
import { PRIMARY_CTA_HREF, PRIMARY_CTA_LABEL } from '../../lib/site';

const STEPS = [
  { num: 1, icon: '🐾', mascot: '😺', title: 'เริ่มทดลองใช้ฟรี', desc: 'เริ่มลองได้ก่อน ไม่ต้องใช้บัตรเครดิต และไม่ต้องมีทีมเทคนิค' },
  { num: 2, icon: '💚', mascot: '🐱', title: 'เชื่อม LINE OA เดิม', desc: 'ใช้กับบัญชี LINE OA ของร้านคุณได้เลย แล้วค่อยตั้งค่าสิ่งที่จำเป็นก่อน' },
  { num: 3, icon: '🛍️', mascot: '😸', title: 'บอกงานหลักของร้าน', desc: 'เช่น ถามราคา รับออเดอร์ จองคิว หรือเก็บข้อมูลลูกค้าที่ถามเข้ามาบ่อย' },
  { num: 4, icon: '💬', mascot: '😻', title: 'เริ่มให้ระบบช่วยตอบ', desc: 'ให้ AI รับหน้าแรกก่อน แล้วส่งต่อให้ทีมเมื่อเป็นเคสที่ต้องใช้คนดูแลต่อ' },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 max-w-6xl mx-auto px-4">
      <div className="text-center mb-14 max-w-3xl mx-auto">
        <div className="eyebrow mb-4">เริ่มต้นใช้งานง่าย</div>
        <h2 className="text-3xl md:text-5xl font-black mb-4 leading-tight text-white">
          เริ่มจากสิ่งที่ร้านคุณใช้อยู่แล้ว
          <span className="block text-white/56">ไม่ต้องยกเครื่องใหม่ทั้งหมดตั้งแต่วันแรก</span>
        </h2>
        <p className="text-white/62 text-lg leading-8">
          MeowChat ถูกออกแบบมาให้เริ่มง่ายสำหรับทีมไทย ใช้กับ LINE OA เดิมได้ และค่อย ๆ เพิ่ม flow ตามงานจริงของร้านคุณ
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STEPS.map((s, i) => (
          <div key={s.num} className="relative">
            {i < STEPS.length - 1 && (
              <div className="hidden lg:block absolute top-10 left-full w-full h-px border-t border-dashed border-white/10 z-0" />
            )}
            <div className="rounded-[26px] border border-white/8 bg-white/[0.04] p-6 hover:border-brand-green/30 transition-colors relative z-10 text-center h-full card-glow">
              {/* Mascot above step number */}
              <div className="text-2xl mb-1 mascot-bob">{s.mascot}</div>
              <div className="w-11 h-11 rounded-full bg-brand-green/12 border border-brand-green/30 text-brand-green font-black text-lg flex items-center justify-center mx-auto mb-4">
                {s.num}
              </div>
              <div className="text-3xl mb-4">{s.icon}</div>
              <h3 className="font-semibold text-xl mb-3 text-white">{s.title}</h3>
              <p className="text-white/58 text-sm leading-7">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <a
          href={PRIMARY_CTA_HREF}
          onClick={() => trackCTA({ location: 'how_it_works', label: PRIMARY_CTA_LABEL, destination: PRIMARY_CTA_HREF, variant: 'primary' })}
          className="inline-flex items-center gap-2 bg-brand-green text-white font-bold text-lg px-8 py-4 rounded-2xl hover:opacity-95 transition-opacity shadow-lg shadow-brand-green/20"
        >
          {PRIMARY_CTA_LABEL}
        </a>
      </div>
    </section>
  );
}
