import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import AppShell from '../components/AppShell';
import { apiFetch, ensureShopSelected, API_ORIGIN } from '../lib/clientApi';

const emptyForm = {
  name: '',
  description: '',
  lineChannelId: '',
  lineChannelSecret: '',
  lineAccessToken: '',
};

const initialConnectionState = {
  status: 'idle',
  message: 'ยังไม่ได้ทดสอบการเชื่อมต่อ LINE',
  botName: '',
  basicId: '',
  pictureUrl: '',
};

function maskSecret(value = '', visible = 4) {
  if (!value) return 'ยังไม่ได้กรอก';
  if (value.length <= visible * 2) return value;
  return `${value.slice(0, visible)}••••••${value.slice(-visible)}`;
}

export default function SettingsPage() {
  const router = useRouter();
  const [shop, setShop] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [connection, setConnection] = useState(initialConnectionState);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const currentShop = ensureShopSelected(router);
    if (!currentShop) {
      setLoading(false);
      return;
    }

    setShop(currentShop);
    loadShop(currentShop.id);
  }, [router]);

  const webhookUrl = useMemo(() => `${API_ORIGIN}/webhook`, []);

  const credentialSummary = useMemo(() => {
    const fields = [
      { key: 'lineChannelId', label: 'Channel ID' },
      { key: 'lineChannelSecret', label: 'Channel Secret' },
      { key: 'lineAccessToken', label: 'Access Token' },
    ];

    const completed = fields.filter((field) => Boolean(formData[field.key]?.trim())).length;

    return {
      completed,
      total: fields.length,
      ready: completed === fields.length,
    };
  }, [formData]);

  const loadShop = async (shopId) => {
    try {
      setLoading(true);
      setError('');
      const data = await apiFetch(`/shops/${shopId}`);
      const nextShop = data.shop || null;
      setShop(nextShop);
      setFormData({
        name: nextShop?.name || '',
        description: nextShop?.description || '',
        lineChannelId: nextShop?.line_channel_id || '',
        lineChannelSecret: nextShop?.line_channel_secret || '',
        lineAccessToken: nextShop?.line_access_token || '',
      });
      setConnection(initialConnectionState);
      if (nextShop) {
        localStorage.setItem('currentShop', JSON.stringify(nextShop));
      }
    } catch (err) {
      setError(err.message || 'โหลดข้อมูลร้านไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!shop) return;

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const data = await apiFetch(`/shops/${shop.id}`, {
        method: 'PUT',
        body: JSON.stringify(formData),
      });

      const updatedShop = data.shop || { ...shop, ...formData };
      setShop(updatedShop);
      localStorage.setItem('currentShop', JSON.stringify(updatedShop));
      setSuccess('บันทึกการตั้งค่าเรียบร้อยแล้ว');
    } catch (err) {
      setError(err.message || 'บันทึกการตั้งค่าไม่สำเร็จ');
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {
    const channelId = formData.lineChannelId.trim();
    const channelSecret = formData.lineChannelSecret.trim();
    const accessToken = formData.lineAccessToken.trim();

    if (!channelId || !channelSecret || !accessToken) {
      setConnection({
        status: 'error',
        message: 'กรุณากรอก LINE Channel ID, Channel Secret และ Access Token ให้ครบก่อนทดสอบ',
        botName: '',
        basicId: '',
        pictureUrl: '',
      });
      return;
    }

    try {
      setTestingConnection(true);
      setConnection({
        status: 'testing',
        message: 'กำลังตรวจสอบการเชื่อมต่อกับ LINE...',
        botName: '',
        basicId: '',
        pictureUrl: '',
      });

      const response = await fetch('https://api.line.me/v2/bot/info', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.message || 'ไม่สามารถเชื่อมต่อกับ LINE Messaging API ได้');
      }

      setConnection({
        status: 'success',
        message: 'เชื่อมต่อ LINE สำเร็จ พร้อมใช้งาน',
        botName: data?.displayName || '',
        basicId: data?.basicId || '',
        pictureUrl: data?.pictureUrl || '',
      });
    } catch (err) {
      setConnection({
        status: 'error',
        message: err.message || 'เชื่อมต่อ LINE ไม่สำเร็จ กรุณาตรวจสอบ credentials อีกครั้ง',
        botName: '',
        basicId: '',
        pictureUrl: '',
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const statusTone = {
    idle: 'bg-gray-100 text-gray-700 border-gray-200',
    testing: 'bg-amber-100 text-amber-700 border-amber-200',
    success: 'bg-green-100 text-green-700 border-green-200',
    error: 'bg-red-100 text-red-700 border-red-200',
  };

  const statusLabel = {
    idle: 'ยังไม่ทดสอบ',
    testing: 'กำลังทดสอบ',
    success: 'เชื่อมต่อได้',
    error: 'เชื่อมต่อไม่ได้',
  };

  if (!shop && !loading) {
    return (
      <AppShell title="ตั้งค่า" subtitle="กรุณาเลือกร้านค้าก่อน">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <div className="text-5xl mb-4">🏪</div>
          <p className="text-gray-700 mb-4">ยังไม่ได้เลือกร้านค้าค่ะ</p>
          <button onClick={() => router.push('/shops')} className="bg-indigo-600 text-white px-5 py-3 rounded-lg hover:bg-indigo-700">
            ไปเลือกร้านค้า
          </button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="ตั้งค่าร้าน" subtitle="แก้ไขข้อมูลร้านและการเชื่อมต่อ LINE" shopName={shop?.name}>
      {error && <div className="mb-6 rounded-xl bg-red-50 text-red-700 px-4 py-3 border border-red-200">{error}</div>}
      {success && <div className="mb-6 rounded-xl bg-green-50 text-green-700 px-4 py-3 border border-green-200">{success}</div>}

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center text-gray-500">กำลังโหลดข้อมูล...</div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <form onSubmit={handleSubmit} className="xl:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">ข้อมูลร้านค้า</h2>
              <p className="text-sm text-gray-500 mt-1">ข้อมูลส่วนนี้จะแสดงเป็นข้อมูลหลักของร้านในระบบ</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อร้าน *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="เช่น Meow Coffee"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">คำอธิบายร้าน</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                rows={4}
                placeholder="เล่าเกี่ยวกับร้านหรือบริการของคุณ"
              />
            </div>

            <div className="border-t border-gray-100 pt-5 space-y-4">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">เชื่อมต่อ LINE OA</h2>
                    <p className="text-sm text-gray-500 mt-1">สำหรับรับ webhook และตอบลูกค้าผ่าน LINE</p>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${credentialSummary.ready ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                    {credentialSummary.ready ? 'Credentials ครบแล้ว' : `กรอกแล้ว ${credentialSummary.completed}/${credentialSummary.total}`}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LINE Channel ID</label>
                <input
                  type="text"
                  value={formData.lineChannelId}
                  onChange={(e) => setFormData({ ...formData, lineChannelId: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="2001234567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LINE Channel Secret</label>
                <input
                  type="password"
                  value={formData.lineChannelSecret}
                  onChange={(e) => setFormData({ ...formData, lineChannelSecret: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="กรอก Channel Secret"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LINE Channel Access Token</label>
                <textarea
                  value={formData.lineAccessToken}
                  onChange={(e) => setFormData({ ...formData, lineAccessToken: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  rows={4}
                  placeholder="กรอก Access Token"
                />
              </div>

              <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4 space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">ทดสอบการเชื่อมต่อ LINE</h3>
                    <p className="text-sm text-gray-600 mt-1">ระบบจะลองเรียก LINE Messaging API เพื่อตรวจสอบว่า Access Token ใช้งานได้จริง</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={testingConnection}
                    className="inline-flex items-center justify-center bg-green-600 text-white px-5 py-3 rounded-xl font-medium hover:bg-green-700 disabled:opacity-60"
                  >
                    {testingConnection ? 'กำลังทดสอบ...' : 'ทดสอบการเชื่อมต่อ LINE'}
                  </button>
                </div>

                <div className={`rounded-xl border px-4 py-3 ${statusTone[connection.status]}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="font-semibold">สถานะ LINE: {statusLabel[connection.status]}</div>
                    <span className="text-xs font-medium opacity-80">อัปเดตตามผลทดสอบล่าสุด</span>
                  </div>
                  <p className="text-sm mt-2">{connection.message}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button type="submit" disabled={saving} className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-60">
                {saving ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่า'}
              </button>
            </div>
          </form>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Webhook URL</h3>
              <p className="text-sm text-gray-500 mb-3">นำ URL นี้ไปใส่ใน LINE Developers Console</p>
              <div className="rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-sm break-all text-gray-700">
                {webhookUrl}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">สถานะการเชื่อมต่อ LINE</h3>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border mb-4 ${statusTone[connection.status]}`}>
                {statusLabel[connection.status]}
              </div>

              <dl className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500">Channel ID</dt>
                  <dd className="font-medium text-gray-900 text-right">{formData.lineChannelId || '-'}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500">Channel Secret</dt>
                  <dd className="font-medium text-gray-900 text-right">{maskSecret(formData.lineChannelSecret)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500">Access Token</dt>
                  <dd className="font-medium text-gray-900 text-right">{maskSecret(formData.lineAccessToken, 6)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500">Bot Name</dt>
                  <dd className="font-medium text-gray-900 text-right">{connection.botName || '-'}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500">LINE Basic ID</dt>
                  <dd className="font-medium text-gray-900 text-right">{connection.basicId || '-'}</dd>
                </div>
              </dl>

              {connection.pictureUrl ? (
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-3">
                  <img src={connection.pictureUrl} alt={connection.botName || 'LINE Bot'} className="w-12 h-12 rounded-full border border-gray-200 object-cover" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">บัญชีที่ตรวจพบ</p>
                    <p className="text-xs text-gray-500">ยืนยันจาก LINE Messaging API</p>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">สถานะร้าน</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500">รหัสร้าน</dt>
                  <dd className="font-medium text-gray-900 text-right">{shop?.id || '-'}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500">แพ็กเกจ</dt>
                  <dd className="font-medium text-gray-900 text-right">{shop?.plan_name || shop?.plan || 'Free'}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500">อัปเดตล่าสุด</dt>
                  <dd className="font-medium text-gray-900 text-right">{shop?.updated_at || '-'}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
