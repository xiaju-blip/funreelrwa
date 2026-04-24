import type { Asset, Drama, Episode, User, Position, Order, Task, ShopItem, StakePool, Announcement, MarketData, InviteStats, Transaction } from '../types';

export const mockAssets: Asset[] = [
  {
    id: '1',
    name: '《都市奇缘》版权份额',
    cover: 'https://images.unsplash.com/photo-1536440136628-849c177e76fc?w=800&q=80',
    description: '一部讲述都市爱情的爆款短剧，预计播放量破亿',
    targetAmount: 500000,
    raisedAmount: 425000,
    apy: 18.5,
    durationDays: 90,
    status: 1,
    startTime: '2026-04-01',
    endTime: '2026-06-30'
  },
  {
    id: '2',
    name: '《逆袭人生》版权份额',
    cover: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80',
    description: '励志题材短剧，讲述普通人逆袭成功的故事',
    targetAmount: 300000,
    raisedAmount: 180000,
    apy: 22.0,
    durationDays: 60,
    status: 1,
    startTime: '2026-04-10',
    endTime: '2026-06-10'
  },
  {
    id: '3',
    name: '《豪门恩怨》版权份额',
    cover: 'https://images.unsplash.com/photo-1594909122849-11daa2a0cf2c?w=800&q=80',
    description: '豪门家族恩怨情仇，剧情跌宕起伏',
    targetAmount: 800000,
    raisedAmount: 800000,
    apy: 15.0,
    durationDays: 120,
    status: 2,
    startTime: '2026-03-01',
    endTime: '2026-05-01'
  },
  {
    id: '4',
    name: '《校园风云》版权份额',
    cover: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
    description: '青春校园题材，回忆美好学生时代',
    targetAmount: 200000,
    raisedAmount: 65000,
    apy: 25.0,
    durationDays: 45,
    status: 1,
    startTime: '2026-04-15',
    endTime: '2026-05-30'
  }
];

export const mockDramas: Drama[] = [
  {
    id: '1',
    title: '都市奇缘',
    coverImage: 'https://images.unsplash.com/photo-1536440136628-849c177e76fc?w=800&q=80',
    totalEpisodes: 80,
    category: '爱情',
    vipLevel: 0,
    releaseDate: '2026-04-01'
  },
  {
    id: '2',
    title: '逆袭人生',
    coverImage: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80',
    totalEpisodes: 60,
    category: '励志',
    vipLevel: 1,
    releaseDate: '2026-04-10'
  },
  {
    id: '3',
    title: '豪门恩怨',
    coverImage: 'https://images.unsplash.com/photo-1594909122849-11daa2a0cf2c?w=800&q=80',
    totalEpisodes: 100,
    category: '家族',
    vipLevel: 2,
    releaseDate: '2026-03-01'
  },
  {
    id: '4',
    title: '校园风云',
    coverImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
    totalEpisodes: 40,
    category: '青春',
    vipLevel: 0,
    releaseDate: '2026-04-15'
  },
  {
    id: '5',
    title: '商战风云',
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
    totalEpisodes: 75,
    category: '商战',
    vipLevel: 1,
    releaseDate: '2026-04-20'
  },
  {
    id: '6',
    title: '古装传奇',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80',
    totalEpisodes: 90,
    category: '古装',
    vipLevel: 2,
    releaseDate: '2026-03-15'
  }
];

export const mockEpisodes: Episode[] = [
  { id: '1', episodeNum: 1, title: '第1集：初遇', duration: 180, videoUrl: '' },
  { id: '2', episodeNum: 2, title: '第2集：误会', duration: 185, videoUrl: '' },
  { id: '3', episodeNum: 3, title: '第3集：相识', duration: 190, videoUrl: '' },
  { id: '4', episodeNum: 4, title: '第4集：心动', duration: 175, videoUrl: '' },
  { id: '5', episodeNum: 5, title: '第5集：表白', duration: 200, videoUrl: '' }
];

export const mockUser: User = {
  id: '1',
  nickname: 'CryptoInvestor',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
  vipLevel: 2,
  kycLevel: 2,
  inviteCode: 'FUN2026',
  points: 12580,
  tokenBalance: 2580.5
};

