const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 直接从.env.local文件读取环境变量
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    const value = match[2].trim();
    envVars[key] = value;
  }
});

// 从环境变量中获取Supabase URL和服务角色密钥
const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

// 如果没有配置环境变量，则退出
if (!supabaseUrl || !supabaseServiceKey) {
  console.error('缺少必要的环境变量: NEXT_PUBLIC_SUPABASE_URL 或 SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// 创建Supabase客户端
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// 更新用户信息
async function updateUserInfo() {
  try {
    console.log('开始更新用户信息...');

    // 更新用户信息
    const { data, error } = await supabase
      .from('users')
      .update({
        github_url: 'https://github.com/DOUZHANSHENGYANG',
        google_email: 'douzhanshengyan@gmail.com',
        updated_at: new Date().toISOString()
      })
      .eq('username', 'douzhan')
      .select()
      .single();

    if (error) {
      console.error('更新用户信息失败:', error);
      process.exit(1);
    }

    console.log('用户信息更新成功:', {
      username: data.username,
      github_url: data.github_url,
      google_email: data.google_email
    });

    process.exit(0);
  } catch (error) {
    console.error('更新用户信息时发生错误:', error);
    process.exit(1);
  }
}

// 执行更新
updateUserInfo();
