import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, AlertCircle, CheckCircle } from 'lucide-react';

interface WalletLoginProps {
  onSuccess?: (address: string) => void;
  onError?: (error: string) => void;
}

const WalletLogin: React.FC<WalletLoginProps> = ({ onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState('');

  const connectWallet = async () => {
    setLoading(true);
    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('请安装 MetaMask 或其他以太坊钱包');
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length > 0) {
        setAddress(accounts[0]);
        setConnected(true);
        onSuccess?.(accounts[0]);
      }
    } catch (err: any) {
      onError?.(err.message || '连接失败');
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    setConnected(false);
    setAddress('');
  };

  if (connected) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-green-500/10 border border-green-500/30 rounded-xl p-4"
      >
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <div className="flex-1">
            <p className="text-white font-medium">钱包已连接</p>
            <p className="text-gray-400 text-sm">{address.slice(0, 6)}...{address.slice(-4)}</p>
          </div>
          <button
            onClick={disconnectWallet}
            className="text-red-400 hover:text-red-300 text-sm"
          >
            断开
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.button
      onClick={connectWallet}
      disabled={loading}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50"
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          <Wallet className="w-5 h-5" />
          连接钱包
        </>
      )}
    </motion.button>
  );
};

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default WalletLogin;
