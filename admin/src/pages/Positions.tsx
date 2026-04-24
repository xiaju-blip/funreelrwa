import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Eye, TrendingUp, BarChart3 } from 'lucide-react';
import { supabase } from '../supabase/client';

interface Position {
  id: string;
  user_id: string;
  asset_id: string;
  amount: number;
  cost_price: number;
  created_at: string;
  users?: { nickname: string };
  assets?: { name: string };
}

export default function Positions() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'records' | 'stats'>('records');

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('positions')
      .select('*, users(nickname), assets(name)')
      .order('created_at', { ascending: false });
    setPositions(data || []);
    setLoading(false);
  };

  const filteredPositions = positions.filter(p =>
    p.users?.nickname?.toLowerCase().includes(search.toLowerCase()) ||
    p.assets?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const totalAmount = positions.reduce((sum, p) => sum + p.amount, 0);
  const totalInvestments = positions.length;
  const uniqueUsers = new Set(positions.map(p => p.user_id)).size;
  const uniqueAssets = new Set(positions.map(p => p.asset_id)).size;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">投资管理</h2>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('records')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'records' 
              ? 'bg-orange-500 text-white' 
              : 'bg-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          投资记录
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'stats' 
              ? 'bg-orange-500 text-white' 
              : 'bg-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          投资概况
        </button>
      </div>

      {activeTab === 'stats' ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-6"
          >
            <div className="text-gray-400 text-sm mb-2">总投资金额</div>
            <div className="text-2xl font-bold text-orange-400">{totalAmount.toLocaleString()}</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-6"
          >
            <div className="text-gray-400 text-sm mb-2">投资笔数</div>
            <div className="text-2xl font-bold text-white">{totalInvestments}</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-6"
          >
            <div className="text-gray-400 text-sm mb-2">投资用户数</div>
            <div className="text-2xl font-bold text-white">{uniqueUsers}</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-6"
          >
            <div className="text-gray-400 text-sm mb-2">投资资产数</div>
            <div className="text-2xl font-bold text-white">{uniqueAssets}</div>
          </motion.div>
        </div>
      ) : (
        <>
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="搜索用户或资产..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:border-orange-500 outline-none"
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredPositions.length === 0 ? (
            <div className="text-center py-20 text-gray-500">暂无投资记录</div>
          ) : (
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="px-4 py-3 text-left text-gray-400 text-sm font-medium">用户</th>
                    <th className="px-4 py-3 text-left text-gray-400 text-sm font-medium">资产</th>
                    <th className="px-4 py-3 text-left text-gray-400 text-sm font-medium">投资金额</th>
                    <th className="px-4 py-3 text-left text-gray-400 text-sm font-medium">单价</th>
                    <th className="px-4 py-3 text-left text-gray-400 text-sm font-medium">投资时间</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPositions.map((position) => (
                    <motion.tr
                      key={position.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-gray-800/50 hover:bg-gray-800/30"
                    >
                      <td className="px-4 py-3 text-white">{position.users?.nickname || position.user_id}</td>
                      <td className="px-4 py-3 text-white">{position.assets?.name || position.asset_id}</td>
                      <td className="px-4 py-3 text-orange-400">{position.amount}</td>
                      <td className="px-4 py-3 text-gray-300">{position.cost_price}</td>
                      <td className="px-4 py-3 text-gray-400 text-sm">{new Date(position.created_at).toLocaleString()}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}