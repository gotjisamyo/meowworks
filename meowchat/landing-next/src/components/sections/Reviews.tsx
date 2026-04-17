const REVIEWS = [
  {
    stars: 5,
    text: '"ก่อนใช้ MeowChat ต้องนั่งตอบแชทเองทั้งวัน ตอนนี้ bot จัดการได้หมดเลย ยอดขายเพิ่มขึ้น 40% ในเดือนแรก!"',
    avatar: '🌸',
    name: 'คุณนิด',
    role: 'ร้านเสื้อผ้าออนไลน์ @NidFashion',
  },
  {
    stars: 5,
    text: '"ตั้งค่าง่ายมาก ไม่ต้องรู้ code เลย แค่ 30 นาทีก็ใช้งานได้ ลูกค้าได้รับการตอบเร็วขึ้น ไม่มีตกหล่น"',
    avatar: '🍜',
    name: 'คุณปอนด์',
    role: 'ร้านอาหารเดลิเวอรี่ PondKitchen',
  },
  {
    stars: 5,
    text: '"ประทับใจมากที่ bot เข้าใจภาษาไทยปกติ ลูกค้าพิมพ์ผิดยังเข้าใจ support ทีมตอบไวมาก คุ้มค่ามากครับ"',
    avatar: '📦',
    name: 'คุณไก่',
    role: 'ร้านของชำออนไลน์ KaiShop',
  },
  {
    stars: 4,
    text: '"ช่วยลดเวลาตอบแชทได้จริง จาก 6 ชม./วัน เหลือแค่ตรวจสอบ 30 นาที ทำให้มีเวลาไปพัฒนาธุรกิจมากขึ้น"',
    avatar: '💄',
    name: 'คุณแนน',
    role: 'ร้านเครื่องสำอาง NanBeauty',
  },
];

export default function Reviews() {
  return (
    <section id="reviews" className="py-20 max-w-6xl mx-auto px-4">
      <div className="text-center mb-14">
        <div className="inline-block bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-sm font-bold px-4 py-1.5 rounded-full mb-4">
          ⭐ รีวิวจากลูกค้า
        </div>
        <h2 className="text-3xl md:text-4xl font-black mb-3">ร้านค้าเขาพูดถึงเราว่าไง</h2>
        <p className="text-white/50 text-lg">จากร้านค้าที่ใช้งานจริงทั่วไทย</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {REVIEWS.map((r) => (
          <div
            key={r.name}
            className="bg-brand-card rounded-2xl p-6 border border-white/5 hover:border-brand-orange/20 transition-colors"
          >
            <div className="text-brand-orange text-lg mb-3">
              {'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-4">{r.text}</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-orange/10 rounded-full flex items-center justify-center text-xl">
                {r.avatar}
              </div>
              <div>
                <div className="font-bold text-sm">{r.name}</div>
                <div className="text-white/40 text-xs">{r.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center text-white/40 text-sm">
        คะแนนเฉลี่ย <strong className="text-brand-orange text-base">4.9/5</strong> ⭐ จากผู้ใช้งานจริง
      </div>
    </section>
  );
}
