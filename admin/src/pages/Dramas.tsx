import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, Search, Plus, Edit2, Trash2, X, Image } from 'lucide-react';
import { supabase } from '../supabase/client';

interface Drama {
  id: string;
  title: string;
  description?: string;
  cover_image?: string;
  category?: string;
  total_episodes: number;
  vip_level: number;
  status: number;
  release_date?: string;
  created_at: string;
}

const categories = ['爱情', '动作', '喜剧', '悬疑', '奇幻', '科幻', '古装', '都市', '校园', '商战'];

const defaultDrama: Partial<Drama> = {
  title: '',
  description: '',
  cover_image: '',
  category: '爱情',
  total_episodes: 0,
  vip_level: 0,
  status: 1,
  release_date: new Date().toISOString().split('T')[0],
};

export default function Dramas() {
  const [dramas, setDramas] = useState<Drama[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingDrama, setEditingDrama] = useState<Partial<Drama> | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchDramas();
  }, []);

  const fetchDramas = async () => {
    setLoading(true);
    const { data } = await supabase.from('dramas').select('*').order('created_at', { ascending: false });
    setDramas(data || []);
    setLoading(false);
  };

  const openEdit = (drama?: Drama) => {
    setEditingDrama(drama ? { ...drama } : { ...defaultDrama });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!editingDrama?.title) return;
    setSaving(true);
    
    try {
      if (editingDrama.id) {
        await supabase.from('dramas').update({
          title: editingDrama.title,
          description: editingDrama.description,
          cover_image: editingDrama.cover_image,
          category: editingDrama.category,
          total_episodes: editingDrama.total_episodes,
          vip_level: editingDrama.vip_level,
          status: editingDrama.status,
          release_date: editingDrama.release_date,
        }).eq('id', editingDrama.id);
      } else {
        await supabase.from('dramas').insert({
          title: editingDrama.title,
          description: editingDrama.description,
          cover_image: editingDrama.cover_image,
          category: editingDrama.category,
          total_episodes: editingDrama.total_episodes,
          vip_level: editingDrama.vip_level,
          status: editingDrama.status,
          release_date: editingDrama.release_date,
        });
      }
      setShowModal(false);
      fetchDramas();
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除该短剧吗?')) return;
    await supabase.from('dramas').delete().eq('id', id);
    fetchDramas();
  };

  const filteredDramas = dramas.filter(d => 
    d.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Film className="w-6 h-6 text-orange-500" />
          短剧管理
        </h2>
        <button
          onClick={() => openEdit()}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg flex items-center gap-2 hover:bg-orange-600"
        >
          <Plus className="w-4 h-4" />
          新增短剧
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索短剧名称..."
            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">加载中...</div>
      ) : filteredDramas.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center text-gray-400">暂无数据</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDramas.map((drama) => (
            <motion.div
              key={drama.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-orange-500/50"
            >
              <div className="aspect-video bg-gray-800 relative">
                {drama.cover_image ? (
                  <img src={drama.cover_image} alt={drama.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image className="w-12 h-12 text-gray-600" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded text-xs ${drama.status === 1 ? 'bg-green-500/80 text-white' : 'bg-gray-500/80 text-white'}`}>
                    {drama.status === 1 ? '上架' : '下架'}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-white font-semibold mb-2 truncate">{drama.title}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                  <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded">{drama.category}</span>
                  <span>{drama.total_episodes}集</span>
                  {drama.vip_level > 0 && <span className="text-yellow-400">VIP{drama.vip_level}</span>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(drama)} className="flex-1 px-3 py-1.5 bg-orange-500/10 text-orange-400 rounded hover:bg-orange-500/20 text-sm">
                    编辑
                  </button>
                  <button onClick={() => handleDelete(drama.id)} className="px-3 py-1.5 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 text-sm">
                    删除
                  </button>
                </div>
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
              className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">
                  {editingDrama?.id ? '编辑短剧' : '新增短剧'}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">标题 *</label>
                  <input
                    type="text"
                    value={editingDrama?.title || ''}
                    onChange={e => setEditingDrama({ ...editingDrama, title: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">描述</label>
                  <textarea
                    value={editingDrama?.description || ''}
                    onChange={e => setEditingDrama({ ...editingDrama, description: e.target.value })}
                    rows={3}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">封面图片URL</label>
                  <input
                    type="text"
                    value={editingDrama?.cover_image || ''}
                    onChange={e => setEditingDrama({ ...editingDrama, cover_image: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">分类</label>
                    <select
                      value={editingDrama?.category || '爱情'}
                      onChange={e => setEditingDrama({ ...editingDrama, category: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none"
                    >
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">集数</label>
                    <input
                      type="number"
                      value={editingDrama?.total_episodes || 0}
                      onChange={e => setEditingDrama({ ...editingDrama, total_episodes: parseInt(e.target.value) || 0 })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">VIP等级</label>
                    <input
                      type="number"
                      value={editingDrama?.vip_level || 0}
                      onChange={e => setEditingDrama({ ...editingDrama, vip_level: parseInt(e.target.value) || 0 })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">状态</label>
                    <select
                      value={editingDrama?.status || 1}
                      onChange={e => setEditingDrama({ ...editingDrama, status: parseInt(e.target.value) })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none"
                    >
                      <option value={1}>上架</option>
                      <option value={0}>下架</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">上映日期</label>
                  <input
                    type="date"
                    value={editingDrama?.release_date || ''}
                    onChange={e => setEditingDrama({ ...editingDrama, release_date: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none"
                  />
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
                  disabled={saving || !editingDrama?.title}
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