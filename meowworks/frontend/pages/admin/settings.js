import { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    shopName: 'MeowChat',
    shopEmail: 'contact@meowchat.store',
    shopPhone: '089-123-4567',
    currency: 'THB',
    timezone: 'Asia/Bangkok',
    language: 'th',
    lineChannelId: '2009479206',
    lineChannelSecret: 'bcf10af6467eb012fb5df3d24b0d6de9',
    lineAccessToken: 'xYbF9dlftMZI236ZgRaJK...',
    webhookUrl: 'https://meowchat.store/api/webhook',
    bankName: 'กสิกรไทย',
    bankAccount: '123-456-7890',
    bankAccountName: 'บริษัท เมาส์ซอม จำกัด',
    qrPayment: 'https://promptpay.io/0891234567.png',
    emailNotifications: true,
    lineNotifications: false,
    orderAlerts: true,
    lowStockAlerts: true,
    dailyReport: true,
  });

  const tabs = [
    { id: 'general', icon: '⚙️', label: 'ทั่วไป' },
    { id: 'line', icon: '💬', label: 'LINE' },
    { id: 'payment', icon: '💰', label: 'การเงิน' },
    { id: 'notifications', icon: '🔔', label: 'แจ้งเตือน' },
  ];

  const handleSave = () => {
    alert('บันทึกการตั้งค่าสำเร็จ! 💕');
  };

  return (
    <AdminLayout title="⚙️ ตั้งค่า">
      <div className="flex gap-6">
        {/* Sidebar Tabs */}
        <div className="w-48 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-purple-50 text-purple-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-6">⚙️ ตั้งค่าทั่วไป</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อร้าน</label>
                    <input
                      type="text"
                      value={settings.shopName}
                      onChange={(e) => setSettings({...settings, shopName: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">อีเมล</label>
                    <input
                      type="email"
                      value={settings.shopEmail}
                      onChange={(e) => setSettings({...settings, shopEmail: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">เบอร์โทรศัพท์</label>
                    <input
                      type="text"
                      value={settings.shopPhone}
                      onChange={(e) => setSettings({...settings, shopPhone: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">สกุลเงิน</label>
                    <select
                      value={settings.currency}
                      onChange={(e) => setSettings({...settings, currency: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="THB">฿ THB (บาทไทย)</option>
                      <option value="USD">$ USD (ดอลลาร์)</option>
                      <option value="EUR">€ EUR (ยูโร)</option>
                    </select>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <button onClick={handleSave} className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700">
                    💾 บันทึกการตั้งค่า
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* LINE Settings */}
          {activeTab === 'line' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-6">💬 ตั้งค่า LINE</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Channel ID</label>
                  <input
                    type="text"
                    value={settings.lineChannelId}
                    onChange={(e) => setSettings({...settings, lineChannelId: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">ไม่สามารถแก้ไขได้</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Channel Secret</label>
                  <input
                    type="password"
                    value={settings.lineChannelSecret}
                    onChange={(e) => setSettings({...settings, lineChannelSecret: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Access Token</label>
                  <input
                    type="password"
                    value={settings.lineAccessToken}
                    onChange={(e) => setSettings({...settings, lineAccessToken: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Webhook URL</label>
                  <input
                    type="text"
                    value={settings.webhookUrl}
                    onChange={(e) => setSettings({...settings, webhookUrl: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="pt-4 border-t border-gray-100 flex gap-3">
                  <button onClick={handleSave} className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700">
                    💾 บันทึก
                  </button>
                  <button className="px-6 py-2 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200">
                    🔄 Renew Token
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Payment Settings */}
          {activeTab === 'payment' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-6">💰 ตั้งค่าการเงิน</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ธนาคาร</label>
                    <select
                      value={settings.bankName}
                      onChange={(e) => setSettings({...settings, bankName: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option>กสิกรไทย</option>
                      <option>กรุงเทพ</option>
                      <option>ไทยพาณิชย์</option>
                      <option>กรุงไทย</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">เลขบัญชี</label>
                    <input
                      type="text"
                      value={settings.bankAccount}
                      onChange={(e) => setSettings({...settings, bankAccount: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อบัญชี</label>
                    <input
                      type="text"
                      value={settings.bankAccountName}
                      onChange={(e) => setSettings({...settings, bankAccountName: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-2">QR Payment</label>
                  <input
                    type="text"
                    value={settings.qrPayment}
                    onChange={(e) => setSettings({...settings, qrPayment: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">ลิงก์ QR Code สำหรับ PromptPay</p>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <button onClick={handleSave} className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700">
                    💾 บันทึกการตั้งค่า
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Settings */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-6">🔔 ตั้งค่าแจ้งเตือน</h3>
              <div className="space-y-4">
                {[
                  { key: 'emailNotifications', label: '📧 แจ้งเตือนทาง Email', desc: 'รับการแจ้งเตือนสำคัญทางอีเมล' },
                  { key: 'lineNotifications', label: '💬 แจ้งเตือนทาง LINE', desc: 'รับการแจ้งเตือนใน LINE' },
                  { key: 'orderAlerts', label: '📦 แจ้งเตือนออเดอร์ใหม่', desc: 'แจ้งเลยทันทีเมื่อมีออเดอร์ใหม่' },
                  { key: 'lowStockAlerts', label: '⚠️ แจ้งเตือนสต็อกต่ำ', desc: 'แจ้งเมื่อสินค้าใกล้หมด' },
                  { key: 'dailyReport', label: '📊 ส่งรายงานรายวัน', desc: 'ส่งสรุปยอดขายทุกวัน' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-800">{item.label}</p>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings[item.key]}
                        onChange={(e) => setSettings({...settings, [item.key]: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                ))}

                <div className="pt-4 border-t border-gray-100">
                  <button onClick={handleSave} className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700">
                    💾 บันทึกการตั้งค่า
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
