import Layout from '../components/Layout';
import { useState } from 'react';

export default function Agents() {
  const [agents] = useState([
    { id: 1, name: 'Support Agent', type: 'Chat', status: 'active', chats: 1234, model: 'GPT-4' },
    { id: 2, name: 'Order Agent', type: 'Order', status: 'active', chats: 567, model: 'GPT-4' },
    { id: 3, name: 'Sales Agent', type: 'Sales', status: 'paused', chats: 234, model: 'Claude' },
  ]);

  return (
    <Layout>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">AI Agents</h1>
          <p className="text-gray-600">จัดการ AI Agents ของคุณ</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          + เพิ่ม Agent ใหม่
        </button>
      </div>

      <div className="grid gap-4">
        {agents.map((agent) => (
          <div key={agent.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{agent.name}</h3>
                <p className="text-sm text-gray-500">ประเภท: {agent.type} | Model: {agent.model}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-gray-800">{agent.chats}</span>
                <span className="text-sm text-gray-500">chats</span>
                <span className={`px-3 py-1 rounded-full text-sm ${agent.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {agent.status === 'active' ? 'ทำงาน' : 'หยุด'}
                </span>
                <button className="text-blue-600 hover:text-blue-700">แก้ไข</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
