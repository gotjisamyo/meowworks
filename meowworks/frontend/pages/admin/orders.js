import { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';

export default function OrdersPage() {
  const [orders, setOrders] = useState([
    { id: 'ORD-001', customer: 'LINE: @somsak', customerName: 'สมชาย', items: [{ name: 'สินค้า A', qty: 2, price: 590 }, { name: 'สินค้า B', qty: 1, price: 110 }], total: 1290, status: 'completed', date: '18 มี.ค. 2026', time: '14:30' },
    { id: 'ORD-002', customer: 'LINE: @suda', customerName: 'สมหญิง', items: [{ name: 'สินค้า C', qty: 1, price: 590 }], total: 590, status: 'pending', date: '18 มี.ค. 2026', time: '13:45' },
    { id: 'ORD-003', customer: 'LINE: @wanchai', customerName: 'วิชัย', items: [{ name: 'สินค้า A', qty: 3, price: 590 }, { name: 'สินค้า D', qty: 2, price: 350 }], total: 2490, status: 'shipping', date: '18 มี.ค. 2026', time: '12:20' },
    { id: 'ORD-004', customer: 'LINE: @anon', customerName: 'อนุชา', items: [{ name: 'สินค้า B', qty: 1, price: 990 }], total: 990, status: 'completed', date: '17 มี.ค. 2026', time: '18:00' },
    { id: 'ORD-005', customer: 'LINE: @krit', customerName: 'กฤษฎา', items: [{ name: 'สินค้า E', qty: 2, price: 990 }], total: 1980, status: 'completed', date: '17 มี.ค. 2026', time: '16:30' },
    { id: 'ORD-006', customer: 'LINE: @james', customerName: 'เจมส์', items: [{ name: 'สินค้า A', qty: 1, price: 590 }, { name: 'สินค้า C', qty: 1, price: 590 }], total: 1180, status: 'cancelled', date: '16 มี.ค. 2026', time: '15:00' },
    { id: 'ORD-007', customer: 'LINE: @mike', customerName: 'มิค', items: [{ name: 'สินค้า F', qty: 3, price: 390 }], total: 1170, status: 'completed', date: '16 มี.ค. 2026', time: '11:20' },
    { id: 'ORD-008', customer: 'LINE: @tom', customerName: 'ต้น', items: [{ name: 'สินค้า B', qty: 1, price: 990 }], total: 990, status: 'pending', date: '15 มี.ค. 2026', time: '20:45' },
  ]);

  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

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
      pending: '⏳ รอยืนยัน',
      shipping: '📦 กำลังจัดส่ง',
      cancelled: '❌ ยกเลิก'
    };
    return <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>{labels[status]}</span>;
  };

  const filteredOrders = orders.filter(order => {
    const matchFilter = filter === 'all' || order.status === filter;
    const matchSearch = order.customer.toLowerCase().includes(search.toLowerCase()) || 
                        order.customerName.toLowerCase().includes(search.toLowerCase()) ||
                        order.id.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const updateStatus = (orderId, newStatus) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const stats = {
    total: orders.length,
    completed: orders.filter(o => o.status === 'completed').length,
    pending: orders.filter(o => o.status === 'pending').length,
    shipping: orders.filter(o => o.status === 'shipping').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    totalRevenue: orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0)
  };

  return (
    <AdminLayout title="📦 จัดการออเดอร์">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">ทั้งหมด</p>
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 border-l-4 border-l-green-500">
          <p className="text-gray-500 text-sm">สำเร็จ</p>
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 border-l-4 border-l-yellow-500">
          <p className="text-gray-500 text-sm">รอยืนยัน</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 border-l-4 border-l-blue-500">
          <p className="text-gray-500 text-sm">จัดส่ง</p>
          <p className="text-2xl font-bold text-blue-600">{stats.shipping}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">รายได้</p>
          <p className="text-2xl font-bold text-purple-600">{formatCurrency(stats.totalRevenue)}</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {['all', 'pending', 'shipping', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? 'ทั้งหมด' : 
               status === 'pending' ? 'รอยืนยัน' :
               status === 'shipping' ? 'จัดส่ง' :
               status === 'completed' ? 'สำเร็จ' : 'ยกเลิก'}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="ค้นหาออเดอร์..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ออเดอร์</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ลูกค้า</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">สินค้า</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ราคา</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">วันที่</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">สถานะ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-800">{order.id}</p>
                    <p className="text-xs text-gray-400">{order.time}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-800">{order.customerName}</p>
                    <p className="text-xs text-gray-500">{order.customer}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {order.items.map((item, idx) => (
                        <p key={idx} className="text-sm text-gray-600">
                          {item.name} x{item.qty}
                        </p>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-800">{formatCurrency(order.total)}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.date}</td>
                  <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {order.status === 'pending' && (
                        <button 
                          onClick={() => updateStatus(order.id, 'shipping')}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-200"
                        >
                          ยืนยัน
                        </button>
                      )}
                      {order.status === 'shipping' && (
                        <button 
                          onClick={() => updateStatus(order.id, 'completed')}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium hover:bg-green-200"
                        >
                          สำเร็จ
                        </button>
                      )}
                      {order.status !== 'cancelled' && order.status !== 'completed' && (
                        <button 
                          onClick={() => updateStatus(order.id, 'cancelled')}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-200"
                        >
                          ยกเลิก
                        </button>
                      )}
                      <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200">
                        ดู
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
