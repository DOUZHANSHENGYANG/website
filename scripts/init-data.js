// 初始化数据脚本
// 用于添加常用的内置标签和分类

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// 从环境变量中获取Supabase URL和服务角色密钥
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// 如果没有配置环境变量，则退出
if (!supabaseUrl || !supabaseServiceKey) {
  console.error('缺少必要的环境变量: NEXT_PUBLIC_SUPABASE_URL 或 SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// 创建Supabase客户端
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// 预定义的标签
const predefinedTags = [
  { name: '技术', slug: 'technology' },
  { name: '编程', slug: 'programming' },
  { name: 'JavaScript', slug: 'javascript' },
  { name: 'React', slug: 'react' },
  { name: 'Next.js', slug: 'nextjs' },
  { name: 'CSS', slug: 'css' },
  { name: 'HTML', slug: 'html' },
  { name: '前端', slug: 'frontend' },
  { name: '后端', slug: 'backend' },
  { name: '全栈', slug: 'fullstack' },
  { name: '教程', slug: 'tutorial' },
  { name: '设计', slug: 'design' },
  { name: 'UI/UX', slug: 'ui-ux' },
  { name: '数据库', slug: 'database' },
  { name: '云服务', slug: 'cloud' }
];

// 预定义的分类
const predefinedCategories = [
  { 
    name: '前端开发', 
    slug: 'frontend-development',
    description: '关于HTML、CSS、JavaScript等前端技术的文章'
  },
  { 
    name: '后端开发', 
    slug: 'backend-development',
    description: '关于服务器端编程、API开发等后端技术的文章'
  },
  { 
    name: '移动开发', 
    slug: 'mobile-development',
    description: '关于iOS、Android和跨平台移动应用开发的文章'
  },
  { 
    name: '数据库', 
    slug: 'database',
    description: '关于SQL、NoSQL数据库和数据存储解决方案的文章'
  },
  { 
    name: '云计算', 
    slug: 'cloud-computing',
    description: '关于AWS、Azure、GCP等云服务和云原生技术的文章'
  },
  { 
    name: 'DevOps', 
    slug: 'devops',
    description: '关于CI/CD、容器化、自动化部署等DevOps实践的文章'
  },
  { 
    name: '人工智能', 
    slug: 'artificial-intelligence',
    description: '关于机器学习、深度学习和AI应用的文章'
  },
  { 
    name: '网络安全', 
    slug: 'cybersecurity',
    description: '关于安全最佳实践、漏洞防护和隐私保护的文章'
  }
];

// 添加标签
async function addTags() {
  console.log('开始添加标签...');
  
  for (const tag of predefinedTags) {
    // 检查标签是否已存在
    const { data: existingTag } = await supabase
      .from('tags')
      .select('id')
      .eq('name', tag.name)
      .maybeSingle();
    
    if (existingTag) {
      console.log(`标签 "${tag.name}" 已存在，跳过`);
      continue;
    }
    
    // 添加新标签
    const { data, error } = await supabase
      .from('tags')
      .insert(tag)
      .select();
    
    if (error) {
      console.error(`添加标签 "${tag.name}" 失败:`, error);
    } else {
      console.log(`成功添加标签: "${tag.name}"`);
    }
  }
  
  console.log('标签添加完成');
}

// 添加分类
async function addCategories() {
  console.log('开始添加分类...');
  
  for (const category of predefinedCategories) {
    // 检查分类是否已存在
    const { data: existingCategory } = await supabase
      .from('categories')
      .select('id')
      .eq('name', category.name)
      .maybeSingle();
    
    if (existingCategory) {
      console.log(`分类 "${category.name}" 已存在，跳过`);
      continue;
    }
    
    // 添加新分类
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select();
    
    if (error) {
      console.error(`添加分类 "${category.name}" 失败:`, error);
    } else {
      console.log(`成功添加分类: "${category.name}"`);
    }
  }
  
  console.log('分类添加完成');
}

// 运行初始化
async function init() {
  try {
    await addTags();
    await addCategories();
    console.log('数据初始化完成');
  } catch (error) {
    console.error('初始化过程中发生错误:', error);
  }
}

// 执行初始化
init();
