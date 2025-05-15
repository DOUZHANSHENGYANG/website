import React from 'react';
import { notFound } from 'next/navigation';
import supabase from '@/lib/db/supabase';
import PostCard from '@/components/blog/PostCard';
import { FullPost, Tag } from '@/types';

// 根据slug获取标签
async function getTagBySlug(slug: string) {
  try {
    const { data: tag, error } = await supabase
      .from('tags')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !tag) {
      console.error('获取标签详情失败:', error);
      return null;
    }

    return tag;
  } catch (err) {
    console.error('获取标签详情时发生错误:', err);
    return null;
  }
}

// 获取标签下的文章
async function getPostsByTag(tagId: string) {
  try {
    const { data: postTags, error } = await supabase
      .from('post_tags')
      .select(`
        post:post_id(
          *,
          author:author_id(id, username, avatar),
          categories:post_categories(category:category_id(*)),
          tags:post_tags(tag:tag_id(*))
        )
      `)
      .eq('tag_id', tagId);

    if (error) {
      console.error('获取标签文章失败:', error);
      return [];
    }

    // 格式化文章数据
    const posts = postTags
      .map((pt: any) => {
        const post = pt.post;
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
    console.error('获取标签文章时发生错误:', err);
    return [];
  }
}

interface TagPageProps {
  params: {
    slug: string;
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = params;
  const tag = await getTagBySlug(slug);

  if (!tag) {
    notFound();
  }

  const posts = await getPostsByTag(tag.id);

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            标签: {tag.name}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {posts.length} 篇文章
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">该标签下暂无文章</p>
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
export async function generateMetadata({ params }: TagPageProps) {
  const { slug } = params;
  const tag = await getTagBySlug(slug);

  if (!tag) {
    return {
      title: '标签不存在',
      description: '找不到请求的标签'
    };
  }

  return {
    title: `标签: ${tag.name}`,
    description: `浏览带有"${tag.name}"标签的所有文章`
  };
}
