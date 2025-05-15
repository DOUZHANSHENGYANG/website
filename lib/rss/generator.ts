import { Feed } from 'feed';
import supabase from '@/lib/db/supabase';
import { FullPost } from '@/types';

// 生成主RSS Feed
export async function generateMainFeed(): Promise<Feed> {
  // 获取网站基本信息
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const siteTitle = '个人博客';
  const siteDescription = '基于Next.js开发的个人博客网站，分享技术文章、教程和个人见解';
  
  // 创建Feed实例
  const feed = new Feed({
    title: siteTitle,
    description: siteDescription,
    id: siteUrl,
    link: siteUrl,
    language: 'zh-CN',
    image: `${siteUrl}/images/logo.png`,
    favicon: `${siteUrl}/favicon.ico`,
    copyright: `版权所有 © ${new Date().getFullYear()} ${siteTitle}`,
    updated: new Date(),
    feedLinks: {
      rss2: `${siteUrl}/rss/feed.xml`,
      json: `${siteUrl}/rss/feed.json`,
      atom: `${siteUrl}/rss/atom.xml`,
    },
    author: {
      name: '博客作者',
      email: 'example@example.com',
      link: siteUrl,
    },
  });
  
  // 获取最新的已发布文章
  const { data: posts, error } = await supabase
    .from('posts')
    .select(`
      id, title, slug, content, excerpt, cover_image, created_at, updated_at, published, view_count,
      author:author_id(id, username, avatar, email),
      categories:post_categories(category:category_id(id, name, slug)),
      tags:post_tags(tag:tag_id(id, name, slug))
    `)
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(20);
  
  if (error) {
    console.error('获取文章列表失败:', error);
    return feed;
  }
  
  // 格式化文章数据
  const formattedPosts = posts.map((post: any) => {
    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      coverImage: post.cover_image,
      createdAt: new Date(post.created_at),
      updatedAt: new Date(post.updated_at),
      published: post.published,
      viewCount: post.view_count,
      author: post.author,
      categories: post.categories.map((c: any) => c.category),
      tags: post.tags.map((t: any) => t.tag)
    } as FullPost;
  });
  
  // 添加文章到Feed
  formattedPosts.forEach((post) => {
    const url = `${siteUrl}/blog/${post.slug}`;
    
    feed.addItem({
      title: post.title,
      id: url,
      link: url,
      description: post.excerpt || '',
      content: post.content,
      author: [
        {
          name: post.author?.username || '博客作者',
          email: post.author?.email || 'example@example.com',
          link: siteUrl,
        },
      ],
      date: post.createdAt,
      image: post.coverImage ? (post.coverImage.startsWith('http') ? post.coverImage : `${siteUrl}${post.coverImage}`) : undefined,
      category: post.categories.map((category) => ({
        name: category.name,
        domain: `${siteUrl}/blog/categories/${category.slug}`,
      })),
    });
  });
  
  return feed;
}

// 生成分类RSS Feed
export async function generateCategoryFeed(categorySlug: string): Promise<Feed | null> {
  // 获取分类信息
  const { data: category, error: categoryError } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', categorySlug)
    .single();
  
  if (categoryError || !category) {
    console.error('获取分类信息失败:', categoryError);
    return null;
  }
  
  // 获取网站基本信息
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const siteTitle = '个人博客';
  
  // 创建Feed实例
  const feed = new Feed({
    title: `${siteTitle} - ${category.name}分类`,
    description: category.description || `${category.name}分类下的所有文章`,
    id: `${siteUrl}/blog/categories/${category.slug}`,
    link: `${siteUrl}/blog/categories/${category.slug}`,
    language: 'zh-CN',
    image: `${siteUrl}/images/logo.png`,
    favicon: `${siteUrl}/favicon.ico`,
    copyright: `版权所有 © ${new Date().getFullYear()} ${siteTitle}`,
    updated: new Date(),
    feedLinks: {
      rss2: `${siteUrl}/rss/categories/${category.slug}.xml`,
      json: `${siteUrl}/rss/categories/${category.slug}.json`,
      atom: `${siteUrl}/rss/categories/${category.slug}.atom`,
    },
    author: {
      name: '博客作者',
      email: 'example@example.com',
      link: siteUrl,
    },
  });
  
  // 获取该分类下的文章
  const { data: postCategories, error: postsError } = await supabase
    .from('post_categories')
    .select(`
      post:post_id(
        id, title, slug, content, excerpt, cover_image, created_at, updated_at, published, view_count,
        author:author_id(id, username, avatar, email),
        categories:post_categories(category:category_id(id, name, slug)),
        tags:post_tags(tag:tag_id(id, name, slug))
      )
    `)
    .eq('category_id', category.id)
    .order('post_id', { referencedTable: 'posts', foreignKeyColumn: 'created_at', ascending: false });
  
  if (postsError) {
    console.error('获取分类文章失败:', postsError);
    return feed;
  }
  
  // 格式化文章数据并添加到Feed
  postCategories.forEach((pc: any) => {
    const post = pc.post;
    if (!post || !post.published) return;
    
    const formattedPost = {
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      coverImage: post.cover_image,
      createdAt: new Date(post.created_at),
      updatedAt: new Date(post.updated_at),
      published: post.published,
      viewCount: post.view_count,
      author: post.author,
      categories: post.categories.map((c: any) => c.category),
      tags: post.tags.map((t: any) => t.tag)
    } as FullPost;
    
    const url = `${siteUrl}/blog/${formattedPost.slug}`;
    
    feed.addItem({
      title: formattedPost.title,
      id: url,
      link: url,
      description: formattedPost.excerpt || '',
      content: formattedPost.content,
      author: [
        {
          name: formattedPost.author?.username || '博客作者',
          email: formattedPost.author?.email || 'example@example.com',
          link: siteUrl,
        },
      ],
      date: formattedPost.createdAt,
      image: formattedPost.coverImage ? (formattedPost.coverImage.startsWith('http') ? formattedPost.coverImage : `${siteUrl}${formattedPost.coverImage}`) : undefined,
      category: formattedPost.categories.map((cat) => ({
        name: cat.name,
        domain: `${siteUrl}/blog/categories/${cat.slug}`,
      })),
    });
  });
  
  return feed;
}
