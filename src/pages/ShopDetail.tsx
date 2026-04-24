import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Gift, Ticket, Crown, Zap, Loader2, Check } from 'lucide-react';
import { supabase } from '../supabase/client';
import { useI18n } from '../hooks/useI18n';
import { useAuth } from '../contexts/AuthContext';

interface ShopItem {
  id: string;
  name: string;
  type: number;
  points: number;
  token_amount: number | null;
  vip_days: number | null;
  image: string | null;
  stock: number | null;
  daily_limit: number | null;
}

export default function ShopDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useI18n();
  const { user } = useAuth();
  const [item, setItem] = useState<ShopItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [exchanging, setExchanging] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      fetchItem();
    }
  }, [id]);

  const fetchItem = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('shop_items')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setItem(data);
    } catch (err) {
      console.error('Failed to fetch item:', err);
    } finally {
      setLoading(false);
    }
  };

  const getItemIcon = (type: number) => {
    switch (type) {
      case 1: return <Ticket className="w-12 h-12" />;
      case 2: return <Crown className="w-12 h-12" />;
      case 3: return <Zap className="w-12 h-12" />;
      default: return <Gift className="w-12 h-12" />;
    }
  };

  const getItemTypeName = (type: number) => {
    switch (type) {
      case 1: return t('shop.ticket');
      case 2: return t('shop.vip');
      case 3: return t('shop.prop');
      default: return t('shop.item');
    }
  };

  const handleExchange = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setExchanging(true);
    try {
      const { error } = await supabase.from('exchange_records').insert({
        user_id: user.id,
        item_id: id,
        points_used: item?.points || 0,
        quantity: 1,
        status: 0,
      });

      if (error) throw error;
      setSuccess(true);
    } catch (err) {
      console.error('Exchange failed:', err);
      alert(t('common.error'));
    } finally {
      setExchanging(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">{t('shop.notFound') || '商品不存在'}</p>
          <a href="/shop" className="text-orange-400 hover:text-orange-300">
            {t('common.back')}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-20 pb-12">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-6"
        >
          <a href="/shop" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </a>
        </motion.div>

        {success ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-green-500/20 border border-green-500/30 rounded-2xl p-8 text-center"
          >
            <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">{t('shop.exchangeSuccess') || '兑换成功'}</h3>
            <p className="text-gray-400 mb-4">{item.name}</p>
            <a
              href="/shop"
              className="inline-block px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              {t('common.back')}
            </a>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden"
          >
            <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              {item.image ? (
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="text-orange-500">{getItemIcon(item.type)}</div>
              )}
            </div>

            <div className="p-6">
              <span className="text-sm text-orange-400 font-medium">
                {getItemTypeName(item.type)}
              </span>
              <h1 className="text-2xl font-bold text-white mt-1 mb-2">{item.name}</h1>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400">{t('shop.points')}</span>
                  <span className="text-orange-400 font-bold">{item.points}</span>
                </div>
                {item.token_amount && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-800">
                    <span className="text-gray-400">{t('common.token')}</span>
                    <span className="text-white font-bold">{item.token_amount} IPT</span>
                  </div>
                )}
                {item.vip_days && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-800">
                    <span className="text-gray-400">{t('shop.vip')}</span>
                    <span className="text-white font-bold">{item.vip_days} {t('common.days')}</span>
                  </div>
                )}
                {item.stock !== null && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-800">
                    <span className="text-gray-400">库存</span>
                    <span className="text-white font-bold">{item.stock}</span>
                  </div>
                )}
              </div>

              <button
                onClick={handleExchange}
                disabled={exchanging}
                className="w-full py-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
              >
                {exchanging ? t('common.loading') : `${item.points} ${t('shop.points')} ${t('shop.exchange')}`}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}