import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Users, Film, Coins, ShoppingCart,
  Gift, Settings, Menu, X, LogOut, Package, Landmark, Crown
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
  { id: '', name: '仪表盘', icon: LayoutDashboard },
  { id: 'users', name: '用户管理', icon: Users },
  { id: 'dramas', name: '短剧管理', icon: Film },
  { id: 'assets', name: '资产管理', icon: Coins },
  { id: 'orders', name: '投资管理', icon: ShoppingCart },
  { id: 'tasks', name: '任务管理', icon: Gift },
  { id: 'vip', name: 'VIP管理', icon: Crown },
  { id: 'shop', name: '商城管理', icon: Package },
  { id: 'stakes', name: '质押池管理', icon: Landmark },
  { id: 'settings', name: '系统设置', icon: Settings },
];

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const activeTab = location.pathname.replace('/', '') || 'dashboard';

  const handleTabChange = (tab: string) => {
    navigate(`/${tab}`);
  };

  return (
    <div className="min-h-screen bg-black flex">
      <motion.aside
        initial={{ width: 240 }}
        animate={{ width: isSidebarOpen ? 240 : 0 }}
        className="bg-gray-900 border-r border-orange-500/20 overflow-hidden h-screen flex-shrink-0"
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            <span className="text-white font-bold text-lg">Admin</span>
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === (item.id || 'dashboard')
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </motion.aside>

      <main className="flex-1 overflow-auto">
        <header className="bg-gray-900/50 border-b border-orange-500/20 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-gray-400 hover:text-orange-400 transition-colors"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="text-white font-bold text-xl">FunReelRWA 后台管理</h1>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <>
                <span className="text-gray-400 text-sm">{user.nickname}</span>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">退出</span>
                </button>
              </>
            )}
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  );
}
