'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchForm from '@/components/blog/SearchForm';
import SearchResults from '@/components/blog/SearchResults';
import { Post, Category, Tag } from '@/types';

export default function SearchPage() {
  const searchParams = useSearchParams();
  
  const [query, setQuery] = useState('');
  const [type, setType] = useState<'all' | 'post' | 'category' | 'tag'>('all');
  const [results, setResults] = useState<{
    posts: Post[];
    categories: Category[];
    tags: Tag[];
  }>({
    posts: [],
    categories: [],
    tags: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // 从URL参数中获取搜索条件
  useEffect(() => {
    const q = searchParams.get('q');
    const t = searchParams.get('type') as 'all' | 'post' | 'category' | 'tag';
    const p = searchParams.get('page');
    
    if (q) {
      setQuery(q);
    }
    
    if (t && ['all', 'post', 'category', 'tag'].includes(t)) {
      setType(t);
    }
    
    if (p) {
      const pageNum = parseInt(p);
      if (!isNaN(pageNum) && pageNum > 0) {
        setPage(pageNum);
      }
    }
  }, [searchParams]);
  
  // 执行搜索
  useEffect(() => {
    const performSearch = async () => {
      if (!query) {
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        // 构建API URL
        const apiUrl = `/api/search?q=${encodeURIComponent(query)}&type=${type}&page=${page}&pageSize=10`;
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error('搜索失败');
        }
        
        const data = await response.json();
        
        setResults(data.data);
        setTotalPages(data.meta.pageCount);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    performSearch();
  }, [query, type, page]);
  
  // 处理分页
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) {
      return;
    }
    
    // 更新URL参数
    const url = new URL(window.location.href);
    url.searchParams.set('page', newPage.toString());
    window.history.pushState({}, '', url.toString());
    
    setPage(newPage);
  };
  
  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">搜索</h1>
        
        {/* 搜索表单 */}
        <div className="mb-8">
          <SearchForm />
        </div>
        
        {/* 搜索结果 */}
        {query ? (
          <div>
            {/* 搜索信息 */}
            {!isLoading && !error && (
              <div className="mb-6 text-gray-600 dark:text-gray-400">
                {results.posts.length + results.categories.length + results.tags.length > 0 ? (
                  <p>
                    找到与 "{query}" 相关的{' '}
                    {results.posts.length + results.categories.length + results.tags.length} 个结果
                  </p>
                ) : (
                  <p>未找到与 "{query}" 相关的结果</p>
                )}
              </div>
            )}
            
            {/* 错误提示 */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}
            
            {/* 搜索结果 */}
            <SearchResults
              results={results}
              query={query}
              type={type}
              isLoading={isLoading}
            />
            
            {/* 分页 */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1 || isLoading}
                    className={`px-3 py-1 rounded-md ${
                      page === 1 || isLoading
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800'
                        : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    上一页
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      disabled={isLoading}
                      className={`px-3 py-1 rounded-md ${
                        pageNum === page
                          ? 'bg-indigo-600 text-white dark:bg-indigo-700'
                          : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages || isLoading}
                    className={`px-3 py-1 rounded-md ${
                      page === totalPages || isLoading
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800'
                        : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    下一页
                  </button>
                </nav>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p>请输入搜索关键词</p>
          </div>
        )}
      </div>
    </div>
  );
}
