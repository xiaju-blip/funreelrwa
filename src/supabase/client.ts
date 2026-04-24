/**
 * 配置文件
 * 修改下面的 SUPABASE_URL 和 ANON_KEY 以连接到您的 Supabase 项目
 */
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// ⚠️ 您需要修改此 URL 指向您的 Supabase 项目
// 本地开发可使用 http://localhost:54321
// 生产环境使用您的 Supabase 项目 URL
export const SUPABASE_URL = 'http://localhost:54321';
export const supabaseAnonKey = 'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH';

export const supabaseUrl = SUPABASE_URL;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
