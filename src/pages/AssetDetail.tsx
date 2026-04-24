import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, Clock, Users, DollarSign, Calendar, Target } from 'lucide-react';
import { supabase } from '../supabase/client';
import { useI18n } from '../hooks/useI18n';
import { useAuth } from '../contexts/AuthContext';

interface Asset {
  id: string;
  name: string;
  description: string | null;
  cover: string | null;
  target_amount: number;
  raised_amount: number | null;
  apy: number | null;
  duration_days: number | null;
  status: number | null;
  start_time: string | null;
  end_time: string | null;
  created_at: string | null;
}

export default function AssetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);
  const [investAmount, setInvestAmount] = useState('');
  const [investing, setInvesting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchAsset();
    }
  }, [id]);

  const fetchAsset = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setAsset(data);
    } catch (err) {
      console.error('Failed to fetch asset:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInvest = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    const amount = parseFloat(investAmount);
    if (!amount || amount <= 0) {
      return;
    }

    setInvesting(true);
    try {
      const { error } = await supabase.from('positions').insert({
        user_id: user.id,
        asset_id: id,
        amount: amount,
        cost_price: 1,
      });

      if (error) throw error;
      alert(t('assets.investSuccess') || '投资成功');
      setInvestAmount('');
      fetchAsset();
    } catch (err) {
      console.error('Investment failed:', err);
      alert(t('common.error'));
    } finally {
      setInvesting(false);
    }
  };

  const formatAmount = (amount: number | null) => {
    if (amount === null || amount === undefined) return '0';
    return amount.toLocaleString();
  };

  const progress = asset ? ((asset.raised_amount || 0) / asset.target_amount) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">{t('assets.notFound') || '资产不存在'}</p>
          <a href="/assets" className="text-orange-400 hover:text-orange-300">
            {t('common.back')}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-6"
        >
          <a href="/assets" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </a>
          <h1 className="text-2xl font-bold text-white">{asset.name}</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-2xl overflow-hidden mb-6"
        >
          <img
            src={asset.cover || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800'}
            alt={asset.name}
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          <div className="absolute top-4 right-4 bg-orange-500 text-black text-sm font-bold px-3 py-1 rounded-full">
            APY {asset.apy || 0}%
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <Target className="w-6 h-6 text-orange-400 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">{t('assets.target')}</p>
              <p className="text-xl font-bold text-white">${formatAmount(asset.target_amount)}</p>
            </div>
            <div className="text-center">
              <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">{t('assets.raised')}</p>
              <p className="text-xl font-bold text-white">${formatAmount(asset.raised_amount)}</p>
            </div>
            <div className="text-center">
              <Calendar className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">{t('assets.duration')}</p>
              <p className="text-xl font-bold text-white">{asset.duration_days || 0}{t('common.days')}</p>
            </div>
            <div className="text-center">
              <DollarSign className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">{t('assets.apy')}</p>
              <p className="text-xl font-bold text-white">{asset.apy || 0}%</p>
            </div>
          </div>

          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-gray-400">{t('assets.progress')}</span>
            <span className="text-orange-400 font-medium">{progress.toFixed(1)}%</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6"
        >
          <h3 className="text-white font-bold mb-4">{t('assets.description')}</h3>
          <p className="text-gray-400">{asset.description || t('common.noData')}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-6"
        >
          <h3 className="text-white font-bold mb-4">{t('assets.invest')}</h3>
          <div className="flex gap-4">
            <input
              type="number"
              value={investAmount}
              onChange={(e) => setInvestAmount(e.target.value)}
              placeholder={t('assets.amountPlaceholder')}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
            />
            <button
              onClick={handleInvest}
              disabled={investing || !investAmount}
              className="px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              {investing ? t('common.loading') : t('assets.investNow')}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}