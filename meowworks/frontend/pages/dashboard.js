import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    customers: 0,
    orders: 0,
    revenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [invRes, crmRes, ordersRes] = await Promise.all([
        fetch('/api/inventory/shop-001/summary'),
        fetch('/api/crm/shop-001/stats'),
        fetch('/api/orders/shop-001')
      ]);

      const inv = await invRes.json();
      const crm = await crmRes.json();
      const orders = await ordersRes.json();

      setStats({
        products: inv.total_products || 0,
        customers: crm.total_customers || 0,
        orders: orders.length || 0,
        revenue: orders.reduce((sum, o) => sum + (o.total_amount || 0), 0)
      });
      setRecentOrders(orders.slice(0, 5));
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="p-8 text-center">กำลังโหลด...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">📊 MeowChat Dashboard</h1>
          <p className="text-gray-600 mt-2">ภาพรวมธุรกิจของคุณ</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-blue-600">{stats.products}</div>
            <div className="text-gray-500">สินค้าทั้งหมด</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-green-600">{stats.customers}</div>
            <div className="text-gray-500">ลูกค้า</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-orange-500">{stats.orders}</div>
            <div className="text-gray-500">ออร์เดอร์</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-purple-600">฿{stats.revenue.toLocaleString()}</div>
            <div className="text-gray-500">รายได้</div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <a href="/inventory" className="block bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <div className="text-4xl mb-2">📦</div>
            <div className="font-bold text-lg">จัดการสินค้า</div>
            <div className="text-gray-500 text-sm">Stock คงคลัง รับ-จ่ายสินค้า</div>
          </a>
          <a href="/customers" className="block bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <div className="text-4xl mb-2">👥</div>
            <div className="font-bold text-lg">ลูกค้า</div>
            <div className="text-gray-500 text-sm">จัดการข้อมูลลูกค้า</div>
          </a>
          <a href="/orders" className="block bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <div className="text-4xl mb-2">🛒</div>
            <div className="font-bold text-lg">ออร์เดอร์</div>
            <div className="text-gray-500 text-sm">ติดตามคำสั่งซื้อ</div>
          </a>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold">📋 ออร์เดอร์ล่าสุด</h2>
          </div>
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">Order ID</th>
                <th className="p-4 text-left">ลูกค้า</th>
                <th className="p-4 text-right">จำนวน</th>
                <th className="p-4 text-center">สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-4 font-mono text-sm">{order.order_number}</td>
                  <td className="p-4">{order.customer_id?.substring(0, 20)}...</td>
                  <td className="p-4 text-right">฿{order.total_amount}</td>
                  <td className="p-4 text-center">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
