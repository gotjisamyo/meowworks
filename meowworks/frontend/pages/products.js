import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Products() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    imageUrl: ''
  });

  const [shop, setShop] = useState(null);

  useEffect(() => {
    const currentShop = localStorage.getItem('currentShop');
    if (currentShop) {
      const shopData = JSON.parse(currentShop);
      setShop(shopData);
      fetchProducts(shopData.id);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProducts = async (shopId) => {
    try {
      const res = await fetch(`http://localhost:3001/api/products/${shopId}`);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!shop) {
      alert('กรุณาเลือกร้านค้าก่อนค่ะ');
      return;
    }

    try {
      const payload = {
        ...formData,
        shopId: shop.id,
        price: parseFloat(formData.price) || 0,
        stock: parseInt(formData.stock) || 0
      };

      let res;
      if (editingProduct) {
        res = await fetch(`http://localhost:3001/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('http://localhost:3001/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        alert(editingProduct ? '✅ แก้ไขสินค้าสำเร็จ!' : '✅ เพิ่มสินค้าสำเร็จ!');
        setShowForm(false);
        setEditingProduct(null);
        setFormData({ name: '', description: '', price: '', stock: '', category: '', imageUrl: '' });
        fetchProducts(shop.id);
      }
    } catch (error) {
      alert('❌ เกิดข้อผิดพลาด');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category || '',
      imageUrl: product.imageUrl || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('ยืนยันการลบสินค้า?')) return;
    
    try {
      const res = await fetch(`http://localhost:3001/api/products/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        alert('✅ ลบสินค้าสำเร็จ!');
        fetchProducts(shop.id);
      }
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
              <a href="/products" className="text-indigo-600 font-medium">สินค้า</a>
              <a href="/orders" className="text-gray-600 hover:text-indigo-600">ออร์เดอร์</a>
              <a href="/settings" className="text-gray-600 hover:text-indigo-600">ตั้งค่า</a>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">📦 จัดการสินค้า</h1>
            <p className="text-gray-600">เพิ่มและแก้ไขสินค้าของร้าน</p>
          </div>
          <button
            onClick={() => { setShowForm(true); setEditingProduct(null); setFormData({ name: '', description: '', price: '', stock: '', category: '', imageUrl: '' }); }}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 flex items-center gap-2"
          >
            ➕ เพิ่มสินค้า
          </button>
        </div>

        {/* Product Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4">
              <h2 className="text-xl font-bold mb-4">{editingProduct ? '✏️ แก้ไขสินค้า' : '➕ เพิ่มสินค้าใหม่'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อสินค้า *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="เสื้อยืดสีดำ"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">รายละเอียด</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    rows={2}
                    placeholder="เสื้อยืดผ้าคอตตอน ลายเรียบ"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ราคา (บาท) *</label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="350"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">จำนวน</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="100"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">หมวดหมู่</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="เสื้อผ้า"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL รูปภาพ</label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
                  >
                    {editingProduct ? '💾 บันทึก' : '➕ เพิ่มสินค้า'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowForm(false); setEditingProduct(null); }}
                    className="flex-1 bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
                  >
                    ยกเลิก
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-2xl">⏳ กำลังโหลด...</div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">ยังไม่มีสินค้า</h3>
            <p className="text-gray-600 mb-4">เพิ่มสินค้าแรกของร้านคุณได้เลย!</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
            >
              ➕ เพิ่มสินค้า
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-40 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-6xl">👕</span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-800">{product.name}</h3>
                  {product.category && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded mt-1 inline-block">
                      {product.category}
                    </span>
                  )}
                  {product.description && (
                    <p className="text-gray-600 text-sm mt-2 line-clamp-2">{product.description}</p>
                  )}
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xl font-bold text-indigo-600">฿{product.price}</span>
                    <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.stock > 0 ? `มี ${product.stock} ชิ้น` : 'สินค้าหมด'}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex-1 bg-indigo-50 text-indigo-600 py-2 rounded-lg hover:bg-indigo-100"
                    >
                      ✏️ แก้ไข
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100"
                    >
                      🗑️ ลบ
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
