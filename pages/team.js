import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Team() {
  const router = useRouter();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', role: 'member', email: '', phone: '' });
  const [shop, setShop] = useState(null);

  useEffect(() => {
    const currentShop = localStorage.getItem('currentShop');
    if (currentShop) {
      const shopData = JSON.parse(currentShop);
      setShop(shopData);
      fetchMembers(shopData.id);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchMembers = async (shopId) => {
    try {
      const res = await fetch(`http://localhost:3001/api/team?shopId=${shopId}`);
      const data = await res.json();
      setMembers(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!shop) return;

    try {
      const res = await fetch('http://localhost:3001/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, shopId: shop.id })
      });

      if (res.ok) {
        alert('✅ เพิ่มสมาชิกสำเร็จ!');
        setShowForm(false);
        setFormData({ name: '', role: 'member', email: '', phone: '' });
        fetchMembers(shop.id);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('ยืนยันการลบ?')) return;
    
    try {
      const res = await fetch(`http://localhost:3001/api/team/${id}`, {
        method: 'DELETE'
      });
      
      if (res.ok) {
        alert('✅ ลบสำเร็จ!');
        fetchMembers(shop.id);
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
      <header className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">👥 ทีมงาน</h1>
          <div className="flex gap-4 items-center">
            <span className="text-sm">{shop?.name}</span>
            <button onClick={logout} className="bg-white text-indigo-500 px-4 py-2 rounded-lg font-semibold">
              ออกจากระบบ
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow p-4">
        <div className="container mx-auto flex gap-4">
          <a href="/dashboard" className="text-gray-600 hover:text-indigo-500">📊 Dashboard</a>
          <a href="/products" className="text-gray-600 hover:text-indigo-500">🛒 สินค้า</a>
          <a href="/inventory" className="text-gray-600 hover:text-indigo-500">📦 คลัง</a>
          <a href="/crm" className="text-gray-600 hover:text-indigo-500">👥 CRM</a>
          <a href="/orders" className="text-gray-600 hover:text-indigo-500">📋 Orders</a>
          <a href="/projects" className="text-gray-600 hover:text-indigo-500">📁 โปรเจค</a>
          <a href="/team" className="text-indigo-500 font-semibold">👥 ทีม</a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">สมาชิกทีม</h2>
          <button 
            onClick={() => setShowForm(true)}
            className="bg-indigo-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-600"
          >
            + เพิ่มสมาชิก
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-3xl font-bold text-indigo-500">{members.length}</div>
            <div className="text-gray-600">สมาชิกทั้งหมด</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-3xl font-bold text-green-500">{members.filter(m => m.role === 'admin').length}</div>
            <div className="text-gray-600">Admin</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-3xl font-bold text-blue-500">{members.filter(m => m.role === 'member').length}</div>
            <div className="text-gray-600">สมาชิก</div>
          </div>
        </div>

        {/* Members Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">ชื่อ</th>
                <th className="p-4 text-left">Role</th>
                <th className="p-4 text-left">อีเมล</th>
                <th className="p-4 text-left">เบอร์โทร</th>
                <th className="p-4 text-left">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-semibold">{member.name}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${member.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {member.role === 'admin' ? 'Admin' : 'สมาชิก'}
                    </span>
                  </td>
                  <td className="p-4">{member.email || '-'}</td>
                  <td className="p-4">{member.phone || '-'}</td>
                  <td className="p-4">
                    <button 
                      onClick={() => handleDelete(member.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
              {members.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    ยังไม่มีสมาชิกในทีมค่ะ
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
            <h3 className="text-xl font-bold mb-4">เพิ่มสมาชิกทีม</h3>
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
                  <label className="block text-sm font-semibold mb-1">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="member">สมาชิก</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">อีเมล</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full p-2 border rounded-lg"
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
                  className="flex-1 bg-indigo-500 text-white py-2 rounded-lg font-semibold hover:bg-indigo-600"
                >
                  เพิ่ม
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
