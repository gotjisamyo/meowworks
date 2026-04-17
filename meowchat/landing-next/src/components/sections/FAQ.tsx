'use client';
import { useState } from 'react';

export const FAQ_ITEMS = [
  { q: 'ต้องมี LINE Official Account ก่อนใช้งานไหม?', a: 'ใช่ ต้องมี LINE OA (ฟรี) ก่อน แนะนำสมัคร LINE OA Verified เพื่อให้ลูกค้าเชื่อถือมากขึ้น สมัครได้ที่ account.line.biz แล้วนำ Channel Access Token มาวางในระบบ MeowChat ได้เลย' },
  { q: 'บอทเข้าใจภาษาไทยได้ดีแค่ไหน?', a: 'เข้าใจธรรมชาติภาษาไทย คำสแลง ทับศัพท์ ได้ดีมาก ไม่ใช่แค่ keyword matching แต่เป็น AI ที่เข้าใจ context และความหมาย แม้ลูกค้าพิมพ์ผิดหรือใช้ภาษาพูดก็ยังตอบได้ถูกต้อง' },
  { q: 'ข้อมูลลูกค้าของฉันปลอดภัยไหม?', a: 'ปลอดภัยแน่นอน เราปฏิบัติตาม พ.ร.บ. PDPA อย่างเคร่งครัด ข้อมูลแต่ละร้านแยกกันสมบูรณ์ (multi-tenant isolation) ไม่มีการแชร์ข้อมูลข้ามร้านหรือกับบุคคลภายนอก' },
  { q: 'ถ้าบอทตอบผิด ฉันจะรู้ได้อย่างไร?', a: 'ระบบแจ้งเตือนเมื่อบอทตอบไม่ได้หรือตอบผิดพลาด มีฟีเจอร์ Human Handoff โอนการสนทนาให้คนตอบได้ทันที พร้อม Dashboard ที่ให้คุณดู log การสนทนาทุกข้อความย้อนหลังได้' },
  { q: 'ยกเลิก subscription ได้ไหม?', a: 'ยกเลิกได้ทุกเมื่อ ไม่มีสัญญาผูกมัด ไม่มีค่าปรับ ข้อมูลร้านและลูกค้าของคุณยังคงอยู่ครบ 30 วันหลังยกเลิก เพื่อให้คุณมีเวลา export ข้อมูลออก' },
  { q: 'รองรับหลายสาขาได้ไหม?', a: 'ได้เลย แพ็กเกจ Pro รองรับ 3 LINE OA และแพ็กเกจ Business รองรับไม่จำกัด เหมาะกับธุรกิจแฟรนไชส์หรือร้านที่มีหลายสาขา แต่ละสาขาจัดการแยกกันได้อิสระ' },
  { q: 'MeowChat ต่างจากแชทบอทธรรมดายังไง?', a: 'แชทบอทธรรมดาตอบแค่ keyword ที่ตั้งไว้ MeowChat ใช้ Large Language Model (LLM) จริงๆ ที่เข้าใจความหมายและ context ลูกค้าถามนอก script ก็ตอบได้ ปรับบุคลิก น้ำเสียง ตั้งชื่อบอทได้ ไม่ใช่แค่ Q&A ธรรมดา' },
  { q: 'ข้อความหมดก่อนสิ้นเดือน ทำยังไง?', a: 'เติมได้เลยทันที ฿99 ต่อ 500 ครั้ง ไม่ต้องรอสิ้นเดือน ถ้าข้อความหมด AI จะหยุดตอบอัตโนมัติโดยไม่แสดงข้อผิดพลาดให้ลูกค้าเห็น พร้อมส่งแจ้งเตือนให้คุณทางอีเมลและ LINE ทันที' },
  { q: 'MeowChat จะเอาข้อมูลลูกค้าฉันไปทำอะไร?', a: 'ไม่นำข้อมูลของคุณไปเป็น training data ครับ ข้อมูลของคุณเป็นของคุณเท่านั้น ใช้เพียงเพื่อให้ AI ตอบลูกค้าตามที่คุณตั้งค่าไว้' },
  { q: 'Mawsom Company คือใคร? MeowChat จะยังอยู่ไหมในระยะยาว?', a: 'Mawsom Company Limited บริษัทไทยที่ดำเนินกิจการในกรุงเทพฯ ผู้พัฒนา MeowChat เราไม่ใช่ startup ที่จะหายไปในคืนเดียว มีทีมงานดูแลระบบและ support ตลอด การสมัครใช้งานไม่มีสัญญาผูกมัด ยกเลิกได้ทุกเมื่อ' },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/5 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-sm hover:bg-white/3 transition-colors"
      >
        <span>{q}</span>
        <span className={`text-brand-orange text-lg transition-transform ${open ? 'rotate-45' : ''}`}>+</span>
      </button>
      {open && (
        <div className="px-5 pb-4 text-white/50 text-sm leading-relaxed border-t border-white/5">
          {a}
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  return (
    <section id="faq" className="py-20 bg-brand-card/30">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-14">
          <div className="inline-block bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-sm font-bold px-4 py-1.5 rounded-full mb-4">
            ❓ คำถามที่พบบ่อย
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-3">มีคำถาม? เรามีคำตอบ</h2>
          <p className="text-white/50 text-lg">ข้อสงสัยที่เจ้าของร้านถามบ่อยที่สุด</p>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item) => (
            <FAQItem key={item.q} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
