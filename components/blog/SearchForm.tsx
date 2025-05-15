'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [query, setQuery] = useState('');
  const [type, setType] = useState<'all' | 'post' | 'category' | 'tag'>('all');
  
  // 从URL参数中获取初始值
  useEffect(() => {
    const q = searchParams.get('q');
    const t = searchParams.get('type') as 'all' | 'post' | 'category' | 'tag';
    
    if (q) {
      setQuery(q);
    }
    
    if (t && ['all', 'post', 'category', 'tag'].includes(t)) {
      setType(t);
    }
  }, [searchParams]);
  
  // 处理表单提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      return;
    }
    
    // 构建搜索URL
    const searchUrl = `/search?q=${encodeURIComponent(query)}&type=${type}`;
    
    // 导航到搜索页面
    router.push(searchUrl);
  };
  
  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索文章、分类、标签..."
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            required
          />
          <button
            type="submit"
            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
        
        <select
          value={type}
          onChange={(e) => setType(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        >
          <option value="all">全部</option>
          <option value="post">文章</option>
          <option value="category">分类</option>
          <option value="tag">标签</option>
        </select>
        
        <button
          type="submit"
          className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:hidden"
        >
          搜索
        </button>
      </div>
    </form>
  );
}
