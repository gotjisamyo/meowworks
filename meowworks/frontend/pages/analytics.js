import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Analytics() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    lowStockItems: 0,
    topProducts: [],
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);
  const [shop, setShop] = useState(null);
  const [period, setPeriod] = useState('week');

  useEffect(() => {
    const currentShop = localStorage.getItem('currentShop');
    if (currentShop) {
      const shopData = JSON.parse(currentShop);
      setShop(shopData);
      fetchAnalytics(shopData.id);
    } else {
      setLoading(false);
    }
  }, [period]);

  const fetchAnalytics = async (shopId) => {
    try {
      const [productsRes, customersRes, ordersRes, inventoryRes] = await Promise.all([
        fetch(`http://localhost:3001/api/products/${shopId}`),
        fetch(`http://localhost:3001/api/crm/${shopId}`),
        fetch(`http://localhost:3001/api/orders?shopId=${shopId}`),
        fetch(`http://localhost:3001/api/inventory/${shopId}`)
      ]);

      const products = await productsRes.json();
      const customers = await customersRes.json();
      const orders = await ordersRes.json();
      const inventory = await inventoryRes.json();

      const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
      const lowStock = inventory.filter(i => (i.quantity || 0) < 10);

      setStats({
        totalRevenue,
        totalOrders: orders.length,
        totalCustomers: customers.length,
        totalProducts: products.length,
        lowStockItems: lowStock.length,
        topProducts: products.slice(0, 5),
        recentOrders: orders.slice(0, 5)
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-2xl">⏳ กำลังโหลด...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-500 to-teal-500 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">📊 Analytics</h1>
          <div className="flex gap-4 items-center">
            <span className="text-sm">{shop?.name}</span>
            <button onClick={logout} className="bg-white text-pink-500 px-4 py-2 rounded-lg font-semibold">
              ออกจากระบบ
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow p-4">
        <div className="container mx-auto flex gap-4">
          <a href="/dashboard" className="text-gray-600 hover:text-pink-500">📊 Dashboard</a>
          <a href="/products" className="text-gray-600 hover:text-pink-500">🛒 สินค้า</a>
          <a href="/inventory" className="text-gray-600 hover:text-pink-500">📦 คลัง</a>
          <a href="/crm" className="text-gray-600 hover:text-pink-500">👥 CRM</a>
          <a href="/orders" className="text-gray-600 hover:text-pink-500">📋 Orders</a>
          <a href="/marketing" className="text-gray-600 hover:text-pink-500">📢 Marketing</a>
          <a href="/analytics" className="text-pink-500 font-semibold">📊 Analytics</a>
          <a href="/settings" className="text-gray-600 hover:text-pink-500">⚙️ ตั้งค่า</a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        {/* Period Selector */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">ภาพรวมธุรกิจ</h2>
          <select 
            value={period} 
            onChange={(e) => setPeriod(e.target.value)}
            className="border rounded-lg px-4 py-2"
          >
            <option value="today">วันนี้</option>
            <option value="week">สัปดาห์นี้</option>
            <option value="month">เดือนนี้</option>
            <option value="year">ปีนี้</option>
          </select>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-3xl mb-2">💰</div>
            <div className="text-3xl font-bold text-green-500">฿{stats.totalRevenue.toLocaleString()}</div>
            <div className="text-gray-500">รายได้ทั้งหมด</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-3xl mb-2">📋</div>
            <div className="text-3xl font-bold text-blue-500">{stats.totalOrders}</div>
            <div className="text-gray-500">ออร์เดอร์ทั้งหมด</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-3xl mb-2">👥</div>
            <div className="text-3xl font-bold text-purple-500">{stats.totalCustomers}</div>
            <div className="text-gray-500">ลูกค้า</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-3xl mb-2">⚠️</div>
            <div className="text-3xl font-bold text-red-500">{stats.lowStockItems}</div>
            <div className="text-gray-500">Stock ต่ำ</div>
          </div>
        </div>

        {/* Charts Placeholder */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-bold mb-4">📈 รายได้ตามช่วงเวลา</h3>
            <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">📊 Chart will be here</span>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-bold mb-4">🛒 สินค้าขายดี</h3>
            <div className="space-y-3">
              {stats.topProducts.map((product, index) => (
                <div key={index} className="flex justify-between items-center border-b pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-400">{index + 1}</span>
                    <span>{product.name}</span>
                  </div>
                  <span className="text-green-500 font-semibold">฿{product.price}</span>
                </div>
              ))}
              {stats.topProducts.length === 0 && (
                <div className="text-center text-gray-400 py-4">ยังไม่มีข้อมูล</div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-bold mb-4">📋 ออร์เดอร์ล่าสุด</h3>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Order ID</th>
                <th className="text-left py-2">ลูกค้า</th>
                <th className="text-left py-2">สินค้า</th>
                <th className="text-left py-2">ยอดรวม</th>
                <th className="text-left py-2">สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2 font-mono text-sm">{order.id?.slice(0, 8)}</td>
                  <td className="py-2">{order.customerName || '-'}</td>
                  <td className="py-2">{order.items?.length || 0} ชิ้น</td>
                  <td className="py-2 text-green-500 font-semibold">฿{order.total}</td>
                  <td className="py-2">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                      {order.status || 'completed'}
                    </span>
                  </td>
                </tr>
              ))}
              {stats.recentOrders.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-gray-400">ยังไม่มีออร์เดอร์</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
