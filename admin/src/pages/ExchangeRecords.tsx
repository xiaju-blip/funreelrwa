import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Gift } from 'lucide-react';
import { supabase } from '../supabase/client';

interface ExchangeRecord {
  id: string;
  user_id: string;
  item_id: string;
  points_used: number;
  quantity: number;
  status: number;
  created_at: string;
  users?: { nickname: string };
  shop_items?: { name: string };
}

export default function ExchangeRecords() {
  const [records, setRecords] = useState<ExchangeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('exchange_records')
      .select('*, users(nickname), shop_items(name)')
      .order('created_at', { ascending: false });
    setRecords(data || []);
    setLoading(false);
  };

  const filteredRecords = records.filter(r =>
    r.users?.nickname?.toLowerCase().includes(search.toLowerCase()) ||
    r.shop_items?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">兑换记录</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="搜索用户..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:border-orange-500 outline-none"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="text-center py-20 text-gray-500">暂无兑换记录</div>
      ) : (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="px-4 py-3 text-left text-gray-400 text-sm font-medium">用户</th>
                <th className="px-4 py-3 text-left text-gray-400 text-sm font-medium">商品</th>
                <th className="px-4 py-3 text-left text-gray-400 text-sm font-medium">消耗积分</th>
                <th className="px-4 py-3 text-left text-gray-400 text-sm font-medium">数量</th>
                <th className="px-4 py-3 text-left text-gray-400 text-sm font-medium">状态</th>
                <th className="px-4 py-3 text-left text-gray-400 text-sm font-medium">时间</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <motion.tr
                  key={record.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-gray-800/50 hover:bg-gray-800/30"
                >
                  <td className="px-4 py-3 text-white">{record.users?.nickname || record.user_id}</td>
                  <td className="px-4 py-3 text-white">{record.shop_items?.name || record.item_id}</td>
                  <td className="px-4 py-3 text-orange-400">{record.points_used}</td>
                  <td className="px-4 py-3 text-gray-300">{record.quantity}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${record.status === 1 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {record.status === 1 ? '已完成' : '待处理'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-sm">{new Date(record.created_at).toLocaleString()}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}