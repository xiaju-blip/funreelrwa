import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Coins, ShoppingCart, Film, TrendingUp } from 'lucide-react';
import { supabase } from '../supabase/client';

interface Stats {
  users: number;
  assets: number;
  orders: number;
  dramas: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({ users: 0, assets: 0, orders: 0, dramas: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [{ count: users }, { count: assets }, { count: orders }, { count: dramas }] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('assets').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('dramas').select('*', { count: 'exact', head: true }),
      ]);
      setStats({
        users: users || 0,
        assets: assets || 0,
        orders: orders || 0,
        dramas: dramas || 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { name: '总用户数', value: stats.users, icon: Users, color: 'from-orange-500 to-orange-600' },
    { name: '资产数量', value: stats.assets, icon: Coins, color: 'from-yellow-500 to-orange-500' },
    { name: '订单数量', value: stats.orders, icon: ShoppingCart, color: 'from-orange-600 to-red-500' },
    { name: '短剧数量', value: stats.dramas, icon: Film, color: 'from-amber-500 to-orange-500' },
  ];

  return (
    <div className="p-6">
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
            <p className="text-white text-2xl font-bold">
              {loading ? '-' : card.value.toLocaleString()}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="bg-gray-900 border border-orange-500/20 rounded-xl p-6">
        <h3 className="text-white font-bold mb-4">数据概览</h3>
        <p className="text-gray-400">欢迎使用 FunReelRWA 后台管理系统。</p>
      </div>
    </div>
  );
}
