import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    todayRevenue: 0,
    todayOrders: 0,
    todayCustomers: 0,
    todayChats: 0,
    monthRevenue: 0,
    monthOrders: 0,
    totalCustomers: 0,
    activeAgents: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentCustomers, setRecentCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      // Simulated data - replace with real API calls
      setStats({
        todayRevenue: 15990,
        todayOrders: 12,
        todayCustomers: 5,
        todayChats: 48,
        monthRevenue: 125900,
        monthOrders: 156,
        totalCustomers: 89,
        activeAgents: 3
      });

      setRecentOrders([
        { id: 'ORD-001', customer: 'สมชาย', items: 2, total: 1290, status: 'completed', date: '18 มี.ค. 2026' },
        { id: 'ORD-002', customer: 'สมหญิง', items: 1, total: 590, status: 'pending', date: '18 มี.ค. 2026' },
        { id: 'ORD-003', customer: 'วิชัย', items: 3, total: 2490, status: 'shipping', date: '18 มี.ค. 2026' },
        { id: 'ORD-004', customer: 'อนุชา', items: 1, total: 990, status: 'completed', date: '17 มี.ค. 2026' },
        { id: 'ORD-005', customer: 'ธนกฤต', items: 2, total: 1980, status: 'completed', date: '17 มี.ค. 2026' },
      ]);

      setRecentCustomers([
        { id: 1, name: 'LINE: @somsak', group: 'VIP', orders: 15, spent: 15900, joined: '18 มี.ค. 2026' },
        { id: 2, name: 'LINE: @somchai', group: 'Regular', orders: 3, spent: 2970, joined: '17 มี.ค. 2026' },
        { id: 3, name: 'LINE: @suda', group: 'New', orders: 0, spent: 0, joined: '16 มี.ค. 2026' },
      ]);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
    setLoading(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(amount);
  };

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      shipping: 'bg-blue-100 text-blue-700',
      cancelled: 'bg-red-100 text-red-700'
    };
    const labels = {
      completed: '✅ สำเร็จ',
      pending: '⏳ รอ',
      shipping: '📦 จัดส่ง',
      cancelled: '❌ ยกเลิก'
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>{labels[status]}</span>;
  };

  const StatCard = ({ icon, label, value, subValue, color }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm mb-1">{label}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          {subValue && <p className="text-xs text-gray-400 mt-1">{subValue}</p>}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color.replace('text-', 'bg-')}/10`}>
          {icon}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <AdminLayout title="กำลังโหลด...">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Dashboard">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          icon="💰" 
          label="ยอดขายวันนี้" 
          value={formatCurrency(stats.todayRevenue)} 
          subValue="▲ +12% จากเมื่อวาน"
          color="text-green-600"
        />
        <StatCard 
          icon="📦" 
          label="ออเดอร์วันนี้" 
          value={stats.todayOrders} 
          subValue="รายการ"
          color="text-blue-600"
        />
        <StatCard 
          icon="👥" 
          label="ลูกค้าใหม่" 
          value={stats.todayCustomers} 
          subValue="คน"
          color="text-purple-600"
        />
        <StatCard 
          icon="💬" 
          label="AI Chats" 
          value={stats.todayChats} 
          subValue="ครั้ง"
          color="text-orange-500"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-800">📈 ยอดขายรายสัปดาห์</h3>
            <select className="text-sm border border-gray-200 rounded-lg px-3 py-1">
              <option>7 วันล่าสุด</option>
              <option>30 วันล่าสุด</option>
              <option>90 วันล่าสุด</option>
            </select>
          </div>
          <div className="h-48 flex items-end justify-between gap-2">
            {[4500, 8200, 6200, 9800, 7200, 11500, 15990].map((value, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full bg-purple-500 rounded-t-lg hover:bg-purple-600 transition-colors relative group"
                  style={{ height: `${(value / 12000) * 100}%`, minHeight: '20px' }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {formatCurrency(value)}
                  </div>
                </div>
                <span className="text-xs text-gray-400">{['จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.', 'อา.'][index]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Plan Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-6">🥧 รายได้ตามแพลน</h3>
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
              <path className="text-purple-200" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
              <path className="text-orange-400" strokeDasharray="40, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
              <path className="text-green-400" strokeDasharray="35, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
              <path className="text-blue-400" strokeDasharray="25, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-2xl font-bold text-gray-800">{formatCurrency(stats.monthRevenue)}</span>
              <span className="text-xs text-gray-500">เดือนนี้</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-purple-500"></span> Business</span>
              <span className="font-medium">฿89,700 (40%)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-orange-400"></span> Starter</span>
              <span className="font-medium">฿44,055 (35%)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-400"></span> Enterprise</span>
              <span className="font-medium">฿19,980 (25%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">📦 ออเดอร์ล่าสุด</h3>
            <a href="/admin/orders" className="text-sm text-purple-600 hover:underline">ดูทั้งหมด →</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
                  <th className="pb-3 font-medium">ออเดอร์</th>
                  <th className="pb-3 font-medium">ลูกค้า</th>
                  <th className="pb-3 font-medium">ราคา</th>
                  <th className="pb-3 font-medium">สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                    <td className="py-3 text-sm font-medium">{order.id}</td>
                    <td className="py-3 text-sm">{order.customer}</td>
                    <td className="py-3 text-sm font-medium">{formatCurrency(order.total)}</td>
                    <td className="py-3">{getStatusBadge(order.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Customers */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">👥 ลูกค้าล่าสุด</h3>
            <a href="/admin/customers" className="text-sm text-purple-600 hover:underline">ดูทั้งหมด →</a>
          </div>
          <div className="space-y-3">
            {recentCustomers.map((customer) => (
              <div key={customer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span>👤</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-800">{customer.name}</p>
                    <p className="text-xs text-gray-500">เข้าร่วม {customer.joined}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    customer.group === 'VIP' ? 'bg-yellow-100 text-yellow-700' :
                    customer.group === 'Regular' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {customer.group}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{customer.orders} ออเดอร์</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white">
          <p className="text-sm opacity-80">ยอดขายเดือนนี้</p>
          <p className="text-xl font-bold">{formatCurrency(stats.monthRevenue)}</p>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <p className="text-sm opacity-80">ออเดอร์เดือนนี้</p>
          <p className="text-xl font-bold">{stats.monthOrders}</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
          <p className="text-sm opacity-80">ลูกค้าทั้งหมด</p>
          <p className="text-xl font-bold">{stats.totalCustomers}</p>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 text-white">
          <p className="text-sm opacity-80">AI Agents</p>
          <p className="text-xl font-bold">{stats.activeAgents}</p>
        </div>
      </div>
    </AdminLayout>
  );
}
