import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Shops() {
  const router = useRouter();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newShop, setNewShop] = useState({ name: '', description: '' });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    checkAuth();
    fetchShops();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  };

  const fetchShops = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/shops', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setShops(data.shops || []);
      }
    } catch (error) {
      console.error('Error fetching shops:', error);
    } finally {
      setLoading(false);
    }
  };

  const createShop = async (e) => {
    e.preventDefault();
    setCreating(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/shops', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newShop)
      });

      if (response.ok) {
        const data = await response.json();
        setShops([...shops, data.shop]);
        setShowModal(false);
        setNewShop({ name: '', description: '' });
        
        // Redirect to shop dashboard
        localStorage.setItem('currentShop', JSON.stringify(data.shop));
        router.push('/');
      }
    } catch (error) {
      console.error('Error creating shop:', error);
    } finally {
      setCreating(false);
    }
  };

  const selectShop = (shop) => {
    localStorage.setItem('currentShop', JSON.stringify(shop));
    router.push('/');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('currentShop');
    router.push('/login');
  };

  const [user, setUser] = useState({});

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl">🤖</span>
              <h1 className="ml-2 text-xl font-bold text-gray-900">MeowChat</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">{user.name}</span>
              <button
                onClick={logout}
                className="text-gray-600 hover:text-gray-900"
              >
                ออกระบบ
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">ร้านค้าของฉัน</h2>
            <p className="text-gray-600 mt-1">จัดการร้านค้าของคุณ</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            + สร้างร้านใหม่
          </button>
        </div>

        {/* Shops Grid */}
        {shops.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">🏪</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">ยังไม่มีร้านค้า</h3>
            <p className="text-gray-600 mb-6">สร้างร้านค้าแรกของคุณเพื่อเริ่มใช้งาน</p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
            >
              + สร้างร้านใหม่
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shops.map((shop) => (
              <div key={shop.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{shop.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {shop.description || 'ไม่มีคำอธิบาย'}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                    {shop.plan_name || 'Free'}
                  </span>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => selectShop(shop)}
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
                  >
                    เข้าร้านค้า
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Shop Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">สร้างร้านค้าใหม่</h3>
            
            <form onSubmit={createShop} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ชื่อร้าน *
                </label>
                <input
                  type="text"
                  value={newShop.name}
                  onChange={(e) => setNewShop({ ...newShop, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  placeholder="ร้านขายเสื้อผ้า"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  คำอธิบาย
                </label>
                <textarea
                  value={newShop.description}
                  onChange={(e) => setNewShop({ ...newShop, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  placeholder="ร้านขายเสื้อผ้าออนไลน์..."
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {creating ? 'กำลังสร้าง...' : 'สร้างร้าน'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
