'use client';
import { useState } from 'react';

export const FAQ_ITEMS = [
  {
    q: 'ต้องมี LINE Official Account ก่อนใช้งานไหม?',
    a: 'ใช่ค่ะ หากต้องการใช้งาน MeowChat บน LINE คุณควรมี LINE OA ของธุรกิจอยู่แล้ว จากนั้นจึงเชื่อมต่อเข้ากับระบบเพื่อเริ่มตั้งค่างานตอบลูกค้าได้',
  },
  {
    q: 'บอทตอบภาษาไทยได้แค่ไหน?',
    a: 'MeowChat ออกแบบมาสำหรับการตอบลูกค้าภาษาไทยและช่วยจัดการคำถามที่พบบ่อยได้ดีขึ้น แต่ธุรกิจควรทดสอบข้อความจริงของตนและตั้งค่าการส่งต่อให้ทีมในเคสที่สำคัญหรือซับซ้อน',
  },
  {
    q: 'ข้อมูลลูกค้าปลอดภัยไหม?',
    a: 'เราออกแบบระบบให้มีมาตรการด้านความปลอดภัยและมีเอกสารประกอบการใช้งานที่เกี่ยวข้อง อย่างไรก็ตามธุรกิจควรประเมินประเภทข้อมูลของตนและให้ทีมตรวจสอบเองในกรณีที่ข้อมูลมีความอ่อนไหวสูง',
  },
  {
    q: 'ถ้าบอทตอบไม่ได้หรือควรให้คนตอบต่อ ทำยังไง?',
    a: 'MeowChat รองรับการส่งต่อให้แอดมินหรือทีมงานเมื่อจำเป็น เพื่อให้ธุรกิจคุมคุณภาพการตอบในเคสที่สำคัญได้',
  },
  {
    q: 'ทดลองใช้ฟรียังไง?',
    a: 'คุณสามารถเริ่มทดลองใช้งานฟรี 14 วันได้โดยไม่ต้องใช้บัตรเครดิต จากนั้นจึงค่อยเลือกแพ็กเกจที่เหมาะกับธุรกิจของคุณ',
  },
  {
    q: 'ธุรกิจหลายสาขาหรือหลายทีมใช้ได้ไหม?',
    a: 'ได้ค่ะ แต่ควรคุยกับทีมก่อนเริ่มใช้งาน เพื่อประเมินรูปแบบงาน สิทธิ์ผู้ใช้ และความต้องการด้านหลายสาขาหรือหลายบัญชี LINE OA',
  },
  {
    q: 'ข้อมูลของร้านฉันจะถูกนำไปใช้ยังไง?',
    a: 'ข้อมูลถูกใช้เพื่อให้บริการตามรูปแบบการใช้งานที่ธุรกิจของคุณตั้งค่า และเพื่อการดูแลระบบในขอบเขตที่เกี่ยวข้อง โดยรายละเอียดอ้างอิงตามเอกสารของบริการ',
  },
  {
    q: 'เหมาะกับคลินิก ร้านขายยา หรือธุรกิจเฉพาะทางไหม?',
    a: 'ใช้ได้ในบางกรณี เช่น การตอบคำถามเบื้องต้น การนัดหมาย หรือการคัดกรองก่อนส่งต่อ แต่สำหรับข้อมูลหรือคำแนะนำเฉพาะทางควรให้ทีมตรวจสอบทุกครั้ง',
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass-panel rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left font-semibold text-base hover:bg-white/[0.03] transition-colors"
      >
        <span className="text-white/88">{q}</span>
        <span className={`text-brand-orange text-lg transition-transform ${open ? 'rotate-45' : ''}`}>+</span>
      </button>
      {open && (
        <div className="px-6 pb-5 text-white/60 text-sm leading-7 border-t border-white/6">
          {a}
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  return (
    <section id="faq" className="py-24 section-shell">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-14 max-w-3xl mx-auto">
          <div className="eyebrow mb-4">FAQ</div>
          <h2 className="text-3xl md:text-5xl font-black mb-4 leading-tight">มีคำถามก่อนเริ่มใช้งาน?</h2>
          <p className="text-white/58 text-lg leading-8">สรุปคำถามที่ธุรกิจมักถามก่อนเชื่อม LINE OA เข้ากับ MeowChat เพื่อให้ตัดสินใจได้ง่ายขึ้นและตรงกับการใช้งานจริง</p>
        </div>

        <div className="space-y-4">
          {FAQ_ITEMS.map((item) => (
            <FAQItem key={item.q} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
