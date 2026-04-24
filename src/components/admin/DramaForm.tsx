import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';

interface DramaFormProps {
  drama?: any;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const DramaForm: React.FC<DramaFormProps> = ({ drama, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: drama?.title?.zh || '',
    titleEn: drama?.title?.en || '',
    description: drama?.description?.zh || '',
    descriptionEn: drama?.description?.en || '',
    totalEpisodes: drama?.total_episodes || 1,
    vipLevel: drama?.vip_level || 0,
    status: drama?.status ?? 1,
    coverImage: drama?.cover_image || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: { zh: formData.title, en: formData.titleEn },
      description: { zh: formData.description, en: formData.descriptionEn },
      total_episodes: formData.totalEpisodes,
      vip_level: formData.vipLevel,
      status: formData.status,
      cover_image: formData.coverImage
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-orange-500/30 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">{drama ? '编辑短剧' : '新增短剧'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">标题（中文）</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-orange-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">标题（英文）</label>
              <input
                type="text"
                value={formData.titleEn}
                onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">描述（中文）</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-orange-500 h-20"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">描述（英文）</label>
              <textarea
                value={formData.descriptionEn}
                onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-orange-500 h-20"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">总集数</label>
              <input
                type="number"
                value={formData.totalEpisodes}
                onChange={(e) => setFormData({ ...formData, totalEpisodes: parseInt(e.target.value) })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-orange-500"
                min={1}
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">VIP等级</label>
              <select
                value={formData.vipLevel}
                onChange={(e) => setFormData({ ...formData, vipLevel: parseInt(e.target.value) })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-orange-500"
              >
                <option value={0}>免费</option>
                <option value={1}>VIP1</option>
                <option value={2}>VIP2</option>
                <option value={3}>VIP3</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">状态</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: parseInt(e.target.value) })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-orange-500"
              >
                <option value={1}>上架</option>
                <option value={0}>下架</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">封面图片</label>
            <div className="flex items-center gap-4">
              {formData.coverImage && (
                <img src={formData.coverImage} alt="cover" className="w-20 h-20 rounded-lg object-cover" />
              )}
              <div className="flex-1">
                <input
                  type="text"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  placeholder="图片URL"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-orange-500"
                />
              </div>
              <button className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 flex items-center gap-2">
                <Upload className="w-4 h-4" /> 上传
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700"
            >
              {drama ? '保存' : '创建'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DramaForm;
