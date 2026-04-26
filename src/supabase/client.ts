/**
 * 配置文件
 * 修改下面的 SUPABASE_URL 和 ANON_KEY 以连接到您的 Supabase 项目
 */
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// ⚠️ 您需要修改此 URL 指向您的 Supabase 项目
// 生产环境使用您的 Supabase 项目 URL
export const SUPABASE_URL = 'https://cnsjgrvpdkgerrueyheo.supabase.co';
export const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNuc2pncnZwZGtnZXJydWV5aGVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMTg1NzYsImV4cCI6MjA5MjY5NDU3Nn0.GeMOyFRruw-ffiX_YPp1AN-6hNUaKCdw5nnI_38JLnY';

export const supabaseUrl = SUPABASE_URL;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
