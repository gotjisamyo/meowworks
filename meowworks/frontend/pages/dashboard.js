import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import AppShell from '../components/AppShell';
import { apiFetch, ensureShopSelected } from '../lib/clientApi';

function formatCurrency(value) {
  return `฿${Number(value || 0).toLocaleString()}`;
}

function formatDateTime(value) {
  if (!value) return '-';

  try {
    return new Date(value).toLocaleString('th-TH', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return value;
  }
}

function getTodayRevenue(orders) {
  const today = new Date();
  const y = today.getFullYear();
  const m = today.getMonth();
  const d = today.getDate();

  return orders.reduce((sum, order) => {
    if (!order?.created_at) return sum;

    const createdAt = new Date(order.created_at);
    const isToday = createdAt.getFullYear() === y && createdAt.getMonth() === m && createdAt.getDate() === d;

    if (!isToday) return sum;
    return sum + Number(order.total_amount || 0);
  }, 0);
}

function buildActivities(orders, customersById) {
  const orderActivities = (orders || []).slice(0, 5).map((order) => ({
    id: `order-${order.id}`,
    icon: '🧾',
    title: `ออร์เดอร์ ${order.order_number || order.id}`,
    description: `${customersById[order.customer_id]?.name || 'ลูกค้าทั่วไป'} • ${formatCurrency(order.total_amount)}`,
    status: order.status || '-',
    time: order.created_at,
  }));

  const newCustomerActivities = Object.values(customersById)
    .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
    .slice(0, 3)
    .map((customer) => ({
      id: `customer-${customer.id}`,
      icon: '👤',
      title: `ลูกค้าใหม่ ${customer.name || 'ไม่ระบุชื่อ'}`,
      description: `กลุ่ม ${customer.customer_group || 'regular'}`,
      status: customer.status || 'active',
      time: customer.created_at,
    }));

  return [...orderActivities, ...newCustomerActivities]
    .sort((a, b) => new Date(b.time || 0) - new Date(a.time || 0))
    .slice(0, 6);
}

export default function DashboardPage() {
  const router = useRouter();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    recentOrdersCount: 0,
    revenueToday: 0,
    customersTotal: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [customersById, setCustomersById] = useState({});

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
    loadDashboard(currentShop.id);
  }, [router]);

  const loadDashboard = async (shopId) => {
    try {
      setLoading(true);
      setError('');

      const [orders, crmStats, customers] = await Promise.all([
        apiFetch(`/orders/${shopId}`),
        apiFetch(`/crm/${shopId}/stats`),
        apiFetch(`/crm/list/${shopId}`),
      ]);

      const safeOrders = Array.isArray(orders) ? orders : [];
      const safeCustomers = Array.isArray(customers) ? customers : [];
      const customerMap = safeCustomers.reduce((acc, customer) => {
        acc[customer.id] = customer;
        return acc;
      }, {});

      setStats({
        recentOrdersCount: safeOrders.length,
        revenueToday: getTodayRevenue(safeOrders),
        customersTotal: Number(crmStats?.total_customers || safeCustomers.length || 0),
      });
      setCustomersById(customerMap);
      setRecentOrders(safeOrders.slice(0, 5));
      setRecentActivities(buildActivities(safeOrders, customerMap));
    } catch (err) {
      console.error(err);
      setError(err.message || 'โหลดข้อมูล dashboard ไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  const statCards = useMemo(() => ([
    { label: 'Orders ล่าสุด', value: stats.recentOrdersCount, color: 'text-orange-500' },
    { label: 'Revenue วันนี้', value: formatCurrency(stats.revenueToday), color: 'text-emerald-600' },
    { label: 'Customers ทั้งหมด', value: stats.customersTotal, color: 'text-blue-600' },
  ]), [stats]);

  if (!shop && !loading) {
    return (
      <AppShell title="Dashboard" subtitle="กรุณาเลือกร้านค้าก่อนเริ่มใช้งาน">
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
    <AppShell title="Dashboard" subtitle="ภาพรวมธุรกิจของร้าน" shopName={shop?.name}>
      {error && <div className="mb-6 rounded-xl bg-red-50 text-red-700 px-4 py-3 border border-red-200">{error}</div>}

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center text-gray-500">กำลังโหลดข้อมูล...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {statCards.map((item) => (
              <div key={item.label} className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className={`text-3xl font-bold ${item.color}`}>{item.value}</div>
                <div className="text-gray-500 mt-2">{item.label}</div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">ออร์เดอร์ล่าสุด</h2>
                <a href="/orders" className="text-indigo-600 text-sm hover:underline">ดูทั้งหมด</a>
              </div>
              {recentOrders.length === 0 ? (
                <div className="p-8 text-center text-gray-500">ยังไม่มีออร์เดอร์ในร้านนี้</div>
              ) : (
                <>
                  <div className="md:hidden divide-y divide-gray-100">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-semibold text-gray-900">{order.order_number || order.id}</div>
                            <div className="text-sm text-gray-500 mt-1">{customersById[order.customer_id]?.name || '-'}</div>
                          </div>
                          <span className="px-2.5 py-1 rounded-full text-xs bg-indigo-50 text-indigo-700">{order.status || '-'}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <div className="text-gray-400">เวลา</div>
                            <div className="text-gray-700 mt-1">{formatDateTime(order.created_at)}</div>
                          </div>
                          <div>
                            <div className="text-gray-400">จำนวนเงิน</div>
                            <div className="text-gray-900 font-medium mt-1">{formatCurrency(order.total_amount)}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 text-gray-500">
                        <tr>
                          <th className="text-left px-6 py-3">เลขออร์เดอร์</th>
                          <th className="text-left px-6 py-3">ลูกค้า</th>
                          <th className="text-left px-6 py-3">เวลา</th>
                          <th className="text-left px-6 py-3">จำนวนเงิน</th>
                          <th className="text-left px-6 py-3">สถานะ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentOrders.map((order) => (
                          <tr key={order.id} className="border-t border-gray-100">
                            <td className="px-6 py-4 font-medium text-gray-900">{order.order_number || order.id}</td>
                            <td className="px-6 py-4 text-gray-600">{customersById[order.customer_id]?.name || '-'}</td>
                            <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{formatDateTime(order.created_at)}</td>
                            <td className="px-6 py-4 text-gray-900">{formatCurrency(order.total_amount)}</td>
                            <td className="px-6 py-4">
                              <span className="px-2.5 py-1 rounded-full text-xs bg-indigo-50 text-indigo-700">{order.status || '-'}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900">Recent activities</h2>
              </div>
              {recentActivities.length === 0 ? (
                <div className="p-8 text-center text-gray-500">ยังไม่มีกิจกรรมล่าสุด</div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl leading-none">{activity.icon}</div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-medium text-gray-900 truncate">{activity.title}</p>
                            <span className="text-xs text-gray-400 whitespace-nowrap">{formatDateTime(activity.time)}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                          <p className="text-xs text-indigo-600 mt-2">{activity.status}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </AppShell>
  );
}
