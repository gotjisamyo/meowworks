import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function CRM() {
  const router = useRouter();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    lineId: '',
    group: 'Regular',
    notes: ''
  });

  const [shop, setShop] = useState(null);

  useEffect(() => {
    const currentShop = localStorage.getItem('currentShop');
    if (currentShop) {
      const shopData = JSON.parse(currentShop);
      setShop(shopData);
      fetchCustomers(shopData.id);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCustomers = async (shopId) => {
    try {
      const res = await fetch(`http://localhost:3001/api/crm/${shopId}`);
      const data = await res.json();
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!shop) {
      alert('กรุณาเลือกร้านค้าก่อนค่ะ');
      return;
    }

    try {
      const payload = {
        ...formData,
        shopId: shop.id
      };

      let res;
      if (editingCustomer) {
        res = await fetch(`http://localhost:3001/api/crm/${editingCustomer.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('http://localhost:3001/api/crm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        alert(editingCustomer ? '✅ แก้ไขลูกค้าสำเร็จ!' : '✅ เพิ่มลูกค้าสำเร็จ!');
        setShowForm(false);
        setEditingCustomer(null);
        setFormData({ name: '', phone: '', email: '', lineId: '', group: 'Regular', notes: '' });
        fetchCustomers(shop.id);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ เกิดข้อผิดพลาดค่ะ');
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name || '',
      phone: customer.phone || '',
      email: customer.email || '',
      lineId: customer.lineId || '',
      group: customer.group || 'Regular',
      notes: customer.notes || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('ยืนยันการลบ?')) return;
    
    try {
      const res = await fetch(`http://localhost:3001/api/crm/${id}`, {
        method: 'DELETE'
      });
      
      if (res.ok) {
        alert('✅ ลบลูกค้าสำเร็จ!');
        fetchCustomers(shop.id);
      }
    } catch (error) {
      console.error('Error:', error);
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
          <h1 className="text-2xl font-bold">👥 CRM - ลูกค้า</h1>
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
          <a href="/crm" className="text-pink-500 font-semibold">👥 CRM</a>
          <a href="/orders" className="text-gray-600 hover:text-pink-500">📋 Orders</a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">รายชื่อลูกค้า</h2>
          <button 
            onClick={() => { setShowForm(true); setEditingCustomer(null); setFormData({ name: '', phone: '', email: '', lineId: '', group: 'Regular', notes: '' }); }}
            className="bg-pink-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-pink-600"
          >
            + เพิ่มลูกค้า
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-3xl font-bold text-pink-500">{customers.length}</div>
            <div className="text-gray-600">ลูกค้าทั้งหมด</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-3xl font-bold text-teal-500">{customers.filter(c => c.group === 'VIP').length}</div>
            <div className="text-gray-600">VIP</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-3xl font-bold text-blue-500">{customers.filter(c => c.group === 'Regular').length}</div>
            <div className="text-gray-600">Regular</div>
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">ชื่อ</th>
                <th className="p-4 text-left">เบอร์โทร</th>
                <th className="p-4 text-left">LINE ID</th>
                <th className="p-4 text-left">กลุ่ม</th>
                <th className="p-4 text-left">ยอดซื้อ</th>
                <th className="p-4 text-left">จำนวนออร์เดอร์</th>
                <th className="p-4 text-left">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="p-4">
                    <div className="font-semibold">{customer.name}</div>
                    <div className="text-sm text-gray-500">{customer.email}</div>
                  </td>
                  <td className="p-4">{customer.phone || '-'}</td>
                  <td className="p-4">{customer.lineId || '-'}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${customer.group === 'VIP' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
                      {customer.group || 'Regular'}
                    </span>
                  </td>
                  <td className="p-4">฿{customer.total_spent || 0}</td>
                  <td className="p-4">{customer.total_orders || 0}</td>
                  <td className="p-4">
                    <button 
                      onClick={() => handleEdit(customer)}
                      className="text-blue-500 hover:text-blue-700 mr-2"
                    >
                      แก้ไข
                    </button>
                    <button 
                      onClick={() => handleDelete(customer.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-500">
                    ยังไม่มีลูกค้าค่ะ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              {editingCustomer ? 'แก้ไขลูกค้า' : 'เพิ่มลูกค้า'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">ชื่อ *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">เบอร์โทร</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">LINE ID</label>
                  <input
                    type="text"
                    value={formData.lineId}
                    onChange={(e) => setFormData({...formData, lineId: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">กลุ่ม</label>
                  <select
                    value={formData.group}
                    onChange={(e) => setFormData({...formData, group: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="Regular">Regular</option>
                    <option value="VIP">VIP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">หมายเหตุ</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    rows="3"
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-pink-500 text-white py-2 rounded-lg font-semibold hover:bg-pink-600"
                >
                  {editingCustomer ? 'บันทึก' : 'เพิ่ม'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
