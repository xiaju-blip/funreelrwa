-- Add RLS policies for admin access
-- Tasks table
DROP POLICY IF EXISTS "allow select tasks" ON tasks;
CREATE POLICY "allow select tasks" ON tasks FOR SELECT USING (true);

DROP POLICY IF EXISTS "allow all tasks" ON tasks;
CREATE POLICY "allow all tasks" ON tasks FOR ALL USING (true);

-- User tasks table
DROP POLICY IF EXISTS "allow select user_tasks" ON user_tasks;
CREATE POLICY "allow select user_tasks" ON user_tasks FOR SELECT USING (true);

DROP POLICY IF EXISTS "allow all user_tasks" ON user_tasks;
CREATE POLICY "allow all user_tasks" ON user_tasks FOR ALL USING (true);

-- Stake records table
DROP POLICY IF EXISTS "allow select stake_records" ON stake_records;
CREATE POLICY "allow select stake_records" ON stake_records FOR SELECT USING (true);

DROP POLICY IF EXISTS "allow all stake_records" ON stake_records;
CREATE POLICY "allow all stake_records" ON stake_records FOR ALL USING (true);

-- Exchange records table
DROP POLICY IF EXISTS "allow select exchange_records" ON exchange_records;
CREATE POLICY "allow select exchange_records" ON exchange_records FOR SELECT USING (true);

DROP POLICY IF EXISTS "allow all exchange_records" ON exchange_records;
CREATE POLICY "allow all exchange_records" ON exchange_records FOR ALL USING (true);

-- Positions table
DROP POLICY IF EXISTS "allow select positions" ON positions;
CREATE POLICY "allow select positions" ON positions FOR SELECT USING (true);

DROP POLICY IF EXISTS "allow all positions" ON positions;
CREATE POLICY "allow all positions" ON positions FOR ALL USING (true);

-- VIP levels table
DROP POLICY IF EXISTS "allow select vip_levels" ON vip_levels;
CREATE POLICY "allow select vip_levels" ON vip_levels FOR SELECT USING (true);

DROP POLICY IF EXISTS "allow all vip_levels" ON vip_levels;
CREATE POLICY "allow all vip_levels" ON vip_levels FOR ALL USING (true);

-- Assets table
DROP POLICY IF EXISTS "allow select assets" ON assets;
CREATE POLICY "allow select assets" ON assets FOR SELECT USING (true);

DROP POLICY IF EXISTS "allow all assets" ON assets;
CREATE POLICY "allow all assets" ON assets FOR ALL USING (true);

-- Stake pools table
DROP POLICY IF EXISTS "allow select stake_pools" ON stake_pools;
CREATE POLICY "allow select stake_pools" ON stake_pools FOR SELECT USING (true);

DROP POLICY IF EXISTS "allow all stake_pools" ON stake_pools;
CREATE POLICY "allow all stake_pools" ON stake_pools FOR ALL USING (true);

-- Shop items table
DROP POLICY IF EXISTS "allow select shop_items" ON shop_items;
CREATE POLICY "allow select shop_items" ON shop_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "allow all shop_items" ON shop_items;
CREATE POLICY "allow all shop_items" ON shop_items FOR ALL USING (true);