import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/db/supabase';

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
  const results = {
    success: [] as string[],
    skipped: [] as string[],
    failed: [] as { name: string, error: string }[]
  };
  
  for (const tag of predefinedTags) {
    // 检查标签是否已存在
    const { data: existingTag } = await supabase
      .from('tags')
      .select('id')
      .eq('name', tag.name)
      .maybeSingle();
    
    if (existingTag) {
      results.skipped.push(tag.name);
      continue;
    }
    
    // 添加新标签
    const { data, error } = await supabase
      .from('tags')
      .insert(tag)
      .select();
    
    if (error) {
      results.failed.push({ name: tag.name, error: error.message });
    } else {
      results.success.push(tag.name);
    }
  }
  
  return results;
}

// 添加分类
async function addCategories() {
  const results = {
    success: [] as string[],
    skipped: [] as string[],
    failed: [] as { name: string, error: string }[]
  };
  
  for (const category of predefinedCategories) {
    // 检查分类是否已存在
    const { data: existingCategory } = await supabase
      .from('categories')
      .select('id')
      .eq('name', category.name)
      .maybeSingle();
    
    if (existingCategory) {
      results.skipped.push(category.name);
      continue;
    }
    
    // 添加新分类
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select();
    
    if (error) {
      results.failed.push({ name: category.name, error: error.message });
    } else {
      results.success.push(category.name);
    }
  }
  
  return results;
}

export async function GET(request: NextRequest) {
  try {
    // 检查是否已登录
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    
    // 简单的API密钥验证，实际应用中应使用更安全的方法
    if (key !== process.env.ADMIN_API_KEY && key !== 'init-data-key') {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }
    
    // 执行初始化
    const tagResults = await addTags();
    const categoryResults = await addCategories();
    
    return NextResponse.json({
      success: true,
      message: '数据初始化完成',
      results: {
        tags: tagResults,
        categories: categoryResults
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || '初始化数据失败' },
      { status: 500 }
    );
  }
}
