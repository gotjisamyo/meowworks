const PLANS = [
  {
    icon: '🐱',
    name: 'ทดลองใช้',
    hint: 'ไม่ต้องใส่บัตร ไม่มีค่าใช้จ่าย',
    price: 'ฟรี',
    period: '14 วัน',
    features: [
      'บอทตอบอัตโนมัติทันที',
      'ข้อความไม่จำกัดในช่วง trial',
      'LINE OA 1 บัญชี',
      'Knowledge Base + Dashboard',
      'ช่วย setup ผ่าน LINE ฟรี',
    ],
    cta: 'เริ่มทดลองใช้ฟรี →',
    ctaHref: 'https://my.meowchat.store/onboarding',
    popular: false,
  },
  {
    icon: '🚀',
    name: 'Starter',
    hint: 'สำหรับร้านที่รับแชทจริงจัง',
    price: '490',
    period: '/เดือน',
    features: [
      '3,000 ข้อความ/เดือน (~100 ครั้ง/วัน)',
      'AI Auto Reply ภาษาไทย ปรับบุคลิกได้',
      'LINE OA 1 บัญชี (เพิ่ม +฿500/OA)',
      'เติมข้อความเพิ่ม ฿99 ต่อ 500 ครั้ง',
      'Dashboard + Human Handoff + Analytics',
      'LINE Notify แจ้งเตือนทันที',
      'ช่วยตั้งค่าผ่านกลุ่ม LINE ฟรี',
    ],
    cta: 'ทดลองใช้ฟรี 14 วัน →',
    ctaHref: 'https://my.meowchat.store/onboarding',
    popular: true,
  },
  {
    icon: '⚡',
    name: 'Pro',
    hint: 'สำหรับธุรกิจที่เติบโตเร็ว',
    price: '990',
    period: '/เดือน',
    features: [
      '10,000 ข้อความ/เดือน (~330/วัน)',
      'LINE OA 3 บัญชี (เพิ่มได้ +฿500/OA)',
      'Analytics ครบครัน',
      'Priority Support',
      'Broadcast ไม่จำกัด',
    ],
    cta: 'ทดลองใช้ฟรี 14 วัน →',
    ctaHref: 'https://my.meowchat.store/onboarding',
    popular: false,
  },
  {
    icon: '👑',
    name: 'Business',
    hint: 'สำหรับองค์กรและแฟรนไชส์',
    price: '2,490',
    period: '/เดือน',
    features: [
      'ข้อความ fair-use ไม่จำกัด (≤50,000/เดือน)',
      'LINE OA ไม่จำกัดบัญชี',
      'Messenger + Instagram DM (เร็วๆนี้)',
      'Multi-branch หลายสาขา',
      'API Integration + Webhook',
      'ทีม Support ส่วนตัว 24/7',
      'ช่วยตั้งค่าและ onboard ครบถ้วน',
    ],
    cta: 'ติดต่อฝ่ายขาย',
    ctaHref: 'https://line.me/ti/p/@960xboyt',
    popular: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-brand-card/30">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-14">
          <div className="inline-block bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-sm font-bold px-4 py-1.5 rounded-full mb-4">
            💕 ราคา
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-3">ทดลองใช้ฟรี 14 วัน</h2>
          <p className="text-white/50 text-lg">
            ไม่ต้องใส่บัตร ไม่ต้องผูก — บอทพร้อมทำงานทันที
          </p>
          <p className="text-white/30 text-sm mt-2">
            1 ข้อความ = AI ตอบ 1 ครั้ง · ไม่นับข้อความที่คนตอบเอง · ทุกแพ็กเกจมี AI Auto Reply
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-brand-card rounded-2xl p-6 border flex flex-col ${
                plan.popular
                  ? 'border-brand-orange shadow-lg shadow-brand-orange/10'
                  : 'border-white/5'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-orange text-white text-xs font-black px-4 py-1 rounded-full">
                  🐾 ยอดนิยม
                </div>
              )}
              <div className="text-4xl mb-3">{plan.icon}</div>
              <div className="font-black text-xl mb-1">{plan.name}</div>
              <div className="text-white/40 text-sm mb-4">{plan.hint}</div>
              <div className="mb-5">
                {plan.price === 'ฟรี' ? (
                  <span className="text-3xl font-black text-brand-orange">{plan.price}</span>
                ) : (
                  <>
                    <span className="text-white/50 text-sm">฿</span>
                    <span className="text-3xl font-black">{plan.price}</span>
                    <span className="text-white/50 text-sm">{plan.period}</span>
                  </>
                )}
                {plan.price === 'ฟรี' && (
                  <span className="text-white/50 text-sm"> {plan.period}</span>
                )}
              </div>
              <ul className="flex-1 space-y-2 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="text-sm text-white/60 flex gap-2">
                    <span className="text-brand-orange mt-0.5 shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href={plan.ctaHref}
                className={`block text-center font-bold py-3 rounded-xl transition-opacity hover:opacity-90 ${
                  plan.popular
                    ? 'bg-brand-orange text-white'
                    : 'border border-white/20 text-white hover:border-white/40'
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        {/* Add-ons note */}
        <div className="mt-6 bg-brand-card rounded-2xl border border-white/5 p-5 max-w-2xl mx-auto text-center text-sm text-white/50 leading-relaxed">
          📊 <strong className="text-white/70">ข้อความหมดก่อนสิ้นเดือน?</strong> เติมได้เลย ฿99 ต่อ 500 ครั้ง ไม่ต้องรอรอบบิล<br />
          🏪 <strong className="text-white/70">ดูแลหลาย LINE OA?</strong> เพิ่ม OA ได้ทุกแพ็กเกจ ในราคา ฿500 ต่อบัญชี/เดือน
        </div>

        {/* Payment + PDPA */}
        <div className="mt-4 text-center text-sm text-white/30">
          รับชำระผ่าน &nbsp;
          <span className="bg-white/5 px-3 py-1 rounded-full mx-1">💸 PromptPay</span>
          <span className="bg-white/5 px-3 py-1 rounded-full mx-1">💳 บัตรเครดิต/เดบิต</span>
          <span className="bg-white/5 px-3 py-1 rounded-full mx-1">🏦 โอนธนาคาร</span>
          <span className="block mt-2">🔒 ปลอดภัย 100% by Omise · ปฏิบัติตาม PDPA · ข้อมูลไม่นำไป training</span>
        </div>
      </div>
    </section>
  );
}
