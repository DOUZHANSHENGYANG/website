import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import MarkdownRenderer from '@/components/blog/MarkdownRenderer';
import ArticleMeta from '@/components/blog/ArticleMeta';
import ShareButtons from '@/components/blog/ShareButtons';
import CommentSection from '@/components/blog/CommentSection';
import ReadingProgressBar from '@/components/blog/ReadingProgressBar';
import { FullPost } from '@/types';

// 模拟从数据库获取文章数据
async function getPostBySlug(slug: string): Promise<FullPost | null> {
  // 这里应该是从数据库获取数据，现在使用模拟数据
  const mockPosts = [
    {
      id: '1',
      title: '开始使用Next.js构建现代Web应用',
      slug: 'getting-started-with-nextjs',
      content: `
# 开始使用Next.js构建现代Web应用

Next.js是一个用于构建现代Web应用的React框架。它提供了许多开箱即用的功能，如服务器端渲染、静态站点生成、路由、API路由等，使开发人员能够轻松构建高性能、SEO友好的Web应用。

## 为什么选择Next.js？

Next.js提供了许多优势：

- **服务器端渲染(SSR)** - 提高首屏加载速度和SEO
- **静态站点生成(SSG)** - 预渲染页面，提供极快的加载速度
- **增量静态再生(ISR)** - 结合了SSG和SSR的优点
- **文件系统路由** - 基于文件结构的直观路由系统
- **API路由** - 轻松创建API端点
- **内置CSS和Sass支持** - 简化样式管理
- **代码分割和捆绑** - 优化加载性能
- **热模块替换** - 提高开发体验

## 开始使用Next.js

### 安装

创建一个新的Next.js应用非常简单：

\`\`\`bash
npx create-next-app@latest my-next-app
cd my-next-app
npm run dev
\`\`\`

这将创建一个新的Next.js项目并启动开发服务器。

### 项目结构

一个基本的Next.js项目结构如下：

\`\`\`
my-next-app/
  ├── app/             # App Router (Next.js 13+)
  ├── pages/           # Pages Router (传统)
  ├── public/          # 静态资源
  ├── styles/          # 样式文件
  ├── components/      # React组件
  ├── lib/             # 工具函数和库
  ├── next.config.js   # Next.js配置
  └── package.json     # 项目依赖
\`\`\`

### 创建页面

在Next.js中，页面是放在\`pages\`目录（传统方式）或\`app\`目录（App Router）中的React组件。

**传统Pages Router示例：**

\`\`\`jsx
// pages/index.js
export default function Home() {
  return (
    <div>
      <h1>欢迎来到我的Next.js应用</h1>
      <p>这是首页</p>
    </div>
  );
}
\`\`\`

**App Router示例：**

\`\`\`jsx
// app/page.js
export default function Home() {
  return (
    <div>
      <h1>欢迎来到我的Next.js应用</h1>
      <p>这是使用App Router的首页</p>
    </div>
  );
}
\`\`\`

### 数据获取

Next.js提供了多种数据获取方法：

**服务器组件中：**

\`\`\`jsx
// app/page.js
async function getData() {
  const res = await fetch('https://api.example.com/data');
  return res.json();
}

export default async function Page() {
  const data = await getData();

  return (
    <div>
      <h1>{data.title}</h1>
      <p>{data.description}</p>
    </div>
  );
}
\`\`\`

## 结论

Next.js是一个功能强大的React框架，适合构建各种类型的Web应用。它的灵活性和性能优化使其成为现代Web开发的绝佳选择。

无论您是构建个人博客、电子商务网站还是企业应用，Next.js都能提供所需的工具和功能，帮助您创建出色的用户体验。
      `,
      excerpt: 'Next.js是一个React框架，它使构建高性能、SEO友好的Web应用变得简单。本文将介绍如何开始使用Next.js进行开发。',
      coverImage: '/images/cover.svg',
      published: true,
      featured: true,
      authorId: 'user1',
      createdAt: new Date('2023-01-15'),
      updatedAt: new Date('2023-01-15'),
      viewCount: 1250,
      author: {
        id: 'user1',
        username: '张三',
        email: 'zhangsan@example.com',
        avatar: '/images/avatar.svg',
        role: 'admin',
        createdAt: new Date('2022-01-01'),
        updatedAt: new Date('2022-01-01')
      },
      categories: [
        {
          id: 'cat1',
          name: '技术',
          slug: 'technology',
          description: '技术相关文章'
        },
        {
          id: 'cat2',
          name: 'Web开发',
          slug: 'web-development',
          description: 'Web开发相关文章'
        }
      ],
      tags: [
        {
          id: 'tag1',
          name: 'Next.js',
          slug: 'nextjs'
        },
        {
          id: 'tag2',
          name: 'React',
          slug: 'react'
        },
        {
          id: 'tag3',
          name: '前端',
          slug: 'frontend'
        }
      ]
    },
    // 可以添加更多模拟文章...
  ];

  const post = mockPosts.find(post => post.slug === slug);
  return post || null;
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

  return (
    <article className="bg-white dark:bg-gray-900">
      <ReadingProgressBar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 文章封面图 */}
        <div className="relative w-full h-[400px] mb-8 rounded-lg overflow-hidden">
          <Image
            src={post.coverImage || '/images/cover.svg'}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>

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

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
      type: 'article',
      publishedTime: post.createdAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [post.author.username],
      tags: post.tags.map(tag => tag.name)
    }
  };
}
