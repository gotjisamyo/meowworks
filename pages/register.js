import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { apiFetch } from '../lib/clientApi';

const steps = [
  { key: 'account', label: 'สมัครสมาชิก', icon: '👤' },
  { key: 'shop', label: 'สร้างร้าน', icon: '🏪' },
  { key: 'product', label: 'เพิ่มสินค้า', icon: '📦' },
  { key: 'line', label: 'เชื่อม LINE', icon: '💬' },
  { key: 'done', label: 'เสร็จแล้ว', icon: '✨' },
];

const initialAccount = { name: '', email: '', password: '', confirmPassword: '' };
const initialShop = { name: '', description: '' };
const initialProduct = { name: '', description: '', price: '', stock: '', category: '' };
const initialLine = { lineChannelId: '', lineChannelSecret: '', lineAccessToken: '' };

export default function Register() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [account, setAccount] = useState(initialAccount);
  const [shopForm, setShopForm] = useState(initialShop);
  const [productForm, setProductForm] = useState(initialProduct);
  const [lineForm, setLineForm] = useState(initialLine);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [user, setUser] = useState(null);
  const [shop, setShop] = useState(null);
  const [lineStatus, setLineStatus] = useState({ type: 'idle', message: 'ยังไม่ได้ทดสอบการเชื่อมต่อ LINE' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.replace('/dashboard');
    }
  }, [router]);

  const canGoBack = currentStep > 0 && currentStep < steps.length - 1;
  const stepTitle = useMemo(() => steps[currentStep]?.label || 'เริ่มต้นใช้งาน', [currentStep]);

  const handleAccountSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (account.password !== account.confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน');
      return;
    }

    if (account.password.length < 6) {
      setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
      return;
    }

    setLoading(true);

    try {
      const data = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: account.name.trim(),
          email: account.email.trim(),
          password: account.password,
        }),
      });

      const nextUser = data.user || null;
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(nextUser || {}));
      setUser(nextUser);
      setCurrentStep(1);
      setSuccess('สมัครสมาชิกสำเร็จแล้ว ต่อไปสร้างร้านแรกของคุณค่ะ');
    } catch (err) {
      setError(err.message || 'สมัครสมาชิกไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  const handleShopSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const data = await apiFetch('/shops', {
        method: 'POST',
        body: JSON.stringify({
          name: shopForm.name.trim(),
          description: shopForm.description.trim(),
        }),
      });

      const createdShop = data.shop;
      setShop(createdShop);
      localStorage.setItem('currentShop', JSON.stringify(createdShop));
      if (createdShop?.id) {
        localStorage.setItem('selectedShopId', createdShop.id);
      }
      if (user) {
        localStorage.setItem('user', JSON.stringify({ ...user, shops: [createdShop] }));
      }
      setCurrentStep(2);
      setSuccess('สร้างร้านสำเร็จแล้ว ลองเพิ่มสินค้าชิ้นแรกกันเลย');
    } catch (err) {
      setError(err.message || 'สร้างร้านไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!shop?.id) {
      setError('ไม่พบร้านค้าที่กำลังตั้งค่า กรุณาย้อนกลับไปสร้างร้านอีกครั้ง');
      return;
    }

    setLoading(true);

    try {
      await apiFetch('/products', {
        method: 'POST',
        body: JSON.stringify({
          shopId: shop.id,
          name: productForm.name.trim(),
          description: productForm.description.trim(),
          price: parseFloat(productForm.price) || 0,
          stock: parseInt(productForm.stock, 10) || 0,
          category: productForm.category.trim(),
        }),
      });

      setCurrentStep(3);
      setSuccess('เพิ่มสินค้าเรียบร้อยแล้ว ถัดไปเชื่อม LINE OA เพื่อเริ่มคุยกับลูกค้าค่ะ');
    } catch (err) {
      setError(err.message || 'เพิ่มสินค้าไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  const handleSkipLine = () => {
    setError('');
    setSuccess('ข้ามการเชื่อม LINE ไปก่อนได้ สามารถกลับมาตั้งค่าทีหลังที่หน้าตั้งค่าร้าน');
    setCurrentStep(4);
  };

  const handleLineSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!shop?.id) {
      setError('ไม่พบร้านค้าที่กำลังตั้งค่า กรุณาย้อนกลับไปสร้างร้านอีกครั้ง');
      return;
    }

    setLoading(true);

    try {
      const data = await apiFetch(`/shops/${shop.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          lineChannelId: lineForm.lineChannelId.trim(),
          lineChannelSecret: lineForm.lineChannelSecret.trim(),
          lineAccessToken: lineForm.lineAccessToken.trim(),
        }),
      });

      const updatedShop = data.shop || { ...shop, ...lineForm };
      setShop(updatedShop);
      localStorage.setItem('currentShop', JSON.stringify(updatedShop));
      setLineStatus({ type: 'success', message: 'บันทึก LINE credentials สำเร็จแล้ว' });
      setCurrentStep(4);
      setSuccess('พร้อมแล้วค่ะ ไปที่ dashboard เพื่อเริ่มใช้งาน MeowChat ได้เลย');
    } catch (err) {
      setError(err.message || 'บันทึก LINE ไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  const testLineConnection = async () => {
    const accessToken = lineForm.lineAccessToken.trim();

    if (!accessToken) {
      setLineStatus({ type: 'error', message: 'กรุณากรอก LINE Channel Access Token ก่อนทดสอบ' });
      return;
    }

    try {
      setLineStatus({ type: 'loading', message: 'กำลังทดสอบการเชื่อมต่อ LINE...' });
      const response = await fetch('https://api.line.me/v2/bot/info', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.message || 'ไม่สามารถเชื่อมต่อกับ LINE Messaging API ได้');
      }

      setLineStatus({
        type: 'success',
        message: `เชื่อมต่อสำเร็จ: ${data?.displayName || 'LINE OA พร้อมใช้งาน'}`,
      });
    } catch (err) {
      setLineStatus({ type: 'error', message: err.message || 'ทดสอบการเชื่อมต่อ LINE ไม่สำเร็จ' });
    }
  };

  const renderStepContent = () => {
    if (currentStep === 0) {
      return (
        <form onSubmit={handleAccountSubmit} className="space-y-4">
          <Field label="ชื่อ-นามสกุล">
            <input
              type="text"
              value={account.name}
              onChange={(e) => setAccount({ ...account, name: e.target.value })}
              className="input"
              placeholder="สมหญิง ใจดี"
              required
            />
          </Field>

          <Field label="อีเมล">
            <input
              type="email"
              value={account.email}
              onChange={(e) => setAccount({ ...account, email: e.target.value })}
              className="input"
              placeholder="owner@shop.com"
              required
            />
          </Field>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="รหัสผ่าน">
              <input
                type="password"
                value={account.password}
                onChange={(e) => setAccount({ ...account, password: e.target.value })}
                className="input"
                placeholder="อย่างน้อย 6 ตัวอักษร"
                required
              />
            </Field>
            <Field label="ยืนยันรหัสผ่าน">
              <input
                type="password"
                value={account.confirmPassword}
                onChange={(e) => setAccount({ ...account, confirmPassword: e.target.value })}
                className="input"
                placeholder="พิมพ์อีกครั้ง"
                required
              />
            </Field>
          </div>

          <button type="submit" disabled={loading} className="primary-btn w-full">
            {loading ? 'กำลังสมัคร...' : 'สมัครและเริ่มตั้งค่าร้าน'}
          </button>
        </form>
      );
    }

    if (currentStep === 1) {
      return (
        <form onSubmit={handleShopSubmit} className="space-y-4">
          <Field label="ชื่อร้าน">
            <input
              type="text"
              value={shopForm.name}
              onChange={(e) => setShopForm({ ...shopForm, name: e.target.value })}
              className="input"
              placeholder="เช่น Meow Coffee"
              required
            />
          </Field>

          <Field label="คำอธิบายร้าน">
            <textarea
              value={shopForm.description}
              onChange={(e) => setShopForm({ ...shopForm, description: e.target.value })}
              className="input min-h-[110px]"
              placeholder="ขายอะไร จุดเด่นอะไร ลูกค้าควรรู้อะไรบ้าง"
            />
          </Field>

          <button type="submit" disabled={loading} className="primary-btn w-full">
            {loading ? 'กำลังสร้างร้าน...' : 'สร้างร้านและไปต่อ'}
          </button>
        </form>
      );
    }

    if (currentStep === 2) {
      return (
        <form onSubmit={handleProductSubmit} className="space-y-4">
          <Field label="ชื่อสินค้า">
            <input
              type="text"
              value={productForm.name}
              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              className="input"
              placeholder="กาแฟคั่วกลาง 250g"
              required
            />
          </Field>

          <Field label="รายละเอียดสินค้า">
            <textarea
              value={productForm.description}
              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
              className="input min-h-[96px]"
              placeholder="บอกจุดเด่น รสชาติ หรือรายละเอียดที่ควรรู้"
            />
          </Field>

          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="ราคา (บาท)">
              <input
                type="number"
                min="0"
                value={productForm.price}
                onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                className="input"
                placeholder="250"
                required
              />
            </Field>
            <Field label="สต็อก">
              <input
                type="number"
                min="0"
                value={productForm.stock}
                onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                className="input"
                placeholder="20"
              />
            </Field>
            <Field label="หมวดหมู่">
              <input
                type="text"
                value={productForm.category}
                onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                className="input"
                placeholder="กาแฟ"
              />
            </Field>
          </div>

          <button type="submit" disabled={loading} className="primary-btn w-full">
            {loading ? 'กำลังเพิ่มสินค้า...' : 'เพิ่มสินค้าชิ้นแรก'}
          </button>
        </form>
      );
    }

    if (currentStep === 3) {
      return (
        <form onSubmit={handleLineSubmit} className="space-y-4">
          <Field label="LINE Channel ID">
            <input
              type="text"
              value={lineForm.lineChannelId}
              onChange={(e) => setLineForm({ ...lineForm, lineChannelId: e.target.value })}
              className="input"
              placeholder="2001234567"
            />
          </Field>

          <Field label="LINE Channel Secret">
            <input
              type="password"
              value={lineForm.lineChannelSecret}
              onChange={(e) => setLineForm({ ...lineForm, lineChannelSecret: e.target.value })}
              className="input"
              placeholder="กรอก secret ของ LINE OA"
            />
          </Field>

          <Field label="LINE Channel Access Token">
            <textarea
              value={lineForm.lineAccessToken}
              onChange={(e) => setLineForm({ ...lineForm, lineAccessToken: e.target.value })}
              className="input min-h-[120px]"
              placeholder="กรอก access token เพื่อให้ระบบตอบลูกค้าผ่าน LINE"
            />
          </Field>

          <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm">
            <div className="font-medium text-gray-900">สถานะการเชื่อมต่อ</div>
            <div className={`mt-2 ${lineStatus.type === 'error' ? 'text-red-600' : lineStatus.type === 'success' ? 'text-green-600' : 'text-gray-600'}`}>
              {lineStatus.message}
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            <button type="button" onClick={testLineConnection} className="secondary-btn">
              ทดสอบ LINE
            </button>
            <button type="button" onClick={handleSkipLine} className="secondary-btn">
              ข้ามไว้ก่อน
            </button>
            <button type="submit" disabled={loading} className="primary-btn">
              {loading ? 'กำลังบันทึก...' : 'บันทึกและเสร็จสิ้น'}
            </button>
          </div>
        </form>
      );
    }

    return (
      <div className="space-y-6 text-center">
        <div className="text-6xl">🎉</div>
        <div>
          <h4 className="text-2xl font-bold text-gray-900">ร้านของคุณพร้อมแล้ว</h4>
          <p className="text-gray-600 mt-2">เข้าสู่ dashboard เพื่อดูภาพรวมร้าน จัดการสินค้า และตั้งค่า LINE เพิ่มเติมได้ทันทีค่ะ</p>
        </div>

        <div className="rounded-2xl bg-indigo-50 border border-indigo-100 p-5 text-left space-y-2">
          <div className="flex items-center justify-between gap-4">
            <span className="text-gray-500">เจ้าของร้าน</span>
            <span className="font-semibold text-gray-900">{user?.name || '-'}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-gray-500">ร้าน</span>
            <span className="font-semibold text-gray-900">{shop?.name || '-'}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-gray-500">สินค้าแรก</span>
            <span className="font-semibold text-gray-900">{productForm.name || '-'}</span>
          </div>
        </div>

        <button onClick={() => router.push('/dashboard')} className="primary-btn w-full">
          ไปที่ Dashboard
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#c7d2fe,_#a78bfa_45%,_#4338ca)] px-4 py-8 md:py-12">
      <div className="mx-auto max-w-6xl grid xl:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
        <div className="text-white xl:sticky xl:top-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm backdrop-blur">
            <span>🚀</span>
            <span>Onboarding ภายในไม่กี่นาที</span>
          </div>
          <h1 className="mt-6 text-4xl md:text-5xl font-bold leading-tight">เปิดร้านบน MeowChat แบบลื่น ๆ ตั้งแต่สมัครจนพร้อมขาย</h1>
          <p className="mt-4 text-lg text-indigo-100 max-w-2xl">เราจะพาคุณผ่านทุกขั้นตอนสำคัญ: สมัครสมาชิก สร้างร้าน เพิ่มสินค้า และเชื่อม LINE OA ก่อนพาเข้าสู่ dashboard อัตโนมัติค่ะ</p>

          <div className="mt-8 grid gap-3">
            {steps.map((step, index) => {
              const active = index === currentStep;
              const done = index < currentStep;
              return (
                <div
                  key={step.key}
                  className={`rounded-2xl border px-4 py-4 transition ${active ? 'border-white bg-white text-gray-900 shadow-xl' : done ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : 'border-white/20 bg-white/10 text-white backdrop-blur'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center text-lg ${active ? 'bg-indigo-100' : done ? 'bg-emerald-100' : 'bg-white/15'}`}>
                      {done ? '✓' : step.icon}
                    </div>
                    <div>
                      <div className="text-sm opacity-70">ขั้นตอน {index + 1}</div>
                      <div className="font-semibold">{step.label}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-[28px] shadow-2xl p-6 md:p-8">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <div className="text-sm font-medium text-indigo-600">MeowChat Onboarding</div>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stepTitle}</h3>
              <p className="text-gray-500 mt-2">{currentStep < 4 ? `ขั้นตอน ${currentStep + 1} จาก ${steps.length}` : 'พร้อมเข้าใช้งานแล้วค่ะ'}</p>
            </div>
            <div className="rounded-full bg-indigo-50 text-indigo-700 px-4 py-2 text-sm font-semibold">
              {Math.round((currentStep / (steps.length - 1)) * 100)}%
            </div>
          </div>

          <div className="mb-6 h-2 rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300" style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }} />
          </div>

          {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div>}
          {success && <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">{success}</div>}

          {renderStepContent()}

          <div className="mt-6 flex items-center justify-between gap-4 text-sm">
            <div className="text-gray-500">
              มีบัญชีอยู่แล้ว?{' '}
              <Link href="/login" className="font-semibold text-indigo-600 hover:underline">
                เข้าสู่ระบบ
              </Link>
            </div>

            {canGoBack ? (
              <button type="button" onClick={() => { setError(''); setSuccess(''); setCurrentStep((prev) => prev - 1); }} className="text-gray-600 hover:text-gray-900 font-medium">
                ← ย้อนกลับ
              </button>
            ) : <span />}
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
        .primary-btn {
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          color: white;
          border-radius: 14px;
          padding: 0.95rem 1rem;
          font-weight: 600;
          transition: transform 0.15s ease, opacity 0.2s ease;
        }
        .primary-btn:hover {
          transform: translateY(-1px);
        }
        .primary-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        .secondary-btn {
          background: white;
          color: #374151;
          border: 1px solid #d1d5db;
          border-radius: 14px;
          padding: 0.95rem 1rem;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 mb-1.5">{label}</span>
      {children}
    </label>
  );
}
