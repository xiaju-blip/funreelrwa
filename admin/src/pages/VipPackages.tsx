import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Plus, Edit2, Trash2, X, Search, DollarSign, Coins } from 'lucide-react';
import { supabase } from '../supabase/client';

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

const defaultPackage: Partial<VipPackage> = {
  vip_level: 0,
  name: '',
  duration_days: 30,
  price_cny: 0,
  price_usdt: 0,
  benefits: '',
  status: 1,
  sort_order: 0,
};

export default function VipPackages() {
  const [packages, setPackages] = useState<VipPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Partial<VipPackage> | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('vip_packages')
      .select('*')
      .order('sort_order', { ascending: true });
    
    if (!error) {
      setPackages(data || []);
    }
    setLoading(false);
  };

  const openEdit = (pkg?: VipPackage) => {
    setEditingPackage(pkg ? { ...pkg } : { ...defaultPackage });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!editingPackage?.name) return;
    setSaving(true);
    
    try {
      if (editingPackage.id) {
        await supabase.from('vip_packages').update({
          vip_level: editingPackage.vip_level,
          name: editingPackage.name,
          duration_days: editingPackage.duration_days,
          price_cny: editingPackage.price_cny,
          price_usdt: editingPackage.price_usdt,
          benefits: editingPackage.benefits,
          status: editingPackage.status,
          sort_order: editingPackage.sort_order,
        }).eq('id', editingPackage.id);
      } else {
        await supabase.from('vip_packages').insert({
          vip_level: editingPackage.vip_level,
          name: editingPackage.name,
          duration_days: editingPackage.duration_days,
          price_cny: editingPackage.price_cny,
          price_usdt: editingPackage.price_usdt,
          benefits: editingPackage.benefits,
          status: editingPackage.status,
          sort_order: editingPackage.sort_order,
        });
      }
      setShowModal(false);
      fetchPackages();
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除该套餐吗?')) return;
    await supabase.from('vip_packages').delete().eq('id', id);
    fetchPackages();
  };

  const filteredPackages = packages.filter(p => 
    p.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatPrice = (price: number) => {
    return price.toLocaleString('zh-CN', { minimumFractionDigits: 2 });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Crown className="w-6 h-6 text-yellow-500" />
          VIP套餐管理
        </h2>
        <button
          onClick={() => openEdit()}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg flex items-center gap-2 hover:bg-orange-600"
        >
          <Plus className="w-4 h-4" />
          新增���餐
        </button>
      </div>

      <div className="mb-4">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="搜索套餐..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 pl-10 text-white"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">加载中...</div>
      ) : filteredPackages.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center text-gray-400">暂无数据</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPackages.map((pkg) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-yellow-500/50"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-yellow-500" />
                  <h3 className="text-white font-semibold">{pkg.name}</h3>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${pkg.status === 1 ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                  {pkg.status === 1 ? '上架' : '下架'}
                </span>
              </div>
              
              <div className="text-sm text-gray-400 space-y-1 mb-3">
                <div>VIP等级: <span className="text-yellow-400">VIP{pkg.vip_level}</span></div>
                <div>时长: <span className="text-white">{pkg.duration_days}天</span></div>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1 text-green-400">
                    <DollarSign className="w-3 h-3" />
                    ¥{formatPrice(pkg.price_cny)}
                  </div>
                  <div className="flex items-center gap-1 text-blue-400">
                    <Coins className="w-3 h-3" />
                    ${formatPrice(pkg.price_usdt)} USDT
                  </div>
                </div>
                {pkg.benefits && (
                  <div className="text-xs text-gray-500 mt-2 line-clamp-2">
                    {pkg.benefits}
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <button onClick={() => openEdit(pkg)} className="flex-1 px-3 py-1.5 bg-orange-500/10 text-orange-400 rounded hover:bg-orange-500/20 text-sm">
                  编辑
                </button>
                <button onClick={() => handleDelete(pkg.id)} className="px-3 py-1.5 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 text-sm">
                  删除
                </button>
              </div>
            </motion.div>
          ))}
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
                  {editingPackage?.id ? '编辑套餐' : '新增套餐'}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">套餐名称 *</label>
                  <input
                    type="text"
                    value={editingPackage?.name || ''}
                    onChange={e => setEditingPackage({ ...editingPackage, name: e.target.value })}
                    placeholder="如: VIP月卡"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">VIP等级 *</label>
                    <input
                      type="number"
                      value={editingPackage?.vip_level || 0}
                      onChange={e => setEditingPackage({ ...editingPackage, vip_level: parseInt(e.target.value) || 0 })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">时长(天) *</label>
                    <input
                      type="number"
                      value={editingPackage?.duration_days || 30}
                      onChange={e => setEditingPackage({ ...editingPackage, duration_days: parseInt(e.target.value) || 30 })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">价格(¥CNY) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingPackage?.price_cny || 0}
                      onChange={e => setEditingPackage({ ...editingPackage, price_cny: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">价格(USDT) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingPackage?.price_usdt || 0}
                      onChange={e => setEditingPackage({ ...editingPackage, price_usdt: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm mb-1">权益描述</label>
                  <textarea
                    value={editingPackage?.benefits || ''}
                    onChange={e => setEditingPackage({ ...editingPackage, benefits: e.target.value })}
                    rows={3}
                    placeholder="如: 享9折购物折扣、专属客服..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm mb-1">排序</label>
                  <input
                    type="number"
                    value={editingPackage?.sort_order || 0}
                    onChange={e => setEditingPackage({ ...editingPackage, sort_order: parseInt(e.target.value) || 0 })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm mb-1">状态</label>
                  <select
                    value={editingPackage?.status || 1}
                    onChange={e => setEditingPackage({ ...editingPackage, status: parseInt(e.target.value) })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  >
                    <option value={1}>上架</option>
                    <option value={0}>下架</option>
                  </select>
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
                  disabled={saving || !editingPackage?.name}
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