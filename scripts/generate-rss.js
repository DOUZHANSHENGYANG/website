const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const { Feed } = require('feed');
require('dotenv').config({ path: '.env.local' });

// 创建Supabase客户端
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// 网站URL
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const siteTitle = '个人博客';
const siteDescription = '基于Next.js开发的个人博客网站，分享技术文章、教程和个人见解';

// 生成主RSS Feed
async function generateMainFeed() {
  try {
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
      throw error;
    }
    
    // 添加文章到Feed
    posts.forEach((post) => {
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
        date: new Date(post.created_at),
        image: post.cover_image ? (post.cover_image.startsWith('http') ? post.cover_image : `${siteUrl}${post.cover_image}`) : undefined,
        category: post.categories.map((c) => ({
          name: c.category.name,
          domain: `${siteUrl}/blog/categories/${c.category.slug}`,
        })),
      });
    });
    
    // 确保目录存在
    const rssDir = path.join(process.cwd(), 'public', 'rss');
    if (!fs.existsSync(rssDir)) {
      fs.mkdirSync(rssDir, { recursive: true });
    }
    
    // 写入不同格式的Feed
    fs.writeFileSync(path.join(rssDir, 'feed.xml'), feed.rss2());
    fs.writeFileSync(path.join(rssDir, 'atom.xml'), feed.atom1());
    fs.writeFileSync(path.join(rssDir, 'feed.json'), feed.json1());
    
    console.log('主RSS Feed已生成');
  } catch (error) {
    console.error('生成主RSS Feed失败:', error);
  }
}

// 生成分类RSS Feed
async function generateCategoryFeeds() {
  try {
    // 获取所有分类
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*');
    
    if (error) {
      throw error;
    }
    
    // 确保目录存在
    const categoriesDir = path.join(process.cwd(), 'public', 'rss', 'categories');
    if (!fs.existsSync(categoriesDir)) {
      fs.mkdirSync(categoriesDir, { recursive: true });
    }
    
    // 为每个分类生成Feed
    for (const category of categories) {
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
        console.error(`获取分类 ${category.name} 的文章失败:`, postsError);
        continue;
      }
      
      // 添加文章到Feed
      postCategories.forEach((pc) => {
        const post = pc.post;
        if (!post || !post.published) return;
        
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
          date: new Date(post.created_at),
          image: post.cover_image ? (post.cover_image.startsWith('http') ? post.cover_image : `${siteUrl}${post.cover_image}`) : undefined,
          category: post.categories.map((c) => ({
            name: c.category.name,
            domain: `${siteUrl}/blog/categories/${c.category.slug}`,
          })),
        });
      });
      
      // 写入不同格式的Feed
      fs.writeFileSync(path.join(categoriesDir, `${category.slug}.xml`), feed.rss2());
      fs.writeFileSync(path.join(categoriesDir, `${category.slug}.atom`), feed.atom1());
      fs.writeFileSync(path.join(categoriesDir, `${category.slug}.json`), feed.json1());
    }
    
    console.log('分类RSS Feed已生成');
  } catch (error) {
    console.error('生成分类RSS Feed失败:', error);
  }
}

// 主函数
async function main() {
  try {
    await generateMainFeed();
    await generateCategoryFeeds();
    console.log('所有RSS Feed已生成完成');
  } catch (error) {
    console.error('生成RSS Feed失败:', error);
    process.exit(1);
  }
}

// 执行主函数
main();
