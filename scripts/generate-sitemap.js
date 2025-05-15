const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// 创建Supabase客户端
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// 网站URL
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// 生成XML头部
const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

// 生成XML尾部
const xmlFooter = `</urlset>`;

// 生成URL项
const generateUrlEntry = (url, lastmod, changefreq = 'weekly', priority = '0.7') => {
  return `
  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
};

// 格式化日期为ISO字符串
const formatDate = (date) => {
  return new Date(date).toISOString();
};

// 生成文章网站地图
async function generatePostsSitemap() {
  try {
    // 获取所有已发布的文章
    const { data: posts, error } = await supabase
      .from('posts')
      .select('slug, updated_at')
      .eq('published', true);

    if (error) {
      throw error;
    }

    let sitemap = xmlHeader;

    // 添加每篇文章的URL
    for (const post of posts) {
      const url = `${siteUrl}/blog/${post.slug}`;
      const lastmod = formatDate(post.updated_at);
      sitemap += generateUrlEntry(url, lastmod, 'weekly', '0.8');
    }

    sitemap += xmlFooter;

    // 写入文件
    const filePath = path.join(process.cwd(), 'public', 'sitemap-posts.xml');
    fs.writeFileSync(filePath, sitemap);
    console.log('文章网站地图已生成:', filePath);
  } catch (error) {
    console.error('生成文章网站地图失败:', error);
  }
}

// 生成分类网站地图
async function generateCategoriesSitemap() {
  try {
    // 获取所有分类
    const { data: categories, error } = await supabase
      .from('categories')
      .select('slug');

    if (error) {
      throw error;
    }

    let sitemap = xmlHeader;

    // 添加分类列表页
    sitemap += generateUrlEntry(`${siteUrl}/blog/categories`, formatDate(new Date()), 'weekly', '0.7');

    // 添加每个分类的URL
    for (const category of categories) {
      const url = `${siteUrl}/blog/categories/${category.slug}`;
      const lastmod = formatDate(new Date());
      sitemap += generateUrlEntry(url, lastmod, 'weekly', '0.6');
    }

    sitemap += xmlFooter;

    // 写入文件
    const filePath = path.join(process.cwd(), 'public', 'sitemap-categories.xml');
    fs.writeFileSync(filePath, sitemap);
    console.log('分类网站地图已生成:', filePath);
  } catch (error) {
    console.error('生成分类网站地图失败:', error);
  }
}

// 生成标签网站地图
async function generateTagsSitemap() {
  try {
    // 获取所有标签
    const { data: tags, error } = await supabase
      .from('tags')
      .select('slug');

    if (error) {
      throw error;
    }

    let sitemap = xmlHeader;

    // 添加标签列表页
    sitemap += generateUrlEntry(`${siteUrl}/blog/tags`, formatDate(new Date()), 'weekly', '0.7');

    // 添加每个标签的URL
    for (const tag of tags) {
      const url = `${siteUrl}/blog/tags/${tag.slug}`;
      const lastmod = formatDate(new Date());
      sitemap += generateUrlEntry(url, lastmod, 'weekly', '0.6');
    }

    sitemap += xmlFooter;

    // 写入文件
    const filePath = path.join(process.cwd(), 'public', 'sitemap-tags.xml');
    fs.writeFileSync(filePath, sitemap);
    console.log('标签网站地图已生成:', filePath);
  } catch (error) {
    console.error('生成标签网站地图失败:', error);
  }
}

// 主函数
async function main() {
  try {
    // 确保public目录存在
    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // 生成各种网站地图
    await generatePostsSitemap();
    await generateCategoriesSitemap();
    await generateTagsSitemap();

    console.log('所有网站地图已生成完成');
  } catch (error) {
    console.error('生成网站地图失败:', error);
    process.exit(1);
  }
}

// 执行主函数
main();
