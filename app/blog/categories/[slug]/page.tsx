import React from 'react';
import { notFound } from 'next/navigation';
import supabase from '@/lib/db/supabase';
import PostCard from '@/components/blog/PostCard';
import { FullPost, Category } from '@/types';

// 根据slug获取分类
async function getCategoryBySlug(slug: string) {
  try {
    const { data: category, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !category) {
      console.error('获取分类详情失败:', error);
      return null;
    }

    return category;
  } catch (err) {
    console.error('获取分类详情时发生错误:', err);
    return null;
  }
}

// 获取分类下的文章
async function getPostsByCategory(categoryId: string) {
  try {
    const { data: postCategories, error } = await supabase
      .from('post_categories')
      .select(`
        post:post_id(
          *,
          author:author_id(id, username, avatar),
          categories:post_categories(category:category_id(*)),
          tags:post_tags(tag:tag_id(*))
        )
      `)
      .eq('category_id', categoryId);

    if (error) {
      console.error('获取分类文章失败:', error);
      return [];
    }

    // 格式化文章数据
    const posts = postCategories
      .map((pc: any) => {
        const post = pc.post;
        if (!post || !post.published) return null;

        return {
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          coverImage: post.cover_image,
          createdAt: post.created_at,
          updatedAt: post.updated_at,
          published: post.published,
          featured: post.featured,
          viewCount: post.view_count,
          author: post.author,
          categories: post.categories.map((c: any) => c.category),
          tags: post.tags.map((t: any) => t.tag)
        };
      })
      .filter(Boolean);

    return posts;
  } catch (err) {
    console.error('获取分类文章时发生错误:', err);
    return [];
  }
}

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const posts = await getPostsByCategory(category.id);

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            分类: {category.name}
          </h1>
          {category.description && (
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {category.description}
            </p>
          )}
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {posts.length} 篇文章
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">该分类下暂无文章</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: FullPost) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// 生成元数据
export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: '分类不存在',
      description: '找不到请求的分类'
    };
  }

  return {
    title: `分类: ${category.name}`,
    description: category.description || `浏览${category.name}分类下的所有文章`
  };
}
