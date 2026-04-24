import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Eye } from 'lucide-react';
import { supabase } from '../supabase/client';

interface Order {
  id: string;
  user_id: string;
  asset_id: string;
  amount: number;
  price: number;
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
  users?: { nickname: string };
  assets?: { name: string };
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'cancelled'>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    setLoading(true);
    let query = supabase.from('orders').select('*, users(nickname), assets(name)').order('created_at', { ascending: false });
    if (filter !== 'all') query = query.eq('status', filter);
    const { data } = await query;
    setOrders(data || []);
    setLoading(false);
  };

  const filteredOrders = orders.filter(o =>
    o.users?.nickname?.toLowerCase().includes(search.toLowerCase()) ||
    o.assets?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-500/20 text-yellow-400',
      completed: 'bg-green-500/20 text-green-400',
      cancelled: 'bg-red-500/20 text-red-400',
    };
    const labels = { pending: '待处理', completed: '已完成', cancelled: '已取消' };
    return <span className={`px-2 py-1 rounded text-xs ${styles[status as keyof typeof styles]}`}>{labels[status as keyof typeof labels]}</span>;
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">订单管理</h2>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="搜索用户或资产..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:border-orange-500 outline-none"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:border-orange-500 outline-none"
          >
            <option value="all">全部状态</option>
            <option value="pending">待处理</option>
            <option value="completed">已完成</option>
            <option value="cancelled">已取消</option>
          </select>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-left text-gray-400 text-sm">订单ID</th>
              <th className="px-4 py-3 text-left text-gray-400 text-sm">用户</th>
              <th className="px-4 py-3 text-left text-gray-400 text-sm">资产</th>
              <th className="px-4 py-3 text-left text-gray-400 text-sm">金额</th>
              <th className="px-4 py-3 text-left text-gray-400 text-sm">状态</th>
              <th className="px-4 py-3 text-left text-gray-400 text-sm">时间</th>
              <th className="px-4 py-3 text-left text-gray-400 text-sm">操作</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="p-8 text-center text-gray-400">加载中...</td></tr>
            ) : filteredOrders.length === 0 ? (
              <tr><td colSpan={7} className="p-8 text-center text-gray-400">暂无数据</td></tr>
            ) : (
              filteredOrders.map((order) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-t border-gray-800 hover:bg-gray-800/50"
                >
                  <td className="px-4 py-3 text-gray-300 text-sm">{order.id.slice(0, 8)}</td>
                  <td className="px-4 py-3 text-gray-300 text-sm">{order.users?.nickname || '-'}</td>
                  <td className="px-4 py-3 text-gray-300 text-sm">{order.assets?.name || '-'}</td>
                  <td className="px-4 py-3 text-orange-400 text-sm">${order.total.toLocaleString()}</td>
                  <td className="px-4 py-3">{getStatusBadge(order.status)}</td>
                  <td className="px-4 py-3 text-gray-400 text-sm">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <button className="p-1 text-gray-400 hover:text-orange-400">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
