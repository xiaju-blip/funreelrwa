export interface Asset {
  id: string;
  name: string;
  cover: string;
  description: string;
  targetAmount: number;
  raisedAmount: number;
  apy: number;
  durationDays: number;
  status: number;
  startTime: string;
  endTime: string;
}

export interface Drama {
  id: string;
  title: string;
  coverImage: string;
  totalEpisodes: number;
  category: string;
  vipLevel: number;
  releaseDate: string;
}

export interface Episode {
  id: string;
  episodeNum: number;
  title: string;
  duration: number;
  videoUrl: string;
}

export interface User {
  id: string;
  nickname: string;
  avatar: string;
  vipLevel: number;
  kycLevel: number;
  inviteCode: string;
  points: number;
  tokenBalance: number;
}

export interface Position {
  id: string;
  assetId: string;
  assetName: string;
  amount: number;
  currentValue: number;
  returnRate: number;
}

export interface Order {
  id: string;
  type: 'buy' | 'sell';
  price: number;
  amount: number;
  status: number;
  createdAt: string;
}

export interface Task {
  id: string;
  name: string;
  type: number;
  description: string;
  rewardPoints: number;
  rewardToken: number;
  progress: number;
  target: number;
  status: number;
  canClaim: boolean;
}

export interface ShopItem {
  id: string;
  name: string;
  type: number;
  points: number;
  tokenAmount?: number;
  vipDays?: number;
  stock: number;
  image: string;
}

export interface StakePool {
  id: string;
  name: string;
  lockDays: number;
  baseApy: number;
  vipBonus: number;
  maxStake: number;
  totalStaked: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  isImportant: boolean;
}

export interface MarketData {
  price: number;
  change24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
}

export interface InviteStats {
  directCount: number;
  indirectCount: number;
  totalReward: number;
}

export interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: number;
  createdAt: string;
}
