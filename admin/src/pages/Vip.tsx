import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Plus, Edit2, Trash2, X, Search, TrendingUp, Package } from 'lucide-react';
import { supabase } from '../supabase/client';

interface VipLevel {
  id: string;
  level: number;
  name: string;
  discount: number;
  points_bonus: number;
  daily_token?: number;
  required_points: number;
  status: number;
  sort_order: number;
  created_at: string;
}

interface VipPurchase {
  id: string;
  nickname?: string;
  email?: string;
  vip_level: number;
  vip_expire_at?: string;
  created_at?: string;
}

interface VipPackage {
  id: string;
  vip_level: number;
  name: string;
  duration_days: number;
  price_cny: number;
  price_usdt: number;
  benefits: string;
  status: number;
  sort_order: number;
  created_at: string;
}

interface VipOrder {
  id: string;
  user_id: string;
  package_id: string;
  payment_method: string;
  amount_cny: number;
  amount_usdt: number;
  status: number;
  created_at: string;
  users?: { nickname: string; email: string };
  vip_packages?: { name: string; vip_level: number };
}

const defaultVip: Partial<VipLevel> = {
  level: 0,
  name: '',
  discount: 0,
  points_bonus: 0,
  daily_token: 0,
  required_points: 0,
  status: 1,
  sort_order: 0,
};

