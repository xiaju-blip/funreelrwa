import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Bell, CheckCircle, Info, AlertTriangle, Gift, TrendingUp } from 'lucide-react';
import { useI18n } from '../hooks/useI18n';

interface Notification {
  id: string;
  type: 'system' | 'asset' | 'task' | 'reward';
  title: string;
  content: string;
  time: string;
  read: boolean;
}

export default function Notifications() {
  const { t, lang } = useI18n();
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'system',
      title: lang === 'zh' ? '系统维护通知' : 'System Maintenance',
      content: lang === 'zh' ? '平台将于今晚 02:00-04:00 进行系统维护' : 'Platform maintenance scheduled for 02:00-04:00 tonight',
      time: '10分钟前',
      read: false
    },
    {
      id: '2',
      type: 'asset',
      title: lang === 'zh' ? '资产收益到账' : 'Asset Income Received',
      content: lang === 'zh' ? '您投资的《霸道总裁爱上我》本期收益已到账' : 'Income from "CEO Falls in Love" has been credited',
      time: '2小时前',
      read: false
    },
    {
      id: '3',
      type: 'task',
      title: lang === 'zh' ? '任务完成' : 'Task Completed',
      content: lang === 'zh' ? '每日签到任务已完成，获得 10 积分' : 'Daily check-in completed, earned 10 points',
      time: '昨天',
      read: true
    },
    {
      id: '4',
      type: 'reward',
      title: lang === 'zh' ? '邀请奖励' : 'Invitation Reward',
      content: lang === 'zh' ? '您邀请的好友完成首笔投资，获得 50 REEL 奖励' : 'Your invited friend made first investment, earned 50 REEL',
      time: '3天前',
      read: true
    }
  ]);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const filteredNotifications = activeTab === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'system': return <Info className="w-5 h-5 text-blue-400" />;
      case 'asset': return <TrendingUp className="w-5 h-5 text-green-400" />;
      case 'task': return <CheckCircle className="w-5 h-5 text-orange-400" />;
      case 'reward': return <Gift className="w-5 h-5 text-purple-400" />;
      default: return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-black pt-20 pb-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-6"
        >
          <a href="/" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </a>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">
              {lang === 'zh' ? '通知中心' : 'Notifications'}
            </h1>
            <p className="text-gray-400 text-sm">
              {unreadCount > 0
                ? (lang === 'zh' ? `您有 ${unreadCount} 条未读通知` : `You have ${unreadCount} unread notifications`)
                : (lang === 'zh' ? '暂无新通知' : 'No new notifications')}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 text-sm text-orange-400 hover:text-orange-300 transition-colors"
            >
              {lang === 'zh' ? '全部已读' : 'Mark all read'}
            </button>
          )}
        </motion.div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'all'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {lang === 'zh' ? '全部' : 'All'}
          </button>
          <button
            onClick={() => setActiveTab('unread')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'unread'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {lang === 'zh' ? '未读' : 'Unread'}
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        <div className="space-y-3">
          <AnimatePresence>
            {filteredNotifications.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <Bell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">
                  {activeTab === 'unread'
                    ? (lang === 'zh' ? '暂无未读通知' : 'No unread notifications')
                    : (lang === 'zh' ? '暂无通知' : 'No notifications')}
                </p>
              </motion.div>
            ) : (
              filteredNotifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onClick={() => markAsRead(notification.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    notification.read
                      ? 'bg-gray-900 border-gray-800'
                      : 'bg-gray-800/50 border-orange-500/30'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      notification.read ? 'bg-gray-800' : 'bg-gray-700'
                    }`}>
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-medium">{notification.title}</h3>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm mt-1">{notification.content}</p>
                      <p className="text-gray-500 text-xs mt-2">{notification.time}</p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
