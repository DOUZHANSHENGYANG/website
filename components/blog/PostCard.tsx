'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FullPost } from '@/types';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { formatDate } from '@/lib/utils';

interface PostCardProps {
  post: FullPost;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <article className="flex flex-col overflow-hidden rounded-lg shadow-lg transition-shadow hover:shadow-xl dark:bg-gray-800">
      {/* 文章封面图 */}
      <div className="flex-shrink-0">
        <Link href={`/blog/${post.slug}`}>
          <OptimizedImage
            src={post.coverImage || '/images/cover.svg'}
            alt={`${post.title}的封面图`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            wrapperClassName="h-48 w-full"
            priority={false}
            loading="lazy"
          />
        </Link>
      </div>

      {/* 文章内容 */}
      <div className="flex flex-1 flex-col justify-between bg-white p-6 dark:bg-gray-800">
        <div className="flex-1">
          {/* 分类 */}
          {post.categories && post.categories.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
              {post.categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/blog/categories/${category.slug}`}
                  className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          )}

          {/* 标题 */}
          <Link href={`/blog/${post.slug}`}>
            <h2 className="text-xl font-semibold text-gray-900 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400 mb-2">
              {post.title}
            </h2>
          </Link>

          {/* 摘要 */}
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
            {post.excerpt}
          </p>

          {/* 标签 */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/blog/tags/${tag.slug}`}
                  className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* 作者信息和发布日期 */}
        <div className="mt-4 flex items-center">
          <div className="flex-shrink-0">
            <OptimizedImage
              src={post.author?.avatar || '/images/avatar.svg'}
              alt={`${post.author?.username || '未知作者'}的头像`}
              width={40}
              height={40}
              className="rounded-full object-cover"
              wrapperClassName="h-10 w-10 rounded-full"
            />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {post.author?.username || '未知作者'}
            </p>
            <div className="flex space-x-1 text-sm text-gray-500 dark:text-gray-400">
              <time dateTime={new Date(post.createdAt).toISOString()}>
                {formatDate(post.createdAt)}
              </time>
              {post.viewCount !== undefined && (
                <>
                  <span aria-hidden="true">&middot;</span>
                  <span>{post.viewCount} 次阅读</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
