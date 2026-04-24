import React from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Users, Film, Coins, ShoppingCart,
  Gift, Settings, Menu, X, Landmark, Package, Crown
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onToggle: () => void;
}

const navItems = [
  { id: 'dashboard', name: '仪表盘', icon: LayoutDashboard },
  { id: 'users', name: '用户管理', icon: Users },
  { id: 'dramas', name: '短剧管理', icon: Film },
  { id: 'assets', name: '资产管理', icon: Coins },
  { id: 'orders', name: '订单管理', icon: ShoppingCart },
  { id: 'tasks', name: '任务管理', icon: Gift },
  { id: 'vip', name: 'VIP等级', icon: Crown },
  { id: 'vip-packages', name: 'VIP套餐', icon: Crown },
  { id: 'shop', name: '商城管理', icon: Package },
  { id: 'stakes', name: '质押管理', icon: Landmark },
  { id: 'settings', name: '系统设置', icon: Settings },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, activeTab, onTabChange, onToggle }) => {
  return (
    <motion.aside
      initial={{ width: 240 }}
      animate={{ width: isOpen ? 240 : 0 }}
      className="bg-gray-900 border-r border-orange-500/20 overflow-hidden h-screen"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            <span className="text-white font-bold text-lg">Admin</span>
          </div>
          <button
            onClick={onToggle}
            className="p-2 text-gray-400 hover:text-orange-400 transition-colors"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === item.id
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
  );
};

export default Sidebar;