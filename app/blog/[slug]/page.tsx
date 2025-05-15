import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import MarkdownRenderer from '@/components/blog/MarkdownRenderer';
import ArticleMeta from '@/components/blog/ArticleMeta';
import ShareButtons from '@/components/blog/ShareButtons';
import CommentSection from '@/components/blog/CommentSection';
import ReadingProgressBar from '@/components/blog/ReadingProgressBar';
import ArticleJsonLd from '@/components/seo/ArticleJsonLd';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { FullPost } from '@/types';

// 从Supabase获取文章数据
import supabase from '@/lib/db/supabase';

export async function getPostBySlug(slug: string): Promise<FullPost | null> {
  try {
    // 获取文章基本信息
    const { data: post, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:author_id(id, username, email, avatar, role, created_at, updated_at)
      `)
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (error || !post) {
      console.error('获取文章失败:', error);
      return null;
    }

    // 获取文章分类
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select(`
        id, name, slug, description
      `)
      .in('id', (
        await supabase
          .from('post_categories')
          .select('category_id')
          .eq('post_id', post.id)
      ).data?.map(pc => pc.category_id) || []);

    if (categoriesError) {
      console.error('获取文章分类失败:', categoriesError);
    }

    // 获取文章标签
    const { data: tags, error: tagsError } = await supabase
      .from('tags')
      .select(`
        id, name, slug
      `)
      .in('id', (
        await supabase
          .from('post_tags')
          .select('tag_id')
          .eq('post_id', post.id)
      ).data?.map(pt => pt.tag_id) || []);

    if (tagsError) {
      console.error('获取文章标签失败:', tagsError);
    }

    // 增加文章浏览量
    const { error: updateError } = await supabase
      .from('posts')
      .update({ view_count: (post.view_count || 0) + 1 })
      .eq('id', post.id);

    if (updateError) {
      console.error('更新文章浏览量失败:', updateError);
    }

    // 格式化文章数据
    const formattedPost: FullPost = {
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      coverImage: post.cover_image,
      published: post.published,
      featured: post.featured,
      authorId: post.author_id,
      createdAt: new Date(post.created_at),
      updatedAt: new Date(post.updated_at),
      viewCount: post.view_count || 0,
      author: post.author ? {
        id: post.author.id,
        username: post.author.username,
        email: post.author.email,
        avatar: post.author.avatar || '/images/avatar.svg',
        role: post.author.role,
        createdAt: new Date(post.author.created_at),
        updatedAt: new Date(post.author.updated_at)
      } : {
        id: 'unknown',
        username: '未知作者',
        email: '',
        avatar: '/images/avatar.svg',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      categories: categories || [],
      tags: tags || []
    };

    return formattedPost;
  } catch (err) {
    console.error('获取文章详情时发生错误:', err);
    return null;
  }
}

interface PostPageProps {
  params: {
    slug: string;
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // 构建完整的URL用于分享
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const fullUrl = `${baseUrl}/blog/${post.slug}`;

  // 构建面包屑导航数据
  const breadcrumbItems = [
    { name: '首页', url: baseUrl },
    { name: '博客', url: `${baseUrl}/blog` },
    { name: post.title, url: fullUrl }
  ];

  return (
    <>
      {/* 结构化数据 */}
      <ArticleJsonLd post={post} url={fullUrl} />
      <BreadcrumbJsonLd items={breadcrumbItems} />

      <article className="bg-white dark:bg-gray-900">
        <ReadingProgressBar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* 文章封面图 */}
          <OptimizedImage
            src={post.coverImage || '/images/cover.svg'}
            alt={`${post.title}的封面图`}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            wrapperClassName="w-full h-[400px] mb-8 rounded-lg overflow-hidden"
          />

          {/* 文章标题 */}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            {post.title}
          </h1>

          {/* 文章元数据 */}
          <ArticleMeta
            author={post.author}
            publishDate={post.createdAt}
            categories={post.categories}
            tags={post.tags}
            viewCount={post.viewCount}
          />

          {/* 文章内容 */}
          <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8">
            <MarkdownRenderer content={post.content} />
          </div>

          {/* 分享按钮 */}
          <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
            <ShareButtons title={post.title} url={fullUrl} />
          </div>

          {/* 评论部分 */}
          <CommentSection postId={post.id} />
        </div>
      </article>
    </>
  );
}

// 生成元数据
export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: '文章不存在',
      description: '找不到请求的文章'
    };
  }

  // 构建完整的URL用于分享
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const fullUrl = `${baseUrl}/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.excerpt,
    keywords: [...post.tags.map(tag => tag.name), ...post.categories.map(cat => cat.name)],
    authors: [{ name: post.author.username }],
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: fullUrl,
      siteName: '个人博客',
      images: [
        {
          url: post.coverImage || '/images/cover.svg',
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ],
      locale: 'zh_CN',
      type: 'article',
      publishedTime: post.createdAt instanceof Date ? post.createdAt.toISOString() : new Date(post.createdAt).toISOString(),
      modifiedTime: post.updatedAt instanceof Date ? post.updatedAt.toISOString() : new Date(post.updatedAt).toISOString(),
      authors: [post.author.username],
      tags: post.tags.map(tag => tag.name)
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage || '/images/cover.svg'],
    }
  };
}
