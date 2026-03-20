import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';

export default function FinancePage() {
  const [transactions, setTransactions] = useState([
    { id: 'TXN-001', date: '18 มี.ค. 2026', customer: 'LINE: @somsak', plan: 'Business', amount: 2990, status: 'success', method: 'QR Payment' },
    { id: 'TXN-002', date: '18 มี.ค. 2026', customer: 'LINE: @suda', plan: 'Starter', amount: 990, status: 'success', method: 'Bank Transfer' },
    { id: 'TXN-003', date: '17 มี.ค. 2026', customer: 'LINE: @wanchai', plan: 'Business', amount: 2990, status: 'success', method: 'QR Payment' },
    { id: 'TXN-004', date: '17 มี.ค. 2026', customer: 'LINE: @thanakit', plan: 'Starter', amount: 990, status: 'pending', method: 'Bank Transfer' },
    { id: 'TXN-005', date: '16 มี.ค. 2026', customer: 'LINE: @anon', plan: 'Enterprise', amount: 9990, status: 'success', method: 'QR Payment' },
    { id: 'TXN-006', date: '16 มี.ค. 2026', customer: 'LINE: @krit', plan: 'Starter', amount: 990, status: 'failed', method: 'Bank Transfer' },
    { id: 'TXN-007', date: '15 มี.ค. 2026', customer: 'LINE: @james', plan: 'Business', amount: 2990, status: 'success', method: 'QR Payment' },
    { id: 'TXN-008', date: '15 มี.ค. 2026', customer: 'LINE: @mike', plan: 'Business', amount: 2990, status: 'success', method: 'Credit Card' },
  ]);

  const [stats, setStats] = useState({
    todayRevenue: 3980,
    yesterdayRevenue: 5980,
    monthRevenue: 125900,
    lastMonthRevenue: 98500,
    yearRevenue: 1259000,
    totalTransactions: 156,
    successRate: 94.2
  });

  const [filter, setFilter] = useState('all');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(amount);
  };

  const getStatusBadge = (status) => {
    const styles = {
      success: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      failed: 'bg-red-100 text-red-700'
    };
    const labels = {
      success: '✅ สำเร็จ',
      pending: '⏳ รอยืนยัน',
      failed: '❌ ล้มเหลว'
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>{labels[status]}</span>;
  };

  const filteredTransactions = filter === 'all' 
    ? transactions 
    : transactions.filter(t => t.status === filter);

  const planStats = [
    { name: 'Starter (฿999)', count: 45, revenue: 44955, color: 'bg-blue-500' },
    { name: 'Business (฿2,990)', count: 30, revenue: 89700, color: 'bg-purple-500' },
    { name: 'Enterprise (฿9,990)', count: 10, revenue: 99900, color: 'bg-yellow-500' },
  ];

  return (
    <AdminLayout title="💰 การเงิน">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm mb-1">💵 ยอดขายวันนี้</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.todayRevenue)}</p>
          <p className="text-xs text-gray-400 mt-1">
            {stats.todayRevenue >= stats.yesterdayRevenue ? '▲' : '▼'} {Math.abs(Math.round((stats.todayRevenue - stats.yesterdayRevenue) / stats.yesterdayRevenue * 100))}% จากเมื่อวาน
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm mb-1">📅 ยอดขายเดือนนี้</p>
          <p className="text-2xl font-bold text-purple-600">{formatCurrency(stats.monthRevenue)}</p>
          <p className="text-xs text-gray-400 mt-1">
            ▲ +{Math.round((stats.monthRevenue - stats.lastMonthRevenue) / stats.lastMonthRevenue * 100)}% จากเดือนที่แล้ว
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm mb-1">📆 ยอดขายปีนี้</p>
          <p className="text-2xl font-bold text-blue-600">{formatCurrency(stats.yearRevenue)}</p>
          <p className="text-xs text-gray-400 mt-1">รวม {stats.totalTransactions} รายการ</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm mb-1">✅ อัตราความสำเร็จ</p>
          <p className="text-2xl font-bold text-green-600">{stats.successRate}%</p>
          <p className="text-xs text-gray-400 mt-1">{stats.totalTransactions} รายการ</p>
        </div>
      </div>

      {/* Plan Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {planStats.map((plan, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl ${plan.color} flex items-center justify-center text-white`}>
                {index === 0 ? '🌟' : index === 1 ? '💼' : '👑'}
              </div>
              <div>
                <p className="font-bold text-gray-800">{plan.name}</p>
                <p className="text-sm text-gray-500">{plan.count} คน</p>
              </div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
              <div className={`${plan.color} h-2 rounded-full`} style={{ width: `${(plan.revenue / stats.monthRevenue) * 100}%` }}></div>
            </div>
            <p className="text-lg font-bold text-gray-800">{formatCurrency(plan.revenue)}</p>
          </div>
        ))}
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between flex-wrap gap-4">
          <h3 className="font-bold text-gray-800 text-lg">📋 ประวัติรายการ</h3>
          <div className="flex gap-2">
            <button 
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              ทั้งหมด
            </button>
            <button 
              onClick={() => setFilter('success')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'success' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              สำเร็จ
            </button>
            <button 
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              รอยืนยัน
            </button>
            <button 
              onClick={() => setFilter('failed')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'failed' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              ล้มเหลว
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">รายการ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">วันที่</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ลูกค้า</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">แพลน</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ช่องทาง</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">จำนวน</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">สถานะ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTransactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">{txn.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{txn.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{txn.customer}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      txn.plan === 'Enterprise' ? 'bg-yellow-100 text-yellow-700' :
                      txn.plan === 'Business' ? 'bg-purple-100 text-purple-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {txn.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{txn.method}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-800">{formatCurrency(txn.amount)}</td>
                  <td className="px-6 py-4">{getStatusBadge(txn.status)}</td>
                  <td className="px-6 py-4">
                    <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                      ดูรายละเอียด
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">📄</div>
          <div className="text-left">
            <p className="font-bold text-gray-800">ส่งออกรายงาน</p>
            <p className="text-sm text-gray-500">Excel / PDF</p>
          </div>
        </button>
        <button className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">📧</div>
          <div className="text-left">
            <p className="font-bold text-gray-800">ส่งใบแจ้งหนี้</p>
            <p className="text-sm text-gray-500">Email ลูกค้า</p>
          </div>
        </button>
        <button className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl">⚙️</div>
          <div className="text-left">
            <p className="font-bold text-gray-800">ตั้งค่าการเงิน</p>
            <p className="text-sm text-gray-500">ธนาคาร / QR</p>
          </div>
        </button>
      </div>
    </AdminLayout>
  );
}
