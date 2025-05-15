import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import supabase from '@/lib/db/supabase';

export const metadata: Metadata = {
  title: 'RSS订阅',
  description: '订阅我们的RSS Feed，获取最新文章更新',
  robots: {
    index: true,
    follow: true,
  },
};

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

export default async function RssPage() {
  const categories = await getCategories();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  // RSS Feed链接
  const mainFeeds = [
    { name: 'RSS 2.0', url: '/api/rss?format=rss', icon: 'rss' },
    { name: 'Atom', url: '/api/rss?format=atom', icon: 'atom' },
    { name: 'JSON Feed', url: '/api/rss?format=json', icon: 'json' },
  ];
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">RSS订阅</h1>
      
      <div className="max-w-3xl mx-auto space-y-12">
        <section className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">什么是RSS？</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            RSS（Really Simple Syndication）是一种用于发布频繁更新的网站内容的标准格式。
            通过订阅RSS Feed，您可以使用RSS阅读器实时获取我们的最新文章，而无需手动访问网站。
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            我们提供多种格式的Feed，包括RSS 2.0、Atom和JSON Feed，您可以根据自己的偏好选择合适的格式。
          </p>
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
            <h3 className="text-lg font-medium mb-2">推荐的RSS阅读器</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
              <li>Feedly - 适用于网页和移动设备</li>
              <li>Inoreader - 功能丰富的RSS阅读器</li>
              <li>NewsBlur - 支持社交分享的阅读器</li>
              <li>Feedbin - 简洁优雅的RSS服务</li>
              <li>NetNewsWire - macOS和iOS上的免费开源阅读器</li>
            </ul>
          </div>
        </section>
        
        {/* 主Feed */}
        <section className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">主要Feed</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            订阅我们的主要Feed，获取所有最新文章的更新。
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {mainFeeds.map((feed) => (
              <a
                key={feed.name}
                href={feed.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-orange-500 text-white rounded-full mb-3">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 3a1 1 0 000 2c5.523 0 10 4.477 10 10a1 1 0 102 0C17 8.373 11.627 3 5 3z" />
                    <path d="M4 9a1 1 0 011-1 7 7 0 017 7 1 1 0 11-2 0 5 5 0 00-5-5 1 1 0 01-1-1z" />
                    <path d="M3 15a2 2 0 114 0 2 2 0 01-4 0z" />
                  </svg>
                </div>
                <span className="text-gray-900 dark:text-white font-medium">{feed.name}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">点击订阅</span>
              </a>
            ))}
          </div>
        </section>
        
        {/* 分类Feed */}
        <section className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">分类Feed</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            您也可以订阅特定分类的Feed，只接收您感兴趣的内容。
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {categories.map((category) => (
              <div key={category.slug} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{category.name}</h3>
                <div className="flex flex-wrap gap-2 mt-3">
                  <a
                    href={`/api/rss?category=${category.slug}&format=rss`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium bg-orange-100 text-orange-800 px-2 py-1 rounded hover:bg-orange-200 transition-colors"
                  >
                    RSS
                  </a>
                  <a
                    href={`/api/rss?category=${category.slug}&format=atom`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                  >
                    Atom
                  </a>
                  <a
                    href={`/api/rss?category=${category.slug}&format=json`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200 transition-colors"
                  >
                    JSON
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* 如何使用 */}
        <section className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">如何使用RSS</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-indigo-500 pl-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">1. 选择RSS阅读器</h3>
              <p className="text-gray-700 dark:text-gray-300 mt-1">
                首先，您需要选择一个RSS阅读器。可以是网页版、桌面应用或移动应用。
              </p>
            </div>
            <div className="border-l-4 border-indigo-500 pl-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">2. 复制Feed链接</h3>
              <p className="text-gray-700 dark:text-gray-300 mt-1">
                在本页面上找到您想要订阅的Feed，右键点击链接并选择"复制链接地址"。
              </p>
            </div>
            <div className="border-l-4 border-indigo-500 pl-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">3. 添加到阅读器</h3>
              <p className="text-gray-700 dark:text-gray-300 mt-1">
                在您的RSS阅读器中，找到"添加订阅"或"添加Feed"选项，然后粘贴链接。
              </p>
            </div>
            <div className="border-l-4 border-indigo-500 pl-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">4. 开始阅读</h3>
              <p className="text-gray-700 dark:text-gray-300 mt-1">
                完成订阅后，您将开始在阅读器中收到我们的最新文章。每当有新文章发布时，您的阅读器会自动更新。
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
