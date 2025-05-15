import { MetadataRoute } from 'next';
import supabase from '@/lib/db/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  // 获取所有已发布的文章
  const { data: posts } = await supabase
    .from('posts')
    .select('slug, updated_at')
    .eq('published', true);
  
  // 获取所有分类
  const { data: categories } = await supabase
    .from('categories')
    .select('slug');
  
  // 获取所有标签
  const { data: tags } = await supabase
    .from('tags')
    .select('slug');
  
  // 静态页面
  const staticPages = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/tags`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/sitemap`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ];
  
  // 文章页面
  const postPages = posts?.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at),
    changeFrequency: 'weekly',
    priority: 0.8,
  })) || [];
  
  // 分类页面
  const categoryPages = categories?.map((category) => ({
    url: `${baseUrl}/blog/categories/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  })) || [];
  
  // 标签页面
  const tagPages = tags?.map((tag) => ({
    url: `${baseUrl}/blog/tags/${tag.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  })) || [];
  
  return [
    ...staticPages,
    ...postPages,
    ...categoryPages,
    ...tagPages,
  ];
}
