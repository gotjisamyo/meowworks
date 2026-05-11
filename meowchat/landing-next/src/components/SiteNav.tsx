import { useState } from 'react';
import { trackCTA } from '../lib/analytics';
import { PRIMARY_CTA_HREF, SECONDARY_CTA_HREF } from '../lib/site';

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
  );
}

export default function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="snav">
        <a href="/" className="snav-logo">
          <MeowLogo size={30} />MeowChat
        </a>
        <ul className="snav-links">
          <li><a href="/#problems">ทำไมต้องใช้</a></li>
          <li><a href="/#usecases">เหมาะกับใคร</a></li>
          <li><a href="/#how">วิธีเริ่มใช้</a></li>
        </ul>
        <div className="snav-right">
          <a
            href={SECONDARY_CTA_HREF}
            className="snav-demo"
            onClick={() => trackCTA({ location: 'nav', label: 'คุยกับทีม', destination: SECONDARY_CTA_HREF, variant: 'secondary' })}
          >
            คุยกับทีม
          </a>
          <a
            href={PRIMARY_CTA_HREF}
            className="snav-cta"
            onClick={() => trackCTA({ location: 'nav', label: 'ทดลองฟรี 14 วัน', destination: PRIMARY_CTA_HREF, variant: 'primary' })}
          >
            ทดลองฟรี 14 วัน
          </a>
          <button
            className="snav-hamburger"
            aria-label={open ? 'ปิดเมนู' : 'เปิดเมนู'}
            aria-expanded={open}
            onClick={() => setOpen(v => !v)}
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {open && (
        <div className="snav-mobile">
          <a href="/#problems" onClick={() => setOpen(false)}>ทำไมต้องใช้</a>
          <a href="/#usecases" onClick={() => setOpen(false)}>เหมาะกับใคร</a>
          <a href="/#how" onClick={() => setOpen(false)}>วิธีเริ่มใช้</a>
          <a href={SECONDARY_CTA_HREF} onClick={() => setOpen(false)}>คุยกับทีม</a>
          <a
            href={PRIMARY_CTA_HREF}
            className="snav-mobile-cta"
            onClick={() => { setOpen(false); trackCTA({ location: 'mobile_menu', label: 'ทดลองฟรี 14 วัน', destination: PRIMARY_CTA_HREF, variant: 'primary' }); }}
          >
            ทดลองฟรี 14 วัน
          </a>
        </div>
      )}

      <style>{`
        .snav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
          border-bottom: 1px solid #E2E8F0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
          display: flex; align-items: center;
          padding: 0 32px; height: 64px; gap: 24px;
          font-family: 'Sarabun', 'Noto Sans Thai', sans-serif;
        }
        .snav-logo {
          display: flex; align-items: center; gap: 9px;
          font-weight: 800; font-size: 17px; color: #0F172A;
          text-decoration: none; margin-right: auto; letter-spacing: -0.2px;
        }
        .snav-links {
          display: flex; gap: 28px; list-style: none; margin: 0; padding: 0;
        }
        .snav-links a {
          color: #475569; text-decoration: none;
          font-size: 14px; font-weight: 500; transition: color 0.18s;
        }
        .snav-links a:hover { color: #059669; }
        .snav-right { display: flex; align-items: center; gap: 10px; }
        .snav-demo {
          padding: 7px 16px; border-radius: 8px;
          border: 1.5px solid #CBD5E1; background: transparent;
          font-size: 13px; font-weight: 600; color: #475569;
          text-decoration: none; transition: all 0.18s;
        }
        .snav-demo:hover { border-color: #059669; color: #059669; }
        .snav-cta {
          padding: 10px 18px; border-radius: 8px;
          background: #059669; color: white;
          font-size: 13px; font-weight: 700; text-decoration: none;
          transition: background 0.18s, box-shadow 0.18s;
          box-shadow: 0 2px 8px rgba(5,150,105,0.28);
          min-height: 44px; display: inline-flex; align-items: center;
        }
        .snav-cta:hover { background: #047857; box-shadow: 0 4px 14px rgba(5,150,105,0.38); }
        .snav-hamburger {
          display: none;
          background: none; border: 1px solid #E2E8F0; color: #475569;
          font-size: 1.1rem; width: 44px; height: 44px; border-radius: 8px;
          cursor: pointer; align-items: center; justify-content: center;
          transition: border-color 0.2s, color 0.2s;
        }
        .snav-hamburger:hover { border-color: #059669; color: #059669; }
        .snav-mobile {
          position: fixed; top: 64px; left: 0; right: 0; z-index: 99;
          background: #FFFFFF; border-bottom: 1px solid #E2E8F0;
          box-shadow: 0 4px 16px rgba(0,0,0,0.06);
          padding: 12px 20px 16px;
          display: flex; flex-direction: column; gap: 4px;
          font-family: 'Sarabun', 'Noto Sans Thai', sans-serif;
        }
        .snav-mobile a {
          color: #475569; text-decoration: none;
          font-size: 0.95rem; font-weight: 500;
          padding: 10px 4px; border-bottom: 1px solid #E2E8F0;
          transition: color 0.2s;
        }
        .snav-mobile a:last-child { border-bottom: none; }
        .snav-mobile a:hover { color: #059669; }
        .snav-mobile-cta {
          margin-top: 8px; display: block; text-align: center;
          padding: 13px 20px; border-radius: 10px;
          background: #059669 !important; color: white !important;
          font-size: 15px; font-weight: 700;
        }
        @media (max-width: 767px) {
          .snav-links { display: none; }
          .snav-demo { display: none; }
          .snav-hamburger { display: flex; }
        }
      `}</style>
    </>
  );
}
