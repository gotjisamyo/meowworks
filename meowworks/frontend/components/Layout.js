import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Layout({ children, title = 'MeowWorks' }) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/products', label: 'สินค้า', icon: '📦' },
    { href: '/orders', label: 'ออร์เดอร์', icon: '🧾' },
    { href: '/settings', label: 'ตั้งค่า', icon: '⚙️' },
  ];

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
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 responsive-main">
          <div className="flex justify-between items-center h-16 gap-3 responsive-header-row">
            <div className="flex items-center space-x-3 min-w-0">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-700"
                aria-label="Open navigation menu"
              >
                ☰
              </button>
              <span className="text-2xl">🤖</span>
              <h1 className="text-lg md:text-xl font-bold text-gray-900 truncate">{title}</h1>
              <span className="hidden sm:inline px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full">
                SME Thailand
              </span>
            </div>
            <div className="flex items-center space-x-4 responsive-inline">
              <span className="text-sm text-gray-500">Welcome, Admin</span>
              <div className="h-8 w-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-medium shrink-0">
                A
              </div>
            </div>
          </div>
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
          <aside className="responsive-nav-drawer absolute left-0 top-0 h-full bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <span className="text-2xl">🤖</span>
                <span>MeowWorks</span>
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
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-base font-medium ${
                      isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-100'
                    }`}
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

      <div className="flex responsive-stack">
        <aside className="w-64 bg-white shadow-sm min-h-[calc(100vh-4rem)] hidden md:block">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = router.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 p-6 md:pb-6 responsive-main responsive-content">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
