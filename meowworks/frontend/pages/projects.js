import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Projects() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState({ todo: [], inProgress: [], done: [] });
  const [loading, setLoading] = useState(true);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [projectForm, setProjectForm] = useState({ name: '', description: '', status: 'active' });
  const [taskForm, setTaskForm] = useState({ title: '', description: '', priority: 'medium', dueDate: '' });
  const [shop, setShop] = useState(null);

  useEffect(() => {
    const currentShop = localStorage.getItem('currentShop');
    if (currentShop) {
      const shopData = JSON.parse(currentShop);
      setShop(shopData);
      fetchProjects(shopData.id);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProjects = async (shopId) => {
    try {
      const res = await fetch(`http://localhost:3001/api/projects?shopId=${shopId}`);
      const data = await res.json();
      setProjects(data);
      
      // Fetch tasks
      const tasksRes = await fetch(`http://localhost:3001/api/projects/tasks?shopId=${shopId}`);
      const tasksData = await tasksRes.json();
      
      setTasks({
        todo: tasksData.filter(t => t.status === 'todo'),
        inProgress: tasksData.filter(t => t.status === 'inProgress'),
        done: tasksData.filter(t => t.status === 'done')
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!shop) return;

    try {
      const res = await fetch('http://localhost:3001/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...projectForm, shopId: shop.id })
      });

      if (res.ok) {
        alert('✅ สร้างโปรเจคสำเร็จ!');
        setShowProjectForm(false);
        setProjectForm({ name: '', description: '', status: 'active' });
        fetchProjects(shop.id);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const logout = () => {
    localStorage.clear();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-2xl">⏳ กำลังโหลด...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">📁 โปรเจค</h1>
          <div className="flex gap-4 items-center">
            <span className="text-sm">{shop?.name}</span>
            <button onClick={logout} className="bg-white text-purple-500 px-4 py-2 rounded-lg font-semibold">
              ออกจากระบบ
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow p-4">
        <div className="container mx-auto flex gap-4">
          <a href="/dashboard" className="text-gray-600 hover:text-purple-500">📊 Dashboard</a>
          <a href="/products" className="text-gray-600 hover:text-purple-500">🛒 สินค้า</a>
          <a href="/inventory" className="text-gray-600 hover:text-purple-500">📦 คลัง</a>
          <a href="/crm" className="text-gray-600 hover:text-purple-500">👥 CRM</a>
          <a href="/orders" className="text-gray-600 hover:text-purple-500">📋 Orders</a>
          <a href="/projects" className="text-purple-500 font-semibold">📁 โปรเจค</a>
          <a href="/marketing" className="text-gray-600 hover:text-purple-500">📢 Marketing</a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        {/* Project Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold">📋 งานทั้งหมด</h2>
            <p className="text-gray-500">จัดการโปรเจคและงาน</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowProjectForm(true)}
              className="bg-purple-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-600"
            >
              + โปรเจคใหม่
            </button>
            <button 
              onClick={() => setShowTaskForm(true)}
              className="bg-pink-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-pink-600"
            >
              + งานใหม่
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-4">
            <div className="text-2xl font-bold text-purple-500">{projects.length}</div>
            <div className="text-gray-500">โปรเจคทั้งหมด</div>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <div className="text-2xl font-bold text-gray-500">{tasks.todo.length}</div>
            <div className="text-gray-500">รอดำเนินการ</div>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <div className="text-2xl font-bold text-yellow-500">{tasks.inProgress.length}</div>
            <div className="text-gray-500">กำลังทำ</div>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <div className="text-2xl font-bold text-green-500">{tasks.done.length}</div>
            <div className="text-gray-500">เสร็จแล้ว</div>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-3 gap-4">
          {/* Todo */}
          <div className="bg-gray-100 rounded-xl p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-500">📝 รอดำเนินการ</h3>
              <span className="bg-gray-200 px-2 py-1 rounded-full text-sm">{tasks.todo.length}</span>
            </div>
            <div className="space-y-3">
              {tasks.todo.map((task, index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow">
                  <div className="font-semibold">{task.title}</div>
                  <div className="text-sm text-gray-500 mt-1">{task.description}</div>
                  <div className="flex justify-between mt-2">
                    <span className={`text-xs px-2 py-1 rounded ${task.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              ))}
              {tasks.todo.length === 0 && (
                <div className="text-center text-gray-400 py-8">ไม่มีงาน</div>
              )}
            </div>
          </div>

          {/* In Progress */}
          <div className="bg-yellow-50 rounded-xl p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-yellow-600">🔥 กำลังทำ</h3>
              <span className="bg-yellow-200 px-2 py-1 rounded-full text-sm">{tasks.inProgress.length}</span>
            </div>
            <div className="space-y-3">
              {tasks.inProgress.map((task, index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow border-l-4 border-yellow-400">
                  <div className="font-semibold">{task.title}</div>
                  <div className="text-sm text-gray-500 mt-1">{task.description}</div>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-600">
                      {task.priority}
                    </span>
                  </div>
                </div>
              ))}
              {tasks.inProgress.length === 0 && (
                <div className="text-center text-gray-400 py-8">ไม่มีงาน</div>
              )}
            </div>
          </div>

          {/* Done */}
          <div className="bg-green-50 rounded-xl p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-green-600">✅ เสร็จแล้ว</h3>
              <span className="bg-green-200 px-2 py-1 rounded-full text-sm">{tasks.done.length}</span>
            </div>
            <div className="space-y-3">
              {tasks.done.map((task, index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow border-l-4 border-green-400 opacity-75">
                  <div className="font-semibold line-through">{task.title}</div>
                  <div className="text-sm text-gray-500 mt-1">{task.description}</div>
                </div>
              ))}
              {tasks.done.length === 0 && (
                <div className="text-center text-gray-400 py-8">ไม่มีงาน</div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Project Form Modal */}
      {showProjectForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">สร้างโปรเจคใหม่</h3>
            <form onSubmit={handleCreateProject}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">ชื่อโปรเจค</label>
                  <input
                    type="text"
                    value={projectForm.name}
                    onChange={(e) => setProjectForm({...projectForm, name: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">รายละเอียด</label>
                  <textarea
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    rows="3"
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowProjectForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-purple-500 text-white py-2 rounded-lg font-semibold hover:bg-purple-600"
                >
                  สร้าง
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task Form Modal */}
      {showTaskForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">เพิ่มงานใหม่</h3>
            <form onSubmit={(e) => { e.preventDefault(); setShowTaskForm(false); }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">ชื่องาน</label>
                  <input
                    type="text"
                    value={taskForm.title}
                    onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">รายละเอียด</label>
                  <textarea
                    value={taskForm.description}
                    onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">ความสำคัญ</label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({...taskForm, priority: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="low">ต่ำ</option>
                    <option value="medium">ปกติ</option>
                    <option value="high">สูง</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowTaskForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-pink-500 text-white py-2 rounded-lg font-semibold hover:bg-pink-600"
                >
                  เพิ่ม
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
