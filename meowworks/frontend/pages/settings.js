import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Settings() {
  const router = useRouter();
  const [shop, setShop] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    phone: '',
    address: '',
    lineOfficialAccount: '',
    facebookPage: '',
    email: '',
    logoUrl: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentShop = localStorage.getItem('currentShop');
    if (currentShop) {
      const shopData = JSON.parse(currentShop);
      setShop(shopData);
      setFormData({
        name: shopData.name || '',
        description: shopData.description || '',
        phone: shopData.phone || '',
        address: shopData.address || '',
        lineOfficialAccount: shopData.lineOfficialAccount || '',
        facebookPage: shopData.facebookPage || '',
        email: shopData.email || '',
        logoUrl: shopData.logoUrl || ''
      });
    }
    setLoading(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!shop) return;

    try {
      const res = await fetch(`http://localhost:3001/api/shops/${shop.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        alert('✅ บันทึกสำเร็จ!');
        localStorage.setItem('currentShop', JSON.stringify({ ...shop, ...formData }));
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
          <h1 className="text-2xl font-bold">⚙️ ตั้งค่าร้าน</h1>
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
          <a href="/settings" className="text-pink-500 font-semibold">⚙️ ตั้งค่า</a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Shop Info */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">🏪 ข้อมูลร้าน</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">ชื่อร้าน</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">รายละเอียด</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  rows="3"
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
                <label className="block text-sm font-semibold mb-1">อีเมล</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">ที่อยู่</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  rows="2"
                />
              </div>
              <button
                type="submit"
                className="bg-pink-500 text-white px-6 py-2 rounded-lg font-semibold w-full hover:bg-pink-600"
              >
                บันทึก
              </button>
            </form>
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">🔗 ลิงก์โซเชียล</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">LINE Official Account</label>
                <input
                  type="text"
                  value={formData.lineOfficialAccount}
                  onChange={(e) => setFormData({...formData, lineOfficialAccount: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  placeholder="@lineOfficial"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Facebook Page</label>
                <input
                  type="text"
                  value={formData.facebookPage}
                  onChange={(e) => setFormData({...formData, facebookPage: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  placeholder="facebook.com/pagename"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Logo URL</label>
                <input
                  type="text"
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({...formData, logoUrl: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  placeholder="https://..."
                />
              </div>
            </form>
          </div>

          {/* API Keys */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">🔑 API Keys</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Gemini API Key</label>
                <input
                  type="password"
                  value="••••••••••••••••"
                  className="w-full p-2 border rounded-lg bg-gray-50"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">LINE Channel Access Token</label>
                <input
                  type="password"
                  value="••••••••••••••••"
                  className="w-full p-2 border rounded-lg bg-gray-50"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-red-100">
            <h2 className="text-xl font-bold mb-4 text-red-500">⚠️ โซนอันตราย</h2>
            <div className="space-y-4">
              <button className="bg-yellow-500 text-white px-6 py-2 rounded-lg font-semibold w-full hover:bg-yellow-600">
                📤 Export ข้อมูล
              </button>
              <button className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold w-full hover:bg-red-600">
                🗑️ ลบข้อมูลทั้งหมด
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
