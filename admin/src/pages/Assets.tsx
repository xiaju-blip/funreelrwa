import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, Plus, Search, Edit2, Trash2, X, Image, TrendingUp } from 'lucide-react';
import { supabase } from '../supabase/client';

interface Asset {
  id: string;
  name: string;
  description?: string;
  cover?: string;
  target_amount: number;
  raised_amount: number;
  apy: number;
  duration_days: number;
  status: number;
  start_time?: string;
  end_time?: string;
  created_at: string;
}

interface Position {
  id: string;
  user_id: string;
  asset_id: string;
  amount: number;
  cost_price: number;
  created_at: string;
  users?: { nickname: string };
}

const defaultAsset: Partial<Asset> = {
  name: '',
  description: '',
  cover: '',
  target_amount: 0,
  raised_amount: 0,
  apy: 0,
  duration_days: 30,
  status: 0,
  start_time: new Date().toISOString().split('T')[0],
  end_time: '',
};

const Assets: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [positionSearch, setPositionSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Partial<Asset> | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'assets' | 'records'>('assets');

  useEffect(() => {
    fetchAssets();
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    const { data } = await supabase
      .from('positions')
      .select('*, users(nickname)')
      .order('created_at', { ascending: false })
      .limit(50);
    setPositions(data || []);
  };

  const fetchAssets = async () => {
    setLoading(true);
    const { data } = await supabase.from('assets').select('*').order('created_at', { ascending: false });
    setAssets(data || []);
    setLoading(false);
  };

  const openEdit = (asset?: Asset) => {
    setEditingAsset(asset ? { ...asset } : { ...defaultAsset });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!editingAsset?.name || !editingAsset?.target_amount) return;
    setSaving(true);
    
    try {
      if (editingAsset.id) {
        await supabase.from('assets').update({
          name: editingAsset.name,
          description: editingAsset.description,
          cover: editingAsset.cover,
          target_amount: editingAsset.target_amount,
          raised_amount: editingAsset.raised_amount,
          apy: editingAsset.apy,
          duration_days: editingAsset.duration_days,
          status: editingAsset.status,
          start_time: editingAsset.start_time,
          end_time: editingAsset.end_time,
        }).eq('id', editingAsset.id);
      } else {
        await supabase.from('assets').insert({
          name: editingAsset.name,
          description: editingAsset.description,
          cover: editingAsset.cover,
          target_amount: editingAsset.target_amount,
          raised_amount: editingAsset.raised_amount || 0,
          apy: editingAsset.apy,
          duration_days: editingAsset.duration_days,
          status: editingAsset.status,
          start_time: editingAsset.start_time,
          end_time: editingAsset.end_time,
        });
      }
      setShowModal(false);
      fetchAssets();
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除该资产吗?')) return;
    await supabase.from('assets').delete().eq('id', id);
    fetchAssets();
  };

  const filteredAssets = assets.filter(a => 
    a.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: number) => {
    const styles: Record<number, string> = {
      0: 'bg-gray-500/20 text-gray-400',
      1: 'bg-green-500/20 text-green-400',
      2: 'bg-orange-500/20 text-orange-400',
    };
    const labels: Record<number, string> = {
      0: '草稿',
      1: '进行中',
      2: '已结束',
    };
    return <span className={`px-2 py-1 rounded text-xs ${styles[status]}`}>{labels[status]}</span>;
  };

  const filteredPositions = positions.filter(p =>
    p.users?.nickname?.toLowerCase().includes(positionSearch.toLowerCase())
  );

  const getAssetName = (assetId: string) => {
    const asset = assets.find(a => a.id === assetId);
    return asset?.name || assetId;
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Coins className="w-6 h-6 text-orange-500" />
          资产管理
        </h2>
        {activeTab === 'assets' && (
          <button
            onClick={() => openEdit()}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            <Plus className="w-4 h-4" />
            新增资产
          </button>
        )}
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('assets')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'assets' 
              ? 'bg-orange-500 text-white' 
              : 'bg-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          <Coins className="w-4 h-4" />
          资产管理
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
          投资记录
        </button>
      </div>

      {activeTab === 'assets' ? (
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="搜索资产..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-md bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-400">加载中...</div>
        ) : filteredAssets.length === 0 ? (
          <div className="p-8 text-center text-gray-400">暂无数据</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-400 text-sm">资产名称</th>
                  <th className="px-4 py-3 text-left text-gray-400 text-sm">目标金额</th>
                  <th className="px-4 py-3 text-left text-gray-400 text-sm">已募集</th>
                  <th className="px-4 py-3 text-left text-gray-400 text-sm">年化收益</th>
                  <th className="px-4 py-3 text-left text-gray-400 text-sm">期限</th>
                  <th className="px-4 py-3 text-left text-gray-400 text-sm">状态</th>
                  <th className="px-4 py-3 text-left text-gray-400 text-sm">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.map((asset) => (
                  <tr key={asset.id} className="border-t border-gray-800 hover:bg-gray-800/50">
                    <td className="px-4 py-3 text-white">{asset.name}</td>
                    <td className="px-4 py-3 text-gray-300">${asset.target_amount?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-300">${asset.raised_amount?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-orange-400">{asset.apy}%</td>
                    <td className="px-4 py-3 text-gray-300">{asset.duration_days}天</td>
                    <td className="px-4 py-3">{getStatusBadge(asset.status)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(asset)} className="p-1 text-orange-400 hover:bg-orange-500/10 rounded">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(asset.id)} className="p-1 text-red-400 hover:bg-red-500/10 rounded">
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
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="搜索用户..."
                value={positionSearch}
                onChange={(e) => setPositionSearch(e.target.value)}
                className="w-full max-w-md bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white"
              />
            </div>
          </div>
          {filteredPositions.length === 0 ? (
            <div className="p-8 text-center text-gray-400">暂无投资记录</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-gray-400 text-sm">用户</th>
                    <th className="px-4 py-3 text-left text-gray-400 text-sm">资产</th>
                    <th className="px-4 py-3 text-left text-gray-400 text-sm">投资金额</th>
                    <th className="px-4 py-3 text-left text-gray-400 text-sm">单价</th>
                    <th className="px-4 py-3 text-left text-gray-400 text-sm">投资时间</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPositions.map((position) => (
                    <tr key={position.id} className="border-t border-gray-800 hover:bg-gray-800/50">
                      <td className="px-4 py-3 text-white">{position.users?.nickname || position.user_id}</td>
                      <td className="px-4 py-3 text-white">{getAssetName(position.asset_id)}</td>
                      <td className="px-4 py-3 text-orange-400">{position.amount}</td>
                      <td className="px-4 py-3 text-gray-300">{position.cost_price}</td>
                      <td className="px-4 py-3 text-gray-400 text-sm">{new Date(position.created_at).toLocaleString()}</td>
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
              className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">
                  {editingAsset?.id ? '编辑资产' : '新增资产'}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">资产名称 *</label>
                  <input
                    type="text"
                    value={editingAsset?.name || ''}
                    onChange={e => setEditingAsset({ ...editingAsset, name: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">描述</label>
                  <textarea
                    value={editingAsset?.description || ''}
                    onChange={e => setEditingAsset({ ...editingAsset, description: e.target.value })}
                    rows={3}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">封面图片URL</label>
                  <input
                    type="text"
                    value={editingAsset?.cover || ''}
                    onChange={e => setEditingAsset({ ...editingAsset, cover: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">目标金额 *</label>
                    <input
                      type="number"
                      value={editingAsset?.target_amount || 0}
                      onChange={e => setEditingAsset({ ...editingAsset, target_amount: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">年化收益 (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingAsset?.apy || 0}
                      onChange={e => setEditingAsset({ ...editingAsset, apy: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">锁定期限 (天)</label>
                    <input
                      type="number"
                      value={editingAsset?.duration_days || 30}
                      onChange={e => setEditingAsset({ ...editingAsset, duration_days: parseInt(e.target.value) || 30 })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">状态</label>
                    <select
                      value={editingAsset?.status || 0}
                      onChange={e => setEditingAsset({ ...editingAsset, status: parseInt(e.target.value) })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none"
                    >
                      <option value={0}>草稿</option>
                      <option value={1}>进行中</option>
                      <option value={2}>已结束</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">开始时间</label>
                    <input
                      type="date"
                      value={editingAsset?.start_time || ''}
                      onChange={e => setEditingAsset({ ...editingAsset, start_time: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">结束时间</label>
                    <input
                      type="date"
                      value={editingAsset?.end_time || ''}
                      onChange={e => setEditingAsset({ ...editingAsset, end_time: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700"
                >
                  取消
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !editingAsset?.name || !editingAsset?.target_amount}
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
};

export default Assets;