import { useState } from 'react';
import { Settings as SettingsIcon, Globe, Palette, Bell, Shield, Save } from 'lucide-react';

export default function Settings() {
  const [language, setLanguage] = useState('zh');
  const [theme, setTheme] = useState('dark');
  const [notifications, setNotifications] = useState(true);

  const handleSave = () => {
    localStorage.setItem('admin_settings', JSON.stringify({ language, theme, notifications }));
    alert('设置已保存');
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-orange-500" />
          系统设置
        </h2>
      </div>

      <div className="max-w-2xl space-y-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-semibold text-white">语言设置</h3>
          </div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
          >
            <option value="zh">中文</option>
            <option value="en">English</option>
          </select>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Palette className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-semibold text-white">主题设置</h3>
          </div>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
          >
            <option value="dark">深色主题</option>
            <option value="light">浅色主题</option>
          </select>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-orange-500" />
              <h3 className="text-lg font-semibold text-white">通知设置</h3>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`px-4 py-1.5 rounded-lg text-sm ${notifications ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}
            >
              {notifications ? '已启用' : '已禁用'}
            </button>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          保存设置
        </button>
      </div>
    </div>
  );
}