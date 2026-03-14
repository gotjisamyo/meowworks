import Layout from '../components/Layout';

export default function Orders() {
  const orders = [
    { id: 'ORD-001', customer: 'สมชาย', items: 'เสื้อ L 2 ตัว', total: 600, status: 'completed', date: '14 มี.ค.' },
    { id: 'ORD-002', customer: 'พิม', items: 'กางเกง M 1 ตัว', total: 350, status: 'pending', date: '14 มี.ค.' },
    { id: 'ORD-003', customer: 'แดง', items: 'เสื้อ S 3 ตัว', total: 900, status: 'shipped', date: '13 มี.ค.' },
    { id: 'ORD-004', customer: 'ใบบุญ', items: 'กางเกง XL 2 ตัว', total: 700, status: 'completed', date: '13 มี.ค.' },
  ];

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
        <p className="text-gray-600">จัดการคำสั่งซื้อ</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Order ID</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">ลูกค้า</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">สินค้า</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">ราคา</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">สถานะ</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">วันที่</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t border-gray-50">
                <td className="px-6 py-4 font-medium text-gray-800">{order.id}</td>
                <td className="px-6 py-4 text-gray-600">{order.customer}</td>
                <td className="px-6 py-4 text-gray-600">{order.items}</td>
                <td className="px-6 py-4 text-gray-800">฿{order.total}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    order.status === 'completed' ? 'bg-green-100 text-green-700' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.status === 'completed' ? 'เสร็จ' : 
                     order.status === 'shipped' ? 'จัดส่งแล้ว' : 'รอดำเนินการ'}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
