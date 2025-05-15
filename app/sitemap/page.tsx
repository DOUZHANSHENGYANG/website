import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import supabase from '@/lib/db/supabase';

export const metadata: Metadata = {
  title: '网站地图',
  description: '浏览网站的所有页面和内容',
  robots: {
    index: true,
    follow: true,
  },
};

// 获取所有已发布的文章
async function getPosts() {
  try {
    const { data: posts, error } = await supabase
      .from('posts')
      .select('title, slug')
      .eq('published', true)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('获取文章列表失败:', error);
      return [];
    }
    
    return posts;
  } catch (err) {
    console.error('获取文章列表时发生错误:', err);
    return [];
  }
}

// 获取所有分类
async function getCategories() {
  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('name, slug')
      .order('name');
    
    if (error) {
      console.error('获取分类列表失败:', error);
      return [];
    }
    
    return categories;
  } catch (err) {
    console.error('获取分类列表时发生错误:', err);
    return [];
  }
}

// 获取所有标签
async function getTags() {
  try {
    const { data: tags, error } = await supabase
      .from('tags')
      .select('name, slug')
      .order('name');
    
    if (error) {
      console.error('获取标签列表失败:', error);
      return [];
    }
    
    return tags;
  } catch (err) {
    console.error('获取标签列表时发生错误:', err);
    return [];
  }
}

export default async function SitemapPage() {
  const posts = await getPosts();
  const categories = await getCategories();
  const tags = await getTags();
  
  // 主要页面
  const mainPages = [
    { title: '首页', path: '/' },
    { title: '博客', path: '/blog' },
    { title: '关于', path: '/about' },
    { title: '分类', path: '/blog/categories' },
    { title: '标签', path: '/blog/tags' },
    { title: '搜索', path: '/search' },
  ];
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">网站地图</h1>
      
      <div className="space-y-12">
        {/* 主要页面 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">主要页面</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mainPages.map((page) => (
              <li key={page.path}>
                <Link 
                  href={page.path}
                  className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  {page.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
        
        {/* 分类 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">分类</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link 
                  href={`/blog/categories/${category.slug}`}
                  className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
        
        {/* 标签 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">标签</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tags.map((tag) => (
              <li key={tag.slug}>
                <Link 
                  href={`/blog/tags/${tag.slug}`}
                  className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  {tag.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
        
        {/* 文章 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">文章</h2>
          <ul className="space-y-2">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link 
                  href={`/blog/${post.slug}`}
                  className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
        
        {/* XML网站地图链接 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">XML网站地图</h2>
          <ul className="space-y-2">
            <li>
              <a 
                href="/sitemap.xml" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                主网站地图 (sitemap.xml)
              </a>
            </li>
            <li>
              <a 
                href="/sitemap-posts.xml" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                文章网站地图 (sitemap-posts.xml)
              </a>
            </li>
            <li>
              <a 
                href="/sitemap-categories.xml" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                分类网站地图 (sitemap-categories.xml)
              </a>
            </li>
            <li>
              <a 
                href="/sitemap-tags.xml" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                标签网站地图 (sitemap-tags.xml)
              </a>
            </li>
            <li>
              <a 
                href="/robots.txt" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Robots.txt
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
