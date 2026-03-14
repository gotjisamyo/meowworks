import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalChats: 0,
    todayChats: 0,
    totalOrders: 0,
    todayOrders: 0,
    totalRevenue: 0,
    activeAgents: 0
  });
  const [recentChats, setRecentChats] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [shop, setShop] = useState(null);

  useEffect(() => {
    checkAuth();
    fetchDashboardData();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const currentShop = localStorage.getItem('currentShop');
    if (!token) router.push('/login');
    if (currentShop) setShop(JSON.parse(currentShop));
  };

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch orders
      const ordersRes = await fetch('http://localhost:3001/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const ordersData = await ordersRes.json();
      
      if (ordersData.data) {
        const today = new Date().toDateString();
        const todayOrders = ordersData.data.filter(o => new Date(o.createdAt).toDateString() === today);
        const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.price * o.quantity), 0);
        
        setStats({
          totalChats: 156,
          todayChats: todayOrders.length * 2,
          totalOrders: ordersData.data.length,
          todayOrders: todayOrders.length,
          totalRevenue: todayRevenue,
          activeAgents: 2
        });
        
        setRecentOrders(ordersData.data.slice(0, 5));
      }
      
      // Mock chat data
      setRecentChats([
        { id: 1, name: 'สมชาย', message: 'มีเสื้อสีน้ำเงินไซส์ L ไหม?', time: '2 นาที', status: 'replied' },
        { id: 2, name: 'พิม', message: 'จัดส่งกี่วันคะ?', time: '5 นาที', status: 'pending' },
        { id: 3, name: 'แดง', message: 'ราคาเท่าไหร่?', time: '10 นาที', status: 'replied' },
        { id: 4, name: 'ใบบุญ', message: 'มีส่วนลดไหม?', time: '15 นาที', status: 'replied' },
      ]);
      
    } catch (error) {
      console.error('Error:', error);
      // Use mock data
      setStats({
        totalChats: 156,
        todayChats: 23,
        totalOrders: 45,
        todayOrders: 12,
        totalRevenue: 45600,
        activeAgents: 2
      });
      setRecentChats([
        { id: 1, name: 'สมชาย', message: 'มีเสื้อสีน้ำเงินไซส์ L ไหม?', time: '2 นาที', status: 'replied' },
        { id: 2, name: 'พิม', message: 'จัดส่งกี่วันคะ?', time: '5 นาที', status: 'pending' },
        { id: 3, name: 'แดง', message: 'ราคาเท่าไหร่?', time: '10 นาที', status: 'replied' },
      ]);
    }
  };

  const testAIChat = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'สวัสดีครับ' })
      });
      const data = await response.json();
      alert('AI ตอบ: ' + data.message);
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🐱</span>
              <h1 className="text-xl font-bold text-gray-900">MeowChat</h1>
              <span className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
                {shop?.name || 'Demo Shop'}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={testAIChat}
                className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600"
              >
                🧪 Test AI
              </button>
              <span className="text-sm text-gray-500">Welcome, Admin</span>
              <div className="h-8 w-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-medium">
                A
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-[calc(100vh-4rem)] hidden md:block">
          <nav className="p-4 space-y-1">
            <a href="/" className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-indigo-50 text-indigo-700 font-medium">
              <span className="text-xl">📊</span>
              <span>Dashboard</span>
            </a>
            <a href="/agents" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50">
              <span className="text-xl">🤖</span>
              <span>AI Agents</span>
            </a>
            <a href="/orders" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50">
              <span className="text-xl">📦</span>
              <span>Orders</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50">
              <span className="text-xl">💬</span>
              <span>Chats</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50">
              <span className="text-xl">👥</span>
              <span>Customers</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50">
              <span className="text-xl">📈</span>
              <span>Analytics</span>
            </a>
            <a href="/settings" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50">
              <span className="text-xl">⚙️</span>
              <span>Settings</span>
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 pb-24 md:pb-6">
          <div className="max-w-7xl mx-auto">
            {/* Page Title */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-gray-600">ยินดีต้อนรับกลับ! นี่คือภาพรวมธุรกิจของคุณ</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl">💬</span>
                  <span className="text-green-500 text-sm font-medium">+12%</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-800">{stats.todayChats}</h3>
                <p className="text-gray-500 text-sm">แชทวันนี้</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl">📦</span>
                  <span className="text-green-500 text-sm font-medium">+8%</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-800">{stats.todayOrders}</h3>
                <p className="text-gray-500 text-sm">ออร์เดอร์วันนี้</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl">👥</span>
                  <span className="text-green-500 text-sm font-medium">+5%</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-800">{stats.totalChats}</h3>
                <p className="text-gray-500 text-sm">ลูกค้าทั้งหมด</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl">💰</span>
                  <span className="text-green-500 text-sm font-medium">+23%</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-800">฿{stats.totalRevenue.toLocaleString()}</h3>
                <p className="text-gray-500 text-sm">รายได้วันนี้</p>
              </div>
            </div>

            {/* Charts & Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Chats */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">💬 แชทล่าสุด</h2>
                  <a href="#" className="text-indigo-600 text-sm hover:underline">ดูทั้งหมด</a>
                </div>
                <div className="space-y-4">
                  {recentChats.map((chat) => (
                    <div key={chat.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-indigo-600 font-medium">{chat.name[0]}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{chat.name}</p>
                          <p className="text-sm text-gray-500 truncate max-w-xs">{chat.message}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-400">{chat.time}</span>
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${chat.status === 'replied' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {chat.status === 'replied' ? 'ตอบแล้ว' : 'รอตอบ'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">📦 ออร์เดอร์ล่าสุด</h2>
                  <a href="/orders" className="text-indigo-600 text-sm hover:underline">ดูทั้งหมด</a>
                </div>
                <div className="space-y-4">
                  {recentOrders.length > 0 ? recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="font-medium text-gray-800">Order #{order.id}</p>
                        <p className="text-sm text-gray-500">{order.product}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-800">฿{order.price * order.quantity}</p>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          order.status === 'completed' ? 'bg-green-100 text-green-700' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {order.status === 'completed' ? 'เสร็จ' : order.status === 'pending' ? 'รอ' : 'ส่งแล้ว'}
                        </span>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>ยังไม่มีออร์เดอร์</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
              <h2 className="text-xl font-bold mb-4">🚀 เริ่มต้นใช้งาน</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a href="/settings" className="bg-white/20 hover:bg-white/30 rounded-lg p-4 text-center">
                  <span className="text-2xl">🔗</span>
                  <p className="font-medium mt-2">เชื่อมต่อ LINE</p>
                </a>
                <a href="/agents" className="bg-white/20 hover:bg-white/30 rounded-lg p-4 text-center">
                  <span className="text-2xl">🤖</span>
                  <p className="font-medium mt-2">ตั้งค่า AI Agent</p>
                </a>
                <a href="#" className="bg-white/20 hover:bg-white/30 rounded-lg p-4 text-center">
                  <span className="text-2xl">📦</span>
                  <p className="font-medium mt-2">เพิ่มสินค้า</p>
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
        <div className="flex justify-around py-2">
          <a href="/" className="flex flex-col items-center px-4 py-2 text-indigo-600">
            <span className="text-xl">📊</span>
            <span className="text-xs mt-1">Dashboard</span>
          </a>
          <a href="/agents" className="flex flex-col items-center px-4 py-2 text-gray-500">
            <span className="text-xl">🤖</span>
            <span className="text-xs mt-1">Agents</span>
          </a>
          <a href="/orders" className="flex flex-col items-center px-4 py-2 text-gray-500">
            <span className="text-xl">📦</span>
            <span className="text-xs mt-1">Orders</span>
          </a>
          <a href="/settings" className="flex flex-col items-center px-4 py-2 text-gray-500">
            <span className="text-xl">⚙️</span>
            <span className="text-xs mt-1">Settings</span>
          </a>
        </div>
      </nav>
    </div>
  );
}
