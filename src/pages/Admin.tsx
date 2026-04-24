import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../supabase/client';
import { useI18n } from '../hooks/useI18n';
import {
  LayoutDashboard, Users, Film, Coins, ShoppingCart,
  Gift, Settings, Menu, X, TrendingUp, Eye, DollarSign, Package, ArrowLeft
} from 'lucide-react';

interface Stats {
  users: number;
  assets: number;
  orders: number;
  dramas: number;
}

const Admin: React.FC = () => {
  const { lang } = useI18n();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [stats, setStats] = useState<Stats>({ users: 0, assets: 0, orders: 0, dramas: 0 });
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const navItems = [
    { id: 'dashboard', name: lang === 'zh' ? '仪表盘' : 'Dashboard', icon: LayoutDashboard },
    { id: 'users', name: lang === 'zh' ? '用户管理' : 'Users', icon: Users },
    { id: 'dramas', name: lang === 'zh' ? '短剧管理' : 'Dramas', icon: Film },
    { id: 'assets', name: lang === 'zh' ? '资产管理' : 'Assets', icon: Coins },
    { id: 'orders', name: lang === 'zh' ? '订单管理' : 'Orders', icon: ShoppingCart },
    { id: 'tasks', name: lang === 'zh' ? '任务管理' : 'Tasks', icon: Gift },
    { id: 'shop', name: lang === 'zh' ? '商城管理' : 'Shop', icon: Package },
    { id: 'settings', name: lang === 'zh' ? '系统设置' : 'Settings', icon: Settings },
  ];

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchStats = async () => {
    const [{ count: users }, { count: assets }, { count: orders }, { count: dramas }] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('assets').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('dramas').select('*', { count: 'exact', head: true }),
    ]);
    setStats({ users: users || 0, assets: assets || 0, orders: orders || 0, dramas: dramas || 0 });
  };

  const fetchData = async () => {
    setLoading(true);
    let query;
    switch (activeTab) {
      case 'users': query = supabase.from('users').select('*').limit(10); break;
      case 'assets': query = supabase.from('assets').select('*').limit(10); break;
      case 'orders': query = supabase.from('orders').select('*, users(nickname), assets(name)').limit(10); break;
      case 'dramas': query = supabase.from('dramas').select('*').limit(10); break;
      case 'tasks': query = supabase.from('tasks').select('*').limit(10); break;
      case 'shop': query = supabase.from('shop_items').select('*').limit(10); break;
      default: setData([]); setLoading(false); return;
    }
    const { data: result } = await query;
    setData(result || []);
    setLoading(false);
  };

  const statCards = [
    { name: lang === 'zh' ? '总用户数' : 'Total Users', value: stats.users, icon: Users, color: 'from-orange-500 to-orange-600' },
    { name: lang === 'zh' ? '资产数量' : 'Total Assets', value: stats.assets, icon: Coins, color: 'from-yellow-500 to-orange-500' },
    { name: lang === 'zh' ? '订单数量' : 'Total Orders', value: stats.orders, icon: ShoppingCart, color: 'from-orange-600 to-red-500' },
    { name: lang === 'zh' ? '短剧数量' : 'Total Dramas', value: stats.dramas, icon: Film, color: 'from-amber-500 to-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-black flex">
      <motion.aside
        initial={{ width: 240 }}
        animate={{ width: isSidebarOpen ? 240 : 0 }}
        className="bg-gray-900 border-r border-orange-500/20 overflow-hidden"
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
                onClick={() => setActiveTab(item.id)}
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

      <main className="flex-1 overflow-auto">
        <header className="bg-gray-900/50 border-b border-orange-500/20 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-gray-400 hover:text-orange-400 transition-colors"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <a href="/" className="flex items-center gap-2 text-gray-400 hover:text-orange-400 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">{lang === 'zh' ? '返回首页' : 'Back to Home'}</span>
            </a>
          </div>
          <h1 className="text-white font-bold text-xl">{lang === 'zh' ? 'FunReelRWA 后台管理' : 'FunReelRWA Admin'}</h1>
          <div className="w-8" />
        </header>

        <div className="p-6">
          {activeTab === 'dashboard' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((card) => (
                  <motion.div
                    key={card.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-900 border border-orange-500/20 rounded-xl p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-lg flex items-center justify-center`}>
                        <card.icon className="w-6 h-6 text-white" />
                      </div>
                      <TrendingUp className="w-5 h-5 text-green-400" />
                    </div>
                    <p className="text-gray-400 text-sm">{card.name}</p>
                    <p className="text-white text-2xl font-bold">{card.value.toLocaleString()}</p>
                  </motion.div>
                ))}
              </div>

              <div className="bg-gray-900 border border-orange-500/20 rounded-xl p-6">
                <h3 className="text-white font-bold mb-4">{lang === 'zh' ? '数据概览' : 'Overview'}</h3>
                <p className="text-gray-400">{lang === 'zh' ? '欢迎使用 FunReelRWA 后台管理系统。点击左侧菜单管理各模块数据。' : 'Welcome to FunReelRWA Admin. Click the left menu to manage modules.'}</p>
              </div>
            </>
          )}

          {activeTab !== 'dashboard' && (
            <div className="bg-gray-900 border border-orange-500/20 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-orange-500/20 flex items-center justify-between">
                <h3 className="text-white font-bold">
                  {navItems.find(i => i.id === activeTab)?.name}
                </h3>
                <span className="text-gray-400 text-sm">共 {data.length} 条记录</span>
              </div>
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="p-8 text-center text-gray-400">{lang === 'zh' ? '加载中...' : 'Loading...'}</div>
                ) : data.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">{lang === 'zh' ? '暂无数据' : 'No Data'}</div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-gray-800">
                      <tr>
                        {Object.keys(data[0]).slice(0, 6).map((key) => (
                          <th key={key} className="px-4 py-3 text-left text-gray-400 text-sm font-medium">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((row, idx) => (
                        <tr key={idx} className="border-t border-gray-800 hover:bg-gray-800/50">
                          {Object.values(row).slice(0, 6).map((val: any, i) => (
                            <td key={i} className="px-4 py-3 text-gray-300 text-sm">
                              {typeof val === 'object' ? JSON.stringify(val).slice(0, 30) : String(val).slice(0, 30)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin;
