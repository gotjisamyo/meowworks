import { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([
    { id: 1, lineId: '@somsak', name: 'สมชาย', group: 'VIP', orders: 25, spent: 48750, lastOrder: '18 มี.ค. 2026', joined: '1 ม.ค. 2026', phone: '089-xxx-1234', email: 'somchai@email.com' },
    { id: 2, lineId: '@suda', name: 'สมหญิง', group: 'VIP', orders: 18, spent: 32100, lastOrder: '17 มี.ค. 2026', joined: '15 ม.ค. 2026', phone: '089-xxx-5678', email: 'suda@email.com' },
    { id: 3, lineId: '@wanchai', name: 'วิชัย', group: 'Regular', orders: 8, spent: 12990, lastOrder: '16 มี.ค. 2026', joined: '1 ก.พ. 2026', phone: '086-xxx-9012', email: 'wanchai@email.com' },
    { id: 4, lineId: '@anon', name: 'อนุชา', group: 'Regular', orders: 5, spent: 6990, lastOrder: '15 มี.ค. 2026', joined: '10 ก.พ. 2026', phone: '081-xxx-3456', email: '' },
    { id: 5, lineId: '@krit', name: 'กฤษฎา', group: 'New', orders: 1, spent: 990, lastOrder: '14 มี.ค. 2026', joined: '14 มี.ค. 2026', phone: '', email: 'krit@email.com' },
    { id: 6, lineId: '@james', name: 'เจมส์', group: 'Inactive', orders: 0, spent: 0, lastOrder: '-', joined: '20 ก.พ. 2026', phone: '090-xxx-7890', email: 'james@email.com' },
    { id: 7, lineId: '@mike', name: 'มิค', group: 'Regular', orders: 3, spent: 4500, lastOrder: '12 มี.ค. 2026', joined: '5 ก.พ. 2026', phone: '', email: '' },
    { id: 8, lineId: '@tom', name: 'ต้น', group: 'New', orders: 0, spent: 0, lastOrder: '-', joined: '16 มี.ค. 2026', phone: '089-xxx-1111', email: '' },
  ]);

  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(amount);
  };

  const getGroupBadge = (group) => {
    const styles = {
      VIP: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      Regular: 'bg-blue-100 text-blue-700 border-blue-300',
      New: 'bg-green-100 text-green-700 border-green-300',
      Inactive: 'bg-gray-100 text-gray-500 border-gray-300'
    };
    const labels = {
      VIP: '🌟 VIP',
      Regular: '👤 Regular',
      New: '🆕 New',
      Inactive: '💤 Inactive'
    };
    return <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[group]}`}>{labels[group]}</span>;
  };

  const filteredCustomers = customers.filter(customer => {
    const matchFilter = filter === 'all' || customer.group === filter;
    const matchSearch = customer.name.toLowerCase().includes(search.toLowerCase()) || 
                        customer.lineId.toLowerCase().includes(search.toLowerCase()) ||
                        customer.email.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const stats = {
    total: customers.length,
    vip: customers.filter(c => c.group === 'VIP').length,
    regular: customers.filter(c => c.group === 'Regular').length,
    new: customers.filter(c => c.group === 'New').length,
    inactive: customers.filter(c => c.group === 'Inactive').length,
    totalRevenue: customers.reduce((sum, c) => sum + c.spent, 0)
  };

  return (
    <AdminLayout title="👥 จัดการลูกค้า">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">ลูกค้าทั้งหมด</p>
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 border-l-4 border-l-yellow-500">
          <p className="text-gray-500 text-sm">🌟 VIP</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.vip}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 border-l-4 border-l-blue-500">
          <p className="text-gray-500 text-sm">👤 Regular</p>
          <p className="text-2xl font-bold text-blue-600">{stats.regular}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 border-l-4 border-l-green-500">
          <p className="text-gray-500 text-sm">🆕 New</p>
          <p className="text-2xl font-bold text-green-600">{stats.new}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">รายได้รวม</p>
          <p className="text-2xl font-bold text-purple-600">{formatCurrency(stats.totalRevenue)}</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {['all', 'VIP', 'Regular', 'New', 'Inactive'].map((group) => (
            <button
              key={group}
              onClick={() => setFilter(group)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === group 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {group === 'all' ? 'ทั้งหมด' : 
               group === 'VIP' ? '🌟 VIP' :
               group === 'Regular' ? '👤 Regular' :
               group === 'New' ? '🆕 New' : '💤 Inactive'}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="ค้นหาลูกค้า..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((customer) => (
          <div 
            key={customer.id} 
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedCustomer(customer)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-xl">
                  👤
                </div>
                <div>
                  <p className="font-bold text-gray-800">{customer.name}</p>
                  <p className="text-sm text-gray-500">{customer.lineId}</p>
                </div>
              </div>
              {getGroupBadge(customer.group)}
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-50 rounded-lg p-2">
                <p className="text-gray-500">ออเดอร์</p>
                <p className="font-bold text-gray-800">{customer.orders}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2">
                <p className="text-gray-500">รายจ่าย</p>
                <p className="font-bold text-purple-600">{formatCurrency(customer.spent)}</p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-xs text-gray-500">
              <span>เข้าร่วม: {customer.joined}</span>
              <span>ซื้อล่าสุด: {customer.lastOrder}</span>
            </div>

            <div className="mt-3 flex gap-2">
              <button className="flex-1 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200">
                💬 ส่งข้อความ
              </button>
              <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
                📝 แก้ไข
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedCustomer(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-3xl">
                  👤
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{selectedCustomer.name}</h3>
                  <p className="text-gray-500">{selectedCustomer.lineId}</p>
                  {getGroupBadge(selectedCustomer.group)}
                </div>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-500 text-sm">ออเดอร์ทั้งหมด</p>
                  <p className="text-xl font-bold text-gray-800">{selectedCustomer.orders}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-500 text-sm">รายจ่ายรวม</p>
                  <p className="text-xl font-bold text-purple-600">{formatCurrency(selectedCustomer.spent)}</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <h4 className="font-bold text-gray-800 mb-3">📱 ข้อมูลติดต่อ</h4>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center gap-2">
                    <span>📧</span> {selectedCustomer.email || '-'}
                  </p>
                  <p className="flex items-center gap-2">
                    <span>📱</span> {selectedCustomer.phone || '-'}
                  </p>
                  <p className="flex items-center gap-2">
                    <span>📅</span> เข้าร่วม: {selectedCustomer.joined}
                  </p>
                  <p className="flex items-center gap-2">
                    <span>🛒</span> ซื้อล่าสุด: {selectedCustomer.lastOrder}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700">
                  💬 ส่งข้อความ
                </button>
                <button className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200">
                  📋 ประวัติ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