export const mockPositions: Position[] = [
  {
    id: '1',
    assetId: '1',
    assetName: '《都市奇缘》版权份额',
    amount: 5000,
    currentValue: 5925,
    returnRate: 18.5
  },
  {
    id: '2',
    assetId: '3',
    assetName: '《豪门恩怨》版权份额',
    amount: 3000,
    currentValue: 3450,
    returnRate: 15.0
  }
];

export const mockOrders: Order[] = [
  { id: '1', type: 'buy', price: 1.25, amount: 1000, status: 1, createdAt: '2026-04-18 10:30' },
  { id: '2', type: 'sell', price: 1.35, amount: 500, status: 2, createdAt: '2026-04-17 15:20' },
  { id: '3', type: 'buy', price: 1.20, amount: 2000, status: 1, createdAt: '2026-04-16 09:15' }
];

export const mockTasks: Task[] = [
  { id: '1', name: '每日签到', type: 2, description: '完成每日签到', rewardPoints: 10, rewardToken: 0, progress: 0, target: 1, status: 0, canClaim: true },
  { id: '2', name: '观看10分钟', type: 2, description: '观看短剧累计10分钟', rewardPoints: 20, rewardToken: 0, progress: 8, target: 10, status: 0, canClaim: false },
  { id: '3', name: '观看30分钟', type: 2, description: '观看短剧累计30分钟', rewardPoints: 40, rewardToken: 0, progress: 8, target: 30, status: 0, canClaim: false },
  { id: '4', name: '点赞剧集', type: 2, description: '给任意剧集点赞', rewardPoints: 5, rewardToken: 0, progress: 0, target: 1, status: 0, canClaim: true },
  { id: '5', name: '分享剧集', type: 2, description: '分享任意剧集', rewardPoints: 15, rewardToken: 0, progress: 1, target: 1, status: 2, canClaim: false }
];

export const mockShopItems: ShopItem[] = [
  { id: '1', name: 'REEL代币', type: 1, points: 1000, tokenAmount: 1, stock: -1, image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&q=80' },
  { id: '2', name: 'VIP1体验卡(7天)', type: 2, points: 500, vipDays: 7, stock: 100, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80' },
  { id: '3', name: '补签卡', type: 3, points: 200, stock: 50, image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed8?w=400&q=80' },
  { id: '4', name: '抽奖券', type: 5, points: 500, stock: 200, image: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=400&q=80' },
  { id: '5', name: '双倍积分卡', type: 6, points: 300, stock: 100, image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80' }
];

export const mockStakePools: StakePool[] = [
  { id: '1', name: '活期池', lockDays: 0, baseApy: 5, vipBonus: 3, maxStake: 0, totalStaked: 2500000 },
  { id: '2', name: '30天池', lockDays: 30, baseApy: 8, vipBonus: 0.5, maxStake: 5000000, totalStaked: 3200000 },
  { id: '3', name: '90天池', lockDays: 90, baseApy: 12, vipBonus: 1, maxStake: 10000000, totalStaked: 5800000 },
  { id: '4', name: '180天池', lockDays: 180, baseApy: 18, vipBonus: 2, maxStake: 20000000, totalStaked: 8900000 }
];

export const mockAnnouncements: Announcement[] = [
  { id: '1', title: 'FunReelRWA平台正式上线', content: '...', createdAt: '2026-04-18', isImportant: true },
  { id: '2', title: '新剧集《都市奇缘》上线', content: '...', createdAt: '2026-04-17', isImportant: false },
  { id: '3', title: 'VIP会员权益升级公告', content: '...', createdAt: '2026-04-15', isImportant: false }
];

export const mockMarketData: MarketData = {
  price: 1.28,
  change24h: 5.2,
  volume24h: 1250000,
  high24h: 1.35,
  low24h: 1.20
};

export const mockInviteStats: InviteStats = {
  directCount: 12,
  indirectCount: 8,
  totalReward: 2580
};

export const mockTransactions: Transaction[] = [
  { id: '1', type: '积分兑换', amount: 10, status: 1, createdAt: '2026-04-18 10:30' },
  { id: '2', type: 'VIP购买', amount: 300, status: 1, createdAt: '2026-04-17 15:20' },
  { id: '3', type: '质押收益', amount: 25.5, status: 1, createdAt: '2026-04-16 00:00' }
];

export const platformStats = {
  totalUsers: 125890,
  totalAssets: 28500000,
  totalDividends: 1250000,
  dailyActiveUsers: 25890
};
