import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Pricing() {
  const router = useRouter();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPlan, setCurrentPlan] = useState(null);

  useEffect(() => {
    fetchPlans();
    checkCurrentPlan();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/plans');
      if (response.ok) {
        const data = await response.json();
        setPlans(data.plans || []);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
      // Use default plans if API fails
      setPlans([
        { id: 1, name: 'Starter', price: 999, max_chats: 500, max_agents: 1, features: ['ใช้งานได้ 1 Agent', '500 ข้อความ/เดือน', 'รองรับ LINE Bot', 'สถิติพื้นฐาน', 'สนับสนุนทาง Email'] },
        { id: 2, name: 'Pro', price: 2999, max_chats: 5000, max_agents: 5, features: ['ใช้งานได้ 5 Agents', '5,000 ข้อความ/เดือน', 'รองรับ LINE Bot', 'สถิติขั้นสูง', 'AI Auto Reply', 'สนับสนุนทาง Email & Chat'] },
        { id: 3, name: 'Enterprise', price: 9999, max_chats: -1, max_agents: -1, features: ['ใช้งานได้ไม่จำกัด Agents', 'ข้อความไม่จำกัด', 'รองรับ Multi-channel', 'สถิติขั้นสูง & Analytics', 'API Access', 'สนับสนุน 24/7'] },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const checkCurrentPlan = () => {
    const shop = JSON.parse(localStorage.getItem('currentShop') || '{}');
    setCurrentPlan(shop.plan_name || null);
  };

  const handleSubscribe = async (plan) => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/billing/subscribe', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ planId: plan.id })
      });

      if (response.ok) {
        alert(`สมัครแพลน ${plan.name} สำเร็จ!`);
        router.push('/settings');
      }
    } catch (error) {
      console.error('Subscribe error:', error);
      // For demo, just redirect
      router.push('/settings');
    }
  };

  const defaultPlans = [
    {
      id: 1,
      name: 'Starter',
      price: 999,
      max_chats: 500,
      max_agents: 1,
      features: [
        'ใช้งานได้ 1 Agent',
        '500 ข้อความ/เดือน',
        'รองรับ LINE Bot',
        'สถิติพื้นฐาน',
        'สนับสนุนทาง Email'
      ]
    },
    {
      id: 2,
      name: 'Pro',
      price: 2999,
      max_chats: 5000,
      max_agents: 5,
      popular: true,
      features: [
        'ใช้งานได้ 5 Agents',
        '5,000 ข้อความ/เดือน',
        'รองรับ LINE Bot',
        'สถิติขั้นสูง',
        'AI Auto Reply',
        'สนับสนุนทาง Email & Chat'
      ]
    },
    {
      id: 3,
      name: 'Enterprise',
      price: 9999,
      max_chats: -1,
      max_agents: -1,
      features: [
        'ใช้งานได้ไม่จำกัด Agents',
        'ข้อความไม่จำกัด',
        'รองรับ Multi-channel',
        'สถิติขั้นสูง & Analytics',
        'API Access',
        'สนับสนุน 24/7'
      ]
    }
  ];

  const displayPlans = plans.length > 0 ? plans : defaultPlans;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <span className="text-2xl">🤖</span>
              <h1 className="ml-2 text-xl font-bold text-gray-900">MeowChat</h1>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-gray-600 hover:text-gray-900">
                เข้าสู่ระบบ
              </Link>
              <Link href="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                สมัครฟรี
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Pricing Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">เลือกแพลนที่เหมาะกับคุณ</h1>
          <p className="text-xl text-gray-600 mt-4">
            เริ่มต้นที่ ฿999/เดือน ลดค่าใช้จ่าย ด้วย AI ที่ทำงานแทนคุณ 24/7
          </p>
        </div>

        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {displayPlans.map((plan) => (
              <div 
                key={plan.id} 
                className={`bg-white rounded-2xl shadow-sm border-2 p-8 ${
                  plan.popular ? 'border-indigo-500 relative' : 'border-gray-100'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      ยอดนิยม
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">฿{plan.price}</span>
                    <span className="text-gray-500">/เดือน</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <span className="text-green-500 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                  <li className="flex items-center text-gray-600">
                    <span className="text-green-500 mr-2">✓</span>
                    {plan.max_chats === -1 
                      ? 'ข้อความไม่จำกัด' 
                      : `ข้อความ ${plan.max_chats}/เดือน`}
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="text-green-500 mr-2">✓</span>
                    {plan.max_agents === -1 
                      ? 'Agents ไม่จำกัด' 
                      : `ใช้งานได้ ${plan.max_agents} Agent`}
                  </li>
                </ul>

                <button
                  onClick={() => handleSubscribe(plan)}
                  className={`w-full py-3 rounded-lg font-semibold transition ${
                    plan.popular
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {currentPlan === plan.name ? 'แพลนปัจจุบัน' : 'เลือกแพลนนี้'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* FAQ */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">คำถามที่พบบ่อย</h2>
          
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">สามารถเปลี่ยนแพลนได้ไหม?</h3>
              <p className="text-gray-600">ใช่! คุณสามารถอัปเกรดหรือดาวน์เกรดแพลนได้ตลอดเวลา การเปลี่ยนแพลนจะมีผลทันที</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">มีทดลองใช้ฟรีไหม?</h3>
              <p className="text-gray-600">มี! ทดลองใช้ฟรี 7 วัน ไม่ต้องใส่บัตรเครดิต</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">ข้อความเกินจะเป็นอย่างไร?</h3>
              <p className="text-gray-600">คุณสามารถซื้อเพิ่มได้ หรืออัปเกรดเป็นแพลนที่สูงกว่า</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>© 2026 MeowChat. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
