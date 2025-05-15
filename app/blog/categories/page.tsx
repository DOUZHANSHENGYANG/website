import React from 'react';
import Link from 'next/link';
import supabase from '@/lib/db/supabase';
import { Category } from '@/types';

// 获取所有分类
async function getCategories() {
  try {
    // 获取所有分类
    const { data: categories, error } = await supabase
      .from('categories')
      .select(`
        *,
        posts:post_categories(
          post:post_id(id)
        )
      `)
      .order('name');

    if (error) {
      console.error('获取分类列表失败:', error);
      return [];
    }

    if (!categories || categories.length === 0) {
      return [];
    }

    // 格式化分类数据，添加文章计数
    const formattedCategories = categories.map((category: any) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      postCount: category.posts ? category.posts.length : 0
    }));

    return formattedCategories;
  } catch (err) {
    console.error('获取分类列表时发生错误:', err);
    return [];
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">文章分类</h1>

        {categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">暂无分类</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category: Category & { postCount: number }) => (
              <Link
                key={category.id}
                href={`/blog/categories/${category.slug}`}
                className="block p-6 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 transition duration-150"
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {category.name}
                </h2>
                {category.description && (
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {category.description}
                  </p>
                )}
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {category.postCount} 篇文章
                </p>
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
    title: '文章分类',
    description: '浏览所有文章分类'
  };
}
