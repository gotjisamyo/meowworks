export default function AgentCard({ agent, onStatusChange, onDelete }) {
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    paused: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
  };

  const typeIcons = {
    sales: '💰',
    support: '🎧',
    orders: '📦',
    faq: '❓',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
            {typeIcons[agent.type] || '🤖'}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{agent.name}</h3>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[agent.status]}`}>
              {agent.status === 'active' ? '🟢 Active' : agent.status === 'paused' ? '⏸️ Paused' : '❌ Error'}
            </span>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-4">{agent.description}</p>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-lg font-semibold text-gray-900">{agent.chatsToday}</p>
          <p className="text-xs text-gray-500">Chats Today</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-lg font-semibold text-gray-900">{agent.avgResponseTime}</p>
          <p className="text-xs text-gray-500">Avg Response</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-lg font-semibold text-gray-900">{agent.successRate}%</p>
          <p className="text-xs text-gray-500">Success</p>
        </div>
      </div>

      <div className="flex space-x-2">
        {agent.status === 'active' ? (
          <button
            onClick={() => onStatusChange?.(agent.id, 'paused')}
            className="flex-1 px-4 py-2 text-sm font-medium text-yellow-700 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
          >
            ⏸️ Pause
          </button>
        ) : (
          <button
            onClick={() => onStatusChange?.(agent.id, 'active')}
            className="flex-1 px-4 py-2 text-sm font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            ▶️ Activate
          </button>
        )}
        <button
          onClick={() => onDelete?.(agent.id)}
          className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
