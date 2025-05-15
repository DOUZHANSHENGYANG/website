'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Post, Category, Tag } from '@/types';

interface SearchResultsProps {
  results: {
    posts: Post[];
    categories: Category[];
    tags: Tag[];
  };
  query: string;
  type: 'all' | 'post' | 'category' | 'tag';
  isLoading: boolean;
}

export default function SearchResults({
  results,
  query,
  type,
  isLoading
}: SearchResultsProps) {
  const { posts, categories, tags } = results;
  
  // 计算总结果数
  const totalResults = posts.length + categories.length + tags.length;
  
  // 高亮搜索关键词
  const highlightText = (text: string) => {
    if (!query || !text) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => {
      if (part.toLowerCase() === query.toLowerCase()) {
        return <mark key={index} className="bg-yellow-200 dark:bg-yellow-800">{part}</mark>;
      }
      return part;
    });
  };
  
  // 渲染文章结果
  const renderPosts = () => {
    if (posts.length === 0) {
      return null;
    }
    
    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          文章 ({posts.length})
        </h2>
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="flex space-x-4">
              {post.coverImage && (
                <div className="flex-shrink-0">
                  <Link href={`/blog/${post.slug}`}>
                    <div className="relative w-24 h-24 rounded-md overflow-hidden">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </Link>
                </div>
              )}
              <div className="flex-1">
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-lg font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  {highlightText(post.title)}
                </Link>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {highlightText(post.excerpt || '')}
                </p>
                <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <span>
                    {new Date(post.createdAt).toLocaleDateString('zh-CN')}
                  </span>
                  <span className="mx-2">•</span>
                  <span>{post.author?.username}</span>
                  {post.categories && post.categories.length > 0 && (
                    <>
                      <span className="mx-2">•</span>
                      <span>
                        {post.categories.map((cat) => cat.name).join(', ')}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // 渲染分类结果
  const renderCategories = () => {
    if (categories.length === 0) {
      return null;
    }
    
    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          分类 ({categories.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/blog/categories/${category.slug}`}
              className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              <h3 className="font-medium text-indigo-600 dark:text-indigo-400">
                {highlightText(category.name)}
              </h3>
              {category.description && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {highlightText(category.description)}
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>
    );
  };
  
  // 渲染标签结果
  const renderTags = () => {
    if (tags.length === 0) {
      return null;
    }
    
    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          标签 ({tags.length})
        </h2>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link
              key={tag.id}
              href={`/blog/tags/${tag.slug}`}
              className="inline-block px-3 py-1 bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              {highlightText(tag.name)}
            </Link>
          ))}
        </div>
      </div>
    );
  };
  
  // 渲染加载状态
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  // 渲染无结果状态
  if (query && totalResults === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
          未找到相关结果
        </h3>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          没有找到与 "{query}" 相关的{' '}
          {type === 'all'
            ? '内容'
            : type === 'post'
            ? '文章'
            : type === 'category'
            ? '分类'
            : '标签'}
          。
        </p>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          建议：
          <ul className="mt-2 list-disc list-inside">
            <li>检查拼写是否正确</li>
            <li>尝试使用不同的关键词</li>
            <li>尝试使用更通用的关键词</li>
            <li>尝试搜索所有类型</li>
          </ul>
        </p>
      </div>
    );
  }
  
  // 渲染搜索结果
  return (
    <div>
      {(type === 'all' || type === 'post') && renderPosts()}
      {(type === 'all' || type === 'category') && renderCategories()}
      {(type === 'all' || type === 'tag') && renderTags()}
    </div>
  );
}
