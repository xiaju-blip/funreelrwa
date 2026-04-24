import { supabase } from '../supabase/client';
import type { Tables, TablesInsert } from '../supabase/types';

export type User = Tables<'users'>;
export type Asset = Tables<'assets'>;
export type Drama = Tables<'dramas'>;
export type Episode = Tables<'episodes'>;
export type StakePool = Tables<'stake_pools'>;
export type StakeRecord = Tables<'stake_records'>;
export type Task = Tables<'tasks'>;
export type UserTask = Tables<'user_tasks'>;
export type ShopItem = Tables<'shop_items'>;
export type Order = Tables<'orders'>;
export type Position = Tables<'positions'>;
export type PointsTransaction = Tables<'points_transactions'>;
export type TokenTransaction = Tables<'token_transactions'>;
export type Announcement = Tables<'announcements'>;

export const userApi = {
  async getUser(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  },

  async updateUser(userId: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    return { data, error };
  },

  async getUserStats(userId: string) {
    const { data: positions } = await supabase
      .from('positions')
      .select('amount, cost_price')
      .eq('user_id', userId);
    
    const { data: stakes } = await supabase
      .from('stake_records')
      .select('amount, total_earned')
      .eq('user_id', userId)
      .eq('status', 1);
    
    const totalInvested = positions?.reduce((sum, p) => sum + (p.amount * p.cost_price), 0) || 0;
    const totalStaked = stakes?.reduce((sum, s) => sum + s.amount, 0) || 0;
    const stakeEarnings = stakes?.reduce((sum, s) => sum + (s.total_earned || 0), 0) || 0;
    
    return { totalInvested, totalStaked, stakeEarnings };
  }
};

export const assetApi = {
  async getAssets(status?: number) {
    let query = supabase.from('assets').select('*').order('created_at', { ascending: false });
    if (status !== undefined) query = query.eq('status', status);
    const { data, error } = await query;
    return { data, error };
  },

  async getAssetById(assetId: string) {
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .eq('id', assetId)
      .single();
    return { data, error };
  },

  async createOrder(order: TablesInsert<'orders'>) {
    const { data, error } = await supabase
      .from('orders')
      .insert(order)
      .select()
      .single();
    return { data, error };
  },

  async getOrders(userId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*, asset:assets(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async getPositions(userId: string) {
    const { data, error } = await supabase
      .from('positions')
      .select('*, asset:assets(*)')
      .eq('user_id', userId);
    return { data, error };
  }
};

export const dramaApi = {
  async getDramas(status?: number) {
    let query = supabase.from('dramas').select('*').order('created_at', { ascending: false });
    if (status !== undefined) query = query.eq('status', status);
    const { data, error } = await query;
    return { data, error };
  },

  async getDramaById(dramaId: string) {
    const { data, error } = await supabase
      .from('dramas')
      .select('*')
      .eq('id', dramaId)
      .single();
    return { data, error };
  },

  async getEpisodes(dramaId: string) {
    const { data, error } = await supabase
      .from('episodes')
      .select('*')
      .eq('drama_id', dramaId)
      .order('episode_num', { ascending: true });
    return { data, error };
  },

  async recordWatch(record: TablesInsert<'watch_records'>) {
    const { data, error } = await supabase
      .from('watch_records')
      .insert(record)
      .select()
      .single();
    return { data, error };
  },

  async updateWatchRecord(recordId: string, updates: Partial<Tables<'watch_records'>>) {
    const { data, error } = await supabase
      .from('watch_records')
      .update(updates)
      .eq('id', recordId)
      .select()
      .single();
    return { data, error };
  }
};

export const stakeApi = {
  async getStakePools(status?: number) {
    let query = supabase.from('stake_pools').select('*').order('sort_order', { ascending: true });
    if (status !== undefined) query = query.eq('status', status);
    const { data, error } = await query;
    return { data, error };
  },

  async getStakePoolById(poolId: string) {
    const { data, error } = await supabase
      .from('stake_pools')
      .select('*')
      .eq('id', poolId)
      .single();
    return { data, error };
  },

  async stake(stakeRecord: TablesInsert<'stake_records'>) {
    const { data, error } = await supabase
      .from('stake_records')
      .insert(stakeRecord)
      .select()
      .single();
    return { data, error };
  },

  async unstake(recordId: string) {
    const { data, error } = await supabase
      .from('stake_records')
      .update({ status: 2 })
      .eq('id', recordId)
      .select()
      .single();
    return { data, error };
  },

  async getUserStakes(userId: string) {
    const { data, error } = await supabase
      .from('stake_records')
      .select('*, pool:stake_pools(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  }
};

export const taskApi = {
  async getTasks(status?: number) {
    let query = supabase.from('tasks').select('*').order('sort_order', { ascending: true });
    if (status !== undefined) query = query.eq('status', status);
    const { data, error } = await query;
    return { data, error };
  },

  async getUserTasks(userId: string) {
    const { data, error } = await supabase
      .from('user_tasks')
      .select('*, task:tasks(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async claimTask(userTaskId: string) {
    const { data, error } = await supabase
      .from('user_tasks')
      .update({ status: 2, claimed_at: new Date().toISOString() })
      .eq('id', userTaskId)
      .select()
      .single();
    return { data, error };
  },

  async startTask(userId: string, taskId: string) {
    const { data, error } = await supabase
      .from('user_tasks')
      .insert({
        user_id: userId,
        task_id: taskId,
        status: 0,
        progress: 0
      })
      .select()
      .single();
    return { data, error };
  }
};

export const shopApi = {
  async getShopItems(status?: number) {
    let query = supabase.from('shop_items').select('*').order('sort_order', { ascending: true });
    if (status !== undefined) query = query.eq('status', status);
    const { data, error } = await query;
    return { data, error };
  },

  async exchangeItem(exchange: TablesInsert<'exchange_records'>) {
    const { data, error } = await supabase
      .from('exchange_records')
      .insert(exchange)
      .select()
      .single();
    return { data, error };
  },

  async getExchangeRecords(userId: string) {
    const { data, error } = await supabase
      .from('exchange_records')
      .select('*, item:shop_items(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  }
};

export const transactionApi = {
  async getPointsTransactions(userId: string) {
    const { data, error } = await supabase
      .from('points_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async getTokenTransactions(userId: string) {
    const { data, error } = await supabase
      .from('token_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  }
};

export const announcementApi = {
  async getAnnouncements() {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('status', 1)
      .order('created_at', { ascending: false });
    return { data, error };
  }
};
