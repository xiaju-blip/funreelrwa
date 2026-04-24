import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, User, Mail, Phone, Crown } from 'lucide-react';

interface UserFormProps {
  user?: any;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    nickname: user?.nickname || '',
    email: user?.email || '',
    phone: user?.phone || '',
    vip_level: user?.vip_level || 0,
    points: user?.points || 0,
    token_balance: user?.token_balance || 0,
    status: user?.status ?? 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-900 border border-orange-500/30 rounded-2xl w-full max-w-md"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h3 className="text-white font-bold text-lg">{user ? '编辑用户' : '新增用户'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-gray-400 text-sm mb-2 block">昵称</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={formData.nickname}
                onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:border-orange-500 focus:outline-none"
                placeholder="输入昵称"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-2 block">邮箱</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:border-orange-500 focus:outline-none"
                placeholder="输入邮箱"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-2 block">手机号</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:border-orange-500 focus:outline-none"
                placeholder="输入手机号"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-sm mb-2 block flex items-center gap-1">
                <Crown className="w-3 h-3" /> VIP等级
              </label>
              <select
                value={formData.vip_level}
                onChange={(e) => setFormData({ ...formData, vip_level: parseInt(e.target.value) })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:border-orange-500 focus:outline-none"
              >
                <option value={0}>普通用户</option>
                <option value={1}>VIP1</option>
                <option value={2}>VIP2</option>
                <option value={3}>VIP3</option>
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-2 block">状态</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: parseInt(e.target.value) })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:border-orange-500 focus:outline-none"
              >
                <option value={1}>正常</option>
                <option value={0}>禁用</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">积分</label>
              <input
                type="number"
                value={formData.points}
                onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:border-orange-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-2 block">代币余额</label>
              <input
                type="number"
                value={formData.token_balance}
                onChange={(e) => setFormData({ ...formData, token_balance: parseInt(e.target.value) || 0 })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-colors"
            >
              保存
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default UserForm;
