// 初始化示例数据脚本
// 用于添加示例文章、标签和分类

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

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

// 示例文章内容
const sampleArticles = [
  {
    title: 'Next.js 14新特性详解',
    slug: 'nextjs-14-features',
    content: '# Next.js 14新特性详解\n\nNext.js 14是一个重大更新，带来了许多令人兴奋的新特性和改进。本文将详细介绍这些新特性，并探讨它们如何改变我们的开发体验。',
    excerpt: 'Next.js 14带来了许多令人兴奋的新特性和改进，包括服务器组件改进、增强的App Router、部分预渲染等。本文详细介绍这些新特性，并探讨它们如何改变我们的开发体验。',
    coverImage: '/images/cover.svg',
    published: true,
    featured: true,
    categories: ['前端开发', '技术'],
    tags: ['Next.js', 'React', '前端']
  },
  {
    title: 'React Server Components详解',
    slug: 'react-server-components-explained',
    content: '# React Server Components详解\n\nReact Server Components是React生态系统中的一项革命性技术，它改变了我们构建React应用的方式。本文将深入探讨React Server Components的工作原理、优势以及如何在项目中使用它们。',
    excerpt: 'React Server Components是React生态系统中的一项革命性技术，它允许开发者创建在服务器上渲染并且不会增加客户端JavaScript包大小的组件。本文深入探讨了RSC的工作原理、优势以及如何在项目中使用它们。',
    coverImage: '/images/cover.svg',
    published: true,
    featured: true,
    categories: ['前端开发', '技术'],
    tags: ['React', 'Server Components', '前端']
  },
  {
    title: 'Tailwind CSS：实用优先的CSS框架',
    slug: 'tailwind-css-utility-first-framework',
    content: '# Tailwind CSS：实用优先的CSS框架\n\nTailwind CSS是一个功能类优先的CSS框架，它与Bootstrap或Bulma等传统框架有很大不同。本文将介绍Tailwind CSS的核心概念、优势以及如何在项目中使用它。',
    excerpt: 'Tailwind CSS是一个功能类优先的CSS框架，它提供了大量的低级实用类，可以直接在HTML中组合这些类来构建自定义设计。本文介绍了Tailwind CSS的核心概念、优势以及如何在项目中使用它。',
    coverImage: '/images/cover.svg',
    published: true,
    featured: false,
    categories: ['前端开发', 'CSS'],
    tags: ['Tailwind CSS', 'CSS', '前端']
  }
];

// 添加用户
async function addUser() {
  console.log('开始添加用户...');

  // 检查用户是否已存在
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('username', 'douzhan')
    .maybeSingle();

  if (existingUser) {
    console.log('用户已存在，跳过');
    return existingUser.id;
  }

  // 添加新用户
  const { data, error } = await supabase
    .from('users')
    .insert({
      username: 'douzhan',
      email: 'douzhan@example.com',
      avatar: '/images/avatar.svg',
      role: 'admin'
    })
    .select()
    .single();

  if (error) {
    console.error('添加用户失败:', error);
    throw error;
  }

  console.log('成功添加用户:', data.username);
  return data.id;
}

// 添加分类
async function addCategories() {
  console.log('开始添加分类...');
  const categoryMap = new Map();

  for (const article of sampleArticles) {
    for (const categoryName of article.categories) {
      if (categoryMap.has(categoryName)) continue;

      // 生成slug
      const slug = categoryName
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
        .replace(/^-+|-+$/g, '');

      // 检查分类是否已存在
      const { data: existingCategory } = await supabase
        .from('categories')
        .select('id')
        .eq('name', categoryName)
        .maybeSingle();

      if (existingCategory) {
        console.log(`分类 "${categoryName}" 已存在，跳过`);
        categoryMap.set(categoryName, existingCategory.id);
        continue;
      }

      // 添加新分类
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: categoryName,
          slug: slug,
          description: `关于${categoryName}的文章`
        })
        .select()
        .single();

      if (error) {
        console.error(`添加分类 "${categoryName}" 失败:`, error);
        continue;
      }

      console.log(`成功添加分类: "${categoryName}"`);
      categoryMap.set(categoryName, data.id);
    }
  }

  return categoryMap;
}

// 添加标签
async function addTags() {
  console.log('开始添加标签...');
  const tagMap = new Map();

  for (const article of sampleArticles) {
    for (const tagName of article.tags) {
      if (tagMap.has(tagName)) continue;

      // 生成slug
      const slug = tagName
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
        .replace(/^-+|-+$/g, '');

      // 检查标签是否已存在
      const { data: existingTag } = await supabase
        .from('tags')
        .select('id')
        .eq('name', tagName)
        .maybeSingle();

      if (existingTag) {
        console.log(`标签 "${tagName}" 已存在，跳过`);
        tagMap.set(tagName, existingTag.id);
        continue;
      }

      // 添加新标签
      const { data, error } = await supabase
        .from('tags')
        .insert({
          name: tagName,
          slug: slug
        })
        .select()
        .single();

      if (error) {
        console.error(`添加标签 "${tagName}" 失败:`, error);
        continue;
      }

      console.log(`成功添加标签: "${tagName}"`);
      tagMap.set(tagName, data.id);
    }
  }

  return tagMap;
}

// 添加文章
async function addArticles(userId, categoryMap, tagMap) {
  console.log('开始添加文章...');

  for (const article of sampleArticles) {
    // 检查文章是否已存在
    const { data: existingArticle } = await supabase
      .from('posts')
      .select('id')
      .eq('slug', article.slug)
      .maybeSingle();

    if (existingArticle) {
      console.log(`文章 "${article.title}" 已存在，跳过`);
      continue;
    }

    // 添加新文章
    const { data, error } = await supabase
      .from('posts')
      .insert({
        title: article.title,
        slug: article.slug,
        content: article.content,
        excerpt: article.excerpt,
        cover_image: article.coverImage,
        published: article.published,
        featured: article.featured,
        author_id: userId
      })
      .select()
      .single();

    if (error) {
      console.error(`添加文章 "${article.title}" 失败:`, error);
      continue;
    }

    console.log(`成功添加文章: "${article.title}"`);

    // 添加文章-分类关联
    for (const categoryName of article.categories) {
      const categoryId = categoryMap.get(categoryName);
      if (!categoryId) continue;

      const { error: categoryError } = await supabase
        .from('post_categories')
        .insert({
          post_id: data.id,
          category_id: categoryId
        });

      if (categoryError) {
        console.error(`添加文章-分类关联失败:`, categoryError);
      }
    }

    // 添加文章-标签关联
    for (const tagName of article.tags) {
      const tagId = tagMap.get(tagName);
      if (!tagId) continue;

      const { error: tagError } = await supabase
        .from('post_tags')
        .insert({
          post_id: data.id,
          tag_id: tagId
        });

      if (tagError) {
        console.error(`添加文章-标签关联失败:`, tagError);
      }
    }
  }
}

// 运行初始化
async function init() {
  try {
    const userId = await addUser();
    const categoryMap = await addCategories();
    const tagMap = await addTags();
    await addArticles(userId, categoryMap, tagMap);
    console.log('示例数据初始化完成');
  } catch (error) {
    console.error('初始化过程中发生错误:', error);
  }
}

// 执行初始化
init();
