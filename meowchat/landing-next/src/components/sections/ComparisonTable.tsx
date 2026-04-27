const ROWS = [
  {
    feature: 'ราคาเริ่มต้น',
    meow: '฿490/เดือน',
    zwiz: 'ดูราคา →',
    zwizHref: 'https://zwiz.ai',
    botnoi: 'ดูราคา →',
    botnoiHref: 'https://botnoi.ai',
    line: 'ฟรี (จำกัด)',
    highlight: true,
  },
  { feature: 'ภาษาไทย native', meow: '✅', zwiz: '✅', botnoi: '✅', line: '❌' },
  { feature: 'รับออเดอร์ + จองคิว', meow: '✅', zwiz: 'บางแพ็กเกจ', botnoi: '❌', line: '❌' },
  { feature: 'ส่งต่อทีมพร้อม context', meow: '✅', zwiz: '❌', botnoi: '❌', line: '❌' },
  { feature: 'ใช้ LINE OA เดิมได้เลย', meow: '✅', zwiz: '✅', botnoi: '✅', line: '✅' },
  { feature: 'ทดลองใช้ฟรี', meow: '14 วัน', zwiz: '7 วัน', botnoi: 'ไม่มี', line: 'ตลอด (จำกัด)' },
];

const COMPETITORS = ['MeowChat', 'ZWIZ.AI', 'Botnoi', 'LINE OA Free'];

export default function ComparisonTable() {
  return (
    <section id="comparison" className="py-24 max-w-5xl mx-auto px-4">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="eyebrow mb-4">เปรียบเทียบระบบ</div>
        <h2 className="text-3xl md:text-5xl font-black leading-tight mb-4 text-white">
          ทำไมร้านค้าไทยเลือก MeowChat
          <span className="block text-gradient-orange mt-1">มากกว่าตัวเลือกอื่น</span>
        </h2>
        <p className="text-white/58 text-lg leading-8">
          ระบบตอบแชทอัตโนมัติ LINE OA ที่ราคาเข้าถึงได้ พร้อมฟีเจอร์ที่ธุรกิจไทยต้องการจริง
        </p>
      </div>

      <div className="rounded-[28px] border border-white/8 overflow-hidden card-glow">
        {/* Header row */}
        <div className="grid grid-cols-5 bg-white/[0.06] border-b border-white/8">
          <div className="p-4 text-xs font-bold text-white/40 uppercase tracking-wider">ฟีเจอร์</div>
          {COMPETITORS.map((name, i) => (
            <div
              key={name}
              className={`p-4 text-center text-sm font-black ${
                i === 0 ? 'text-brand-mascot bg-brand-mascot/8 border-x border-brand-mascot/20' : 'text-white/70'
              }`}
            >
              {i === 0 && <span className="mr-1">🐱</span>}
              {name}
            </div>
          ))}
        </div>

        {/* Data rows */}
        {ROWS.map((row, ri) => (
          <div
            key={row.feature}
            className={`grid grid-cols-5 border-b border-white/6 last:border-0 ${
              ri % 2 === 0 ? 'bg-white/[0.02]' : ''
            }`}
          >
            <div className="p-4 text-sm text-white/60">{row.feature}</div>

            {/* MeowChat column — highlighted */}
            <div className="p-4 text-center text-sm font-bold text-brand-green bg-brand-mascot/[0.04] border-x border-brand-mascot/20">
              {row.meow}
            </div>

            {/* ZWIZ.AI */}
            <div className="p-4 text-center text-sm text-white/55">
              {'zwizHref' in row ? (
                <a href={row.zwizHref} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white/70 transition-colors text-xs underline underline-offset-2">
                  {row.zwiz}
                </a>
              ) : row.zwiz}
            </div>

            {/* Botnoi */}
            <div className="p-4 text-center text-sm text-white/55">
              {'botnoiHref' in row ? (
                <a href={row.botnoiHref} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white/70 transition-colors text-xs underline underline-offset-2">
                  {row.botnoi}
                </a>
              ) : row.botnoi}
            </div>

            {/* LINE OA Free */}
            <div className="p-4 text-center text-sm text-white/55">{row.line}</div>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-white/28 mt-4">
        ข้อมูลคู่แข่งอ้างอิงจากข้อมูลสาธารณะ กรุณาตรวจสอบที่เว็บไซต์ของแต่ละบริการสำหรับราคาล่าสุด
      </p>
    </section>
  );
}
