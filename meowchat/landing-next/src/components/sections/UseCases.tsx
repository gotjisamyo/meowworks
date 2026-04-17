const USE_CASES = [
  { emoji: '🍱', name: 'ร้านอาหาร', desc: 'รับออเดอร์, เมนูวันนี้, สถานะจัดส่ง', slug: '/line-bot-restaurant' },
  { emoji: '👗', name: 'แฟชั่น / ออนไลน์', desc: 'ถามไซส์, เช็คสต็อก, ปิดการขาย', slug: '/line-bot-clothing' },
  { emoji: '💆', name: 'สปา / ความงาม', desc: 'จองนัด, แนะนำแพ็กเกจ, ยืนยันนัด', slug: '/line-bot-beauty' },
  { emoji: '🏥', name: 'คลินิก', desc: 'นัดหมอ, เช็คคิว, แจ้งผลตรวจ', slug: '/line-bot-clinic' },
  { emoji: '🔧', name: 'ช่าง / บริการ', desc: 'นัดซ่อม, ประเมินราคา, โอนให้ช่าง', slug: '/line-bot-car-service' },
  { emoji: '🏠', name: 'อสังหา / เช่า', desc: 'ถามห้องว่าง, นัดดูห้อง, ส่งรายละเอียด', slug: '/line-bot-realestate' },
  { emoji: '🎓', name: 'สอนพิเศษ', desc: 'สมัครเรียน, จองคลาส, แจ้งเตือนก่อนเรียน', slug: '/line-bot-tutor' },
  { emoji: '🏨', name: 'โรงแรม / ที่พัก', desc: 'เช็คห้องว่าง, จองออนไลน์, check-in', slug: '/line-bot-hotel' },
  { emoji: '☕', name: 'คาเฟ่', desc: 'รับออเดอร์ล่วงหน้า, เมนู, โปรโมชั่น', slug: '/line-bot-cafe' },
  { emoji: '🐾', name: 'ร้านสัตว์เลี้ยง', desc: 'นัดตัดขน, สินค้าสัตว์, คำปรึกษา', slug: '/line-bot-pet' },
  { emoji: '🧺', name: 'ร้านซักรีด', desc: 'รับผ้า, แจ้งสถานะ, ส่งคืน', slug: '/line-bot-laundry' },
  { emoji: '✈️', name: 'ท่องเที่ยว', desc: 'จองทัวร์, ถามโปรแกรม, ราคา', slug: '/line-bot-travel' },
];

export default function UseCases() {
  return (
    <section id="usecases" className="py-20 bg-brand-card/30">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-14">
          <div className="inline-block bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-sm font-bold px-4 py-1.5 rounded-full mb-4">
            🏪 ธุรกิจที่ใช้ได้
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-3">ใช้ได้กับธุรกิจทุกประเภท</h2>
          <p className="text-white/50 text-lg">ไม่ว่าจะขายของ ทำอาหาร หรือให้บริการ MeowChat ช่วยได้ทั้งนั้น</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {USE_CASES.map((uc) => (
            <a
              key={uc.name}
              href={uc.slug}
              className="bg-brand-card rounded-2xl p-4 border border-white/5 hover:border-brand-orange/30 hover:bg-brand-orange/5 transition-all text-center group"
            >
              <div className="text-3xl mb-2">{uc.emoji}</div>
              <div className="font-bold text-sm mb-1 group-hover:text-brand-orange transition-colors">{uc.name}</div>
              <p className="text-white/40 text-xs leading-snug">{uc.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
