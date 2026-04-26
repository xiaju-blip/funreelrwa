-- ============================================
-- FunReelRWA Database Migration
-- 执行顺序：1 -> 2
-- ============================================

-- ============================================
-- Part 1: Create Core Tables
-- ============================================

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(100) UNIQUE,
  phone VARCHAR(20) UNIQUE,
  password_hash VARCHAR(255),
  wallet_address VARCHAR(100) UNIQUE,
  nickname VARCHAR(50) NOT NULL DEFAULT 'User',
  avatar TEXT DEFAULT 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
  kyc_level SMALLINT DEFAULT 0,
  vip_level SMALLINT DEFAULT 0,
  vip_expire_at TIMESTAMP,
  invite_code VARCHAR(20) UNIQUE NOT NULL,
  inviter_id UUID,
  points INTEGER DEFAULT 0,
  token_balance DECIMAL(20,8) DEFAULT 0,
  language VARCHAR(10) DEFAULT 'zh',
  timezone VARCHAR(50) DEFAULT 'Asia/Shanghai',
  status SMALLINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 短剧表
CREATE TABLE IF NOT EXISTS dramas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title JSON NOT NULL,
  description JSON,
  cover_image TEXT NOT NULL,
  category_id UUID,
  total_episodes INTEGER DEFAULT 0,
  vip_level SMALLINT DEFAULT 0,
  status SMALLINT DEFAULT 1,
  release_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 剧集表
CREATE TABLE IF NOT EXISTS episodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  drama_id UUID NOT NULL,
  episode_num INTEGER NOT NULL,
  title JSON,
  video_url TEXT,
  duration INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- IPT资产表
CREATE TABLE IF NOT EXISTS assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  cover TEXT,
  description TEXT,
  target_amount DECIMAL(20,8) NOT NULL,
  raised_amount DECIMAL(20,8) DEFAULT 0,
  apy DECIMAL(5,2) DEFAULT 0,
  duration_days INTEGER DEFAULT 0,
  status SMALLINT DEFAULT 0,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 用户持仓表
CREATE TABLE IF NOT EXISTS positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  asset_id UUID NOT NULL,
  amount DECIMAL(20,8) NOT NULL DEFAULT 0,
  cost_price DECIMAL(20,8) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 交易订单表
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  asset_id UUID NOT NULL,
  type SMALLINT NOT NULL,
  price DECIMAL(20,8) NOT NULL,
  amount DECIMAL(20,8) NOT NULL,
  status SMALLINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 质押池表
CREATE TABLE IF NOT EXISTS stake_pools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL,
  lock_days INTEGER NOT NULL DEFAULT 0,
  base_apy DECIMAL(5,2) NOT NULL DEFAULT 0,
  vip_bonus DECIMAL(5,2) DEFAULT 0,
  max_stake DECIMAL(20,8),
  total_staked DECIMAL(20,8) DEFAULT 0,
  status SMALLINT DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 用户质押记录表
CREATE TABLE IF NOT EXISTS stake_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  pool_id UUID NOT NULL,
  amount DECIMAL(20,8) NOT NULL DEFAULT 0,
  vip_level_at_stake SMALLINT DEFAULT 0,
  lock_end_time TIMESTAMP,
  total_earned DECIMAL(20,8) DEFAULT 0,
  pending_earned DECIMAL(20,8) DEFAULT 0,
  auto_compound BOOLEAN DEFAULT FALSE,
  status SMALLINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 任务表
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  type SMALLINT NOT NULL,
  description TEXT,
  condition_type VARCHAR(50) NOT NULL,
  condition_value JSON,
  reward_points INTEGER DEFAULT 0,
  reward_token DECIMAL(20,8) DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  status SMALLINT DEFAULT 1,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 用户任务记录表
CREATE TABLE IF NOT EXISTS user_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  task_id UUID NOT NULL,
  progress INTEGER DEFAULT 0,
  target INTEGER DEFAULT 0,
  status SMALLINT DEFAULT 0,
  completed_at TIMESTAMP,
  claimed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 积分商城商品表
CREATE TABLE IF NOT EXISTS shop_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  type SMALLINT NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  token_amount DECIMAL(20,8),
  vip_days INTEGER,
  stock INTEGER DEFAULT -1,
  daily_limit INTEGER DEFAULT 0,
  image TEXT,
  status SMALLINT DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 兑换记录表
CREATE TABLE IF NOT EXISTS exchange_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  item_id UUID NOT NULL,
  points_used INTEGER NOT NULL DEFAULT 0,
  quantity INTEGER DEFAULT 1,
  status SMALLINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 积分流水表
CREATE TABLE IF NOT EXISTS points_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type SMALLINT NOT NULL,
  amount INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  source_id VARCHAR(64),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 邀请记录表
CREATE TABLE IF NOT EXISTS invite_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inviter_id UUID NOT NULL,
  invited_id UUID,
  level SMALLINT NOT NULL DEFAULT 1,
  reward_points INTEGER DEFAULT 0,
  reward_token DECIMAL(20,8) DEFAULT 0,
  status SMALLINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 观看记录表
CREATE TABLE IF NOT EXISTS watch_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  drama_id UUID NOT NULL,
  episode_id UUID,
  progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 公告表
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  content TEXT,
  is_important BOOLEAN DEFAULT FALSE,
  status SMALLINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW()
);

