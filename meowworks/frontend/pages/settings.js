import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Settings() {
  const router = useRouter();
  const [shop, setShop] = useState(null);
  const [settings, setSettings] = useState({
    shopName: '',
    shopDescription: '',
    businessType: 'general',
    // AI Settings
    aiName: 'แมวส้ม',
    aiPersonality: 'friendly', // นิสัย AI
    aiResponseStyle: 'balanced', // รูปแบบการตอบ
    aiGreeting: 'สวัสดีค่ะ! มีอะไรให้ช่วยไหมคะ? 💕',
    aiCustomKnowledge: '', // ข้อมูลเพิ่มเติม
    workingHours: '24/7',
    // LINE Settings
    lineChannelId: '',
    lineChannelSecret: '',
    lineAccessToken: ''
  });

  // ประเภทธุรกิจ
  const businessTypes = [
    { value: 'general', label: '🏪 ร้านค้าทั่วไป', icon: '🏪' },
    { value: 'clothing', label: '👕 ร้านเสื้อผ้า', icon: '👕' },
    { value: 'food', label: '🍕 ร้านอาหาร', icon: '🍕' },
    { value: 'coffee', label: '☕ ร้านกาแฟ', icon: '☕' },
    { value: 'electronics', label: '📱 ร้านอิเล็กทรอนิกส์', icon: '📱' },
    { value: 'beauty', label: '💄 ร้านความสวยความงาม', icon: '💄' },
    { value: 'hotel', label: '🏨 โรงแรม/ที่พัก', icon: '🏨' },
    { value: 'clinic', label: '🏥 คลินิก/สุขภาพ', icon: '🏥' },
    { value: 'education', label: '📚 สถาบันการศึกษา', icon: '📚' },
    { value: 'automotive', label: '🚗 ร้านรถยนต์', icon: '🚗' },
  ];

  // นิสัย AI
  const aiPersonalities = [
    { value: 'friendly', label: '😊 �เป็นมิตร', description: 'อ่อนหวาน สนุกสนาน ใช้อิโมจิเยอะ' },
    { value: 'professional', label: '💼 เป็นทางการ', description: 'ตรงไปตรงมา จริงจัง ให้ข้อมูลครบ' },
    { value: 'playful', label: '😜 ขี้เล่น', description: 'ตลก ขำขัน แต่ยังให้บริการดี' },
    { value: 'gentle', label: '🤗 อ่อนโยน', description: 'ช่วยเหลือ ซับซ้อน ใส่ใจลูกค้า' },
  ];

  // รูปแบบการตอบ
  const aiResponseStyles = [
    { value: 'short', label: '⚡ ตอบสั้น', description: 'กระชับ ได้ใจความ ไม่เกิน 2 บรรทัด' },
    { value: 'balanced', label: '⚖️ ตอบพอดี', description: 'สมดุล ทั้งข้อมูลและความสนุก' },
    { value: 'detailed', label: '📝 ตอบละเอียด', description: 'อธิบายเยอะ ให้ข้อมูลครบถ้วน' },
    { value: 'emoji', label: '🎨 มีอิโมจิ', description: 'ใช้อิโมจิเยอะ ดูสนุก น่าคุย' },
  ];
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const currentShop = localStorage.getItem('currentShop');
    if (currentShop) {
      const shopData = JSON.parse(currentShop);
      setShop(shopData);
      setSettings({
        ...settings,
        shopName: shopData.name || '',
        shopDescription: shopData.description || '',
        lineChannelId: shopData.line_channel_id || '',
        lineChannelSecret: shopData.line_channel_secret || '',
        lineAccessToken: shopData.line_access_token || ''
      });
    }
  }, []);

  const handleSave = async () => {
    setSaving(true);
    
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update local storage
    const updatedShop = {
      ...shop,
      ...settings
    };
    localStorage.setItem('currentShop', JSON.stringify(updatedShop));
    
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const testLineConnection = () => {
    if (!settings.lineAccessToken) {
      alert('กรุณาใส่ LINE Access Token ก่อนค่ะ');
      return;
    }
    alert('📱 LINE Integration กำลังทดสอบ...\n\nหากยังไม่ได้ตั้งค่า Webhook กรุณาไปที่ LINE Developers Console และตั้งค่า:\n\nURL: https://your-domain.com/webhook');
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
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">⚙️ ตั้งค่าร้านค้า</h1>
          <p className="text-gray-600">ตั้งค่าต่างๆ สำหรับร้านค้าของคุณ</p>
        </div>

        {/* Success Message */}
        {saved && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            ✅ บันทึกสำเร็จ!
          </div>
        )}

        {/* Shop Info */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">🏪 ข้อมูลร้านค้า</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ชื่อร้านค้า
              </label>
              <input
                type="text"
                value={settings.shopName}
                onChange={(e) => setSettings({...settings, shopName: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="ร้านขายเสื้อผ้าของฉัน"
              />
            </div>
            
            {/* Business Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🏢 ประเภทธุรกิจ
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {businessTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setSettings({...settings, businessType: type.value})}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      settings.businessType === type.value
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-xl mr-2">{type.icon}</span>
                    <span className="text-sm">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                คำอธิบาย
              </label>
              <textarea
                value={settings.shopDescription}
                onChange={(e) => setSettings({...settings, shopDescription: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                rows={3}
                placeholder="ร้านขายเสื้อผ้าออนไลน์ ส่งทั่วประเทศ"
              />
            </div>
          </div>
        </div>

        {/* LINE Integration */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">💬 LINE Integration</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-700">
              📱 <strong>LINE Official Account</strong><br/>
              เชื่อมต่อ LINE OA ของร้านคุณ เพื่อให้ AI ตอบแชทลูกค้าอัตโนมัติ
            </p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LINE Channel ID
              </label>
              <input
                type="text"
                value={settings.lineChannelId}
                onChange={(e) => setSettings({...settings, lineChannelId: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="1234567890"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LINE Channel Secret
              </label>
              <input
                type="password"
                value={settings.lineChannelSecret}
                onChange={(e) => setSettings({...settings, lineChannelSecret: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LINE Access Token
              </label>
              <input
                type="password"
                value={settings.lineAccessToken}
                onChange={(e) => setSettings({...settings, lineAccessToken: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••••••••••••••••••"
              />
              <p className="text-xs text-gray-500 mt-1">
                Token สามารถสร้างได้ที่ LINE Developers Console &gt; Messaging API
              </p>
            </div>
            
            <button
              onClick={testLineConnection}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              🧪 ทดสอบการเชื่อมต่อ
            </button>
          </div>
        </div>

        {/* AI Settings */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">🤖 ตั้งค่า AI Agent</h2>
          <div className="space-y-4">
            {/* AI Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ชื่อ AI Agent
              </label>
              <input
                type="text"
                value={settings.aiName}
                onChange={(e) => setSettings({...settings, aiName: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="แมวส้ม"
              />
            </div>

            {/* AI Personality */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                😊 นิสัย AI
              </label>
              <div className="grid grid-cols-2 gap-3">
                {aiPersonalities.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setSettings({...settings, aiPersonality: p.value})}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      settings.aiPersonality === p.value
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">{p.label}</div>
                    <div className="text-xs text-gray-500">{p.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Response Style */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                💬 รูปแบบการตอบ
              </label>
              <div className="grid grid-cols-2 gap-3">
                {aiResponseStyles.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setSettings({...settings, aiResponseStyle: s.value})}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      settings.aiResponseStyle === s.value
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">{s.label}</div>
                    <div className="text-xs text-gray-500">{s.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Knowledge */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                📚 ข้อมูลเพิ่มเติม (Knowledge Base)
              </label>
              <textarea
                value={settings.aiCustomKnowledge}
                onChange={(e) => setSettings({...settings, aiCustomKnowledge: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                rows={4}
                placeholder="ใส่ข้อมูลเพิ่มเติมเกี่ยวกับร้านคุณ...
เช่น:
- รับเฉพาะวันจันทร์-ศุกร์
- มีบริการจัดส่งฟรีในกรุงเทพ
- มีโปรโมชั่นพิเศษทุกเดือน"
              />
              <p className="text-xs text-gray-500 mt-1">
                AI จะใช้ข้อมูลนี้ในการตอบลูกค้า
              </p>
            </div>

            {/* Greeting */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                👋 ข้อความต้อนรับ
              </label>
              <textarea
                value={settings.aiGreeting}
                onChange={(e) => setSettings({...settings, aiGreeting: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                rows={2}
                placeholder="สวัสดีค่ะ! มีอะไรให้ช่วยไหมคะ? 💕"
              />
            </div>

            {/* Working Hours */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ⏰ เวลาทำงาน
              </label>
              <select
                value={settings.workingHours}
                onChange={(e) => setSettings({...settings, workingHours: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="24/7">24 ชั่วโมง (ตลอดวัน)</option>
                <option value="9-18">09:00 - 18:00 น.</option>
                <option value="custom">กำหนดเอง</option>
              </select>
            </div>
          </div>
        </div>

        {/* Web Widget */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">🌐 Web Widget</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-3">
              ใช้โค้ดนี้เพื่อฝัง Chat Widget ในเว็บไซต์ของคุณ:
            </p>
            <pre className="bg-gray-800 text-green-400 p-4 rounded-lg text-xs overflow-x-auto">
{`<script src="https://meowworks.com/widget.js"></script>
<script>
  window.AIChatWidget.init({
    shopId: '${shop?.id || 'YOUR_SHOP_ID'}',
    shopName: '${settings.shopName || 'ร้านค้า'}'
  });
</script>`}
            </pre>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`<script src="https://meowworks.com/widget.js"></script>
<script>
  window.AIChatWidget.init({
    shopId: '${shop?.id || 'YOUR_SHOP_ID'}',
    shopName: '${settings.shopName || 'ร้านค้า'}'
  });
</script>`);
                alert('📋 คัดลอกโค้ดแล้ว!');
              }}
              className="mt-3 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              📋 คัดลอกโค้ด
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? 'กำลังบันทึก...' : '💾 บันทึกการตั้งค่า'}
          </button>
        </div>
      </main>
    </div>
  );
}
