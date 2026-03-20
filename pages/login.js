import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { apiFetch } from '../lib/clientApi';

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '', remember: true });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.replace('/dashboard');
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: form.email.trim(), password: form.password }),
      });

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user || {}));

      try {
        const shopsData = await apiFetch('/shops');
        const firstShop = shopsData?.shops?.[0];
        if (firstShop) {
          localStorage.setItem('currentShop', JSON.stringify(firstShop));
          localStorage.setItem('selectedShopId', firstShop.id);
          localStorage.setItem('user', JSON.stringify({ ...(data.user || {}), shops: shopsData.shops }));
        } else {
          localStorage.removeItem('currentShop');
          localStorage.removeItem('selectedShopId');
        }
      } catch {
        // ไม่ block login ถ้าดึง shops ไม่สำเร็จ
      }

      router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'เข้าสู่ระบบไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_#1d4ed8,_#4338ca_45%,_#0f172a)] px-4 py-8 md:py-12 flex items-center">
      <div className="mx-auto w-full max-w-6xl grid lg:grid-cols-[1.05fr_0.95fr] gap-8 items-center">
        <div className="text-white">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-4 py-2 text-sm backdrop-blur">
            <span>🐈</span>
            <span>Welcome back to MeowChat</span>
          </div>
          <h1 className="mt-6 text-4xl md:text-5xl font-bold leading-tight">ล็อกอินแล้วเข้าหน้า dashboard ได้ทันที ไม่หลง ไม่วกค่ะ</h1>
          <p className="mt-4 text-lg text-slate-200 max-w-2xl">จัดการสินค้า ออร์เดอร์ ลูกค้า และการเชื่อม LINE OA ได้จากที่เดียว พร้อมเลือกร้านล่าสุดให้อัตโนมัติเมื่อเป็นไปได้</p>

          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            {[
              { title: 'Dashboard ทันที', desc: 'หลัง login จะพาเข้าภาพรวมร้านโดยตรง' },
              { title: 'จำร้านล่าสุด', desc: 'ถ้ามีร้าน ระบบจะตั้ง current shop ให้เลย' },
              { title: 'พร้อมขาย', desc: 'ต่อยอดไปสินค้า ออร์เดอร์ และ LINE ได้ทันที' },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl bg-white/10 border border-white/10 p-4 backdrop-blur">
                <div className="font-semibold">{item.title}</div>
                <div className="text-sm text-slate-200 mt-2">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[28px] shadow-2xl p-6 md:p-8">
          <div className="text-center mb-8">
            <div className="text-4xl">🤖</div>
            <h2 className="text-3xl font-bold text-gray-900 mt-3">เข้าสู่ระบบ</h2>
            <p className="text-gray-500 mt-2">กรอกบัญชีของคุณเพื่อไปต่อที่ dashboard ค่ะ</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="block text-sm font-medium text-gray-700 mb-1.5">อีเมล</span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input"
                placeholder="your@email.com"
                autoComplete="email"
                required
              />
            </label>

            <label className="block">
              <span className="block text-sm font-medium text-gray-700 mb-1.5">รหัสผ่าน</span>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input"
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </label>

            <label className="flex items-center gap-3 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={form.remember}
                onChange={(e) => setForm({ ...form, remember: e.target.checked })}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>จำการเข้าสู่ระบบบนอุปกรณ์นี้</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3.5 rounded-xl font-semibold hover:opacity-95 transition disabled:opacity-50"
            >
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบไป Dashboard'}
            </button>
          </form>

          <div className="mt-6 rounded-2xl bg-slate-50 border border-slate-200 p-4 text-sm text-gray-600">
            <div className="font-semibold text-gray-900">ยังไม่มีบัญชี?</div>
            <div className="mt-1">สมัครแล้วทำ onboarding ครบใน flow เดียวได้เลย</div>
            <Link href="/register" className="inline-flex mt-3 text-indigo-600 font-semibold hover:underline">
              ไปหน้าสมัครสมาชิก →
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          padding: 0.9rem 1rem;
          outline: none;
          transition: all 0.2s ease;
        }
        .input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.12);
        }
      `}</style>
    </div>
  );
}
