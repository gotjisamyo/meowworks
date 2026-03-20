import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/AdminLayout';
import { apiFetch, API_BASE_URL, getToken } from '../../lib/clientApi';

const PLAN_OPTIONS = ['free', 'starter', 'business', 'enterprise'];

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [shops, setShops] = useState([]);
  const [payments, setPayments] = useState([]);
  const [busyAction, setBusyAction] = useState('');

  useEffect(() => {
    bootstrap();
  }, []);

  const bootstrap = async () => {
    const token = getToken();
    if (!token) {
      router.replace('/login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const me = await apiFetch('/auth/me');
      if ((me?.user?.role || 'user') !== 'admin') {
        setAuthorized(false);
        setError('หน้านี้สำหรับ admin เท่านั้น');
        return;
      }

      setAuthorized(true);
      await Promise.all([loadShops(), loadPayments()]);
    } catch (err) {
      const nextMessage = err.message || 'โหลดข้อมูลหลังบ้านไม่สำเร็จ';
      setError(nextMessage);
      if (/unauthorized|token|expired/i.test(nextMessage)) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.replace('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadShops = async () => {
    const data = await apiFetch('/admin/shops');
    setShops(data?.shops || []);
  };

  const loadPayments = async () => {
    const data = await apiFetch('/admin/payments');
    setPayments(data?.payments || []);
  };

  const refreshAll = async () => {
    await Promise.all([loadShops(), loadPayments()]);
  };

  const updatePlan = async (shopId, plan) => {
    const actionKey = `plan-${shopId}`;
    setBusyAction(actionKey);
    setError('');
    setMessage('');

    try {
      await apiFetch(`/admin/shops/${shopId}/plan`, {
        method: 'PATCH',
        body: JSON.stringify({ plan }),
      });
      setMessage('อัปเดตแพ็กเกจร้านเรียบร้อยแล้ว');
      await loadShops();
    } catch (err) {
      setError(err.message || 'เปลี่ยนแพ็กเกจไม่สำเร็จ');
    } finally {
      setBusyAction('');
    }
  };

  const updatePaymentStatus = async (paymentId, action) => {
    const actionKey = `${action}-${paymentId}`;
    setBusyAction(actionKey);
    setError('');
    setMessage('');

    try {
      await apiFetch(`/admin/payments/${paymentId}/${action}`, {
        method: 'POST',
      });
      setMessage(action === 'approve' ? 'อนุมัติการแจ้งโอนแล้ว' : 'ปฏิเสธการแจ้งโอนแล้ว');
      await loadPayments();
    } catch (err) {
      setError(err.message || 'อัปเดตสถานะการแจ้งโอนไม่สำเร็จ');
    } finally {
      setBusyAction('');
    }
  };

  const stats = useMemo(() => {
    const pendingPayments = payments.filter((item) => item.status === 'pending').length;
    const approvedPayments = payments.filter((item) => item.status === 'approved').length;
    const enterpriseShops = shops.filter((item) => item.plan === 'enterprise').length;

    return {
      totalShops: shops.length,
      pendingPayments,
      approvedPayments,
      enterpriseShops,
    };
  }, [shops, payments]);

  if (loading) {
    return (
      <AdminLayout title="System Admin">
        <LoadingView />
      </AdminLayout>
    );
  }

  if (!authorized) {
    return (
      <AdminLayout title="System Admin">
        <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-8 text-red-700">
          <div className="text-2xl font-bold">⛔ ไม่มีสิทธิ์เข้าถึง</div>
          <p className="mt-2">{error || 'เฉพาะ admin เท่านั้น'}</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="System Admin Dashboard">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-900 to-violet-900 p-6 text-white lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm">👑 Admin only</div>
            <h2 className="mt-3 text-3xl font-bold">หลังบ้านผู้บริหารสำหรับดูร้าน ดูแจ้งโอน และจัดการแพ็กเกจ</h2>
            <p className="mt-2 max-w-3xl text-sm text-slate-200">หน้านี้รวมเครื่องมือหลักที่พี่ก็อตต้องใช้: ดูร้านทั้งหมด ตรวจสอบ payment notifications อนุมัติหรือปฏิเสธ และเปลี่ยน plan ของลูกค้าได้จากหน้าเดียวค่ะ</p>
          </div>
          <button onClick={refreshAll} className="rounded-2xl bg-white px-4 py-3 font-semibold text-slate-900 transition hover:bg-slate-100">
            รีเฟรชข้อมูล
          </button>
        </div>

        {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div>}
        {message && <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">{message}</div>}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="ร้านทั้งหมด" value={stats.totalShops} icon="🏪" color="from-indigo-500 to-violet-500" />
          <StatCard label="แจ้งโอนรอตรวจ" value={stats.pendingPayments} icon="💸" color="from-amber-500 to-orange-500" />
          <StatCard label="แจ้งโอนอนุมัติแล้ว" value={stats.approvedPayments} icon="✅" color="from-emerald-500 to-green-500" />
          <StatCard label="ร้านแพ็กเกจ Enterprise" value={stats.enterpriseShops} icon="🚀" color="from-sky-500 to-cyan-500" />
        </div>

        <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">รายชื่อร้านทั้งหมด</h3>
              <p className="text-sm text-gray-500">ดูเจ้าของร้าน อีเมล วันที่สร้าง และเปลี่ยนแพ็กเกจได้ทันที</p>
            </div>
            <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">{shops.length} ร้าน</div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500">
                  <th className="pb-3 pr-4 font-medium">ร้าน</th>
                  <th className="pb-3 pr-4 font-medium">เจ้าของ</th>
                  <th className="pb-3 pr-4 font-medium">แพ็กเกจ</th>
                  <th className="pb-3 pr-4 font-medium">สร้างเมื่อ</th>
                  <th className="pb-3 font-medium">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {shops.map((shop) => (
                  <tr key={shop.id} className="border-b border-gray-50 align-top last:border-0">
                    <td className="py-4 pr-4">
                      <div className="font-semibold text-gray-900">{shop.name}</div>
                      <div className="text-xs text-gray-500">ID: {shop.id}</div>
                      {shop.description && <div className="mt-1 text-xs text-gray-500">{shop.description}</div>}
                    </td>
                    <td className="py-4 pr-4">
                      <div className="font-medium text-gray-800">{shop.owner_name || '-'}</div>
                      <div className="text-xs text-gray-500">{shop.owner_email || '-'}</div>
                    </td>
                    <td className="py-4 pr-4">
                      <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase text-indigo-700">{shop.plan || 'free'}</span>
                    </td>
                    <td className="py-4 pr-4 text-gray-600">{formatDate(shop.created_at)}</td>
                    <td className="py-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <select
                          value={shop.plan || 'free'}
                          onChange={(e) => updatePlan(shop.id, e.target.value)}
                          disabled={busyAction === `plan-${shop.id}`}
                          className="rounded-xl border border-gray-200 px-3 py-2"
                        >
                          {PLAN_OPTIONS.map((plan) => (
                            <option key={plan} value={plan}>{plan}</option>
                          ))}
                        </select>
                        <span className="text-xs text-gray-400">
                          {busyAction === `plan-${shop.id}` ? 'กำลังบันทึก...' : 'เปลี่ยน plan ได้ทันที'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
                {!shops.length && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">ยังไม่มีข้อมูลร้านค้า</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Payment Notifications</h3>
              <p className="text-sm text-gray-500">ดูหลักฐานการโอน พร้อมกด approve/reject ได้จากรายการเดียว</p>
            </div>
            <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">{payments.length} รายการ</div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {payments.map((payment) => (
              <article key={payment.id} className="rounded-3xl border border-gray-200 p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-lg font-bold text-gray-900">{payment.payer_name}</div>
                    <div className="text-sm text-gray-500">แจ้งเมื่อ {formatDate(payment.created_at)}</div>
                  </div>
                  <StatusBadge status={payment.status} />
                </div>

                <div className="mt-4 grid gap-3 text-sm text-gray-700 sm:grid-cols-2">
                  <Info label="จำนวนเงิน" value={formatCurrency(payment.amount)} />
                  <Info label="วันที่โอน" value={formatDate(payment.transfer_date)} />
                  <Info label="ธนาคาร" value={payment.bank_name} />
                  <Info label="เลขบัญชี" value={payment.account_number} />
                </div>

                {payment.proof_base64 && (
                  <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
                    <img
                      src={`data:${payment.proof_content_type || 'image/jpeg'};base64,${payment.proof_base64}`}
                      alt={`proof-${payment.id}`}
                      className="h-64 w-full object-contain bg-white"
                    />
                  </div>
                )}

                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() => updatePaymentStatus(payment.id, 'approve')}
                    disabled={payment.status === 'approved' || busyAction === `approve-${payment.id}` || busyAction === `reject-${payment.id}`}
                    className="flex-1 rounded-2xl bg-emerald-500 px-4 py-3 font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {busyAction === `approve-${payment.id}` ? 'กำลังอนุมัติ...' : 'Approve'}
                  </button>
                  <button
                    onClick={() => updatePaymentStatus(payment.id, 'reject')}
                    disabled={payment.status === 'rejected' || busyAction === `approve-${payment.id}` || busyAction === `reject-${payment.id}`}
                    className="flex-1 rounded-2xl bg-rose-500 px-4 py-3 font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {busyAction === `reject-${payment.id}` ? 'กำลังปฏิเสธ...' : 'Reject'}
                  </button>
                </div>
              </article>
            ))}

            {!payments.length && (
              <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 px-6 py-10 text-center text-gray-500 lg:col-span-2">
                ยังไม่มี payment notifications ในระบบ
              </div>
            )}
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

function LoadingView() {
  return (
    <div className="flex h-64 items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className={`rounded-3xl bg-gradient-to-r ${color} p-5 text-white shadow-lg`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm text-white/80">{label}</div>
          <div className="mt-2 text-3xl font-bold">{value}</div>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    pending: 'bg-amber-100 text-amber-700',
    approved: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-rose-100 text-rose-700',
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[status] || 'bg-slate-100 text-slate-700'}`}>
      {status || 'unknown'}
    </span>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 px-4 py-3">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="mt-1 font-medium text-gray-900">{value || '-'}</div>
    </div>
  );
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(Number(amount || 0));
}

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('th-TH', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}
