import React from 'react';
import Link from 'next/link';
import supabase from '@/lib/db/supabase';
import { Tag } from '@/types';

// 获取所有标签
async function getTags() {
  try {
    // 获取所有标签
    const { data: tags, error } = await supabase
      .from('tags')
      .select(`
        *,
        posts:post_tags(
          post:post_id(id)
        )
      `)
      .order('name');

    if (error) {
      console.error('获取标签列表失败:', error);
      return [];
    }

    // 格式化标签数据，添加文章计数
    return tags.map((tag: any) => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      postCount: tag.posts ? tag.posts.length : 0
    }));
  } catch (err) {
    console.error('获取标签列表时发生错误:', err);
    return [];
  }
}

export default async function TagsPage() {
  const tags = await getTags();

  // 根据文章数量对标签进行排序
  const sortedTags = [...tags].sort((a, b) => b.postCount - a.postCount);

  // 计算标签大小（基于文章数量）
  const maxCount = Math.max(...sortedTags.map(tag => tag.postCount), 1);
  const minCount = Math.min(...sortedTags.map(tag => tag.postCount), 0);
  const fontSizes = {
    min: 0.75, // rem
    max: 2.0   // rem
  };

  // 计算标签字体大小
  const getTagSize = (count: number) => {
    if (maxCount === minCount) return fontSizes.min + (fontSizes.max - fontSizes.min) / 2;
    const size = fontSizes.min + ((count - minCount) / (maxCount - minCount)) * (fontSizes.max - fontSizes.min);
    return size;
  };

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">文章标签</h1>
        
        {tags.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">暂无标签</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-4 py-6">
            {sortedTags.map((tag: Tag & { postCount: number }) => (
              <Link
                key={tag.id}
                href={`/blog/tags/${tag.slug}`}
                className="inline-block px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 transition duration-150"
                style={{ fontSize: `${getTagSize(tag.postCount)}rem` }}
              >
                {tag.name} <span className="text-gray-500 dark:text-gray-400">({tag.postCount})</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// 生成元数据
export async function generateMetadata() {
  return {
    title: '文章标签',
    description: '浏览所有文章标签'
  };
}
