import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function AdminLayout({ children, title = 'MeowChat Admin' }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { icon: '📊', label: 'Dashboard', href: '/admin' },
    { icon: '💰', label: 'การเงิน', href: '/admin/finance' },
    { icon: '📦', label: 'ออเดอร์', href: '/admin/orders' },
    { icon: '👥', label: 'ลูกค้า', href: '/admin/customers' },
    { icon: '🏪', label: 'สินค้า', href: '/admin/products' },
    { icon: '💬', label: 'แชท', href: '/admin/chats' },
    { icon: '🤖', label: 'AI Agents', href: '/admin/agents' },
    { icon: '📢', label: 'Marketing', href: '/admin/marketing' },
    { icon: '⚙️', label: 'ตั้งค่า', href: '/admin/settings' },
  ];

  const currentPath = router.pathname;

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

  const renderMenu = (mobile = false) => (
    <nav className="p-3 space-y-1">
      {menuItems.map((item) => {
        const isActive = currentPath === item.href || (item.href !== '/admin' && currentPath.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
              isActive
                ? 'bg-purple-50 text-purple-600 border-l-4 border-purple-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            {(mobile || sidebarOpen) && <span className="font-medium text-sm">{item.label}</span>}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex responsive-stack">
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300 fixed h-full z-50 hidden md:block`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
          {sidebarOpen && (
            <Link href="/admin" className="flex items-center gap-2">
              <span className="text-2xl">🐱</span>
              <span className="font-bold text-purple-600">MeowChat</span>
            </Link>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg">
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {renderMenu()}

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <span>👤</span>
            </div>
            {sidebarOpen && (
              <div>
                <p className="font-medium text-sm text-gray-800">ก็อต</p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/40"
            aria-label="Close navigation menu"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="responsive-nav-drawer absolute left-0 top-0 h-full bg-white shadow-2xl flex flex-col">
            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
              <Link href="/admin" className="flex items-center gap-2">
                <span className="text-2xl">🐱</span>
                <span className="font-bold text-purple-600">MeowChat</span>
              </Link>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg" aria-label="Close navigation menu">
                ✕
              </button>
            </div>
            {renderMenu(true)}
            <div className="mt-auto p-4 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span>👤</span>
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-800">ก็อต</p>
                  <p className="text-xs text-gray-500">Admin</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}

      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'} ml-0`}>
        <header className="h-16 bg-white shadow-sm border-b border-gray-100 flex items-center justify-between px-4 md:px-6 sticky top-0 z-40 gap-3 responsive-header-row">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-700"
              aria-label="Open navigation menu"
            >
              ☰
            </button>
            <h1 className="text-lg md:text-xl font-bold text-gray-800 truncate">{title}</h1>
          </div>
          <div className="flex items-center gap-4 responsive-inline">
            <button className="p-2 hover:bg-gray-100 rounded-lg relative shrink-0">
              <span>🔔</span>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <Link href="/" className="text-sm text-purple-600 hover:underline">
              ดูเว็บไซต์ →
            </Link>
          </div>
        </header>

        <div className="p-4 md:p-6 responsive-content">
          {children}
        </div>
      </main>
    </div>
  );
}
