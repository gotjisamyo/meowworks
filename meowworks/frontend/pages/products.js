import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AppShell from '../components/AppShell';
import { apiFetch, ensureShopSelected } from '../lib/clientApi';

const emptyForm = { name: '', description: '', price: '', stock: '', category: '', imageUrl: '' };

const normalizeProduct = (product = {}) => ({
  ...product,
  imageUrl: product.imageUrl || product.image_url || '',
  stock: Number(product.stock ?? product.stock_quantity ?? 0),
  price: Number(product.price ?? 0),
});

export default function ProductsPage() {
  const router = useRouter();
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }

    const currentShop = ensureShopSelected(router);
    if (!currentShop) { setLoading(false); return; }

    setShop(currentShop);
    fetchProducts(currentShop.id);
  }, [router]);

  const fetchProducts = async (shopId) => {
    try {
      setLoading(true);
      setError('');
      const data = await apiFetch(`/products/${shopId}`);
      setProducts(Array.isArray(data) ? data.map(normalizeProduct) : []);
    } catch (err) {
      setError(err.message || 'โหลดสินค้าไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!shop) return;

    try {
      setSaving(true);
      const payload = {
        ...formData,
        shopId: shop.id,
        price: parseFloat(formData.price) || 0,
        stock: parseInt(formData.stock, 10) || 0,
      };

      if (editingProduct) {
        await apiFetch(`/products/${editingProduct.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        await apiFetch('/products', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }

      setShowForm(false);
      setEditingProduct(null);
      setFormData(emptyForm);
      await fetchProducts(shop.id);
    } catch (err) {
      alert('เกิดข้อผิดพลาด: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: String(product.price ?? ''),
      stock: String(product.stock ?? ''),
      category: product.category || '',
      imageUrl: product.imageUrl || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('ยืนยันการลบสินค้า?')) return;
    try {
      setDeletingId(id);
      await apiFetch(`/products/${id}`, { method: 'DELETE' });
      await fetchProducts(shop.id);
    } catch (err) {
      alert('ลบสินค้าไม่สำเร็จ: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const openAdd = () => { setEditingProduct(null); setFormData(emptyForm); setShowForm(true); };

  if (!shop && !loading) {
    return (
      <AppShell title="จัดการสินค้า" subtitle="กรุณาเลือกร้านค้าก่อน">
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
    <AppShell
      title="จัดการสินค้า"
      subtitle="เพิ่มและแก้ไขสินค้าของร้าน"
      shopName={shop?.name}
      actions={
        <button onClick={openAdd} className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-700 text-sm">
          + เพิ่มสินค้า
        </button>
      }
    >
      {error && <div className="mb-6 rounded-xl bg-red-50 text-red-700 px-4 py-3 border border-red-200">{error}</div>}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
            <h2 className="text-lg font-semibold mb-4">{editingProduct ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อสินค้า *</label>
                <input type="text" required value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="เสื้อยืดสีดำ" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">รายละเอียด</label>
                <textarea value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  rows={2} placeholder="เสื้อยืดผ้าคอตตอน" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ราคา (฿) *</label>
                  <input type="number" required min="0" value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="350" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">จำนวน</label>
                  <input type="number" min="0" value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="100" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">หมวดหมู่</label>
                <input type="text" value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="เสื้อผ้า" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL รูปภาพ</label>
                <input type="url" value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="https://example.com/image.jpg" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving}
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-60 disabled:cursor-not-allowed">
                  {saving ? 'กำลังบันทึก...' : (editingProduct ? 'บันทึก' : 'เพิ่มสินค้า')}
                </button>
                <button type="button"
                  onClick={() => { setShowForm(false); setEditingProduct(null); }}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200">
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center text-gray-500">กำลังโหลดข้อมูล...</div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
          <div className="text-5xl mb-4">📦</div>
          <p className="text-gray-700 mb-4">ยังไม่มีสินค้าในร้านนี้</p>
          <button onClick={openAdd} className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700">เพิ่มสินค้าแรก</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-indigo-200 transition">
              <div className="h-36 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
                {product.imageUrl
                  ? <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                  : <span className="text-5xl">📦</span>
                }
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900">{product.name}</h3>
                {product.category && (
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded mt-1 inline-block">{product.category}</span>
                )}
                {product.description && (
                  <p className="text-gray-500 text-sm mt-2 line-clamp-2">{product.description}</p>
                )}
                <div className="flex justify-between items-center mt-3">
                  <span className="text-lg font-bold text-indigo-600">฿{Number(product.price || 0).toLocaleString()}</span>
                  <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {product.stock > 0 ? `${product.stock} ชิ้น` : 'สินค้าหมด'}
                  </span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => handleEdit(product)}
                    className="flex-1 bg-indigo-50 text-indigo-600 py-1.5 rounded-lg hover:bg-indigo-100 text-sm">แก้ไข</button>
                  <button onClick={() => handleDelete(product.id)} disabled={deletingId === product.id}
                    className="flex-1 bg-red-50 text-red-600 py-1.5 rounded-lg hover:bg-red-100 text-sm disabled:opacity-60 disabled:cursor-not-allowed">
                    {deletingId === product.id ? 'กำลังลบ...' : 'ลบ'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}