-- VIP等级表
CREATE TABLE IF NOT EXISTS vip_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level SMALLINT NOT NULL,
  name VARCHAR(50) NOT NULL,
  daily_reward DECIMAL(20,8) DEFAULT 0,
  discount DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- VIP套餐表
CREATE TABLE IF NOT EXISTS vip_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  duration_days INTEGER NOT NULL,
  price_cny DECIMAL(20,8) NOT NULL,
  price_usdt DECIMAL(20,8) NOT NULL,
  benefits JSON,
  status SMALLINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW()
);

-- VIP订单表
CREATE TABLE IF NOT EXISTS vip_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  package_id UUID NOT NULL,
  amount DECIMAL(20,8) NOT NULL,
  status SMALLINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 短剧评论表
CREATE TABLE IF NOT EXISTS drama_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  drama_id UUID NOT NULL,
  user_id UUID NOT NULL,
  episode_id UUID,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- Part 2: RLS Policies ( Public Read Access)
-- ============================================

-- Users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_select_users" ON users FOR SELECT USING (true);
CREATE POLICY "allow_insert_users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_update_users" ON users FOR UPDATE USING (true);

-- Dramas
ALTER TABLE dramas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_select_dramas" ON dramas FOR SELECT USING (true);

-- Episodes
ALTER TABLE episodes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_select_episodes" ON episodes FOR SELECT USING (true);

-- Assets
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_select_assets" ON assets FOR SELECT USING (true);
CREATE POLICY "allow_insert_assets" ON assets FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_update_assets" ON assets FOR UPDATE USING (true);

-- Positions
ALTER TABLE positions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_select_positions" ON positions FOR SELECT USING (true);

-- Orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_select_orders" ON orders FOR SELECT USING (true);

-- Stake Pools
ALTER TABLE stake_pools ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_select_stake_pools" ON stake_pools FOR SELECT USING (true);

-- Stake Records
ALTER TABLE stake_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_select_stake_records" ON stake_records FOR SELECT USING (true);

-- Tasks
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_select_tasks" ON tasks FOR SELECT USING (true);
CREATE POLICY "allow_all_tasks" ON tasks FOR ALL USING (true);

-- User Tasks
ALTER TABLE user_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_select_user_tasks" ON user_tasks FOR SELECT USING (true);
CREATE POLICY "allow_all_user_tasks" ON user_tasks FOR ALL USING (true);

-- Shop Items
ALTER TABLE shop_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_select_shop_items" ON shop_items FOR SELECT USING (true);

-- Exchange Records
ALTER TABLE exchange_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_select_exchange_records" ON exchange_records FOR SELECT USING (true);

-- Points Transactions
ALTER TABLE points_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_select_points_transactions" ON points_transactions FOR SELECT USING (true);

-- Invite Records
ALTER TABLE invite_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_select_invite_records" ON invite_records FOR SELECT USING (true);

-- Watch Records
ALTER TABLE watch_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_select_watch_records" ON watch_records FOR SELECT USING (true);

-- Announcements
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_select_announcements" ON announcements FOR SELECT USING (true);

-- VIP Levels
ALTER TABLE vip_levels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_select_vip_levels" ON vip_levels FOR SELECT USING (true);

-- VIP Packages
ALTER TABLE vip_packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_select_vip_packages" ON vip_packages FOR SELECT USING (true);

-- VIP Orders
ALTER TABLE vip_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_select_vip_orders" ON vip_orders FOR SELECT USING (true);

-- Drama Comments
ALTER TABLE drama_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_select_drama_comments" ON drama_comments FOR SELECT USING (true);
CREATE POLICY "allow_insert_drama_comments" ON drama_comments FOR INSERT WITH CHECK (true);

-- ============================================
-- Part 3: Sample Data
-- ============================================

-- Insert sample VIP levels
INSERT INTO vip_levels (level, name, daily_reward, discount) VALUES
(0, 'Free', 0, 0),
(1, 'Bronze', 10, 5),
(2, 'Silver', 20, 10),
(3, 'Gold', 50, 15),
(4, 'Platinum', 100, 20),
(5, 'Diamond', 200, 25);

-- Insert sample tasks
INSERT INTO tasks (name, type, description, condition_type, reward_points, status) VALUES
('每日签到', 1, '每日签到领取积分', 'daily_sign', 10, 1),
('观看短剧', 2, '观看短剧满5分钟', 'watch_drama', 20, 1),
('邀请好友', 3, '成功邀请一位好友', 'invite_friend', 50, 1);

-- Insert sample stake pools
INSERT INTO stake_pools (name, lock_days, base_apy, vip_bonus, status) VALUES
('灵活池', 0, 5.5, 1.0, 1),
('稳健池', 30, 8.0, 1.5, 1),
('高收益池', 90, 12.0, 2.0, 1);

-- Insert sample shop items
INSERT INTO shop_items (name, type, points, token_amount, status) VALUES
('观影券', 1, 100, NULL, 1),
('VIP周卡', 2, 200, 7, 1),
('VIP月卡', 2, 500, 30, 1),
('100积分', 3, 0, 100, 1);

-- Insert sample announcements
INSERT INTO announcements (title, content, status) VALUES
('欢迎来到 FunReelRWA', '全球首个短剧IP版权碎片化投资平台', 1);