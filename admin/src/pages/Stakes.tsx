import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Landmark, Plus, Edit2, Trash2, X, Search, TrendingUp, Award } from 'lucide-react';
import { supabase } from '../supabase/client';

interface StakePool {
  id: string;
  name: string;
  lock_days: number;
  base_apy: number;
  vip_bonus: number;
  max_stake?: number;
  total_staked: number;
  status: number;
  sort_order: number;
  created_at: string;
}

interface StakeRecord {
  id: string;
  user_id: string;
  pool_id: string;
  amount: number;
  pending_earned: number;
  total_earned: number;
  status: number;
  created_at: string;
  users?: { nickname: string };
  stake_pools?: { name: string };
}

const defaultPool: Partial<StakePool> = {
  name: '',
  lock_days: 0,
  base_apy: 0,
  vip_bonus: 0,
  max_stake: 0,
  total_staked: 0,
  status: 1,
  sort_order: 0,
};

export default function Stakes() {
  const [pools, setPools] = useState<StakePool[]>([]);
  const [records, setRecords] = useState<StakeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPool, setEditingPool] = useState<Partial<StakePool> | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'pools' | 'records'>('pools');

  useEffect(() => {
    fetchPools();
    fetchRecords();
  }, []);

  const fetchPools = async () => {
    setLoading(true);
    const { data } = await supabase.from('stake_pools').select('*').order('sort_order');
    setPools(data || []);
    setLoading(false);
  };

  const fetchRecords = async () => {
    const { data } = await supabase
      .from('stake_records')
      .select('*, users(nickname), stake_pools(name)')
      .order('created_at', { ascending: false })
      .limit(50);
    setRecords(data || []);
  };

  const openEdit = (pool?: StakePool) => {
    if (pool) {
      setEditingPool(pool);
    } else {
      setEditingPool({ ...defaultPool });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!editingPool?.name) return;
    setSaving(true);
    try {
      if (editingPool.id) {
        await supabase.from('stake_pools').update({
          name: editingPool.name,
          lock_days: editingPool.lock_days,
          base_apy: editingPool.base_apy,
          vip_bonus: editingPool.vip_bonus,
          max_stake: editingPool.max_stake,
          status: editingPool.status,
          sort_order: editingPool.sort_order,
        }).eq('id', editingPool.id);
      } else {
        await supabase.from('stake_pools').insert({
          name: editingPool.name,
          lock_days: editingPool.lock_days,
          base_apy: editingPool.base_apy,
          vip_bonus: editingPool.vip_bonus,
          max_stake: editingPool.max_stake,
          total_staked: 0,
          status: editingPool.status,
          sort_order: editingPool.sort_order,
        });
      }
      setShowModal(false);
      fetchPools();
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除该质押池吗?')) return;
    await supabase.from('stake_pools').delete().eq('id', id);
    fetchPools();
  };

  const filteredPools = pools.filter(p => p.name?.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Landmark className="w-6 h-6 text-orange-500" />
          质押管理
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('pools')}
            className={`px-4 py-2 rounded-lg ${activeTab === 'pools' ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-400'}`}
          >
            质押池
          </button>
          <button
            onClick={() => setActiveTab('records')}
            className={`px-4 py-2 rounded-lg ${activeTab === 'records' ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-400'}`}
          >
            质押记录
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'pools' ? (
          <motion.div
            key="pools"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="mb-4">
              <button
                onClick={() => openEdit()}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg flex items-center gap-2 hover:bg-orange-600"
              >
                <Plus className="w-4 h-4" />
                新增质押池
              </button>
            </div>

            <div className="mb-4">
              <div className="relative max-w-md">
                <input
                  type="text"
                  placeholder="搜索质押池..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 pl-10 text-white"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              </div>
            </div>

            {loading ? (
              <div className="text-center py-20 text-gray-400">加载中...</div>
            ) : filteredPools.length === 0 ? (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center text-gray-400">暂无数据</div>
            ) : (
              <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-gray-400 text-sm">池名称</th>
                      <th className="px-4 py-3 text-left text-gray-400 text-sm">锁定期</th>
                      <th className="px-4 py-3 text-left text-gray-400 text-sm">基础APY</th>
                      <th className="px-4 py-3 text-left text-gray-400 text-sm">VIP加成</th>
                      <th className="px-4 py-3 text-left text-gray-400 text-sm">总质押</th>
                      <th className="px-4 py-3 text-left text-gray-400 text-sm">状态</th>
                      <th className="px-4 py-3 text-right text-gray-400 text-sm">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPools.map((pool) => (
                      <tr key={pool.id} className="border-t border-gray-800">
                        <td className="px-4 py-3 text-white font-medium">{pool.name}</td>
                        <td className="px-4 py-3 text-gray-300">{pool.lock_days}天</td>
                        <td className="px-4 py-3 text-green-400">{pool.base_apy}%</td>
                        <td className="px-4 py-3 text-orange-400">+{pool.vip_bonus}%</td>
                        <td className="px-4 py-3 text-white">{pool.total_staked || 0}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs ${pool.status === 1 ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                            {pool.status === 1 ? '启用' : '禁用'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button onClick={() => openEdit(pool)} className="text-blue-400 hover:text-blue-300 mr-3">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(pool.id)} className="text-red-400 hover:text-red-300">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="records"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {records.length === 0 ? (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center text-gray-400">暂无质押记录</div>
            ) : (
              <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-gray-400 text-sm">用户</th>
                      <th className="px-4 py-3 text-left text-gray-400 text-sm">质押池</th>
                      <th className="px-4 py-3 text-left text-gray-400 text-sm">质押数量</th>
                      <th className="px-4 py-3 text-left text-gray-400 text-sm">待收益</th>
                      <th className="px-4 py-3 text-left text-gray-400 text-sm">总收益</th>
                      <th className="px-4 py-3 text-left text-gray-400 text-sm">状态</th>
                      <th className="px-4 py-3 text-left text-gray-400 text-sm">时间</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((record) => (
                      <tr key={record.id} className="border-t border-gray-800">
                        <td className="px-4 py-3 text-white">{record.users?.nickname || record.user_id}</td>
                        <td className="px-4 py-3 text-gray-300">{record.stake_pools?.name || record.pool_id}</td>
                        <td className="px-4 py-3 text-orange-400">{record.amount}</td>
                        <td className="px-4 py-3 text-green-400">{record.pending_earned}</td>
                        <td className="px-4 py-3 text-green-400">{record.total_earned}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs ${record.status === 1 ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                            {record.status === 1 ? '进行中' : '已完成'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-sm">{new Date(record.created_at).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

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
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">
                  {editingPool?.id ? '编辑质押池' : '新增质押池'}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">名称</label>
                  <input
                    type="text"
                    value={editingPool?.name || ''}
                    onChange={(e) => setEditingPool({ ...editingPool, name: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">锁定期(天)</label>
                    <input
                      type="number"
                      value={editingPool?.lock_days || 0}
                      onChange={(e) => setEditingPool({ ...editingPool, lock_days: parseInt(e.target.value) })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">基础APY(%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editingPool?.base_apy || 0}
                      onChange={(e) => setEditingPool({ ...editingPool, base_apy: parseFloat(e.target.value) })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">VIP加成(%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editingPool?.vip_bonus || 0}
                      onChange={(e) => setEditingPool({ ...editingPool, vip_bonus: parseFloat(e.target.value) })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">状态</label>
                    <select
                      value={editingPool?.status || 1}
                      onChange={(e) => setEditingPool({ ...editingPool, status: parseInt(e.target.value) })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                    >
                      <option value={1}>启用</option>
                      <option value={0}>禁用</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                >
                  取消
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
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