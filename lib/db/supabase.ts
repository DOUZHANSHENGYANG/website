import { createClient } from '@supabase/supabase-js';

// 从环境变量中获取Supabase URL和匿名密钥
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// 创建Supabase客户端
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 检查Supabase配置是否有效
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or anonymous key is missing. Please check your environment variables.');
}

export default supabase;
