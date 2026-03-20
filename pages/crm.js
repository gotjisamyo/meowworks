import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import AppShell from '../components/AppShell';
import { apiFetch, ensureShopSelected } from '../lib/clientApi';

function formatCurrency(value) {
  return `฿${Number(value || 0).toLocaleString()}`;
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

function normalizeGroup(customer) {
  return customer?.group || customer?.customer_group || 'Regular';
}

function getDisplayName(customer) {
  return customer?.name || customer?.display_name || customer?.line_name || 'ไม่ระบุชื่อ';
}

function getTotalSpent(customer) {
  return Number(customer?.total_spent || customer?.totalSpent || customer?.spent || 0);
}

function getTotalOrders(customer) {
  return Number(customer?.total_orders || customer?.totalOrders || customer?.orders_count || 0);
}

function getLastOrderDate(customer) {
  return customer?.last_order_at || customer?.lastOrderAt || customer?.updated_at || customer?.created_at || null;
}

function getAverageSpend(customer) {
  const totalSpent = getTotalSpent(customer);
  const totalOrders = getTotalOrders(customer);
  if (!totalOrders) return 0;
  return totalSpent / totalOrders;
}

export default function CRMPage() {
  const router = useRouter();
  const [shop, setShop] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [crmStats, setCrmStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

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
    loadCRM(currentShop.id);
  }, [router]);

  const loadCRM = async (shopId) => {
    try {
      setLoading(true);
      setError('');

      const [customersData, statsData] = await Promise.all([
        apiFetch(`/crm/list/${shopId}`),
        apiFetch(`/crm/${shopId}/stats`).catch(() => null),
      ]);

      const safeCustomers = Array.isArray(customersData)
        ? customersData
        : Array.isArray(customersData?.customers)
          ? customersData.customers
          : [];

      setCustomers(safeCustomers);
      setCrmStats(statsData);
    } catch (err) {
      console.error(err);
      setError(err.message || 'โหลดข้อมูลลูกค้าไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return customers;

    return customers.filter((customer) => {
      const fields = [
        getDisplayName(customer),
        customer?.email,
        customer?.phone,
        customer?.lineId,
        customer?.line_id,
        normalizeGroup(customer),
        customer?.notes,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return fields.includes(keyword);
    });
  }, [customers, search]);

  const derivedStats = useMemo(() => {
    const totalCustomers = filteredCustomers.length;
    const vipCustomers = filteredCustomers.filter((customer) => String(normalizeGroup(customer)).toLowerCase() === 'vip').length;
    const totalSpent = filteredCustomers.reduce((sum, customer) => sum + getTotalSpent(customer), 0);
    const totalOrders = filteredCustomers.reduce((sum, customer) => sum + getTotalOrders(customer), 0);
    const activeCustomers = filteredCustomers.filter((customer) => getTotalOrders(customer) > 0).length;

    return {
      totalCustomers,
      vipCustomers,
      regularCustomers: Math.max(totalCustomers - vipCustomers, 0),
      totalSpent,
      totalOrders,
      activeCustomers,
      avgSpendPerCustomer: totalCustomers ? totalSpent / totalCustomers : 0,
    };
  }, [filteredCustomers]);

  const statsCards = useMemo(() => {
    const totalCustomers = Number(crmStats?.total_customers || crmStats?.totalCustomers || derivedStats.totalCustomers);
    const vipCustomers = Number(crmStats?.vip_customers || crmStats?.vipCustomers || derivedStats.vipCustomers);
    const totalOrders = Number(crmStats?.total_orders || crmStats?.totalOrders || derivedStats.totalOrders);
    const totalRevenue = Number(crmStats?.total_spent || crmStats?.totalSpent || crmStats?.revenue || derivedStats.totalSpent);

    return [
      { label: 'ลูกค้าทั้งหมด', value: totalCustomers, tone: 'text-indigo-600' },
      { label: 'ลูกค้า VIP', value: vipCustomers, tone: 'text-amber-500' },
      { label: 'ออร์เดอร์รวม', value: totalOrders, tone: 'text-emerald-600' },
      { label: 'ยอดใช้จ่ายรวม', value: formatCurrency(totalRevenue), tone: 'text-pink-600' },
    ];
  }, [crmStats, derivedStats]);

  const topCustomers = useMemo(() => {
    return [...filteredCustomers]
      .sort((a, b) => getTotalSpent(b) - getTotalSpent(a))
      .slice(0, 5);
  }, [filteredCustomers]);

  if (!shop && !loading) {
    return (
      <AppShell title="CRM" subtitle="กรุณาเลือกร้านค้าก่อน">
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
    <AppShell
      title="CRM"
      subtitle="ดูรายชื่อลูกค้า ข้อมูลติดต่อ และสถิติการซื้อของลูกค้า"
      shopName={shop?.name}
      actions={
        <button
          onClick={() => shop?.id && loadCRM(shop.id)}
          className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
        >
          รีเฟรชข้อมูล
        </button>
      }
    >
      {error && <div className="mb-6 rounded-xl bg-red-50 text-red-700 px-4 py-3 border border-red-200">{error}</div>}

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center text-gray-500">กำลังโหลดข้อมูลลูกค้า...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            {statsCards.map((card) => (
              <div key={card.label} className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className={`text-3xl font-bold ${card.tone}`}>{card.value}</div>
                <div className="text-gray-500 mt-2">{card.label}</div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">รายชื่อลูกค้า</h2>
                  <p className="text-sm text-gray-500 mt-1">ค้นหาจากชื่อ เบอร์โทร อีเมล LINE หรือกลุ่มลูกค้าได้ค่ะ</p>
                </div>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="ค้นหาลูกค้า..."
                  className="w-full md:w-72 rounded-xl border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {filteredCustomers.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 p-10 text-center text-gray-500">
                  {customers.length === 0 ? 'ยังไม่มีลูกค้าในร้านนี้' : 'ไม่พบลูกค้าที่ตรงกับคำค้นหา'}
                </div>
              ) : (
                <>
                  <div className="md:hidden space-y-3">
                    {filteredCustomers.map((customer, index) => {
                      const group = normalizeGroup(customer);
                      const isVip = String(group).toLowerCase() === 'vip';

                      return (
                        <div key={customer.id || `${getDisplayName(customer)}-${customer.phone || customer.email || index}`} className="rounded-2xl border border-gray-200 p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="font-medium text-gray-900 break-words">{getDisplayName(customer)}</div>
                              <div className="text-xs text-gray-500 mt-1">ID: {customer.id || '-'}</div>
                            </div>
                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${isVip ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'}`}>
                              {group}
                            </span>
                          </div>

                          <div className="mt-3 space-y-2 text-sm text-gray-600">
                            <div>โทร: {customer?.phone || '-'}</div>
                            <div className="break-all">อีเมล: {customer?.email || '-'}</div>
                            <div>LINE: {customer?.lineId || customer?.line_id || '-'}</div>
                          </div>

                          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <div className="text-gray-400">ออร์เดอร์</div>
                              <div className="mt-1 font-medium text-gray-900">{getTotalOrders(customer).toLocaleString()}</div>
                            </div>
                            <div>
                              <div className="text-gray-400">ยอดใช้จ่าย</div>
                              <div className="mt-1 font-medium text-gray-900">{formatCurrency(getTotalSpent(customer))}</div>
                            </div>
                            <div className="col-span-2">
                              <div className="text-gray-400">ล่าสุด</div>
                              <div className="mt-1 text-gray-700">{formatDateTime(getLastOrderDate(customer))}</div>
                            </div>
                          </div>

                          {customer?.notes ? <div className="mt-3 text-xs text-gray-500">โน้ต: {customer.notes}</div> : null}
                        </div>
                      );
                    })}
                  </div>

                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 text-gray-500">
                        <tr>
                          <th className="text-left px-4 py-3">ลูกค้า</th>
                          <th className="text-left px-4 py-3">ติดต่อ</th>
                          <th className="text-left px-4 py-3">กลุ่ม</th>
                          <th className="text-left px-4 py-3">ออร์เดอร์</th>
                          <th className="text-left px-4 py-3">ยอดใช้จ่าย</th>
                          <th className="text-left px-4 py-3">ล่าสุด</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCustomers.map((customer, index) => {
                          const group = normalizeGroup(customer);
                          const isVip = String(group).toLowerCase() === 'vip';

                          return (
                            <tr key={customer.id || `${getDisplayName(customer)}-${customer.phone || customer.email || index}`} className="border-t border-gray-100 hover:bg-gray-50 align-top">
                              <td className="px-4 py-4">
                                <div className="font-medium text-gray-900">{getDisplayName(customer)}</div>
                                <div className="text-xs text-gray-500 mt-1">ID: {customer.id || '-'}</div>
                                {customer?.notes ? <div className="text-xs text-gray-500 mt-2 line-clamp-2">{customer.notes}</div> : null}
                              </td>
                              <td className="px-4 py-4 text-gray-600">
                                <div>{customer?.phone || '-'}</div>
                                <div className="mt-1">{customer?.email || '-'}</div>
                                <div className="mt-1 text-xs text-gray-500">LINE: {customer?.lineId || customer?.line_id || '-'}</div>
                              </td>
                              <td className="px-4 py-4">
                                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${isVip ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'}`}>
                                  {group}
                                </span>
                              </td>
                              <td className="px-4 py-4 text-gray-900">{getTotalOrders(customer).toLocaleString()}</td>
                              <td className="px-4 py-4 text-gray-900">{formatCurrency(getTotalSpent(customer))}</td>
                              <td className="px-4 py-4 text-gray-500 whitespace-nowrap">{formatDateTime(getLastOrderDate(customer))}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer insights</h2>
                <div className="space-y-4 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-gray-500">ลูกค้าที่มีออร์เดอร์แล้ว</span>
                    <span className="font-semibold text-gray-900">{derivedStats.activeCustomers.toLocaleString()} คน</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-gray-500">Regular</span>
                    <span className="font-semibold text-gray-900">{derivedStats.regularCustomers.toLocaleString()} คน</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-gray-500">VIP</span>
                    <span className="font-semibold text-gray-900">{derivedStats.vipCustomers.toLocaleString()} คน</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-gray-500">ยอดใช้จ่ายเฉลี่ย / ลูกค้า</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(derivedStats.avgSpendPerCustomer)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="font-semibold text-gray-900">Top customers</h2>
                  <p className="text-sm text-gray-500 mt-1">เรียงตามยอดใช้จ่ายสูงสุด</p>
                </div>
                {topCustomers.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">ยังไม่มีข้อมูลลูกค้า</div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {topCustomers.map((customer, index) => (
                      <div key={customer.id || index} className="px-6 py-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">#{index + 1}</span>
                              <p className="font-medium text-gray-900 truncate">{getDisplayName(customer)}</p>
                            </div>
                            <p className="text-sm text-gray-500 mt-2">{getTotalOrders(customer).toLocaleString()} ออร์เดอร์ • เฉลี่ย {formatCurrency(getAverageSpend(customer))}</p>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-gray-900">{formatCurrency(getTotalSpent(customer))}</div>
                            <div className="text-xs text-gray-400 mt-1">{normalizeGroup(customer)}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </AppShell>
  );
}
