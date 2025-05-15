'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { User, Category, Tag } from '@/types';

interface ArticleMetaProps {
  author: User;
  publishDate: Date;
  categories: Category[];
  tags: Tag[];
  viewCount: number;
}

const ArticleMeta: React.FC<ArticleMetaProps> = ({
  author,
  publishDate,
  categories,
  tags,
  viewCount,
}) => {
  return (
    <div className="flex flex-col space-y-4 mb-8">
      {/* 作者信息和发布日期 */}
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Image
            src={author.avatar || '/images/avatar.svg'}
            alt={author.username}
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{author.username}</p>
          <div className="flex space-x-1 text-sm text-gray-500 dark:text-gray-400">
            <time dateTime={publishDate.toISOString()}>
              {publishDate.toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <span aria-hidden="true">&middot;</span>
            <span>{viewCount} 次阅读</span>
          </div>
        </div>
      </div>

      {/* 分类和标签 */}
      <div className="flex flex-wrap gap-2">
        {/* 分类 */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">分类：</span>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/blog/categories/${category.slug}`}
              className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              {category.name}
            </Link>
          ))}
        </div>

        {/* 标签 */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">标签：</span>
          {tags.map((tag) => (
            <Link
              key={tag.id}
              href={`/blog/tags/${tag.slug}`}
              className="text-xs text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              #{tag.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArticleMeta;
