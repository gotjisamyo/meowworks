import { useState, useEffect } from 'react';

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('inventory');
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stockAction, setStockAction] = useState('in');
  const [stockQuantity, setStockQuantity] = useState('');
  const [stockNotes, setStockNotes] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [invRes, alertsRes, summaryRes] = await Promise.all([
        fetch('/api/inventory/shop-001'),
        fetch('/api/inventory/shop-001/alerts?unreadOnly=true'),
        fetch('/api/inventory/shop-001/summary')
      ]);
      
      const inv = await invRes.json();
      const alertsData = await alertsRes.json();
      const summaryData = await summaryRes.json();
      
      setInventory(inv);
      setAlerts(alertsData);
      setSummary(summaryData);
    } catch (error) {
      console.error('Error loading inventory:', error);
    }
    setLoading(false);
  };

  const handleStockAction = async () => {
    if (!selectedProduct || !stockQuantity) return;
    
    const endpoint = stockAction === 'in' ? 'stock-in' : 
                     stockAction === 'out' ? 'stock-out' : 'adjustment';
    
    try {
      await fetch(`/api/inventory/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shopId: 'shop-001',
          productId: selectedProduct.id,
          quantity: parseInt(stockQuantity),
          adjustment: stockAction === 'adjustment' ? parseInt(stockQuantity) : undefined,
          notes: stockNotes,
          createdBy: 'admin'
        })
      });
      
      setShowStockModal(false);
      setStockQuantity('');
      setStockNotes('');
      loadData();
    } catch (error) {
      console.error('Stock action error:', error);
    }
  };

  const getStockStatus = (product) => {
    const qty = product.stock_quantity || 0;
    if (qty <= 0) return { label: 'หมด', color: 'red' };
    if (qty <= (product.min_stock_level || 10)) return { label: 'ใกล้หมด', color: 'orange' };
    return { label: 'มี', color: 'green' };
  };

  if (loading) {
    return <div className="p-8 text-center">กำลังโหลด...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">📦 จัดการคลังสินค้า</h1>
          <p className="text-gray-600 mt-2">จัดการสินค้าคงคลัง ติดตามการเคลื่อนไหว</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-3xl font-bold text-blue-600">{summary?.total_products || 0}</div>
            <div className="text-gray-500">สินค้าทั้งหมด</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-3xl font-bold text-red-600">{summary?.out_of_stock || 0}</div>
            <div className="text-gray-500">สินค้าหมด</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-3xl font-bold text-orange-500">{summary?.low_stock || 0}</div>
            <div className="text-gray-500">ใกล้หมด</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-3xl font-bold text-green-600">{summary?.total_stock || 0}</div>
            <div className="text-gray-500">จำนวนคงคลัง</div>
          </div>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <div className="flex items-center">
              <span className="text-2xl mr-3">🔔</span>
              <div>
                <h3 className="font-bold text-red-700">แจ้งเตือน Stock</h3>
                <p className="text-red-600">
                  {alerts.filter(a => a.type === 'out_of_stock').length} รายการหมด, {' '}
                  {alerts.filter(a => a.type === 'low_stock').length} ใกล้หมด
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-lg ${activeTab === 'inventory' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
          >
            📦 สินค้าคงคลัง
          </button>
          <button
            onClick={() => setActiveTab('movements')}
            className={`px-4 py-2 rounded-lg ${activeTab === 'movements' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
          >
            📜 ประวัติการเคลื่อนไหว
          </button>
        </div>

        {/* Inventory Table */}
        {activeTab === 'inventory' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 text-left">สินค้า</th>
                  <th className="p-4 text-left">ราคา</th>
                  <th className="p-4 text-center">Stock</th>
                  <th className="p-4 text-center">สถานะ</th>
                  <th className="p-4 text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((product, idx) => {
                  const status = getStockStatus(product);
                  return (
                    <tr key={idx} className="border-t hover:bg-gray-50">
                      <td className="p-4">
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.category}</div>
                      </td>
                      <td className="p-4">฿{product.price}</td>
                      <td className="p-4 text-center font-bold">{product.stock_quantity || 0}</td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-1 rounded text-sm ${
                          status.color === 'red' ? 'bg-red-100 text-red-700' :
                          status.color === 'orange' ? 'bg-orange-100 text-orange-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowStockModal(true);
                          }}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          +/-
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Stock Modal */}
        {showStockModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96">
              <h3 className="text-xl font-bold mb-4">จัดการ Stock</h3>
              <p className="mb-4">{selectedProduct?.name}</p>
              
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setStockAction('in')}
                  className={`flex-1 py-2 rounded ${stockAction === 'in' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
                >
                  📥 รับเข้า
                </button>
                <button
                  onClick={() => setStockAction('out')}
                  className={`flex-1 py-2 rounded ${stockAction === 'out' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
                >
                  📤 จ่ายออก
                </button>
                <button
                  onClick={() => setStockAction('adjustment')}
                  className={`flex-1 py-2 rounded ${stockAction === 'adjustment' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                >
                  ⚙️ ปรับ
                </button>
              </div>
              
              <input
                type="number"
                placeholder="จำนวน"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                className="w-full p-2 border rounded mb-4"
              />
              
              <input
                type="text"
                placeholder="หมายเหตุ (optional)"
                value={stockNotes}
                onChange={(e) => setStockNotes(e.target.value)}
                className="w-full p-2 border rounded mb-4"
              />
              
              <div className="flex gap-2">
                <button
                  onClick={handleStockAction}
                  className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  ยืนยัน
                </button>
                <button
                  onClick={() => setShowStockModal(false)}
                  className="flex-1 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
