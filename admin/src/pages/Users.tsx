import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, Plus, Edit2, Trash2, Wallet, X } from 'lucide-react';
import { supabase } from '../supabase/client';

interface UserData {
  id: string;
  email: string;
  nickname: string;
  wallet_address?: string;
  password_hash?: string;
  password?: string;
  vip_level: number;
  points: number;
  token_balance: number;
  status: number;
  created_at: string;
}

const defaultUser: Partial<UserData> = {
  email: '',
  nickname: '',
  wallet_address: '',
  password: '',
  vip_level: 0,
  points: 0,
  token_balance: 0,
  status: 1,
};

export default function Users() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<Partial<UserData> | null>(null);
  const [saving, setSaving] = useState(false);
  const pageSize = 10;

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const fetchUsers = async () => {
    setLoading(true);
    let query = supabase.from('users').select('*', { count: 'exact' });
    
    if (search) {
      query = query.or(`email.ilike.%${search}%,nickname.ilike.%${search}%,wallet_address.ilike.%${search}%`);
    }
    
    const { data, count } = await query
      .range((page - 1) * pageSize, page * pageSize - 1)
      .order('created_at', { ascending: false });
    
    setUsers(data || []);
    setTotal(count || 0);
    setLoading(false);
  };

  const openEdit = (user?: UserData) => {
    setEditingUser(user ? { ...user } : { ...defaultUser });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!editingUser?.email || !editingUser?.nickname) {
      alert('请填写昵称和邮箱');
      return;
    }
    // 新用户必须填写密码
    if (!editingUser.id && !editingUser.password) {
      alert('请输入登录密码');
      return;
    }
    setSaving(true);
    
    try {
      // Generate password hash if password is provided
      let passwordHash = null;
      if (editingUser.password) {
        const { data: hashData } = await supabase.rpc('hash_password', {
          password: editingUser.password
        });
        passwordHash = hashData;
        if (!passwordHash) {
          throw new Error('密码加密失败');
        }
      }
      
      if (editingUser.id) {
        const updateData: any = {
          email: editingUser.email,
          nickname: editingUser.nickname,
          wallet_address: editingUser.wallet_address || null,
          vip_level: editingUser.vip_level,
          points: editingUser.points,
          token_balance: editingUser.token_balance,
          status: editingUser.status,
        };
        if (passwordHash) {
          updateData.password_hash = passwordHash;
        }
        const { error: updateError } = await supabase.from('users').update(updateData).eq('id', editingUser.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from('users').insert({
          email: editingUser.email,
          nickname: editingUser.nickname,
          wallet_address: editingUser.wallet_address || null,
          password_hash: passwordHash,
          vip_level: editingUser.vip_level,
          points: editingUser.points,
          token_balance: editingUser.token_balance,
          status: editingUser.status,
          invite_code: Math.random().toString(36).substring(2, 10).toUpperCase(),
        });
        if (insertError) throw insertError;
      }
      setShowModal(false);
      setEditingUser(null);
      fetchUsers();
    } catch (err: any) {
      console.error(err);
      alert(err.message || '保存失败');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除该用户吗?')) return;
    await supabase.from('users').delete().eq('id', id);
    fetchUsers();
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">用户管理</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索用户..."
              className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:border-orange-500 outline-none"
            />
          </div>
          <button
            onClick={() => openEdit()}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg flex items-center gap-2 hover:bg-orange-600"
          >
            <Plus className="w-4 h-4" />
            新增用户
          </button>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-left text-gray-400 text-sm">用户</th>
              <th className="px-4 py-3 text-left text-gray-400 text-sm">邮箱</th>
              <th className="px-4 py-3 text-left text-gray-400 text-sm">钱包地址</th>
              <th className="px-4 py-3 text-left text-gray-400 text-sm">VIP等级</th>
              <th className="px-4 py-3 text-left text-gray-400 text-sm">积分</th>
              <th className="px-4 py-3 text-left text-gray-400 text-sm">代币</th>
              <th className="px-4 py-3 text-left text-gray-400 text-sm">状态</th>
              <th className="px-4 py-3 text-left text-gray-400 text-sm">操作</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="text-center py-8 text-gray-400">加载中...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-8 text-gray-400">暂无数据</td></tr>
            ) : (
              users.map((user) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-t border-gray-800 hover:bg-gray-800/50"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-orange-400" />
                      </div>
                      <span className="text-white">{user.nickname}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-300 text-sm">{user.email}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs max-w-[120px] truncate">{user.wallet_address || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${user.vip_level >= 9 ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'}`}>
                      VIP{user.vip_level}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-300 text-sm">{user.points.toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-300 text-sm">{user.token_balance.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${user.status === 1 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {user.status === 1 ? '正常' : '禁用'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(user)} className="p-1 text-orange-400 hover:bg-orange-500/10 rounded">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(user.id)} className="p-1 text-red-400 hover:bg-red-500/10 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>

        <div className="flex items-center justify-between px-4 py-4 border-t border-gray-800">
          <span className="text-gray-400 text-sm">共 {total} 条记录</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-gray-800 text-gray-300 rounded hover:bg-gray-700 disabled:opacity-50 text-sm"
            >
              上一页
            </button>
            <span className="text-gray-400 text-sm">{page} / {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 bg-gray-800 text-gray-300 rounded hover:bg-gray-700 disabled:opacity-50 text-sm"
            >
              下一页
            </button>
          </div>
        </div>
      </div>

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
                  {editingUser?.id ? '编辑用户' : '新增用户'}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">昵称 *</label>
                  <input
                    type="text"
                    value={editingUser?.nickname || ''}
                    onChange={e => setEditingUser({ ...editingUser, nickname: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">邮箱 *</label>
                  <input
                    type="email"
                    value={editingUser?.email || ''}
                    onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">钱包地址</label>
                  <input
                    type="text"
                    value={editingUser?.wallet_address || ''}
                    onChange={e => setEditingUser({ ...editingUser, wallet_address: e.target.value })}
                    placeholder="0x..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">
                    {editingUser?.id ? '新密码 (留空不修改)' : '登录密码 *'}
                  </label>
                  <input
                    type="password"
                    required={!editingUser?.id}
                    value={editingUser?.password || ''}
                    onChange={e => setEditingUser({ ...editingUser, password: e.target.value })}
                    placeholder="请输入密码"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">VIP等级</label>
                    <input
                      type="number"
                      value={editingUser?.vip_level || 0}
                      onChange={e => setEditingUser({ ...editingUser, vip_level: parseInt(e.target.value) || 0 })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">状态</label>
                    <select
                      value={editingUser?.status || 1}
                      onChange={e => setEditingUser({ ...editingUser, status: parseInt(e.target.value) })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none"
                    >
                      <option value={1}>正常</option>
                      <option value={0}>禁用</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">积分</label>
                    <input
                      type="number"
                      value={editingUser?.points || 0}
                      onChange={e => setEditingUser({ ...editingUser, points: parseInt(e.target.value) || 0 })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">代币余额</label>
                    <input
                      type="number"
                      step="0.00000001"
                      value={editingUser?.token_balance || 0}
                      onChange={e => setEditingUser({ ...editingUser, token_balance: parseFloat(e.target.value) || 0 })}
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
                  disabled={saving || !editingUser?.email || !editingUser?.nickname}
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