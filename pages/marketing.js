import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Marketing() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'broadcast',
    message: '',
    target: 'all'
  });
  const [shop, setShop] = useState(null);

  useEffect(() => {
    const currentShop = localStorage.getItem('currentShop');
    if (currentShop) {
      const shopData = JSON.parse(currentShop);
      setShop(shopData);
      fetchCampaigns(shopData.id);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCampaigns = async (shopId) => {
    try {
      const res = await fetch(`http://localhost:3001/api/marketing/campaigns?shopId=${shopId}`);
      const data = await res.json();
      setCampaigns(data);
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
      const res = await fetch('http://localhost:3001/api/marketing/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          shopId: shop.id
        })
      });

      if (res.ok) {
        alert('✅ สร้างแคมเปญสำเร็จ!');
        setShowForm(false);
        setFormData({ name: '', type: 'broadcast', message: '', target: 'all' });
        fetchCampaigns(shop.id);
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
          <h1 className="text-2xl font-bold">📢 Marketing</h1>
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
          <a href="/marketing" className="text-pink-500 font-semibold">📢 Marketing</a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">แคมเปญการตลาด</h2>
          <button 
            onClick={() => setShowForm(true)}
            className="bg-pink-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-pink-600"
          >
            + สร้างแคมเปญใหม่
          </button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-6 rounded-xl">
            <div className="text-3xl mb-2">📣</div>
            <div className="font-bold">Broadcast</div>
            <div className="text-sm opacity-80">ส่งข้อความถึงลูกค้าทั้งหมด</div>
          </div>
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-6 rounded-xl">
            <div className="text-3xl mb-2">🎁</div>
            <div className="font-bold">โปรโมชั่น</div>
            <div className="text-sm opacity-80">ส่งข้อเสนอพิเศษ</div>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl">
            <div className="text-3xl mb-2">🤖</div>
            <div className="font-bold">Auto Reply</div>
            <div className="text-sm opacity-80">ตอบอัตโนมัติ</div>
          </div>
        </div>

        {/* Campaigns List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-bold mb-4">แคมเปญที่สร้างไว้</h3>
          {campaigns.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              ยังไม่มีแคมเปญค่ะ
            </div>
          ) : (
            <div className="space-y-4">
              {campaigns.map((campaign, index) => (
                <div key={index} className="border rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{campaign.name}</div>
                    <div className="text-sm text-gray-500">{campaign.type} - {campaign.status}</div>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-blue-500 hover:text-blue-700">แก้ไข</button>
                    <button className="text-red-500 hover:text-red-700">ลบ</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">สร้างแคมเปญใหม่</h3>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">ชื่อแคมเปญ</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">ประเภท</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="broadcast">Broadcast - ส่งข้อความถึงทุกคน</option>
                    <option value="promotion">โปรโมชั่น - ส่งข้อเสนอพิเศษ</option>
                    <option value="automation">Auto Reply - ตอบอัตโนมัติ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">ข้อความ</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    rows="4"
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
                  สร้าง
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
