import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AssetFormProps {
  asset?: any;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const AssetForm: React.FC<AssetFormProps> = ({ asset, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: asset?.name || '',
    description: asset?.description || '',
    target_amount: asset?.target_amount || '',
    apy: asset?.apy || '',
    duration_days: asset?.duration_days || '',
    cover: asset?.cover || '',
    status: asset?.status ?? 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-orange-500/30 rounded-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h3 className="text-white font-bold text-lg">{asset ? '编辑资产' : '新增资产'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">资产名称</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">描述</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none h-20"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">目标金额</label>
              <input
                type="number"
                value={formData.target_amount}
                onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">年化收益率(%)</label>
              <input
                type="number"
                value={formData.apy}
                onChange={(e) => setFormData({ ...formData, apy: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">期限(天)</label>
              <input
                type="number"
                value={formData.duration_days}
                onChange={(e) => setFormData({ ...formData, duration_days: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">状态</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: parseInt(e.target.value) })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none"
              >
                <option value={1}>进行中</option>
                <option value={0}>已结束</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">封面图片URL</label>
            <input
              type="text"
              value={formData.cover}
              onChange={(e) => setFormData({ ...formData, cover: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none"
            />
          </div>
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border border-gray-700 text-gray-400 rounded-lg hover:bg-gray-800"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssetForm;
