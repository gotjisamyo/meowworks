const TRUST_ITEMS = [
  {
    label: 'เหมาะกับร้านที่ใช้ LINE OA ทุกวัน',
    detail: 'เริ่มจากคำถามที่ลูกค้าถามบ่อย ออเดอร์ และการนัดหมายก่อน แล้วค่อยขยายทีหลัง',
  },
  {
    label: 'AI ช่วยรับหน้าแรก แล้วทีมรับต่อได้',
    detail: 'เมื่อเคสต้องใช้คนดูแล ระบบช่วยสรุปบริบทไว้ให้ ไม่ต้องเริ่มคุยใหม่ทั้งหมด',
  },
  {
    label: 'เริ่มง่ายสำหรับธุรกิจไทย',
    detail: 'ทดลองใช้ฟรี 14 วัน ใช้กับ LINE OA เดิมได้ และมีทีมไทยช่วยดูแนวทางเริ่มต้น',
  },
];

const PROOF_STATS = [
  { value: '24/7', label: 'ช่วยรับข้อความนอกเวลาทำการ' },
  { value: '1 แชท', label: 'คุย จอง สั่งซื้อ ใน flow เดียว' },
  { value: 'ไทย', label: 'ภาษาและ use case ที่ใกล้ธุรกิจไทย' },
];

export default function TrustStrip() {
  return (
    <section className="py-12 md:py-14 max-w-6xl mx-auto px-4">
      <div className="rounded-[30px] border border-white/8 bg-white/[0.04] p-6 md:p-8 card-glow">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-7 items-start">
          <div>
            <div className="eyebrow mb-4">ทำไมร้านถึงตัดสินใจได้ง่ายขึ้น</div>
            <h2 className="text-2xl md:text-[2rem] font-black text-white leading-tight mb-3">
              เริ่มเข้าใจได้เร็ว
              <span className="block text-white/58 mt-1">ว่า MeowChat ช่วยให้ LINE OA ของร้านทำงานเป็นระบบขึ้นอย่างไร</span>
            </h2>
            <p className="text-white/58 text-base md:text-lg leading-7 md:leading-8 max-w-2xl">
              เราออกแบบให้เจ้าของร้านเห็นตั้งแต่ช่วงต้นของหน้าเลยว่า ระบบนี้ไม่ได้มาแทนทีมทั้งหมด
              แต่ช่วยรับหน้าแรก จัดข้อมูล และทำให้ลูกค้าไม่หลุดเพราะร้านตอบช้า
            </p>
            <div className="grid gap-3 mt-6">
              {TRUST_ITEMS.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/8 bg-[#111827]/45 px-4 py-4 md:px-5 md:py-5">
                  <div className="text-base font-semibold text-white mb-1.5">{item.label}</div>
                  <p className="text-sm md:text-base text-white/60 leading-6 md:leading-7">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-3 lg:grid-cols-1 gap-3">
            {PROOF_STATS.map((item) => (
              <div key={item.value + item.label} className="rounded-2xl border border-white/8 bg-[#0f1728] px-5 py-5 md:px-6 md:py-6">
                <div className="text-3xl md:text-4xl font-black text-white mb-2">{item.value}</div>
                <p className="text-sm md:text-base text-white/58 leading-6 md:leading-7">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
