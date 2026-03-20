import { useMemo, useState } from 'react';
import Link from 'next/link';
import { API_BASE_URL } from '../lib/clientApi';

const bankInfo = {
  bankName: 'กสิกรไทย (Kasikornbank)',
  accountName: 'นายกฤษฐาพงศ์ จิรกุลวิชยวงษ์',
  accountNumber: '089-3-66849-7',
};

const qrPayload = `|${bankInfo.bankName}|${bankInfo.accountName}|${bankInfo.accountNumber}|`;
const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(qrPayload)}`;

export default function PaymentPage() {
  const [form, setForm] = useState({
    payerName: '',
    amount: '',
    transferDate: '',
    proofImage: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copied, setCopied] = useState(false);

  const amountPreview = useMemo(() => {
    if (!form.amount) return '-';
    const value = Number(form.amount);
    if (!Number.isFinite(value)) return '-';
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      maximumFractionDigits: 2,
    }).format(value);
  }, [form.amount]);

  const copyAccountNumber = async () => {
    try {
      await navigator.clipboard.writeText(bankInfo.accountNumber.replace(/-/g, ''));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setError('คัดลอกเลขบัญชีไม่สำเร็จ ลองคัดลอกด้วยตนเองนะคะ');
    }
  };

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      handleChange('proofImage', null);
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || '');
      const [, base64 = ''] = result.split(',');
      handleChange('proofImage', {
        fileName: file.name,
        contentType: file.type,
        base64,
        previewUrl: result,
      });
      setError('');
    };
    reader.onerror = () => {
      setError('อ่านไฟล์รูปไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!form.payerName.trim()) {
      setError('กรุณากรอกชื่อผู้โอน');
      return;
    }
    if (!form.amount || Number(form.amount) <= 0) {
      setError('กรุณากรอกจำนวนเงินให้ถูกต้อง');
      return;
    }
    if (!form.transferDate) {
      setError('กรุณาเลือกวันที่โอน');
      return;
    }
    if (!form.proofImage?.base64) {
      setError('กรุณาอัปโหลดหลักฐานการโอน');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/payment/notify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payerName: form.payerName.trim(),
          amount: Number(form.amount),
          transferDate: form.transferDate,
          proofImage: {
            fileName: form.proofImage.fileName,
            contentType: form.proofImage.contentType,
            base64: form.proofImage.base64,
          },
          bankName: bankInfo.bankName,
          accountName: bankInfo.accountName,
          accountNumber: bankInfo.accountNumber,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.error || data?.message || 'ส่งแจ้งโอนไม่สำเร็จ');
      }

      setSuccess('ส่งข้อมูลแจ้งโอนเรียบร้อยแล้ว ทีมงานจะตรวจสอบและยืนยันให้โดยเร็วที่สุดค่ะ');
      setForm({
        payerName: '',
        amount: '',
        transferDate: '',
        proofImage: null,
      });
    } catch (submitError) {
      setError(submitError.message || 'เกิดข้อผิดพลาดระหว่างส่งแจ้งโอน');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-2xl">🐱</span>
            <div>
              <div className="text-lg font-bold">MeowChat Payment</div>
              <div className="text-xs text-slate-400">แจ้งชำระเงินแบบโอนธนาคาร</div>
            </div>
          </Link>
          <Link href="/pricing" className="text-sm text-slate-300 hover:text-white">
            ดูแพ็กเกจ
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <section className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200">
                <span>🏦</span>
                <span>Manual Payment / Bank Transfer</span>
              </div>
              <h1 className="mt-5 text-4xl font-bold leading-tight md:text-5xl">
                โอนเงินเข้าบัญชี แล้วส่งหลักฐานมาให้ทีมตรวจสอบได้เลยค่ะ
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-slate-300">
                หน้านี้รวมข้อมูลบัญชีสำหรับโอนเงิน ปุ่มคัดลอกเลขบัญชี QR code สำหรับสแกน และฟอร์มแจ้งโอนในหน้าเดียว ใช้งานง่ายทั้งบนมือถือและเดสก์ท็อปค่ะ
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm text-slate-400">ข้อมูลบัญชีรับโอน</div>
                  <h2 className="mt-2 text-2xl font-bold">{bankInfo.bankName}</h2>
                </div>
                <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-sm font-medium text-emerald-200">
                  พร้อมรับชำระ
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <InfoRow label="ธนาคาร" value={bankInfo.bankName} />
                <InfoRow label="ชื่อบัญชี" value={bankInfo.accountName} />
                <InfoRow label="เลขบัญชี" value={bankInfo.accountNumber} strong />
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={copyAccountNumber}
                  className="rounded-2xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400"
                >
                  {copied ? 'คัดลอกเลขบัญชีแล้ว ✓' : 'Copy เลขบัญชี'}
                </button>
                <a
                  href={qrImageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl border border-white/15 px-5 py-3 font-semibold text-white transition hover:bg-white/5"
                >
                  เปิด QR code ขนาดใหญ่
                </a>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white p-6 text-slate-900">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm text-slate-500">QR code สำหรับชำระเงิน</div>
                  <h3 className="mt-1 text-xl font-bold">สแกนเพื่อดูข้อมูลบัญชี</h3>
                </div>
                <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">QR พร้อมใช้</div>
              </div>

              <div className="flex flex-col items-center gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <img src={qrImageUrl} alt="QR code สำหรับชำระเงิน" className="h-64 w-64 rounded-2xl bg-white p-3 shadow-sm" />
                <p className="text-center text-sm text-slate-500">
                  ถ้าต้องการ PromptPay QR จริงในอนาคต แนะนำให้เปลี่ยนจาก QR placeholder นี้ไปใช้ payload มาตรฐาน EMVCo/PromptPay ค่ะ
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white p-6 text-slate-900 shadow-2xl shadow-black/20 md:p-8">
            <div className="mb-6">
              <div className="text-sm font-medium text-indigo-600">Payment Notification Form</div>
              <h2 className="mt-1 text-3xl font-bold">ฟอร์มแจ้งโอนเงิน</h2>
              <p className="mt-2 text-slate-500">
                กรอกชื่อผู้โอน จำนวนเงิน วันที่โอน และแนบหลักฐานการโอนเพื่อส่งให้ระบบบันทึกเข้าฐานข้อมูลค่ะ
              </p>
            </div>

            {error && <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div>}
            {success && <div className="mb-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">{success}</div>}

            <form onSubmit={handleSubmit} className="space-y-5">
              <Field label="ชื่อผู้โอน">
                <input
                  type="text"
                  value={form.payerName}
                  onChange={(e) => handleChange('payerName', e.target.value)}
                  className="input"
                  placeholder="เช่น สมหญิง ใจดี"
                  required
                />
              </Field>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="จำนวนเงิน (บาท)">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.amount}
                    onChange={(e) => handleChange('amount', e.target.value)}
                    className="input"
                    placeholder="999.00"
                    required
                  />
                </Field>

                <Field label="วันที่โอน">
                  <input
                    type="datetime-local"
                    value={form.transferDate}
                    onChange={(e) => handleChange('transferDate', e.target.value)}
                    className="input"
                    required
                  />
                </Field>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                ยอดที่กรอกตอนนี้: <span className="font-semibold text-slate-900">{amountPreview}</span>
              </div>

              <Field label="หลักฐานการโอน (อัปโหลดรูป)">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm"
                  required
                />
              </Field>

              {form.proofImage?.previewUrl && (
                <div className="rounded-3xl border border-slate-200 p-4">
                  <div className="mb-3 text-sm font-medium text-slate-600">ตัวอย่างสลิปที่แนบ</div>
                  <img
                    src={form.proofImage.previewUrl}
                    alt="หลักฐานการโอน"
                    className="max-h-[360px] w-full rounded-2xl object-contain bg-slate-50"
                  />
                  <div className="mt-3 text-xs text-slate-500">ไฟล์: {form.proofImage.fileName}</div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-4 text-base font-semibold text-white transition hover:from-indigo-500 hover:to-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'กำลังส่งข้อมูลแจ้งโอน...' : 'ส่งแจ้งโอนเงิน'}
              </button>
            </form>
          </div>
        </section>
      </main>

      <style jsx>{`
        .input {
          width: 100%;
          border: 1px solid #e2e8f0;
          border-radius: 1rem;
          padding: 0.95rem 1rem;
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

function InfoRow({ label, value, strong = false }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm text-slate-400">{label}</span>
      <span className={strong ? 'text-lg font-bold text-white' : 'font-medium text-white'}>{value}</span>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

