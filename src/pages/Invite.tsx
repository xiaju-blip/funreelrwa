import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Copy, Users, Gift, TrendingUp } from 'lucide-react';
import { supabase } from '../supabase/client';
import { useI18n } from '../hooks/useI18n';
import { useAuth } from '../contexts/AuthContext';

interface InvitedUser {
  id: string;
  nickname: string;
  created_at: string;
  points: number;
  token_balance: number;
  vip_level: number;
}

export default function Invite() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [invitedUsers, setInvitedUsers] = useState<InvitedUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.inviteCode) {
      fetchInvitedUsers();
    }
  }, [user?.inviteCode]);

  const fetchInvitedUsers = async () => {
    if (!user?.id) return;
    setLoading(true);
    const { data } = await supabase
      .from('users')
      .select('id, nickname, created_at, points, token_balance, vip_level')
      .eq('inviter_id', user.id)
      .order('created_at', { ascending: false });
    setInvitedUsers(data || []);
    setLoading(false);
  };

  const copyCode = () => {
    if (user?.inviteCode) {
      navigator.clipboard.writeText(user.inviteCode);
      alert(t('invite.copied'));
    }
  };

  const totalPoints = invitedUsers.reduce((sum, u) => sum + (u.points || 0), 0);
  const totalTokens = invitedUsers.reduce((sum, u) => sum + Number(u.token_balance || 0), 0);
  const invitedCount = invitedUsers.length;

  return (
    <div className="min-h-screen bg-black pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-6"
        >
          <a href="/profile" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </a>
          <h1 className="text-2xl font-bold text-white">{t('invite.title')}</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/30 rounded-2xl p-6 mb-6"
        >
          <div className="text-center mb-6">
            <p className="text-gray-400 mb-2">{t('invite.myCode')}</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl font-bold text-white tracking-wider">{user?.inviteCode || 'N/A'}</span>
              <button
                onClick={copyCode}
                className="p-2 bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
              >
                <Copy className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-black/30 rounded-xl p-4 text-center">
              <Users className="w-6 h-6 text-orange-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{loading ? '-' : invitedCount}</p>
              <p className="text-gray-400 text-sm">{t('invite.invited')}</p>
            </div>
            <div className="bg-black/30 rounded-xl p-4 text-center">
              <Gift className="w-6 h-6 text-orange-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{loading ? '-' : totalPoints.toLocaleString()}</p>
              <p className="text-gray-400 text-sm">{t('invite.points')}</p>
            </div>
            <div className="bg-black/30 rounded-xl p-4 text-center">
              <TrendingUp className="w-6 h-6 text-orange-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{loading ? '-' : totalTokens.toFixed(2)}</p>
              <p className="text-gray-400 text-sm">{t('invite.tokens')}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-6"
        >
          <h3 className="text-white font-bold mb-4">邀请的用户列表</h3>
          {loading ? (
            <div className="text-gray-400 text-center py-4">加载中...</div>
          ) : invitedUsers.length === 0 ? (
            <div className="text-gray-400 text-center py-4">暂无邀请用户</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-gray-400 text-sm">用户</th>
                    <th className="px-4 py-3 text-left text-gray-400 text-sm">注册时间</th>
                    <th className="px-4 py-3 text-left text-gray-400 text-sm">积分</th>
                    <th className="px-4 py-3 text-left text-gray-400 text-sm">代币</th>
                    <th className="px-4 py-3 text-left text-gray-400 text-sm">VIP等级</th>
                  </tr>
                </thead>
                <tbody>
                  {invitedUsers.map((u) => (
                    <tr key={u.id} className="border-t border-gray-800">
                      <td className="px-4 py-3 text-white">{u.nickname}</td>
                      <td className="px-4 py-3 text-gray-400 text-sm">
                        {u.created_at ? new Date(u.created_at).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-4 py-3 text-orange-400">{u.points || 0}</td>
                      <td className="px-4 py-3 text-green-400">{Number(u.token_balance || 0).toFixed(2)}</td>
                      <td className="px-4 py-3">
                        {u.vip_level > 0 ? (
                          <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs">VIP{u.vip_level}</span>
                        ) : (
                          <span className="text-gray-500 text-xs">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mt-6"
        >
          <h3 className="text-white font-bold mb-4">{t('invite.rules')}</h3>
          <div className="space-y-3 text-gray-400">
            <p>1. {t('invite.rule1')}</p>
            <p>2. {t('invite.rule2')}</p>
            <p>3. {t('invite.rule3')}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
