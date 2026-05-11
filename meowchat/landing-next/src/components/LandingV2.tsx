import { useState, useEffect, useRef } from 'react'
import { trackCTA } from '../lib/analytics'
import { PRIMARY_CTA_HREF } from '../lib/site'
import SiteNav from './SiteNav'

type UseCase = 'food' | 'shop' | 'beauty' | 'clinic'
type DashView = 'main' | 'analytics'

interface ChatMsg {
  t: 'u' | 'b' | 'typ' | 'order'
  tx?: string
  ts?: string
  dur?: number
}

const CHAT_MSGS: ChatMsg[] = [
  { t: 'u', tx: 'สวัสดีค่ะ ขอสั่งข้าวผัดกระเพราไก่ 2 จานได้เลยไหมคะ?', ts: '21:42' },
  { t: 'typ', dur: 700 },
  { t: 'b', tx: 'สวัสดีค่ะ! 🐱 ขอบคุณที่ทักมานะคะ\n\nข้าวผัดกระเพราไก่ไข่ดาว 2 จาน รวม 178 บาทค่ะ\n\nจะทานเผ็ดน้อย เผ็ดปกติ หรือไม่เผ็ดคะ?', ts: '21:42' },
  { t: 'u', tx: 'ไม่เผ็ดนะคะ ขอบคุณค่ะ', ts: '21:43' },
  { t: 'typ', dur: 500 },
  { t: 'order', ts: '21:43' },
  { t: 'u', tx: 'ยืนยันค่ะ', ts: '21:43' },
  { t: 'b', tx: '✅ รับออเดอร์แล้วนะคะ! รอประมาณ 20 นาทีค่ะ จะแจ้งทันทีที่อาหารพร้อม 🍜', ts: '21:43' },
]

const PROOF_DATA = [
  { ico: '👩', name: 'ร้านข้าวแม่สมใจ', q: '"ออเดอร์ไม่ตกเลยสักครั้ง"' },
  { ico: '💇', name: 'ร้านทำผม Style by Amp', q: '"จองคิวเพิ่มขึ้น 40% ทันที"' },
  { ico: '🛍️', name: 'ร้าน PrettyCloset', q: '"ลูกค้าไม่หลุดแม้สั่งตอนดึก"' },
  { ico: '🏥', name: 'คลินิกผิวพรรณ Skinova', q: '"No-show ลดลง 80%"' },
  { ico: '🍜', name: 'ร้านบะหมี่เจ้าดัง', q: '"ตอบแทนได้แม้ตอนยุ่ง"' },
  { ico: '🌺', name: 'ร้านดอกไม้ Blossom', q: '"เปิดรับออเดอร์ได้ตลอดคืน"' },
]

function makeDots(parent: HTMLElement) {
  for (let i = 0; i < 3; i++) {
    const d = document.createElement('div')
    d.className = 'td'
    parent.appendChild(d)
  }
}

function makeOrderPill(ts: string): HTMLElement {
  const wrap = document.createElement('div')
  wrap.className = 'cm b chat-anim'

  const pill = document.createElement('div')
  pill.className = 'order-pill'

  const title = document.createElement('div')
  title.className = 'op-title'
  title.textContent = '📋 ยืนยันออเดอร์'
  pill.appendChild(title)

  const row1 = document.createElement('div')
  row1.className = 'op-row'
  const s1 = document.createElement('span')
  s1.textContent = 'ข้าวผัดกระเพราไก่ไข่ดาว ×2'
  const s2 = document.createElement('span')
  s2.textContent = '฿178'
  row1.appendChild(s1); row1.appendChild(s2)
  pill.appendChild(row1)

  const row2 = document.createElement('div')
  row2.className = 'op-row'
  row2.style.fontSize = '0.72rem'
  row2.style.color = '#888'
  const s3 = document.createElement('span')
  s3.textContent = 'ไม่เผ็ด'
  row2.appendChild(s3)
  pill.appendChild(row2)

  const total = document.createElement('div')
  total.className = 'op-total'
  const t1 = document.createElement('span')
  t1.textContent = 'รวมทั้งหมด'
  const t2 = document.createElement('span')
  t2.textContent = '฿178'
  t2.style.color = '#06a246'
  total.appendChild(t1); total.appendChild(t2)
  pill.appendChild(total)

  const btn = document.createElement('div')
  btn.className = 'op-confirm'
  btn.textContent = 'ยืนยันออเดอร์นี้'
  pill.appendChild(btn)

  wrap.appendChild(pill)
  const mt = document.createElement('div')
  mt.className = 'mt'
  mt.textContent = ts ?? ''
  wrap.appendChild(mt)
  return wrap
}

function makeBubble(m: ChatMsg): HTMLElement {
  const w = document.createElement('div')
  w.className = `cm ${m.t} chat-anim`
  const bubble = document.createElement('div')
  bubble.className = 'cb'
  const lines = (m.tx ?? '').split('\n')
  lines.forEach((line, i) => {
    bubble.appendChild(document.createTextNode(line))
    if (i < lines.length - 1) bubble.appendChild(document.createElement('br'))
  })
  const mt = document.createElement('div')
  mt.className = 'mt'
  mt.textContent = m.ts ?? ''
  w.appendChild(bubble); w.appendChild(mt)
  return w
}

function MeowLogo({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" fill="none">
      <rect width="30" height="30" rx="8" fill="#059669" />
      <path d="M7 12 L7 6.5 L12.5 12" fill="white" opacity="0.92" />
      <path d="M23 12 L23 6.5 L17.5 12" fill="white" opacity="0.92" />
      <ellipse cx="15" cy="17" rx="7.5" ry="6.5" fill="white" opacity="0.96" />
      <ellipse cx="12.3" cy="16.2" rx="1.4" ry="1.4" fill="#0F172A" />
      <ellipse cx="17.7" cy="16.2" rx="1.4" ry="1.4" fill="#0F172A" />
      <ellipse cx="15" cy="18.5" rx="0.9" ry="0.65" fill="#059669" />
    </svg>
  )
}

