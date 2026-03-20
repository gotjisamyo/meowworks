import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AppShell from '../components/AppShell';
import { apiFetch, ensureShopSelected } from '../lib/clientApi';

const STATUS_LABELS = {
  pending: 'รอดำเนินการ',
  completed: 'เสร็จสิ้น',
  confirmed: 'ยืนยันแล้ว',
  shipping: 'จัดส่งแล้ว',
  cancelled: 'ยกเลิก',
};

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-green-100 text-green-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipping: 'bg-indigo-100 text-indigo-700',
  cancelled: 'bg-red-100 text-red-700',
};

function getOrderDate(order) {
  return order?.created_at || order?.updated_at || order?.order_date || order?.date || null;
}

function normalizeStatus(status) {
  const value = String(status || '').toLowerCase();
  if (value === 'paid' || value === 'success' || value === 'done') return 'completed';
  if (value === 'new' || value === 'awaiting_payment' || value === 'processing') return 'pending';
  return value || 'pending';
}

function getCustomerName(order) {
  return (
    order?.customer_name ||
    order?.customer?.name ||
    order?.customer?.display_name ||
    order?.customer?.line_name ||
    order?.customer_id ||
    '-'
  );
}

function getOrderNumber(order) {
  return order?.order_number || order?.orderNo || order?.id || '-';
}

function getOrderTotal(order) {
  return Number(order?.total_amount || order?.total || order?.amount || 0);
}

function formatDateTime(value) {
  if (!value) return '-';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return new Intl.DateTimeFormat('th-TH', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export default function OrdersPage() {
  const router = useRouter();
  const [shop, setShop] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const currentShop = ensureShopSelected(router);
    if (!currentShop) {
      setLoading(false);
      return;
    }

    setShop(currentShop);
    fetchOrders(currentShop.id);
  }, [router]);

  const fetchOrders = async (shopId) => {
    try {
      setLoading(true);
      setError('');
      const data = await apiFetch(`/orders/${shopId}`);
      const safeOrders = Array.isArray(data) ? data : data?.orders || [];
      setOrders(Array.isArray(safeOrders) ? safeOrders : []);
    } catch (err) {
      setError(err.message || 'โหลดออร์เดอร์ไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (order, newStatus) => {
    try {
      await apiFetch(`/orders/${shop.id}/${order.id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      fetchOrders(shop.id);
    } catch (err) {
      alert('อัปเดตสถานะไม่สำเร็จ: ' + err.message);
    }
  };

  const latestOrders = useMemo(() => {
    return [...orders].sort((a, b) => {
      const aTime = new Date(getOrderDate(a) || 0).getTime();
      const bTime = new Date(getOrderDate(b) || 0).getTime();
      return bTime - aTime;
    });
  }, [orders]);

  if (!shop && !loading) {
    return (
      <AppShell title="ออร์เดอร์" subtitle="กรุณาเลือกร้านค้าก่อน">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <div className="text-5xl mb-4">🏪</div>
          <p className="text-gray-700 mb-4">ยังไม่ได้เลือกร้านค้าค่ะ</p>
          <button onClick={() => router.push('/shops')} className="bg-indigo-600 text-white px-5 py-3 rounded-lg hover:bg-indigo-700">
            ไปเลือกร้านค้า
          </button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="ออร์เดอร์" subtitle="รายการออร์เดอร์ล่าสุดจากร้านของคุณ" shopName={shop?.name}>
      {error && <div className="mb-6 rounded-xl bg-red-50 text-red-700 px-4 py-3 border border-red-200">{error}</div>}

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center text-gray-500">กำลังโหลดข้อมูล...</div>
      ) : latestOrders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center text-gray-500">ยังไม่มีออร์เดอร์ในร้านนี้</div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="font-semibold text-gray-900">ออร์เดอร์ล่าสุด</h2>
              <p className="text-sm text-gray-500 mt-1">เรียงจากใหม่ไปเก่าค่ะ</p>
            </div>
            <div className="text-sm text-gray-500">ทั้งหมด {latestOrders.length} รายการ</div>
          </div>

          <div className="md:hidden divide-y divide-gray-100">
            {latestOrders.map((order) => {
              const status = normalizeStatus(order.status);
              const isPending = status === 'pending';
              const isCompleted = status === 'completed';

              return (
                <div key={order.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-gray-900">{getOrderNumber(order)}</div>
                      <div className="text-sm text-gray-500 mt-1">{getCustomerName(order)}</div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[status] || 'bg-gray-100 text-gray-700'}`}>
                      {STATUS_LABELS[status] || status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="text-gray-400">จำนวนเงิน</div>
                      <div className="text-gray-900 font-medium mt-1">฿{getOrderTotal(order).toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">วันที่สั่งซื้อ</div>
                      <div className="text-gray-700 mt-1">{formatDateTime(getOrderDate(order))}</div>
                    </div>
                  </div>

                  <div>
                    {isPending && (
                      <button
                        onClick={() => updateStatus(order, 'completed')}
                        className="w-full rounded-xl bg-green-50 px-4 py-2.5 text-sm font-medium text-green-700"
                      >
                        ทำเป็น completed
                      </button>
                    )}
                    {isCompleted && <span className="text-xs text-gray-400">เสร็จแล้ว</span>}
                    {!isPending && !isCompleted && <span className="text-xs text-gray-400">-</span>}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-3">เลขออร์เดอร์</th>
                  <th className="text-left px-6 py-3">ลูกค้า</th>
                  <th className="text-left px-6 py-3">จำนวนเงิน</th>
                  <th className="text-left px-6 py-3">สถานะ</th>
                  <th className="text-left px-6 py-3">วันที่สั่งซื้อ</th>
                  <th className="text-left px-6 py-3">การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                {latestOrders.map((order) => {
                  const status = normalizeStatus(order.status);
                  const isPending = status === 'pending';
                  const isCompleted = status === 'completed';

                  return (
                    <tr key={order.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{getOrderNumber(order)}</td>
                      <td className="px-6 py-4 text-gray-600">{getCustomerName(order)}</td>
                      <td className="px-6 py-4 text-gray-900">฿{getOrderTotal(order).toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[status] || 'bg-gray-100 text-gray-700'}`}>
                          {STATUS_LABELS[status] || status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{formatDateTime(getOrderDate(order))}</td>
                      <td className="px-6 py-4">
                        {isPending && (
                          <button
                            onClick={() => updateStatus(order, 'completed')}
                            className="text-green-600 hover:underline text-xs"
                          >
                            ทำเป็น completed
                          </button>
                        )}
                        {isCompleted && <span className="text-xs text-gray-400">เสร็จแล้ว</span>}
                        {!isPending && !isCompleted && <span className="text-xs text-gray-400">-</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AppShell>
  );
}