export default function Vip() {
  const [vips, setVips] = useState<VipLevel[]>([]);
  const [packages, setPackages] = useState<VipPackage[]>([]);
  const [orders, setOrders] = useState<VipOrder[]>([]);
  const [purchases, setPurchases] = useState<VipPurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingVip, setEditingVip] = useState<Partial<VipLevel> | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'levels' | 'packages' | 'records'>('levels');

  useEffect(() => {
    fetchVips();
    fetchPackages();
    fetchOrders();
    fetchPurchases();
  }, []);

  const fetchVips = async () => {
    setLoading(true);
    const { data } = await supabase.from('vip_levels').select('*').order('level', { ascending: true });
    setVips(data || []);
    setLoading(false);
  };

  const fetchPackages = async () => {
    const { data } = await supabase.from('vip_packages').select('*').order('sort_order', { ascending: true });
    setPackages(data || []);
  };

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('vip_orders')
      .select('*, users(nickname, email), vip_packages(name, vip_level)')
      .order('created_at', { ascending: false })
      .limit(50);
    setOrders(data || []);
  };

  const fetchPurchases = async () => {
    const { data } = await supabase
      .from('users')
      .select('id, nickname, email, vip_level, vip_expire_at, created_at')
      .gt('vip_level', 0)
      .order('created_at', { ascending: false })
      .limit(50);
    setPurchases(data || []);
  };

  const openEdit = (vip?: VipLevel) => {
    setEditingVip(vip ? { ...vip } : { ...defaultVip });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!editingVip?.name) return;
    setSaving(true);
    
    try {
      if (editingVip.id) {
        await supabase.from('vip_levels').update({
          level: editingVip.level,
          name: editingVip.name,
          discount: editingVip.discount,
          points_bonus: editingVip.points_bonus,
          daily_token: editingVip.daily_token,
          required_points: editingVip.required_points,
          status: editingVip.status,
          sort_order: editingVip.sort_order,
        }).eq('id', editingVip.id);
      } else {
        await supabase.from('vip_levels').insert({
          level: editingVip.level,
          name: editingVip.name,
          discount: editingVip.discount,
          points_bonus: editingVip.points_bonus,
          daily_token: editingVip.daily_token,
          required_points: editingVip.required_points,
          status: editingVip.status,
          sort_order: editingVip.sort_order,
        });
      }
      setShowModal(false);
      fetchVips();
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除该VIP等级吗?')) return;
    await supabase.from('vip_levels').delete().eq('id', id);
    fetchVips();
  };

  const filteredVips = vips.filter(v => 
    v.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getVipName = (level: number) => {
    const v = vips.find(v => v.level === level);
    return v?.name || `VIP${level}`;
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Crown className="w-6 h-6 text-yellow-500" />
          VIP管理
        </h2>
        {activeTab === 'levels' && (
          <button
            onClick={() => openEdit()}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg flex items-center gap-2 hover:bg-orange-600"
          >
            <Plus className="w-4 h-4" />
            新增等级
          </button>
        )}
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('levels')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'levels' ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          <Crown className="w-4 h-4" />
          VIP等级
        </button>
        <button
          onClick={() => setActiveTab('packages')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'packages' ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" />
          VIP套餐
        </button>
        <button
          onClick={() => setActiveTab('records')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'records' ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          订单记录
        </button>
      </div>

      {activeTab === 'levels' && (
        <>
          <div className="mb-4">
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="搜索VIP等级..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 pl-10 text-white"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20 text-gray-400">加载中...</div>
          ) : filteredVips.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center text-gray-400">暂无数据</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVips.map((vip) => (
                <motion.div
                  key={vip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-yellow-500/50"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Crown className="w-5 h-5 text-yellow-500" />
                      <h3 className="text-white font-semibold">{vip.name}</h3>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${vip.status === 1 ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                      {vip.status === 1 ? '启用' : '禁用'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 space-y-1 mb-3">
                    <div>等级: <span className="text-yellow-400">VIP{vip.level}</span></div>
                    <div>所需积分: <span className="text-white">{vip.required_points?.toLocaleString()}</span></div>
                    <div>折扣: <span className="text-green-400">{vip.discount}%</span></div>
                    <div>积分加成: <span className="text-orange-400">+{vip.points_bonus}%</span></div>
                    {(vip.daily_token || 0) > 0 && <div>每日代币: <span className="text-blue-400">+{vip.daily_token}</span></div>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(vip)} className="flex-1 px-3 py-1.5 bg-orange-500/10 text-orange-400 rounded hover:bg-orange-500/20 text-sm">
                      编辑
                    </button>
                    <button onClick={() => handleDelete(vip.id)} className="px-3 py-1.5 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 text-sm">
                      删除
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'packages' && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-800">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="搜索套餐..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 pl-10 text-white"
              />
            </div>
          </div>
          {packages.length === 0 ? (
            <div className="p-8 text-center text-gray-400">暂无VIP套餐</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-gray-400 text-sm">套餐名称</th>
                    <th className="px-4 py-3 text-left text-gray-400 text-sm">VIP等级</th>
                    <th className="px-4 py-3 text-left text-gray-400 text-sm">天数</th>
                    <th className="px-4 py-3 text-left text-gray-400 text-sm">人民币</th>
                    <th className="px-4 py-3 text-left text-gray-400 text-sm">USDT</th>
                    <th className="px-4 py-3 text-left text-gray-400 text-sm">状态</th>
                  </tr>
                </thead>
                <tbody>
                  {packages.map((pkg) => (
                    <tr key={pkg.id} className="border-t border-gray-800 hover:bg-gray-800/50">
                      <td className="px-4 py-3 text-white">{pkg.name}</td>
                      <td className="px-4 py-3 text-yellow-400">VIP{pkg.vip_level}</td>
                      <td className="px-4 py-3 text-gray-300">{pkg.duration_days}天</td>
                      <td className="px-4 py-3 text-green-400">¥{pkg.price_cny}</td>
                      <td className="px-4 py-3 text-blue-400">${pkg.price_usdt}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs ${pkg.status === 1 ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                          {pkg.status === 1 ? '启用' : '禁用'}
                        </span>
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
          <div className="p-4 border-b border-gray-800">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="搜索订单..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 pl-10 text-white"
              />
            </div>
          </div>
          {orders.length === 0 ? (
            <div className="p-8 text-center text-gray-400">暂无VIP订单</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-gray-400 text-sm">用户</th>
                    <th className="px-4 py-3 text-left text-gray-400 text-sm">套餐</th>
                    <th className="px-4 py-3 text-left text-gray-400 text-sm">支付方式</th>
                    <th className="px-4 py-3 text-left text-gray-400 text-sm">金额</th>
                    <th className="px-4 py-3 text-left text-gray-400 text-sm">状态</th>
                    <th className="px-4 py-3 text-left text-gray-400 text-sm">时间</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-t border-gray-800 hover:bg-gray-800/50">
                      <td className="px-4 py-3 text-white">{order.users?.nickname || order.user_id}</td>
                      <td className="px-4 py-3 text-yellow-400">VIP{order.vip_packages?.vip_level} - {order.vip_packages?.name}</td>
                      <td className="px-4 py-3 text-gray-300">{order.payment_method === 'cny' ? '人民币' : 'USDT'}</td>
                      <td className="px-4 py-3 text-green-400">
                        {order.amount_cny ? `¥${order.amount_cny}` : `$${order.amount_usdt}`}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          order.status === 1 ? 'bg-green-500/20 text-green-400' : 
                          order.status === 0 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {order.status === 0 ? '待支付' : order.status === 1 ? '已完成' : '已取消'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-sm">
                        {order.created_at ? new Date(order.created_at).toLocaleString() : '-'}
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
                  {editingVip?.id ? '编辑VIP等级' : '新增VIP等级'}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">等级数字 *</label>
                    <input
                      type="number"
                      value={editingVip?.level || 0}
                      onChange={e => setEditingVip({ ...editingVip, level: parseInt(e.target.value) || 0 })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">等级名称 *</label>
                    <input
                      type="text"
                      value={editingVip?.name || ''}
                      onChange={e => setEditingVip({ ...editingVip, name: e.target.value })}
                      placeholder="如: 白银会员"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">所需积分</label>
                  <input
                    type="number"
                    value={editingVip?.required_points || 0}
                    onChange={e => setEditingVip({ ...editingVip, required_points: parseInt(e.target.value) || 0 })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">折扣 (%)</label>
                    <input
                      type="number"
                      value={editingVip?.discount || 0}
                      onChange={e => setEditingVip({ ...editingVip, discount: parseInt(e.target.value) || 0 })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">积分加成 (%)</label>
                    <input
                      type="number"
                      value={editingVip?.points_bonus || 0}
                      onChange={e => setEditingVip({ ...editingVip, points_bonus: parseInt(e.target.value) || 0 })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">每日代币</label>
                    <input
                      type="number"
                      step="0.00000001"
                      value={editingVip?.daily_token || 0}
                      onChange={e => setEditingVip({ ...editingVip, daily_token: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">排序</label>
                    <input
                      type="number"
                      value={editingVip?.sort_order || 0}
                      onChange={e => setEditingVip({ ...editingVip, sort_order: parseInt(e.target.value) || 0 })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">状态</label>
                  <select
                    value={editingVip?.status || 1}
                    onChange={e => setEditingVip({ ...editingVip, status: parseInt(e.target.value) })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  >
                    <option value={1}>启用</option>
                    <option value={0}>禁用</option>
                  </select>
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
                  disabled={saving || !editingVip?.name}
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
