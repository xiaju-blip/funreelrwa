import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Crown, Check, Loader2, DollarSign, Coins, ArrowLeft } from 'lucide-react';
import { supabase } from '../supabase/client';
import { useI18n } from '../hooks/useI18n';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from '../components/LoginModal';

interface VipPackage {
  id: string;
  vip_level: number;
  name: string;
  duration_days: number;
  price_cny: number;
  price_usdt: number;
  benefits: string;
}

export default function VipPurchase() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [packages, setPackages] = useState<VipPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<VipPackage | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cny' | 'usdt'>('cny');
  const [purchasing, setPurchasing] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('vip_packages')
        .select('*')
        .eq('status', 1)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setPackages(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    if (!selectedPackage) return;

    setPurchasing(true);
    try {
      const { data: orderData, error: orderError } = await supabase
        .from('vip_orders')
        .insert({
          user_id: user.id,
          package_id: selectedPackage.id,
          payment_method: paymentMethod,
          amount_cny: paymentMethod === 'cny' ? selectedPackage.price_cny : null,
          amount_usdt: paymentMethod === 'usdt' ? selectedPackage.price_usdt : null,
          status: 0,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      if (paymentMethod === 'cny') {
        alert(`订单已创建!\n金额: ¥${selectedPackage.price_cny}\n请完成支付后联系客服开通VIP`);
      } else {
        alert(`USDT支付订单已创建!\n金额: ${selectedPackage.price_usdt} USDT\n请向以下地址转账: 0x1234...5678\n转账后联系客服确认`);
      }

      setSuccess(true);
    } catch (err) {
      console.error(err);
      alert('创建订单失败，请稍后重试');
    } finally {
      setPurchasing(false);
    }
  };

  const benefitsList = [
    { icon: Check, text: '专属VIP身份标识' },
    { icon: Check, text: '观看最新短剧' },
    { icon: Check, text: '专属客服支持' },
    { icon: Check, text: '购物更多折扣' },
    { icon: Check, text: '优先参与活动' },
  ];

  return (
    <div className="min-h-screen bg-black pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <a href="/profile" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </a>
          <h1 className="text-2xl font-bold text-white">{t('vip.purchase')}</h1>
        </motion.div>

        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          </div>
        )}

        {!loading && success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-green-500/20 border border-green-500/30 rounded-2xl p-6 text-center"
          >
            <Crown className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">订单已创建</h3>
            <p className="text-gray-400 mb-4">
              请完成支付后联系客服开通VIP
            </p>
            <button
              onClick={() => {
                setSuccess(false);
                setSelectedPackage(null);
              }}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg"
            >
              返回继续购买
            </button>
          </motion.div>
        )}

        {!loading && !success && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {packages.map((pkg, index) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedPackage(pkg)}
                  className={`bg-gray-900 border rounded-2xl p-6 cursor-pointer transition-all ${
                    selectedPackage?.id === pkg.id
                      ? 'border-orange-500 ring-2 ring-orange-500/30'
                      : 'border-gray-800 hover:border-orange-500/50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Crown className="w-6 h-6 text-yellow-500" />
                    <h3 className="text-lg font-bold text-white">{pkg.name}</h3>
                  </div>
                  
                  <div className="text-3xl font-bold text-white mb-4">
                    {pkg.duration_days}天
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">¥CNY</span>
                      <span className="text-green-400 font-bold">¥{pkg.price_cny}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">USDT</span>
                      <span className="text-blue-400 font-bold">${pkg.price_usdt}</span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500">
                    VIP{pkg.vip_level}专属权益
                  </div>
                </motion.div>
              ))}
            </div>

            {selectedPackage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6"
              >
                <h3 className="text-lg font-bold text-white mb-4">选择支付方式</h3>
                
                <div className="flex gap-4 mb-6">
                  <button
                    onClick={() => setPaymentMethod('cny')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border ${
                      paymentMethod === 'cny'
                        ? 'border-green-500 bg-green-500/10 text-green-400'
                        : 'border-gray-700 text-gray-400'
                    }`}
                  >
                    <DollarSign className="w-5 h-5" />
                    微信/支付宝 (¥CNY)
                  </button>
                  <button
                    onClick={() => setPaymentMethod('usdt')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border ${
                      paymentMethod === 'usdt'
                        ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                        : 'border-gray-700 text-gray-400'
                    }`}
                  >
                    <Coins className="w-5 h-5" />
                    USDT
                  </button>
                </div>

                <div className="bg-gray-800 rounded-lg p-4 mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">套餐</span>
                    <span className="text-white">{selectedPackage.name}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">时长</span>
                    <span className="text-white">{selectedPackage.duration_days}天</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold pt-2 border-t border-gray-700">
                    <span className="text-gray-400">应付</span>
                    <span className="text-orange-400">
                      {paymentMethod === 'cny'
                        ? `¥${selectedPackage.price_cny}`
                        : `$${selectedPackage.price_usdt} USDT`}
                    </span>
                  </div>
                </div>

                <h4 className="text-white font-medium mb-3">权益说明</h4>
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {benefitsList.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-2 text-gray-400 text-sm">
                      <Check className="w-4 h-4 text-green-400" />
                      <span>{benefit.text}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handlePurchase}
                  disabled={purchasing}
                  className="w-full py-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 disabled:opacity-50"
                >
                  {purchasing ? (
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  ) : (
                    `立即购买 ${paymentMethod === 'cny' ? `¥${selectedPackage.price_cny}` : `$${selectedPackage.price_usdt} USDT`}`
                  )}
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
}