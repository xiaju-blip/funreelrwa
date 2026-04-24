import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gift, Ticket, Crown, Zap, Loader2 } from 'lucide-react';
import { supabase } from '../supabase/client';
import { useI18n } from '../hooks/useI18n';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from '../components/LoginModal';
import type { Tables } from '../supabase/types';

interface ShopItem extends Tables<'shop_items'> {}

const Shop: React.FC = () => {
  const { t } = useI18n();
  const { user } = useAuth();
  const [items, setItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    fetchShopItems();
  }, []);

  const fetchShopItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('shop_items')
        .select('*')
        .eq('status', 1)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setItems(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const getItemIcon = (type: number) => {
    switch (type) {
      case 1: return <Ticket className="w-6 h-6" />;
      case 2: return <Crown className="w-6 h-6" />;
      case 3: return <Zap className="w-6 h-6" />;
      default: return <Gift className="w-6 h-6" />;
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

  return (
    <div className="min-h-screen bg-black pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-4">{t('shop.title')}</h1>
          <p className="text-gray-400">{t('shop.subtitle')}</p>
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          </div>
        )}

        {error && (
          <div className="text-center py-20 text-red-400">
            <p>{t('common.error')}: {error}</p>
            <button
              onClick={fetchShopItems}
              className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg"
            >
              {t('common.retry')}
            </button>
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <Gift className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>{t('common.noData')}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.02 }}
              className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden hover:border-orange-500/30 transition-colors"
            >
              <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-orange-500">{getItemIcon(item.type)}</div>
                )}
              </div>
              <div className="p-4">
                <span className="text-xs text-orange-400 font-medium">{getItemTypeName(item.type)}</span>
                <h3 className="text-white font-medium mt-1">{item.name}</h3>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-orange-400 font-bold">{item.points} {t('shop.points')}</span>
                  <button
                    onClick={() => window.location.hash = `#/shop/${item.id}`}
                    className="px-4 py-2 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    {t('shop.exchange')}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
};

export default Shop;
