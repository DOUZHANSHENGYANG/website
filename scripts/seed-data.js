// 初始化示例数据脚本
// 用于添加示例文章、标签和分类

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// 从环境变量中获取Supabase URL和服务角色密钥
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// 如果没有配置环境变量，则退出
if (!supabaseUrl || !supabaseServiceKey) {
  console.error('缺少必要的环境变量: NEXT_PUBLIC_SUPABASE_URL 或 SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// 创建Supabase客户端
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// 示例文章内容
const sampleArticles = [
  {
    title: 'Next.js 14新特性详解',
    slug: 'nextjs-14-features',
    content: `
# Next.js 14新特性详解

Next.js 14是一个重大更新，带来了许多令人兴奋的新特性和改进。本文将详细介绍这些新特性，并探讨它们如何改变我们的开发体验。

## 1. 服务器组件改进

Next.js 14对React服务器组件的支持进行了显著改进，使得开发者可以更轻松地构建高性能的应用程序。服务器组件允许在服务器上渲染组件，减少客户端JavaScript的大小，并提高首次加载性能。

### 主要优势

- **减少客户端JavaScript**: 服务器组件不会增加客户端JavaScript包的大小
- **直接访问后端资源**: 可以直接在组件中访问数据库、文件系统等
- **自动代码分割**: 更智能的代码分割策略

## 2. 增强的App Router

App Router是Next.js 13引入的，在14版本中得到了进一步增强：

```jsx
// app/blog/[slug]/page.js
export default async function BlogPost({ params }) {
  const { slug } = params;
  const post = await getPostBySlug(slug);
  
  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
```

## 3. 部分预渲染

部分预渲染是Next.js 14中最令人兴奋的新特性之一，它允许将页面的静态部分与动态部分分开处理：

- 静态部分在构建时生成
- 动态部分在请求时渲染

这种混合方法提供了最佳的性能和灵活性组合。

## 4. 改进的开发体验

Next.js 14还带来了许多开发体验的改进：

- **更快的刷新速度**: 开发服务器的刷新速度提高了40%
- **更好的错误处理**: 更清晰的错误信息和更好的调试工具
- **Turbopack改进**: 编译速度更快，支持更多功能

## 5. 新的图像组件

Image组件得到了重大改进，提供了更好的性能和用户体验：

```jsx
import Image from 'next/image';

export default function Profile() {
  return (
    <Image
      src="/profile.jpg"
      width={500}
      height={500}
      alt="Profile picture"
      priority
    />
  );
}
```

## 结论

Next.js 14带来了许多令人兴奋的新特性和改进，使得构建现代Web应用程序变得更加简单和高效。无论你是构建个人博客、电子商务网站还是企业应用，Next.js 14都提供了所需的工具和功能。

现在是开始使用Next.js 14的最佳时机！
    `,
    excerpt: 'Next.js 14带来了许多令人兴奋的新特性和改进，包括服务器组件改进、增强的App Router、部分预渲染等。本文详细介绍这些新特性，并探讨它们如何改变我们的开发体验。',
    coverImage: '/images/cover.svg',
    published: true,
    featured: true,
    categories: ['前端开发', '技术'],
    tags: ['Next.js', 'React', '前端']
  },
  {
    title: 'React Server Components详解',
    slug: 'react-server-components-explained',
    content: `
# React Server Components详解

React Server Components是React生态系统中的一项革命性技术，它改变了我们构建React应用的方式。本文将深入探讨React Server Components的工作原理、优势以及如何在项目中使用它们。

## 什么是React Server Components？

React Server Components（RSC）是一种新的组件类型，它允许开发者创建在服务器上渲染并且不会增加客户端JavaScript包大小的组件。这与传统的服务器端渲染（SSR）不同，RSC实际上是在服务器上执行的，而不仅仅是预渲染。

## Server Components vs. Client Components

在React的新模型中，组件分为两种类型：

1. **Server Components**: 在服务器上渲染，不会增加客户端JavaScript包的大小
2. **Client Components**: 在客户端上渲染，可以使用状态、效果和事件处理程序

```jsx
// 这是一个Server Component
export default async function BlogPosts() {
  const posts = await fetchPosts();
  
  return (
    <div>
      {posts.map(post => (
        <BlogPostPreview key={post.id} post={post} />
      ))}
    </div>
  );
}

// 这是一个Client Component
'use client';

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

## React Server Components的优势

RSC带来了许多显著的优势：

### 1. 减少JavaScript包大小

Server Components不会增加客户端JavaScript包的大小，因为它们完全在服务器上执行。这可以显著提高应用程序的性能，特别是在网络连接较慢或设备性能较低的情况下。

### 2. 直接访问后端资源

Server Components可以直接访问数据库、文件系统和其他后端资源，无需通过API层。这简化了数据获取过程，并减少了客户端-服务器往返。

### 3. 自动代码分割

React的新架构提供了更智能的自动代码分割，只有在客户端需要的组件才会被发送到浏览器。

## 在Next.js中使用React Server Components

Next.js是使用React Server Components的最简单方式之一。在Next.js 13+中，App Router默认使用RSC：

```jsx
// app/page.js (Server Component)
export default async function HomePage() {
  const data = await fetchData();
  
  return (
    <main>
      <h1>Welcome to my blog</h1>
      <FeaturedPosts posts={data.featuredPosts} />
      <ClientSideComponent />
    </main>
  );
}

// components/ClientSideComponent.js
'use client';

import { useState } from 'react';

export default function ClientSideComponent() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>
        Toggle Menu
      </button>
      {isOpen && <Menu />}
    </div>
  );
}
```

## 最佳实践

使用React Server Components时，请记住以下最佳实践：

1. **默认使用Server Components**：除非需要客户端特定功能，否则默认使用Server Components
2. **将状态下推到叶子节点**：将客户端状态保持在组件树的叶子节点，尽可能多地使用Server Components
3. **合理划分组件边界**：根据组件是否需要交互性来划分Server和Client Components

## 结论

React Server Components代表了React开发的未来方向，它通过将渲染工作分配到服务器和客户端之间，提供了更好的性能和开发体验。随着Next.js等框架的支持，RSC正在成为构建现代React应用的标准方法。

开始尝试React Server Components，体验它带来的性能和开发体验的提升！
    `,
    excerpt: 'React Server Components是React生态系统中的一项革命性技术，它允许开发者创建在服务器上渲染并且不会增加客户端JavaScript包大小的组件。本文深入探讨了RSC的工作原理、优势以及如何在项目中使用它们。',
    coverImage: '/images/cover.svg',
    published: true,
    featured: true,
    categories: ['前端开发', '技术'],
    tags: ['React', 'Server Components', '前端']
  },
  {
    title: 'Tailwind CSS：实用优先的CSS框架',
    slug: 'tailwind-css-utility-first-framework',
    content: `
# Tailwind CSS：实用优先的CSS框架

Tailwind CSS是一个功能类优先的CSS框架，它与Bootstrap或Bulma等传统框架有很大不同。本文将介绍Tailwind CSS的核心概念、优势以及如何在项目中使用它。

## 什么是实用优先的CSS框架？

传统的CSS框架提供预定义的组件，如按钮、卡片和导航栏。而Tailwind采用了不同的方法，它提供了大量的低级实用类，你可以直接在HTML中组合这些类来构建自定义设计。

```html
<!-- 传统CSS方式 -->
<button class="btn btn-primary">按钮</button>

<!-- Tailwind CSS方式 -->
<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  按钮
</button>
```

## Tailwind CSS的核心概念

### 1. 实用类

Tailwind的核心是其广泛的实用类集合，涵盖了从边距、填充、颜色到Flexbox、Grid等各个方面：

```html
<div class="flex items-center justify-between p-4 bg-white shadow rounded-lg">
  <h2 class="text-xl font-semibold text-gray-800">卡片标题</h2>
  <p class="text-gray-600">卡片内容</p>
</div>
```

### 2. 响应式设计

Tailwind使响应式设计变得简单，通过添加前缀可以在不同的断点应用样式：

```html
<div class="w-full md:w-1/2 lg:w-1/3">
  <!-- 在小屏幕上占满宽度，中等屏幕上占一半，大屏幕上占三分之一 -->
</div>
```

### 3. 状态变体

Tailwind提供了状态变体，如hover、focus、active等：

```html
<button class="bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
  悬停和聚焦效果
</button>
```

## Tailwind CSS的优势

### 1. 更快的开发速度

使用Tailwind，你可以直接在HTML中构建设计，无需在CSS文件和HTML之间切换。这大大加快了开发速度。

### 2. 一致的设计系统

Tailwind提供了一个预设的设计系统，包括颜色、间距、字体大小等。这确保了整个项目的一致性。

### 3. 更小的CSS文件

在生产环境中，Tailwind会删除未使用的CSS，生成一个非常小的CSS文件。

### 4. 高度可定制

Tailwind可以通过配置文件进行定制，你可以更改颜色、间距、断点等。

## 在Next.js项目中使用Tailwind CSS

在Next.js项目中设置Tailwind非常简单：

1. 安装依赖：

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

2. 配置Tailwind：

```js
// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

3. 在全局CSS文件中导入Tailwind：

```css
/* globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 高级技巧

### 1. 使用@apply提取组件样式

如果你发现自己重复使用相同的类组合，可以使用@apply提取到CSS中：

```css
.btn-primary {
  @apply bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded;
}
```

### 2. 使用插件扩展功能

Tailwind有丰富的插件生态系统，如typography、forms等：

```js
// tailwind.config.js
module.exports = {
  // ...
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}
```

## 结论

Tailwind CSS代表了一种新的CSS开发方法，它通过提供低级实用类使开发者能够快速构建自定义设计，而无需编写大量CSS。虽然它的语法可能一开始看起来很冗长，但随着时间的推移，它的效率和灵活性使它成为现代Web开发的流行选择。

如果你还没有尝试过Tailwind CSS，现在是时候了！它可能会改变你编写CSS的方式。
    `,
    excerpt: 'Tailwind CSS是一个功能类优先的CSS框架，它提供了大量的低级实用类，可以直接在HTML中组合这些类来构建自定义设计。本文介绍了Tailwind CSS的核心概念、优势以及如何在项目中使用它。',
    coverImage: '/images/cover.svg',
    published: true,
    featured: false,
    categories: ['前端开发', 'CSS'],
    tags: ['Tailwind CSS', 'CSS', '前端']
  }
];

// 添加用户
async function addUser() {
  console.log('开始添加用户...');
  
  // 检查用户是否已存在
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('username', 'douzhan')
    .maybeSingle();
  
  if (existingUser) {
    console.log('用户已存在，跳过');
    return existingUser.id;
  }
  
  // 添加新用户
  const { data, error } = await supabase
    .from('users')
    .insert({
      username: 'douzhan',
      email: 'douzhan@example.com',
      avatar: '/images/avatar.svg',
      role: 'admin'
    })
    .select()
    .single();
  
  if (error) {
    console.error('添加用户失败:', error);
    throw error;
  }
  
  console.log('成功添加用户:', data.username);
  return data.id;
}

// 添加分类
async function addCategories() {
  console.log('开始添加分类...');
  const categoryMap = new Map();
  
  for (const article of sampleArticles) {
    for (const categoryName of article.categories) {
      if (categoryMap.has(categoryName)) continue;
      
      // 生成slug
      const slug = categoryName
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      // 检查分类是否已存在
      const { data: existingCategory } = await supabase
        .from('categories')
        .select('id')
        .eq('name', categoryName)
        .maybeSingle();
      
      if (existingCategory) {
        console.log(`分类 "${categoryName}" 已存在，跳过`);
        categoryMap.set(categoryName, existingCategory.id);
        continue;
      }
      
      // 添加新分类
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: categoryName,
          slug: slug,
          description: `关于${categoryName}的文章`
        })
        .select()
        .single();
      
      if (error) {
        console.error(`添加分类 "${categoryName}" 失败:`, error);
        continue;
      }
      
      console.log(`成功添加分类: "${categoryName}"`);
      categoryMap.set(categoryName, data.id);
    }
  }
  
  return categoryMap;
}

// 添加标签
async function addTags() {
  console.log('开始添加标签...');
  const tagMap = new Map();
  
  for (const article of sampleArticles) {
    for (const tagName of article.tags) {
      if (tagMap.has(tagName)) continue;
      
      // 生成slug
      const slug = tagName
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      // 检查标签是否已存在
      const { data: existingTag } = await supabase
        .from('tags')
        .select('id')
        .eq('name', tagName)
        .maybeSingle();
      
      if (existingTag) {
        console.log(`标签 "${tagName}" 已存在，跳过`);
        tagMap.set(tagName, existingTag.id);
        continue;
      }
      
      // 添加新标签
      const { data, error } = await supabase
        .from('tags')
        .insert({
          name: tagName,
          slug: slug
        })
        .select()
        .single();
      
      if (error) {
        console.error(`添加标签 "${tagName}" 失败:`, error);
        continue;
      }
      
      console.log(`成功添加标签: "${tagName}"`);
      tagMap.set(tagName, data.id);
    }
  }
  
  return tagMap;
}

// 添加文章
async function addArticles(userId, categoryMap, tagMap) {
  console.log('开始添加文章...');
  
  for (const article of sampleArticles) {
    // 检查文章是否已存在
    const { data: existingArticle } = await supabase
      .from('posts')
      .select('id')
      .eq('slug', article.slug)
      .maybeSingle();
    
    if (existingArticle) {
      console.log(`文章 "${article.title}" 已存在，跳过`);
      continue;
    }
    
    // 添加新文章
    const { data, error } = await supabase
      .from('posts')
      .insert({
        title: article.title,
        slug: article.slug,
        content: article.content,
        excerpt: article.excerpt,
        cover_image: article.coverImage,
        published: article.published,
        featured: article.featured,
        author_id: userId
      })
      .select()
      .single();
    
    if (error) {
      console.error(`添加文章 "${article.title}" 失败:`, error);
      continue;
    }
    
    console.log(`成功添加文章: "${article.title}"`);
    
    // 添加文章-分类关联
    for (const categoryName of article.categories) {
      const categoryId = categoryMap.get(categoryName);
      if (!categoryId) continue;
      
      const { error: categoryError } = await supabase
        .from('post_categories')
        .insert({
          post_id: data.id,
          category_id: categoryId
        });
      
      if (categoryError) {
        console.error(`添加文章-分类关联失败:`, categoryError);
      }
    }
    
    // 添加文章-标签关联
    for (const tagName of article.tags) {
      const tagId = tagMap.get(tagName);
      if (!tagId) continue;
      
      const { error: tagError } = await supabase
        .from('post_tags')
        .insert({
          post_id: data.id,
          tag_id: tagId
        });
      
      if (tagError) {
        console.error(`添加文章-标签关联失败:`, tagError);
      }
    }
  }
}

// 运行初始化
async function init() {
  try {
    const userId = await addUser();
    const categoryMap = await addCategories();
    const tagMap = await addTags();
    await addArticles(userId, categoryMap, tagMap);
    console.log('示例数据初始化完成');
  } catch (error) {
    console.error('初始化过程中发生错误:', error);
  }
}

// 执行初始化
init();
