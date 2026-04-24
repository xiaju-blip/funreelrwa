import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Plus, Edit2, Trash2, X, Search, Gift, Package } from 'lucide-react';
import { supabase } from '../supabase/client';

interface ShopItem {
  id: string;
  name: string;
  type: number;
  points: number;
  token_amount?: number;
  vip_days?: number;
  stock: number;
  image?: string;
  status: number;
  sort_order: number;
  created_at: string;
}

interface ExchangeRecord {
  id: string;
  user_id: string;
  item_id: string;
  points_used: number;
  quantity: number;
  status: number;
  created_at: string;
  users?: { nickname: string };
  shop_items?: { name: string };
}

const itemTypes = [
  { value: 1, label: '代币' },
  { value: 2, label: 'VIP卡' },
  { value: 3, label: '道具' },
  { value: 4, label: '优惠券' },
  { value: 5, label: '其他' },
];

const defaultItem: Partial<ShopItem> = {
  name: '',
  type: 1,
  points: 0,
  token_amount: 0,
  vip_days: 0,
  stock: -1,
  image: '',
  status: 1,
  sort_order: 0,
};

export default function Shop() {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [records, setRecords] = useState<ExchangeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<ShopItem> | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'items' | 'records'>('items');

  useEffect(() => {
    fetchItems();
    fetchRecords();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    const { data } = await supabase.from('shop_items').select('*').order('sort_order', { ascending: true });
    setItems(data || []);
    setLoading(false);
  };

  const fetchRecords = async () => {
    const { data } = await supabase
      .from('exchange_records')
      .select('*, users(nickname), shop_items(name)')
      .order('created_at', { ascending: false })
      .limit(50);
    setRecords(data || []);
  };

  const openEdit = (item?: ShopItem) => {
    setEditingItem(item ? { ...item } : { ...defaultItem });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!editingItem?.name) return;
    setSaving(true);
    
    try {
      if (editingItem.id) {
        await supabase.from('shop_items').update({
          name: editingItem.name,
          type: editingItem.type,
          points: editingItem.points,
          token_amount: editingItem.token_amount,
          vip_days: editingItem.vip_days,
          stock: editingItem.stock,
          image: editingItem.image,
          status: editingItem.status,
          sort_order: editingItem.sort_order,
        }).eq('id', editingItem.id);
      } else {
        await supabase.from('shop_items').insert({
          name: editingItem.name,
          type: editingItem.type,
          points: editingItem.points,
          token_amount: editingItem.token_amount,
          vip_days: editingItem.vip_days,
          stock: editingItem.stock,
          image: editingItem.image,
          status: editingItem.status,
          sort_order: editingItem.sort_order,
        });
      }
      setShowModal(false);
      fetchItems();
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除该商品吗?')) return;
    await supabase.from('shop_items').delete().eq('id', id);
    fetchItems();
  };

  const filteredItems = items.filter(i => i.name?.toLowerCase().includes(searchQuery.toLowerCase()));
  const getTypeLabel = (type: number) => itemTypes.find(t => t.value === type)?.label || '其他';

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-orange-500" />
          商城管理
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('items')}
            className={`px-4 py-2 rounded-lg ${activeTab === 'items' ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-400'}`}
          >
            商品管理
          </button>
          <button
            onClick={() => setActiveTab('records')}
            className={`px-4 py-2 rounded-lg ${activeTab === 'records' ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-400'}`}
          >
            兑换记录
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'items' ? (
          <motion.div
            key="items"
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
                新增商品
              </button>
            </div>

            <div className="mb-4">
              <div className="relative max-w-md">
                <input
                  type="text"
                  placeholder="搜索商品..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 pl-10 text-white"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              </div>
            </div>

            {loading ? (
              <div className="text-center py-20 text-gray-400">加载中...</div>
            ) : filteredItems.length === 0 ? (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center text-gray-400">暂无数据</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden"
                  >
                    <div className="aspect-video bg-gray-800 flex items-center justify-center">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="w-12 h-12 text-gray-600" />
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-orange-400 text-xs">{getTypeLabel(item.type)}</span>
                        <span className={`px-2 py-1 rounded text-xs ${item.status === 1 ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                          {item.status === 1 ? '上架' : '下架'}
                        </span>
                      </div>
                      <h3 className="text-white font-medium mb-1">{item.name}</h3>
                      <p className="text-orange-400 font-bold mb-3">{item.points} 积分</p>
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(item)} className="flex-1 py-1 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 text-sm">
                          编辑
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 text-sm">
                          删除
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
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
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center text-gray-400">暂无兑换记录</div>
            ) : (
              <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-gray-400 text-sm">用户</th>
                      <th className="px-4 py-3 text-left text-gray-400 text-sm">商品</th>
                      <th className="px-4 py-3 text-left text-gray-400 text-sm">消耗积分</th>
                      <th className="px-4 py-3 text-left text-gray-400 text-sm">数量</th>
                      <th className="px-4 py-3 text-left text-gray-400 text-sm">状态</th>
                      <th className="px-4 py-3 text-left text-gray-400 text-sm">时间</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((record) => (
                      <tr key={record.id} className="border-t border-gray-800">
                        <td className="px-4 py-3 text-white">{record.users?.nickname || record.user_id}</td>
                        <td className="px-4 py-3 text-gray-300">{record.shop_items?.name || record.item_id}</td>
                        <td className="px-4 py-3 text-orange-400">{record.points_used}</td>
                        <td className="px-4 py-3 text-gray-300">{record.quantity}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs ${record.status === 1 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                            {record.status === 1 ? '已完成' : '待处理'}
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
                  {editingItem?.id ? '编辑商品' : '新增商品'}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">商品名称</label>
                  <input
                    type="text"
                    value={editingItem?.name || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">类型</label>
                    <select
                      value={editingItem?.type || 1}
                      onChange={(e) => setEditingItem({ ...editingItem, type: parseInt(e.target.value) })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                    >
                      {itemTypes.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">所需积分</label>
                    <input
                      type="number"
                      value={editingItem?.points || 0}
                      onChange={(e) => setEditingItem({ ...editingItem, points: parseInt(e.target.value) })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">代币数量</label>
                    <input
                      type="number"
                      value={editingItem?.token_amount || 0}
                      onChange={(e) => setEditingItem({ ...editingItem, token_amount: parseInt(e.target.value) })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">VIP天数</label>
                    <input
                      type="number"
                      value={editingItem?.vip_days || 0}
                      onChange={(e) => setEditingItem({ ...editingItem, vip_days: parseInt(e.target.value) })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">图片URL</label>
                  <input
                    type="text"
                    value={editingItem?.image || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">状态</label>
                  <select
                    value={editingItem?.status || 1}
                    onChange={(e) => setEditingItem({ ...editingItem, status: parseInt(e.target.value) })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  >
                    <option value={1}>上架</option>
                    <option value={0}>下架</option>
                  </select>
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