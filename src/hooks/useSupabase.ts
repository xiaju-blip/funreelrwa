import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase/client';
import type { Tables } from '../supabase/types';

type User = Tables<'users'>;
type Asset = Tables<'assets'>;
type Drama = Tables<'dramas'>;
type StakePool = Tables<'stake_pools'>;
type Task = Tables<'tasks'>;
type ShopItem = Tables<'shop_items'>;

interface UseSupabaseReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useUser(userId?: string): UseSupabaseReturn<User> {
  const [data, setData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const { data: user, error: err } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      if (err) throw err;
      setData(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取用户失败');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { data, loading, error, refetch: fetchUser };
}

export function useAssets(): UseSupabaseReturn<Asset[]> {
  const [data, setData] = useState<Asset[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssets = useCallback(async () => {
    try {
      setLoading(true);
      const { data: assets, error: err } = await supabase
        .from('assets')
        .select('*')
        .order('created_at', { ascending: false });
      if (err) throw err;
      setData(assets);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取资产失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  return { data, loading, error, refetch: fetchAssets };
}

export function useDramas(): UseSupabaseReturn<Drama[]> {
  const [data, setData] = useState<Drama[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDramas = useCallback(async () => {
    try {
      setLoading(true);
      const { data: dramas, error: err } = await supabase
        .from('dramas')
        .select('*')
        .order('created_at', { ascending: false });
      if (err) throw err;
      setData(dramas);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取短剧失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDramas();
  }, [fetchDramas]);

  return { data, loading, error, refetch: fetchDramas };
}

export function useStakePools(): UseSupabaseReturn<StakePool[]> {
  const [data, setData] = useState<StakePool[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPools = useCallback(async () => {
    try {
      setLoading(true);
      const { data: pools, error: err } = await supabase
        .from('stake_pools')
        .select('*')
        .eq('status', 1)
        .order('sort_order', { ascending: true });
      if (err) throw err;
      setData(pools);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取质押池失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPools();
  }, [fetchPools]);

  return { data, loading, error, refetch: fetchPools };
}

export function useTasks(): UseSupabaseReturn<Task[]> {
  const [data, setData] = useState<Task[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const { data: tasks, error: err } = await supabase
        .from('tasks')
        .select('*')
        .eq('status', 1)
        .order('sort_order', { ascending: true });
      if (err) throw err;
      setData(tasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取任务失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return { data, loading, error, refetch: fetchTasks };
}

export function useShopItems(): UseSupabaseReturn<ShopItem[]> {
  const [data, setData] = useState<ShopItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const { data: items, error: err } = await supabase
        .from('shop_items')
        .select('*')
        .eq('status', 1)
        .order('sort_order', { ascending: true });
      if (err) throw err;
      setData(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取商品失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return { data, loading, error, refetch: fetchItems };
}
