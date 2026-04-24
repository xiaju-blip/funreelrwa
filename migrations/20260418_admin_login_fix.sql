-- ============================================
-- 修复后台管理员登录问题
-- ============================================

-- 1. 授予 anon 角色执行 verify_password 和 hash_password 的权限
GRANT EXECUTE ON FUNCTION hash_password(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION verify_password(TEXT, TEXT) TO anon;

-- 2. 创建或更新管理员测试用户 (VIP level >= 9)
-- 如果用户不存在则创建，密码为 admin123
INSERT INTO users (email, nickname, password_hash, vip_level, avatar)
SELECT 
  'admin@funreel.com',
  'Admin',
  hash_password('admin123'),
  9,
  'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@funreel.com');

-- 3. 更新现有用户的密码和VIP等级
UPDATE users 
SET password_hash = hash_password('admin123'), vip_level = 9
WHERE email = 'admin@funreel.com';

-- 验证数据
SELECT id, email, nickname, vip_level, length(password_hash) as pwd_hash_length FROM users WHERE email = 'admin@funreel.com';