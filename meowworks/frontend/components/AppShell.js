import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/products', label: 'สินค้า', icon: '📦' },
  { href: '/orders', label: 'ออร์เดอร์', icon: '🧾' },
  { href: '/crm', label: 'CRM', icon: '💬' },
  { href: '/settings', label: 'ตั้งค่า', icon: '⚙️' },
];

export default function AppShell({ children, title, subtitle, shopName, actions }) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [router.pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return undefined;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [mobileMenuOpen]);

  return (
    <div className="min-h-screen bg-gray-50 responsive-page">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-700"
              aria-label="Open navigation menu"
            >
              ☰
            </button>

            <Link href="/dashboard" className="flex items-center gap-2 min-w-0">
              <span className="text-2xl">🐱</span>
              <span className="text-lg sm:text-xl font-bold text-gray-900 truncate">MeowChat</span>
            </Link>
            {shopName && (
              <span className="hidden md:inline text-sm bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">
                {shopName}
              </span>
            )}
          </div>

          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = router.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${isActive ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/40"
            aria-label="Close navigation menu"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-[84vw] max-w-sm bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
                  <span className="text-2xl">🐱</span>
                  <span>MeowChat</span>
                </div>
                {shopName ? <p className="text-sm text-gray-500 mt-1 truncate">{shopName}</p> : null}
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-700"
                aria-label="Close navigation menu"
              >
                ✕
              </button>
            </div>

            <nav className="p-4 space-y-2">
              {navItems.map((item) => {
                const isActive = router.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-base font-medium ${isActive ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 pb-8 responsive-main responsive-content">
        <div className="flex flex-col gap-4 mb-6 md:mb-8 md:flex-row md:items-center md:justify-between responsive-header-row responsive-gap-md">
          <div className="min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 break-words responsive-title">{title}</h1>
            {subtitle && <p className="text-sm md:text-base text-gray-600 mt-2 max-w-3xl responsive-subtitle">{subtitle}</p>}
            {shopName && <p className="md:hidden text-sm text-indigo-700 mt-3 font-medium">ร้าน: {shopName}</p>}
          </div>
          {actions ? <div className="w-full md:w-auto [&>*]:w-full md:[&>*]:w-auto responsive-actions-row">{actions}</div> : null}
        </div>
        {children}
      </main>
    </div>
  );
}
