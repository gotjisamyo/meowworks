import { useState, useEffect } from 'react';

export default function Marketing() {
  const [templates, setTemplates] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('templates');
  const [broadcastMsg, setBroadcastMsg] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tplRes, campRes, statsRes] = await Promise.all([
        fetch('http://localhost:3001/api/marketing/templates'),
        fetch('http://localhost:3001/api/marketing/campaigns'),
        fetch('http://localhost:3001/api/marketing/stats')
      ]);
      
      setTemplates(await tplRes.json());
      setCampaigns(await campRes.json());
      setStats(await statsRes.json());
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const applyTemplate = async (templateId) => {
    try {
      const res = await fetch('http://localhost:3001/api/marketing/apply-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          templateId, 
          customerId: 1, // Demo customer
          channel: 'line' 
        })
      });
      const data = await res.json();
      alert(data.success ? '✅ เปิดใช้งาน Automation สำเร็จ!' : '❌ เกิดข้อผิดพลาด');
    } catch (error) {
      alert('❌ เกิดข้อผิดพลาด');
    }
  };

  const sendBroadcast = async () => {
    if (!broadcastMsg.trim()) {
      alert('กรุณาใส่ข้อความก่อนค่ะ');
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/api/marketing/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: broadcastMsg })
      });
      const data = await res.json();
      alert(`✅ ${data.message}`);
      setBroadcastMsg('');
    } catch (error) {
      alert('❌ เกิดข้อผิดพลาด');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <a href="/" className="flex items-center">
                <span className="text-2xl">🐱</span>
                <h1 className="ml-2 text-xl font-bold text-gray-900">MeowChat</h1>
              </a>
            </div>
            <nav className="flex space-x-4">
              <a href="/" className="text-gray-600 hover:text-indigo-600">Dashboard</a>
              <a href="/products" className="text-gray-600 hover:text-indigo-600">สินค้า</a>
              <a href="/marketing" className="text-indigo-600 font-medium">Marketing</a>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl font-bold text-indigo-600">{stats.totalCampaigns || 0}</div>
              <div className="text-gray-600">แคมเปญทั้งหมด</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl font-bold text-green-600">{stats.activeAutomations || 0}</div>
              <div className="text-gray-600">Automation ทำงาน</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl font-bold text-yellow-600">{stats.pendingMessages || 0}</div>
              <div className="text-gray-600">รอส่ง</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl font-bold text-blue-600">{stats.sentMessages || 0}</div>
              <div className="text-gray-600">ส่งแล้ว</div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-6 py-3 rounded-lg font-semibold ${
              activeTab === 'templates' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            📋 Automation Templates
          </button>
          <button
            onClick={() => setActiveTab('broadcast')}
            className={`px-6 py-3 rounded-lg font-semibold ${
              activeTab === 'broadcast' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            📢 Broadcast
          </button>
        </div>

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div key={template.id} className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2">{template.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{template.description}</p>
                
                <div className="space-y-2 mb-4">
                  {template.steps?.map((step, idx) => (
                    <div key={idx} className="text-sm text-gray-500 flex items-start gap-2">
                      <span className="bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded text-xs">
                        วัน {step.day}
                      </span>
                      <span className="line-clamp-2">{step.message?.substring(0, 50)}...</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => applyTemplate(template.id)}
                  className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
                >
                  ✅ เปิดใช้งาน
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Broadcast Tab */}
        {activeTab === 'broadcast' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">📢 ส่งข้อความถึงลูกค้าทุกคน</h3>
            
            <textarea
              value={broadcastMsg}
              onChange={(e) => setBroadcastMsg(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 mb-4"
              rows={6}
              placeholder="พิมข้อความที่ต้องการส่ง..."
            />

            <div className="flex gap-4">
              <button
                onClick={sendBroadcast}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
              >
                🚀 ส่งทันที
              </button>
              <button
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300"
              >
                📅 ตั้งเวลา
              </button>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">💡 ตัวอย่างข้อความ:</h4>
              <div className="space-y-2 text-sm text-yellow-700">
                <button 
                  onClick={() => setBroadcastMsg('🎉 MeowChat มีโปรโมชั่นพิเศษ!\n\n🔥 ลด 50% สำหรับ 100 คนแรก\n\nราคาเพียง ฿499/เดือน\n\nใช้โค้ด: EARLYBIRD\n\nหมดอายุ: สิ้นเดือนนี้ค่ะ!')}
                  className="block hover:underline"
                >
                  🎉 โปรโมชั่นลด 50%
                </button>
                <button 
                  onClick={() => setBroadcastMsg('📚 มาเริ่มต้นใช้งาน MeowChat กันเลย!\n\n1. เข้าไปที่ Dashboard\n2. สร้างร้านค้าของคุณ\n3. เพิ่มสินค้า\n\nมีอะไรให้ช่วยไหมคะ? 💕')}
                  className="block hover:underline"
                >
                  📚 คู่มือเริ่มต้น
                </button>
                <button 
                  onClick={() => setBroadcastMsg('⭐ ขอบคุณที่ใช้ MeowChat นะคะ!\n\nถ้าชอบ ช่วยรีวิวให้หน่อยได้ไหมคะ?\n\nจะเป็นกำลังใจให้พี่ก็อตมากเลยค่ะ 💕')}
                  className="block hover:underline"
                >
                  ⭐ ขอรีวิว
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
