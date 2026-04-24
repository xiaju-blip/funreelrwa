import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ListTodo, Plus, Edit2, Trash2, X, Award, Search, TrendingUp } from 'lucide-react';
import { supabase } from '../supabase/client';

interface Task {
  id: string;
  name: string;
  type: number;
  description?: string;
  condition_type?: string;
  condition_value?: any;
  reward_points: number;
  reward_token?: number;
  sort_order: number;
  status: number;
  start_time?: string;
  end_time?: string;
  created_at: string;
}

interface UserTask {
  id: string;
  user_id: string;
  task_id: string;
  progress: number;
  target: number;
  status: number;
  completed_at?: string;
  claimed_at?: string;
  created_at: string;
  users?: { nickname: string };
  tasks?: { name: string };
}

const taskTypes = [
  { value: 1, label: '每日任务' },
  { value: 2, label: '观看任务' },
  { value: 3, label: '邀请任务' },
  { value: 4, label: '充值任务' },
  { value: 5, label: '其他' },
];

const defaultTask: Partial<Task> = {
  name: '',
  type: 1,
  description: '',
  condition_type: '',
  reward_points: 0,
  reward_token: 0,
  sort_order: 0,
  status: 1,
};

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userTasks, setUserTasks] = useState<UserTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [taskSearch, setTaskSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Partial<Task> | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'tasks' | 'records'>('tasks');

  useEffect(() => {
    fetchTasks();
    fetchUserTasks();
  }, []);

  const fetchUserTasks = async () => {
    const { data } = await supabase
      .from('user_tasks')
      .select('*, users(nickname), tasks(name)')
      .order('created_at', { ascending: false })
      .limit(50);
    setUserTasks(data || []);
  };

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (error) {
        console.error('获取任务失败:', error);
      }
      setTasks(data || []);
    } catch (err) {
      console.error('错误:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除该任务吗?')) return;
    await supabase.from('tasks').delete().eq('id', id);
    fetchTasks();
  };

  const openEdit = (task?: Task) => {
    setEditingTask(task ? { ...task } : { ...defaultTask });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!editingTask?.name) return;
    setSaving(true);
    
    try {
      if (editingTask.id) {
        await supabase.from('tasks').update({
          name: editingTask.name,
          type: editingTask.type,
          description: editingTask.description,
          condition_type: editingTask.condition_type,
          reward_points: editingTask.reward_points,
          reward_token: editingTask.reward_token,
          sort_order: editingTask.sort_order,
          status: editingTask.status,
          start_time: editingTask.start_time,
          end_time: editingTask.end_time,
        }).eq('id', editingTask.id);
      } else {
        await supabase.from('tasks').insert({
          name: editingTask.name,
          type: editingTask.type,
          description: editingTask.description,
          condition_type: editingTask.condition_type,
          reward_points: editingTask.reward_points,
          reward_token: editingTask.reward_token,
          sort_order: editingTask.sort_order,
          status: editingTask.status,
          start_time: editingTask.start_time,
          end_time: editingTask.end_time,
        });
      }
      setShowModal(false);
      fetchTasks();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const filteredTasks = tasks.filter(t => 
    t.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUserTasks = userTasks.filter(ut =>
    ut.users?.nickname?.toLowerCase().includes(taskSearch.toLowerCase()) ||
    ut.tasks?.name?.toLowerCase().includes(taskSearch.toLowerCase())
  );

  const getTypeLabel = (type: number) => taskTypes.find(t => t.value === type)?.label || '其他';

  const getTaskStatusLabel = (status: number) => {
    const labels: Record<number, string> = { 0: '进行中', 1: '已完成', 2: '已领取' };
    return labels[status] || '未知';
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <ListTodo className="w-6 h-6 text-orange-500" />
          任务管理
        </h2>
        {activeTab === 'tasks' && (
          <button
            onClick={() => openEdit()}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg flex items-center gap-2 hover:bg-orange-600"
          >
            <Plus className="w-4 h-4" />
            新增任务
          </button>
        )}
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'tasks' 
              ? 'bg-orange-500 text-white' 
              : 'bg-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          <ListTodo className="w-4 h-4" />
          任务管理
        </button>
        <button
          onClick={() => setActiveTab('records')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'records' 
              ? 'bg-orange-500 text-white' 
              : 'bg-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          任务记录
        </button>
      </div>

      {activeTab === 'tasks' && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-4">
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="搜索任务..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 pl-10 text-white"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20 text-gray-400">加载中...</div>
          ) : filteredTasks.length === 0 ? (
            <div className="p-8 text-center text-gray-400">暂无数据</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-gray-400 text-sm">任务名称</th>
                    <th className="px-4 py-3 text-left text-gray-400 text-sm">类型</th>
                    <th className="px-4 py-3 text-left text-gray-400 text-sm">积分奖励</th>
                    <th className="px-4 py-3 text-left text-gray-400 text-sm">代币奖励</th>
                    <th className="px-4 py-3 text-left text-gray-400 text-sm">排序</th>
                    <th className="px-4 py-3 text-left text-gray-400 text-sm">状态</th>
                    <th className="px-4 py-3 text-left text-gray-400 text-sm">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((task) => (
                    <tr key={task.id} className="border-t border-gray-800 hover:bg-gray-800/50">
                      <td className="px-4 py-3 text-white">{task.name}</td>
                      <td className="px-4 py-3 text-gray-300">{getTypeLabel(task.type)}</td>
                      <td className="px-4 py-3 text-orange-400">+{task.reward_points}</td>
                      <td className="px-4 py-3 text-green-400">+{task.reward_token || 0}</td>
                      <td className="px-4 py-3 text-gray-400">{task.sort_order}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs ${task.status === 1 ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                          {task.status === 1 ? '启用' : '禁用'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(task)} className="p-1 text-orange-400 hover:bg-orange-500/10 rounded">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(task.id)} className="p-1 text-red-400 hover:bg-red-500/10 rounded">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'records' && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-4">
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="搜索用户..."
                value={taskSearch}
                onChange={(e) => setTaskSearch(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 pl-10 text-white"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            </div>
          </div>
          {filteredUserTasks.length === 0 ? (
            <div className="p-8 text-center text-gray-400">暂无任务记录</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-gray-400 text-sm">用户</th>
                    <th className="px-4 py-3 text-left text-gray-400 text-sm">任务</th>
                    <th className="px-4 py-3 text-left text-gray-400 text-sm">进度</th>
                    <th className="px-4 py-3 text-left text-gray-400 text-sm">状态</th>
                    <th className="px-4 py-3 text-left text-gray-400 text-sm">完成时间</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUserTasks.map((ut) => (
                    <tr key={ut.id} className="border-t border-gray-800 hover:bg-gray-800/50">
                      <td className="px-4 py-3 text-white">{ut.users?.nickname || ut.user_id}</td>
                      <td className="px-4 py-3 text-gray-300">{ut.tasks?.name || ut.task_id}</td>
                      <td className="px-4 py-3 text-gray-300">{ut.progress}/{ut.target}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          ut.status === 2 ? 'bg-green-500/20 text-green-400' : 
                          ut.status === 1 ? 'bg-blue-500/20 text-blue-400' : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {getTaskStatusLabel(ut.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-sm">
                        {ut.completed_at ? new Date(ut.completed_at).toLocaleString() : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-lg"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">
                  {editingTask?.id ? '编辑任务' : '新增任务'}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">任务名称 *</label>
                  <input
                    type="text"
                    value={editingTask?.name || ''}
                    onChange={e => setEditingTask({ ...editingTask, name: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">类型</label>
                  <select
                    value={editingTask?.type || 1}
                    onChange={e => setEditingTask({ ...editingTask, type: parseInt(e.target.value) })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none"
                  >
                    {taskTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">描述</label>
                  <textarea
                    value={editingTask?.description || ''}
                    onChange={e => setEditingTask({ ...editingTask, description: e.target.value })}
                    rows={2}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">积分奖励</label>
                    <input
                      type="number"
                      value={editingTask?.reward_points || 0}
                      onChange={e => setEditingTask({ ...editingTask, reward_points: parseInt(e.target.value) })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">代币奖励</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingTask?.reward_token || 0}
                      onChange={e => setEditingTask({ ...editingTask, reward_token: parseFloat(e.target.value) })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">排序</label>
                    <input
                      type="number"
                      value={editingTask?.sort_order || 0}
                      onChange={e => setEditingTask({ ...editingTask, sort_order: parseInt(e.target.value) })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">状态</label>
                    <select
                      value={editingTask?.status || 1}
                      onChange={e => setEditingTask({ ...editingTask, status: parseInt(e.target.value) })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none"
                    >
                      <option value={1}>启用</option>
                      <option value={0}>禁用</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700"
                >
                  取消
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !editingTask?.name}
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
                >
                  {saving ? '保存中...' : '保存'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}