export default function LandingV2() {
  const [activeTab, setActiveTab] = useState<UseCase>('food')
  const [dashView, setDashView] = useState<DashView>('main')
  const [annualBilling, setAnnualBilling] = useState(false)
  const chatBodyRef = useRef<HTMLDivElement>(null)
  const [pastHero, setPastHero] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target) } }),
      { threshold: 0.10 }
    )
    document.querySelectorAll('.lv2-wrap .fade-up').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const check = () => {
      const hero = document.getElementById('hero')
      if (!hero) return
      setPastHero(hero.getBoundingClientRect().bottom < 0)
    }
    check()
    window.addEventListener('scroll', check, { passive: true })
    return () => window.removeEventListener('scroll', check)
  }, [])

  useEffect(() => {
    const chatBody = chatBodyRef.current
    if (!chatBody) return
    let ci = 0
    let tid: ReturnType<typeof setTimeout>

    function addMsg(m: ChatMsg): HTMLElement | null {
      if (!chatBody) return null
      if (m.t === 'typ') {
        const el = document.createElement('div')
        el.className = 'typing'
        makeDots(el)
        chatBody.appendChild(el); chatBody.scrollTop = 9999
        return el
      }
      if (m.t === 'order') {
        const el = makeOrderPill(m.ts ?? '')
        chatBody.appendChild(el); setTimeout(() => el.classList.add('in'), 40); chatBody.scrollTop = 9999
        return el
      }
      const w = makeBubble(m)
      chatBody.appendChild(w); setTimeout(() => w.classList.add('in'), 40); chatBody.scrollTop = 9999
      return w
    }

    function next() {
      if (!chatBody) return
      if (ci >= CHAT_MSGS.length) {
        tid = setTimeout(() => { if (chatBody) chatBody.textContent = ''; ci = 0; tid = setTimeout(next, 600) }, 4500)
        return
      }
      const m = CHAT_MSGS[ci]
      if (m.t === 'typ') {
        const el = addMsg(m); ci++
        tid = setTimeout(() => { el?.remove(); next() }, m.dur ?? 500)
      } else {
        addMsg(m); ci++
        tid = setTimeout(next, m.t === 'order' ? 1900 : m.t === 'u' ? 950 : 1500)
      }
    }
    tid = setTimeout(next, 700)
    return () => clearTimeout(tid)
  }, [])

  const sbStyle = (active?: boolean): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', gap: '7px',
    padding: '5px 12px', borderRadius: '6px', margin: '1px 6px',
    cursor: 'pointer', fontSize: '0.72rem',
    fontWeight: active ? 700 : 500,
    color: active ? '#059669' : '#64748B',
    background: active ? 'rgba(5,150,105,0.10)' : undefined,
    borderRight: active ? '2px solid #059669' : '2px solid transparent',
  })

  const dashBtnStyle = (active: boolean): React.CSSProperties => ({
    padding: '0.45rem 1.1rem', borderRadius: '100px',
    border: `1px solid ${active ? '#059669' : '#E2E8F0'}`,
    background: active ? '#059669' : 'transparent',
    color: active ? '#fff' : '#888',
    fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
    fontFamily: "'Sarabun', sans-serif", transition: 'all 0.2s',
  })

  return (
    <div className="lv2-wrap">

      <SiteNav />

      <section id="hero">
        <div className="hero-glow" />
        <div className="hero-inner">
          <div>
            <div className="hero-tag"><span className="hero-tag-dot" />AI ผู้ช่วยธุรกิจบน LINE OA สำหรับ SME ไทย</div>
            <h1 className="hero-h1">
              ลูกค้าทักตอนไหน<br />
              <span style={{ display: 'block', marginTop: '0.35em' }}><em>ก็ตอบได้ทันที</em></span>
              <span className="dim">แม้คุณไม่อยู่หน้าจอ</span>
            </h1>
            <p className="hero-sub">MeowChat ช่วยตอบแชท รับออเดอร์ และจองคิวแทนคุณบน LINE OA เดิม — ไม่ต้องเปลี่ยนระบบ ไม่ต้องจ้างคนเพิ่ม</p>
            <div className="hero-actions">
              <a className="btn-p" href={PRIMARY_CTA_HREF} onClick={() => trackCTA({ location: 'hero', label: 'เริ่มใช้ฟรี 14 วัน', destination: PRIMARY_CTA_HREF, variant: 'primary' })}>เริ่มใช้ฟรี 14 วัน →</a>
              <a className="btn-s" href="#how" onClick={() => trackCTA({ location: 'hero', label: 'ดูวิธีทำงาน', destination: '#how', variant: 'secondary' })}>ดูวิธีทำงาน</a>
            </div>
            <div style={{ marginTop: '0.6rem', fontSize: '0.82rem', color: 'rgba(0,0,0,0.42)' }}>
              เริ่มต้นเพียง <strong style={{ color: '#059669' }}>฿490/เดือน</strong> · ทดลองฟรี 14 วัน · ยกเลิกได้ทุกเมื่อ
            </div>
            <div className="trust-row">
              <div className="trust-chip"><span className="ok">✓</span>ไม่ต้องใช้บัตรเครดิต</div>
              <div className="trust-chip"><span className="ok">✓</span>ใช้กับ LINE OA เดิมได้เลย</div>
              <div className="trust-chip"><span className="ok">✓</span>ทีมไทยช่วยตั้งค่าให้</div>
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '1.25rem', flexWrap: 'wrap', alignItems: 'center', padding: '0.75rem 1rem', background: 'rgba(5,150,105,0.06)', borderRadius: '12px', border: '1px solid rgba(5,150,105,0.12)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <strong style={{ fontSize: '1.15rem', color: '#059669', fontWeight: 800, lineHeight: 1.1 }}>2,400+</strong>
                <span style={{ fontSize: '0.72rem', color: 'rgba(0,0,0,0.45)', marginTop: '2px' }}>ร้านค้าไทย</span>
              </div>
              <span style={{ color: 'rgba(0,0,0,0.15)', fontSize: '1.2rem' }}>|</span>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <strong style={{ fontSize: '1.15rem', color: '#059669', fontWeight: 800, lineHeight: 1.1 }}>98%</strong>
                <span style={{ fontSize: '0.72rem', color: 'rgba(0,0,0,0.45)', marginTop: '2px' }}>พึงพอใจ</span>
              </div>
              <span style={{ color: 'rgba(0,0,0,0.15)', fontSize: '1.2rem' }}>|</span>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <strong style={{ fontSize: '1.15rem', color: '#059669', fontWeight: 800, lineHeight: 1.1 }}>4.5ล้าน+</strong>
                <span style={{ fontSize: '0.72rem', color: 'rgba(0,0,0,0.45)', marginTop: '2px' }}>ข้อความ/เดือน</span>
              </div>
            </div>
          </div>
          <div className="chat-wrap">
            <div className="chat-frame">
              <div className="chat-bar">
                <div className="chat-ava">🐱</div>
                <div className="chat-info">
                  <div className="chat-n">MeowChat — ร้านข้าวแม่สมใจ</div>
                  <div className="chat-s">● ออนไลน์ตลอด 24 ชั่วโมง</div>
                </div>
              </div>
              <div className="chat-body" ref={chatBodyRef} />
            </div>
            <div className="chat-badge">
              <div className="badge-icon-wrap">⚡</div>
              <div className="badge-text">
                <strong>ตอบภายใน 3 วินาที</strong>
                <span>ไม่มีลูกค้าหลุดเพราะรอนานอีกต่อไป</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="dashboard" style={{ padding: '5.5rem 2rem 6rem', background: 'var(--bg2)', borderBottom: '1px solid var(--border)', overflow: 'hidden' }}>
        <div className="container">
          <div className="fade-up" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
            <div className="eyebrow" style={{ justifyContent: 'center' }}>หน้าหลังบ้านของ MeowChat</div>
            <h2 className="headline">ดูทุกอย่างได้<em>ในที่เดียว</em><br />ไม่ต้องนั่งเฝ้าแชท</h2>
            <p className="sub">ภาพรวมออเดอร์ ยอดขาย และการสนทนา — อัปเดต real-time ดูได้ทุกที่</p>
          </div>
          <div className="fade-up" style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <button onClick={() => setDashView('main')} style={dashBtnStyle(dashView === 'main')}>Dashboard</button>
            <button onClick={() => setDashView('analytics')} style={dashBtnStyle(dashView === 'analytics')}>Analytics</button>
          </div>
          <div className="fade-up" style={{ maxWidth: '1040px', margin: '0 auto', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.06)' }}>
            <div style={{ background: '#FFFFFF', padding: '9px 16px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#FF5F57' }} />
                <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#FFBD2E' }} />
                <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#28C840' }} />
              </div>
              <div style={{ flex: 1, background: '#F1F5F9', borderRadius: '6px', padding: '4px 14px', fontSize: '0.72rem', color: '#94A3B8', textAlign: 'center', maxWidth: '300px', margin: '0 auto' }}>my.meowchat.store/dashboard</div>
            </div>
            <div className="dash-grid">
              <div style={{ background: '#F8FAFC', borderRight: '1px solid #F8FAFC', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '14px 14px 12px', borderBottom: '1px solid #F8FAFC' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <svg width="22" height="22" viewBox="0 0 30 30" fill="none">
                      <rect width="30" height="30" rx="7" fill="#059669" /><path d="M7 12 L7 6.5 L12.5 12" fill="white" opacity="0.9" /><path d="M23 12 L23 6.5 L17.5 12" fill="white" opacity="0.9" /><ellipse cx="15" cy="17" rx="7.5" ry="6.5" fill="white" opacity="0.95" /><ellipse cx="12.3" cy="16.2" rx="1.4" ry="1.4" fill="#0F172A" /><ellipse cx="17.7" cy="16.2" rx="1.4" ry="1.4" fill="#0F172A" />
                    </svg>
                    <div><div style={{ fontWeight: 800, fontSize: '0.8rem', color: '#fff', lineHeight: 1 }}>MeowChat</div><div style={{ fontSize: '0.58rem', color: '#059669', fontWeight: 700, letterSpacing: '0.08em' }}>MERCHANT</div></div>
                  </div>
                </div>
                <div style={{ padding: '10px 0', flex: 1 }}>
                  <div style={{ padding: '0 10px', marginBottom: '4px' }}><span style={{ fontSize: '0.6rem', color: '#CBD5E1', fontWeight: 700, letterSpacing: '0.1em' }}>หลัก</span></div>
                  {[{ icon: '⊞', label: 'Dashboard' }, { icon: '📺', label: 'ตั้งค่าบอท' }, { icon: '📖', label: 'Knowledge Base' }].map(item => (
                    <div key={item.label} style={sbStyle()}><span style={{ fontSize: '0.8rem', opacity: 0.5 }}>{item.icon}</span>{item.label}</div>
                  ))}
                  <div style={{ padding: '0 10px', margin: '10px 0 4px' }}><span style={{ fontSize: '0.6rem', color: '#CBD5E1', fontWeight: 700, letterSpacing: '0.1em' }}>การขาย</span></div>
                  {[{ icon: '📦', label: 'รายการสินค้า', active: true }, { icon: '🛒', label: 'ออเดอร์' }, { icon: '📅', label: 'นัดหมาย' }].map(item => (
                    <div key={item.label} style={sbStyle(item.active)}><span style={{ fontSize: '0.8rem', opacity: item.active ? 1 : 0.5 }}>{item.icon}</span>{item.label}</div>
                  ))}
                  <div style={{ padding: '0 10px', margin: '10px 0 4px' }}><span style={{ fontSize: '0.6rem', color: '#CBD5E1', fontWeight: 700, letterSpacing: '0.1em' }}>ลูกค้า</span></div>
                  {[{ icon: '💬', label: 'บทสนทนา' }, { icon: '👥', label: 'CRM' }, { icon: '📞', label: 'Handoff' }].map(item => (
                    <div key={item.label} style={sbStyle()}><span style={{ fontSize: '0.8rem', opacity: 0.5 }}>{item.icon}</span>{item.label}</div>
                  ))}
                  <div style={{ padding: '0 10px', margin: '10px 0 4px' }}><span style={{ fontSize: '0.6rem', color: '#CBD5E1', fontWeight: 700, letterSpacing: '0.1em' }}>วิเคราะห์</span></div>
                  <div style={sbStyle()}><span style={{ fontSize: '0.8rem', opacity: 0.5 }}>📊</span>Analytics</div>
                </div>
                <div style={{ padding: '10px 12px', borderTop: '1px solid #F8FAFC', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, color: '#fff', flexShrink: 0 }}>ด</div>
                  <div><div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0F172A' }}>พีจอด</div><div style={{ fontSize: '0.6rem', color: '#94A3B8' }}>Owner</div></div>
                </div>
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ padding: '1.25rem', height: '100%', display: dashView === 'main' ? 'block' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.1rem' }}>
                    <div><div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>Dashboard</div><div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '1px' }}>สวัสดี พีจอด (Diwapat) 🐱 บอทพร้อมทำงานแล้ว</div></div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '7px', padding: '4px 10px', fontSize: '0.68rem', color: '#64748B' }}>🔄 รีเฟรช</div>
                      <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '7px', padding: '4px 10px', fontSize: '0.68rem', color: '#64748B' }}>ออกจากระบบ</div>
                    </div>
                  </div>
                  <div className="dash-stats-grid">
                    {[
                      { icon: '🛒', label: 'ชั่วโมงวันนี้', value: '24', sub: 'ออเดอร์วันนี้', color: '#059669' },
                      { icon: '👥', label: 'บทสนทนา', value: '148', sub: 'ทั้งหมดวันนี้', color: '#60a5fa' },
                      { icon: '📈', label: 'อัตราตอบ AI', value: '100%', sub: 'อัตราตอบแทน AI', color: '#34d399' },
                      { icon: '📶', label: 'สถานะบอท', value: 'Online', sub: 'สถานะบอท', color: '#a78bfa', valColor: '#34d399' },
                    ].map(card => (
                      <div key={card.label} style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '0.9rem' }}>
                        <div style={{ fontSize: '0.65rem', color: card.color, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ fontSize: '0.85rem' }}>{card.icon}</span> {card.label}</div>
                        <div style={{ fontSize: '1.6rem', fontWeight: 800, color: (card as any).valColor ?? '#0F172A', lineHeight: 1 }}>{card.value}</div>
                        <div style={{ fontSize: '0.62rem', color: '#94A3B8', marginTop: '3px' }}>{card.sub}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: 'linear-gradient(90deg,#047857,#047857,#059669)', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '0.875rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '28px', height: '28px', background: '#059669', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', flexShrink: 0 }}>🐱</div>
                    <div style={{ fontSize: '0.78rem', color: '#fff', fontWeight: 500 }}><strong style={{ fontWeight: 800 }}>MeowCat แนะนำ 🐱</strong> — ตั้งค่าบอทของคุณให้ <span style={{ color: '#A7F3D0', fontWeight: 700 }}>รายการสินค้า</span> เพื่อเพิ่มยอดขายได้ถึง 500 ข้อความต่อเดือน</div>
                  </div>
                  <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '0.875rem 1rem', marginBottom: '0.875rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ width: '28px', height: '28px', background: '#059669', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', flexShrink: 0 }}>🛒</div>
                    <div style={{ display: 'flex', gap: '2.5rem', flex: 1 }}>
                      {[['พนักงาน','2 รายการ','#fff'],['วันวานนี้','0','#fff'],['รายได้วันนี้','฿0','#34d399'],['รายได้รวม','฿130','#fff']].map(([l,v,c]) => (
                        <div key={l}><div style={{ fontSize: '0.62rem', color: '#94A3B8', marginBottom: '2px' }}>{l}</div><div style={{ fontSize: '0.85rem', fontWeight: 800, color: c }}>{v}</div></div>
                      ))}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>›</div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '0.875rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A' }}>การใช้งานเดือนนี้</div>
                        <div style={{ background: '#059669', color: '#fff', fontSize: '0.6rem', fontWeight: 800, padding: '2px 8px', borderRadius: '100px' }}>Business</div>
                      </div>
                      <div style={{ fontSize: '0.65rem', color: '#94A3B8', marginBottom: '0.5rem' }}>พฤษภาคม 1 พฤษภาคม 2569</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginBottom: '3px' }}>0 <span style={{ fontSize: '0.65rem', color: '#94A3B8', fontWeight: 400 }}>/ 50,000 ข้อความ</span></div>
                      <div style={{ background: '#E2E8F0', borderRadius: '4px', height: '5px', marginBottom: '0.75rem', overflow: 'hidden' }}><div style={{ width: '2%', background: '#059669', height: '100%', borderRadius: '4px' }} /></div>
                      <div style={{ background: 'linear-gradient(90deg,#047857,#059669)', color: '#fff', textAlign: 'center', padding: '7px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700 }}>Upgrade แผน →</div>
                    </div>
                    <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '0.875rem' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>ข้อความรายสัปดาห์</div>
                      <div style={{ fontSize: '0.65rem', color: '#94A3B8', marginBottom: '0.875rem' }}>7 วันที่ผ่านมา</div>
                      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '5px', height: '52px' }}>
                        {[{h:28,d:'จ',o:0.7},{h:38,d:'อ',o:0.7},{h:22,d:'พ',o:0.7},{h:44,d:'พฤ',o:0.7},{h:32,d:'ศ',o:0.7},{h:48,d:'ส',o:1,hi:true},{h:40,d:'อา',o:0.85}].map((b,i) => (
                          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                            <div style={{ background: '#059669', borderRadius: '3px 3px 0 0', width: '100%', height: `${b.h}px`, opacity: b.o }} />
                            <span style={{ fontSize: '0.55rem', color: b.hi ? '#059669' : '#CBD5E1', fontWeight: b.hi ? 700 : undefined }}>{b.d}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ padding: '1.25rem', height: '100%', display: dashView === 'analytics' ? 'block' : 'none' }}>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', marginBottom: '1rem' }}>Analytics <span style={{ fontSize: '0.68rem', background: '#059669', color: '#fff', padding: '2px 8px', borderRadius: '100px', fontWeight: 700, marginLeft: '6px' }}>Premium Insights</span></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '0.875rem' }}>
                    <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '0.875rem' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ color: '#059669' }}>⚡</span> ความเร็วในการตอบกลับ</div>
                      <div style={{ fontSize: '0.65rem', color: '#94A3B8', marginBottom: '4px' }}>AI ทำได้</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#60a5fa' }}>วันที่</div>
                      <div style={{ borderTop: '1px solid #E2E8F0', margin: '10px 0 8px' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#94A3B8' }}><span>เทียบเดือนก่อน</span><span style={{ color: '#0F172A', fontWeight: 700 }}>0 แชท 0</span></div>
                    </div>
                    <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '0.875rem' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ color: '#34d399' }}>✓</span> อารมณ์ผู้ออกจากการแชท</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        {[{l:'● พอใจมาก',p:62,c:'#34d399'},{l:'● ตามปกติ / เฉยๆ',p:31,c:'#fbbf24'},{l:'● หลุดคือ / ด้วยเรื่อง',p:8,c:'#f87171'}].map(r => (
                          <div key={r.l}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', marginBottom: '2px' }}><span style={{ color: r.c }}>{r.l}</span><span style={{ color: '#0F172A', fontWeight: 700 }}>{r.p}%</span></div>
                            <div style={{ background: '#E2E8F0', borderRadius: '3px', height: '5px', overflow: 'hidden' }}><div style={{ width: `${r.p}%`, background: r.c, height: '100%', borderRadius: '3px' }} /></div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '0.875rem' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ color: '#059669' }}>🔥</span> สิ่งที่ทุกคนสนมากที่สุด</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {[{p:'/catalog/apni',c:17},{p:'/catalog/premium',c:13},{p:'/review',c:2}].map(lk => (
                          <div key={lk.p} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.65rem', color: '#94A3B8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '120px' }}>{lk.p}</span>
                            <span style={{ fontSize: '0.65rem', background: '#E2E8F0', borderRadius: '4px', padding: '1px 6px', color: '#059669', fontWeight: 700 }}>↗ {lk.c} คลิก</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '0.875rem', marginBottom: '0.875rem' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.875rem', display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ color: '#60a5fa' }}>📊</span> ลูกค้าถามอะไรบ้าย</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {[{q:'ราคา',n:18,p:90,c:'#059669'},{q:'สั่งซื้อ',n:14,p:70,c:'#60a5fa'},{q:'สต็อก',n:11,p:55,c:'#34d399'},{q:'ไม่มี',n:9,p:45,c:'#a78bfa'},{q:'โปรโมชั่น',n:7,p:35,c:'#fbbf24'}].map(r => (
                        <div key={r.q}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', marginBottom: '3px' }}><span style={{ color: '#0F172A' }}>{r.q}</span><span style={{ color: '#94A3B8' }}>{r.n} ครั้ง</span></div>
                          <div style={{ background: '#E2E8F0', borderRadius: '3px', height: '7px', overflow: 'hidden' }}><div style={{ width: `${r.p}%`, background: r.c, height: '100%', borderRadius: '3px' }} /></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '0.875rem' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.75rem' }}>💬 ตัวอย่างคำถามล่าสุด</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem' }}>
                      <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '0.75rem', border: '1px solid #E2E8F0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}><span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0F172A' }}>Mint</span><span style={{ background: '#34d399', color: '#0f2a1a', fontSize: '0.6rem', fontWeight: 700, padding: '1px 7px', borderRadius: '100px' }}>AI ตอบ</span></div>
                        <div style={{ fontSize: '0.65rem', color: '#64748B', lineHeight: 1.5 }}>&ldquo;อยากรู้เรื่องราคาสินค้า premium หน่อยค่ะ&rdquo;</div>
                      </div>
                      <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '0.75rem', border: '1px solid #E2E8F0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}><span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0F172A' }}>Boss</span><span style={{ background: '#059669', color: '#fff', fontSize: '0.6rem', fontWeight: 700, padding: '1px 7px', borderRadius: '100px' }}>ส่งต่อ</span></div>
                        <div style={{ fontSize: '0.65rem', color: '#64748B', lineHeight: 1.5 }}>&ldquo;ต้องการส่งพรุ่งนี้เร่งด่วน อยากได้ไดสิ้นที่&rdquo;</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="fade-up" style={{ textAlign: 'center', marginTop: '1.75rem' }}>
            <a className="btn-p" href={PRIMARY_CTA_HREF} style={{ fontSize: '0.9rem' }} onClick={() => trackCTA({ location: 'demo', label: 'ลองใช้ Dashboard จริง ฟรี 14 วัน', destination: PRIMARY_CTA_HREF, variant: 'primary' })}>ลองใช้ Dashboard จริง ฟรี 14 วัน →</a>
          </div>
        </div>
      </section>

      <div id="proofbar">
        <div className="proof-track">
          {[...PROOF_DATA, ...PROOF_DATA].map((p, i) => (
            <div key={i} className="proof-item">
              <div className="proof-avatar">{p.ico}</div>
              <div><div className="proof-stars">★★★★★</div><span className="proof-name">{p.name}</span> · <span>{p.q}</span></div>
            </div>
          ))}
        </div>
      </div>

      <section id="problems">
        <div className="container">
          <div className="problems-inner">
            <div className="fade-up">
              <div className="eyebrow">เสียงจากเจ้าของร้านจริงๆ</div>
              <h2 className="headline">เหนื่อยกับ<em>ปัญหาเหล่านี้</em><br />บ้างไหม?</h2>
              <p className="sub" style={{ marginBottom: '1.75rem' }}>ถ้าเคยรู้สึกแบบนี้ คุณไม่ได้อยู่คนเดียว เจ้าของร้านไทยนับพันเจอเหมือนกันทุกวัน</p>
              <div className="problem-cards">
                {[{ico:'😴',title:'ลูกค้าทักตอนดึก ตอบช้า หายไปเลย',desc:'กว่าจะเห็นข้อความตอนเช้า ลูกค้าสั่งร้านอื่นไปแล้ว'},{ico:'🔁',title:'ตอบคำถามเดิมซ้ำทุกวันจนเบื่อ',desc:'"เปิดกี่โมง?" "มีที่จอดรถไหม?" — ตอบจนแอดมินท้อ'},{ico:'📝',title:'ออเดอร์หายในแชท จัดการยุ่งยาก',desc:'ออเดอร์กระจายในแชท note และ DM ผิดพลาดง่ายมาก'},{ico:'👥',title:'แอดมินหมดแรงกับงานซ้ำซาก',desc:'แทนที่จะโฟกัสปิดการขาย กลับต้องตอบแชทอยู่ตลอด'}].map(card => (
                  <div key={card.title} className="p-card"><div className="p-icon">{card.ico}</div><div><strong>{card.title}</strong><span>{card.desc}</span></div></div>
                ))}
              </div>
            </div>
            <div className="fade-up">
              <div className="eyebrow">MeowChat แก้ได้ทุกข้อ</div>
              <h2 className="headline">ให้ AI ดูแล<em>งานซ้ำๆ</em><br />ทีมคุณทำ<em>สิ่งสำคัญกว่า</em></h2>
              <div style={{ margin: '1.25rem 0 1.5rem', padding: '0.875rem 1rem', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.25rem' }}>💡</span>
                <span style={{ fontSize: '0.85rem', color: '#15803d' }}>จ้างแอดมิน 1 คน ≈ <strong>฿9,000–15,000/เดือน</strong> · MeowChat เริ่มที่ <strong>฿490/เดือน</strong> ทำงานได้ 24/7</span>
              </div>
              <div className="sol-cards" style={{ marginTop: '0' }}>
                {[{ico:'⚡',title:'ตอบทันที ทุกชั่วโมง ไม่มีวันหยุด',desc:'ลูกค้าทักตอนตี 2 ก็ได้รับคำตอบภายในวินาที'},{ico:'🤖',title:'ตอบ FAQ อัตโนมัติ ไม่ต้องพิมพ์เอง',desc:'ตั้งค่าครั้งเดียว ตอบได้ทุกวัน เหมือนมีแอดมินเพิ่มอีกคน'},{ico:'📊',title:'รวบออเดอร์ทุกรายการในที่เดียว',desc:'Dashboard สรุปออเดอร์ ลูกค้า และยอดขายแบบ real-time'},{ico:'🤝',title:'ส่งต่อทีมเฉพาะเมื่อต้องการ',desc:'เคสที่ซับซ้อน AI แจ้งทีมพร้อมสรุปบริบทให้ครบ'}].map(card => (
                  <div key={card.title} className="s-card"><div className="s-icon">{card.ico}</div><div><strong>{card.title}</strong><span>{card.desc}</span></div></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="testimonials">
        <div className="container">
          <div className="fade-up" style={{ textAlign: 'center', maxWidth: '560px', margin: '0 auto' }}>
            <div className="eyebrow" style={{ justifyContent: 'center' }}>เสียงจากร้านที่ใช้จริง</div>
            <h2 className="headline">ร้านค้าทั่วไทย<em>เห็นผลจริง</em></h2>
          </div>
          <div className="testi-grid">
            {[
              {ava:'🍜',q:'ก่อนใช้ ลูกค้าทักมาตอนร้านยุ่งแล้วหายไปบ่อย พอมีระบบช่วยตอบเมนูและรับออเดอร์เบื้องต้น ลูกค้าไม่ต้องรอเงียบ ๆ อีกแล้ว',name:'คุณแอม',shop:'ร้านข้าวแม่สมใจ',role:'เจ้าของร้านอาหาร • กรุงเทพฯ'},
              {ava:'💇',q:'โทนการตอบยังดูเป็นร้านเรา และช่วยคัดคำถามบริการก่อนส่งต่อทีมหน้าร้านได้จริง คิวไม่หลุดง่ายแล้ว',name:'คุณแอมป์',shop:'Style by Amp',role:'ร้านทำผม • เชียงใหม่'},
              {ava:'🛍️',q:'ลูกค้าถามไซส์กับสีซ้ำทั้งวัน พอมีระบบช่วยตอบ ทีมไม่ต้องจมกับคำถามเดิม ๆ แล้ว โฟกัสเคสพร้อมซื้อได้มากขึ้น',name:'คุณพลอย',shop:'PrettyCloset',role:'ร้านเสื้อผ้าออนไลน์ • นนทบุรี'},
            ].map(t => (
              <div key={t.name} className="testi-card fade-up">
                <div className="testi-stars">★★★★★</div>
                <p className="testi-q">{t.q}</p>
                <div className="testi-who">
                  <div className="testi-ava">{t.ava}</div>
                  <div>
                    <div className="testi-name">{t.name}</div>
                    <div className="testi-shop">{t.shop}</div>
                    <div className="testi-role">{t.role}</div>
                  </div>
                </div>
                <div className="testi-verified">✓ ลูกค้าจริง</div>
              </div>
            ))}
          </div>
          <div className="fade-up" style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <p style={{ fontSize: '0.95rem', color: 'rgba(0,0,0,0.5)', marginBottom: '1rem' }}>อยากให้ร้านคุณเป็นแบบนี้บ้างไหม?</p>
            <a className="btn-p" href={PRIMARY_CTA_HREF} style={{ display: 'inline-block' }} onClick={() => trackCTA({ location: 'testimonials', label: 'ทดลองฟรี 14 วัน', destination: PRIMARY_CTA_HREF, variant: 'primary' })}>ทดลองฟรี 14 วัน →</a>
          </div>
        </div>
      </section>

      <section id="usecases">
        <div className="container">
          <div className="fade-up" style={{ marginBottom: '2.5rem' }}>
            <div className="eyebrow">เหมาะกับธุรกิจของคุณ</div>
            <h2 className="headline">ไม่ว่าร้านคุณจะขายอะไร<br /><em>MeowChat ช่วยได้</em></h2>
          </div>
          <div className="tab-row">
            {([['food','🍜 ร้านอาหาร'],['shop','🛍️ ร้านค้าออนไลน์'],['beauty','💆 ความงาม & นัดหมาย'],['clinic','🏥 คลินิก & บริการ']] as [UseCase,string][]).map(([id,label]) => (
              <button key={id} className={`tbtn${activeTab===id?' on':''}`} onClick={() => setActiveTab(id)}>{label}</button>
            ))}
          </div>
          {([
            ['food','ร้านอาหารรับออเดอร์ไว\nไม่มีตก ไม่มีผิดพลาด','ลูกค้าสั่งอาหารผ่าน LINE OA ได้เลย MeowChat รับออเดอร์ ยืนยัน และส่งข้อมูลเข้าครัวโดยอัตโนมัติ แม้ตอนร้านคึกคัก',['รับออเดอร์และยืนยันทันที ไม่ต้องรอแอดมิน','แจ้งเวลารอและสถานะการเตรียมอาหาร','จัดการ Delivery และ Pick-up ในที่เดียว','ลูกค้าประจำสั่งซ้ำได้ง่าย ระบบจำเมนูโปรดให้'],[['3×','ออเดอร์ต่อวันเพิ่มขึ้นเฉลี่ย'],['90%','ลดการตอบซ้ำของแอดมิน'],['<5s','ตอบกลับลูกค้าเฉลี่ย'],['24/7','รับออเดอร์ไม่มีวันหยุด']]],
            ['shop','ร้านออนไลน์ปิดการขาย\nได้ตลอดคืน','ลูกค้าถามสินค้า เช็คสต็อก หรือสอบถามราคาตอนดึก — MeowChat ตอบได้ทันทีและนำทางสู่การสั่งซื้อโดยไม่ต้องรอแอดมิน',['ตอบคำถามสินค้าและราคาได้ทุกชั่วโมง','เช็คสต็อกและแจ้งเมื่อสินค้ากลับมา','ช่วยลูกค้าเลือกสินค้าที่ใช่ได้ง่ายขึ้น','เก็บข้อมูลลูกค้าและแจ้งโปรโมชั่นใหม่ๆ'],[['45%','Conversion เพิ่มขึ้น'],['2×','ลูกค้ากลับมาซื้อซ้ำ'],['0','ลูกค้าหลุดเพราะตอบช้า'],['100%','ตอบได้แม้นอกเวลางาน']]],
            ['beauty','จองคิวอัตโนมัติ\nไม่มีทับซ้อน ไม่มีพลาด','ลูกค้าจองนัดผ่าน LINE OA ได้ตลอดเวลา MeowChat จัดการตารางและส่งแจ้งเตือนอัตโนมัติ ทีมคุณเห็นคิวชัดเจนทุกวัน',['จองและยืนยันคิวแบบอัตโนมัติ 24/7','แจ้งเตือนลูกค้าก่อนถึงเวลานัด ลด No-show','จัดการยกเลิก/เลื่อนนัดได้ง่าย','ดูตารางคิวรายวันในแดชบอร์ด'],[['80%','ลด No-show ของลูกค้า'],['5×','จองนัดได้เร็วขึ้น'],['0','ตารางทับซ้อนและข้อผิดพลาด'],['+30%','รายได้ต่อเดือนเฉลี่ย']]],
            ['clinic','คลินิกและบริการ\nจัดการนัดไม่พลาด','ตั้งแต่นัดคุณหมอ สอบถามบริการ ไปจนถึงติดตามผล — MeowChat ดูแลลูกค้าตลอดกระบวนการ ทีมคุณโฟกัสงานที่สำคัญกว่า',['รับนัดและสอบถามบริการอัตโนมัติ','แจ้งค่าใช้จ่ายและเตรียมตัวก่อนนัด','ติดตาม feedback หลังรับบริการ','ส่งต่อเคสเร่งด่วนให้ทีมทันที'],[['95%','ลูกค้าพึงพอใจในการตอบ'],['3h','ประหยัดเวลาทีมต่อวัน'],['↓60%','คำถามซ้ำที่ต้องตอบเอง'],['+25%','นัดหมายต่อเดือน']]],
          ] as [UseCase,string,string,string[],[string,string][]][]).map(([id,h,p,li,stats]) => (
            <div key={id} className={`tpanel${activeTab===id?' on':''}`}>
              <div className="tpanel-left">
                <h3>{h.replace(/\n/g,'\n')}</h3>
                <p>{p}</p>
                <ul className="oc-list">{li.map(l => <li key={l}>{l}</li>)}</ul>
              </div>
              <div className="stat-grid">{stats.map(([n,l]) => <div key={n} className="s-box"><span className="s-n">{n}</span><span className="s-l">{l}</span></div>)}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="how">
        <div className="container">
          <div className="fade-up" style={{ maxWidth: '580px' }}>
            <div className="eyebrow">เริ่มได้ใน 4 ขั้นตอน</div>
            <h2 className="headline">ง่ายกว่าที่คิด<br /><em>ไม่ต้องมีความรู้ด้าน IT</em></h2>
            <p className="sub">ไม่ต้องเปลี่ยน LINE OA ไม่ต้องจ้างโปรแกรมเมอร์ ทีมเราช่วยตั้งค่าจนพร้อมใช้งาน</p>
          </div>
          <div className="steps">
            {[{n:'01',h:'สมัครและทดลองฟรี',p:'สร้างบัญชีใน 2 นาที ไม่ต้องใส่ข้อมูลบัตรเครดิต ทดลองใช้ได้เลย 14 วันเต็ม',arr:true},{n:'02',h:'เชื่อม LINE OA เดิมของร้าน',p:'กดอนุมัติเชื่อม LINE OA ของคุณกับ MeowChat ใช้เวลาไม่ถึง 5 นาที ไม่ต้องสร้างใหม่',arr:true},{n:'03',h:'ตั้งค่าร้านและข้อมูลสำคัญ',p:'ใส่เมนู ราคา ชั่วโมงทำการ และคำถามที่พบบ่อย — ทีมเราช่วยตั้งค่าให้ถ้าต้องการ',arr:true},{n:'04',h:'ให้ AI ทำงานแทนคุณ',p:'MeowChat เริ่มตอบลูกค้าทันที ดูผลสรุปใน Dashboard รับแจ้งเตือนเฉพาะเมื่อจำเป็น'}].map(step => (
              <div key={step.n} className="step fade-up">
                <div className="step-n">{step.n}</div><h4>{step.h}</h4><p>{step.p}</p>
                {step.arr && <div className="step-arr">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features">
        <div className="container">
          <div className="fade-up" style={{ maxWidth: '560px' }}>
            <div className="eyebrow">ครบทุกสิ่งที่ร้านต้องการ</div>
            <h2 className="headline">ไม่ใช่แค่ตอบแชท<br /><em>แต่ช่วยให้ธุรกิจทำเงินมากขึ้น</em></h2>
          </div>
          <div className="feat-grid">
            {[{ico:'⚡',h:'ตอบลูกค้าอัตโนมัติ 24/7',p:'AI ตอบคำถามทั่วไป เมนู ราคา และข้อมูลร้านได้ทันที ไม่มีวันหยุด ไม่ต้องรอแอดมิน',out:'→ ลูกค้าไม่หลุดไปร้านอื่น'},{ico:'📦',h:'รับออเดอร์และจองคิว',p:'ลูกค้าสั่งสินค้าหรือจองนัดได้ผ่านแชท ระบบบันทึกและยืนยันอัตโนมัติ ลดข้อผิดพลาด',out:'→ ออเดอร์ไม่ตก คิวไม่ซ้อน'},{ico:'👥',h:'เก็บข้อมูลลูกค้าเป็นระบบ',p:'รู้ว่าลูกค้าคนไหนซื้ออะไร บ่อยแค่ไหน เพื่อโฟลโลว์อัปและทำโปรโมชั่นที่ตรงจุด',out:'→ ลูกค้าประจำกลับมาซื้อซ้ำ'},{ico:'📊',h:'Dashboard ภาพรวมธุรกิจ',p:'ดูออเดอร์ ยอดขาย และการสนทนาในที่เดียว ไม่ต้องไล่ดูแชททีละข้อความอีกต่อไป',out:'→ ตัดสินใจได้เร็วขึ้น'},{ico:'🤝',h:'ส่งต่อทีมเมื่อจำเป็น',p:'เคสซับซ้อนหรือต้องการดูแลพิเศษ AI แจ้งทีมทันที พร้อมสรุปบริบทการสนทนา',out:'→ ทีมช่วยได้ทันเวลา'},{ico:'🔌',h:'ใช้กับ LINE OA เดิมได้เลย',p:'ไม่ต้องสร้าง LINE OA ใหม่ ไม่ต้องให้ลูกค้าเพิ่มเพื่อนใหม่ เริ่มได้เดี๋ยวนี้เลย',out:'→ ไม่เสียฐานลูกค้าเดิม'}].map(f => (
              <div key={f.h} className="f-card fade-up"><div className="f-ico">{f.ico}</div><h4>{f.h}</h4><p>{f.p}</p><span className="f-out">{f.out}</span></div>
            ))}
          </div>
        </div>
      </section>

      <section id="trust">
        <div className="container">
          <div className="trust-stat-row fade-up">
            <div className="t-stat"><span className="t-num">2,400+</span><span className="t-lbl">ร้านค้าไทยที่ใช้งานแล้ว</span></div>
            <div className="t-stat"><span className="t-num">98%</span><span className="t-lbl">ลูกค้าพึงพอใจในการตอบสนอง</span></div>
            <div className="t-stat"><span className="t-num">4.5 ล้าน+</span><span className="t-lbl">ข้อความที่ตอบแทนร้านต่อเดือน</span></div>
          </div>
          <div className="trust-list fade-up">
            {[['🇹🇭','ทีมไทย ดูแลและช่วยตั้งค่าให้'],['🔒','ข้อมูลปลอดภัย มาตรฐาน PDPA'],['📱','รองรับ LINE OA ทุกแพ็กเกจ'],['⚙️','ทีมคุณยังคุมการขายได้เต็มที่'],['🔄','อัปเดตฟีเจอร์ใหม่สม่ำเสมอ']].map(([ico,txt]) => (
              <div key={txt as string} className="t-badge"><span className="t-badge-ico">{ico}</span>{txt}</div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing">
        <div className="container">
          <div className="fade-up" style={{ textAlign: 'center' }}>
            <div className="eyebrow" style={{ justifyContent: 'center' }}>เริ่มต้นง่าย ทดลองก่อนได้เลย</div>
            <h2 className="headline" style={{ maxWidth: '560px', margin: '0 auto 0.75rem' }}>ลองก่อนจ่ายทีหลัง<br /><em>ไม่ต้องผูกมัด</em></h2>
            <p className="sub" style={{ maxWidth: '480px', margin: '0 auto 1.5rem' }}>ทดลองใช้ฟรี 14 วัน ครบทุกฟีเจอร์ ไม่มีการหักเงินโดยไม่แจ้ง ยกเลิกได้ทุกเมื่อ</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
              <span style={{ fontSize: '0.9rem', color: annualBilling ? 'rgba(0,0,0,0.4)' : '#111', fontWeight: annualBilling ? 400 : 600 }}>รายเดือน</span>
              <button
                onClick={() => setAnnualBilling(v => !v)}
                style={{ position: 'relative', width: '48px', height: '26px', borderRadius: '13px', border: 'none', cursor: 'pointer', background: annualBilling ? '#059669' : '#d1d5db', transition: 'background 0.2s', flexShrink: 0 }}
                aria-label="สลับระหว่างชำระรายเดือนและรายปี"
              >
                <span style={{ position: 'absolute', top: '3px', left: annualBilling ? '25px' : '3px', width: '20px', height: '20px', borderRadius: '50%', background: '#fff', transition: 'left 0.2s', display: 'block' }} />
              </button>
              <span style={{ fontSize: '0.9rem', color: annualBilling ? '#111' : 'rgba(0,0,0,0.4)', fontWeight: annualBilling ? 600 : 400 }}>รายปี</span>
              <span style={{ background: annualBilling ? '#dcfce7' : '#f1f5f9', color: annualBilling ? '#15803d' : '#94a3b8', fontSize: '0.75rem', fontWeight: 700, padding: '2px 10px', borderRadius: '20px', transition: 'all 0.2s' }}>
                {annualBilling ? 'ประหยัด 2 เดือน 🎉' : 'จ่ายรายปี ประหยัดกว่า 17%'}
              </span>
            </div>
          </div>
          <div className="tier-grid fade-up">
            {[
              {
                name: 'Starter',
                price: '490',
                annualPerMonth: '408',
                annualTotal: '4,900',
                annualSaving: '980',
                target: 'ร้านเดี่ยว · เพิ่งเริ่มใช้ AI',
                desc: 'เหมาะกับร้านเดี่ยวที่เพิ่งเริ่มต้น',
                features: ['ตอบลูกค้าอัตโนมัติ 24/7','รับออเดอร์และจองคิว','Dashboard ยอดขาย','ทีมไทยช่วยตั้งค่าฟรี'],
                cta: 'เริ่มต้นด้วย Starter →',
                highlight: false,
              },
              {
                name: 'Pro',
                price: '990',
                annualPerMonth: '825',
                annualTotal: '9,900',
                annualSaving: '1,980',
                target: 'ร้านที่มีลูกค้าเยอะ · ต้องการโต',
                desc: 'สำหรับร้านที่ต้องการเติบโตเร็ว',
                features: ['ทุกอย่างใน Starter','ส่งต่อทีม + แจ้งเตือนอัจฉริยะ','รายงานวิเคราะห์เชิงลึก','ลูกค้า VIP และโปรโมชั่น','ทีมดูแลลำดับแรก'],
                cta: 'เริ่มต้นด้วย Pro →',
                highlight: true,
                badge: '🔥 ยอดนิยม',
              },
              {
                name: 'Business',
                price: '2,490',
                annualPerMonth: '2,075',
                annualTotal: '24,900',
                annualSaving: '4,980',
                target: 'หลายสาขา · ทีมใหญ่ · Custom AI',
                desc: 'ธุรกิจที่มีหลายสาขาหรือทีมใหญ่',
                features: ['ทุกอย่างใน Pro','หลาย LINE OA ในแอคเคาท์เดียว','Custom AI ตามแบรนด์','เชื่อมต่อระบบอื่นได้','ทีมช่วยตั้งค่าส่วนตัว'],
                cta: 'เริ่มต้นด้วย Business →',
                highlight: false,
              },
            ].map(tier => (
              <div key={tier.name} className={`tier-card${tier.highlight ? ' tier-highlight' : ''}`}>
                {tier.badge && <div className="tier-badge">{tier.badge}</div>}
                <div className="tier-name">{tier.name}</div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(0,0,0,0.45)', marginBottom: '0.25rem', fontWeight: 500 }}>{tier.target}</div>
                <div className="tier-price">
                  <span className="tier-thb">฿</span>{annualBilling ? tier.annualPerMonth : tier.price}
                  <span className="tier-mo">/เดือน</span>
                </div>
                <div style={{ fontSize: '0.78rem', marginTop: '-0.4rem', marginBottom: '0.5rem', fontWeight: 600, color: annualBilling ? '#15803d' : '#94a3b8' }}>
                  {annualBilling
                    ? `฿${tier.annualTotal}/ปี · 💰 ประหยัด ฿${tier.annualSaving}`
                    : `จ่ายรายปี ประหยัด ฿${tier.annualSaving}`}
                </div>
                <div className="tier-desc">{tier.desc}</div>
                <ul className="tier-list">
                  {tier.features.map(f => <li key={f}><span className="tier-check">✓</span>{f}</li>)}
                </ul>
                <a
                  className={tier.highlight ? 'btn-p' : 'btn-s'}
                  href={PRIMARY_CTA_HREF}
                  style={{ display: 'block', textAlign: 'center', width: '100%' }}
                  onClick={() => trackCTA({ location: 'pricing', label: tier.name, destination: PRIMARY_CTA_HREF, variant: tier.highlight ? 'primary' : 'secondary' })}
                >
                  {tier.cta}
                </a>
                <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'rgba(0,0,0,0.38)', marginTop: '0.6rem' }}>
                  ไม่ต้องบัตรเครดิต · ยกเลิกได้ทุกเมื่อ
                </div>
              </div>
            ))}
          </div>
          <div className="tier-enterprise fade-up">
            <span className="tier-ent-label">Enterprise</span>
            <span>หลาย LINE OA · Custom AI · SLA · Dedicated manager</span>
            <a href="https://line.me/ti/p/@960xboyt" className="tier-ent-link" onClick={() => trackCTA({ location: 'pricing', label: 'Enterprise ติดต่อทีม', destination: 'https://line.me/ti/p/@960xboyt', variant: 'tertiary' })}>ติดต่อทีม →</a>
          </div>
        </div>
      </section>

      <section id="final">
        <div className="container">
          <div className="eyebrow fade-up" style={{ justifyContent: 'center' }}>พร้อมเริ่มแล้วหรือยัง?</div>
          <h2 className="headline fade-up" style={{ maxWidth: '640px', margin: '0 auto 1rem' }}>ลูกค้าทักทุกนาที<br /><em>แต่ร้านคุณพร้อมตอบทุกคนไหม?</em></h2>
          <p className="sub fade-up" style={{ maxWidth: '460px', margin: '0 auto 2.75rem' }}>MeowChat พร้อมช่วยร้านคุณตอบไว ขายง่าย และเป็นระบบมากขึ้น เริ่มได้เดี๋ยวนี้ ไม่ยาก ไม่เสี่ยง ทดลองฟรีก่อนเสมอ 🐱</p>
          <div className="final-btns fade-up">
            <a className="btn-p" href={PRIMARY_CTA_HREF} onClick={() => trackCTA({ location: 'final', label: 'เริ่มใช้ฟรี 14 วัน', destination: PRIMARY_CTA_HREF, variant: 'primary' })}>เริ่มใช้ฟรี 14 วัน</a>
            <a className="btn-s" href="https://line.me/ti/p/@960xboyt" onClick={() => trackCTA({ location: 'final', label: 'ให้ทีมโทรหาฉัน', destination: 'https://line.me/ti/p/@960xboyt', variant: 'secondary' })}>ให้ทีมโทรหาฉัน</a>
          </div>
        </div>
      </section>

      <footer>
        <div className="footer-logo"><MeowLogo size={22} />MeowChat</div>
        <p>© 2026 MeowChat · AI ผู้ช่วยธุรกิจบน LINE OA สำหรับ SME ไทย</p>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <a href="/privacy" style={{ fontSize: '0.78rem', color: 'var(--tx3)', textDecoration: 'none' }}>นโยบายความเป็นส่วนตัว</a>
          <a href="/terms" style={{ fontSize: '0.78rem', color: 'var(--tx3)', textDecoration: 'none' }}>ข้อกำหนดการใช้งาน</a>
        </div>
      </footer>

      <div id="mob-cta" className={pastHero ? 'show' : ''}>
        <a className="btn-p" href={PRIMARY_CTA_HREF} onClick={() => trackCTA({ location: 'sticky', label: 'เริ่มใช้ฟรี 14 วัน', destination: PRIMARY_CTA_HREF, variant: 'primary' })}>เริ่มใช้ฟรี 14 วัน →</a>
      </div>

    </div>
  )
}
