import Link from 'next/link';
import Image from 'next/image';

// 模拟博客文章数据
const mockPosts = [
  {
    id: '1',
    title: '开始使用Next.js构建现代Web应用',
    slug: 'getting-started-with-nextjs',
    excerpt: 'Next.js是一个React框架，它使构建高性能、SEO友好的Web应用变得简单。本文将介绍如何开始使用Next.js进行开发。',
    coverImage: '/images/placeholder.svg',
    createdAt: new Date('2023-01-15'),
    author: {
      name: '张三',
      avatar: '/images/avatar.svg'
    },
    categories: ['技术', 'Web开发'],
    tags: ['Next.js', 'React', '前端']
  },
  {
    id: '2',
    title: 'Tailwind CSS：实用优先的CSS框架',
    slug: 'tailwind-css-utility-first-framework',
    excerpt: 'Tailwind CSS是一个功能类优先的CSS框架，它允许您通过组合类名来构建自定义设计，而无需编写CSS。',
    coverImage: '/images/placeholder.svg',
    createdAt: new Date('2023-02-20'),
    author: {
      name: '李四',
      avatar: '/images/avatar.svg'
    },
    categories: ['技术', 'CSS'],
    tags: ['Tailwind CSS', '前端', '设计']
  },
  {
    id: '3',
    title: '使用Supabase构建后端服务',
    slug: 'building-backend-with-supabase',
    excerpt: 'Supabase是一个开源的Firebase替代品，提供了数据库、认证、存储等服务。本文将介绍如何使用Supabase构建后端服务。',
    coverImage: '/images/placeholder.svg',
    createdAt: new Date('2023-03-10'),
    author: {
      name: '王五',
      avatar: '/images/avatar.svg'
    },
    categories: ['技术', '后端'],
    tags: ['Supabase', 'PostgreSQL', 'BaaS']
  }
];

export default function BlogPage() {
  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">博客文章</h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            探索我的最新文章、教程和想法
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {mockPosts.map((post) => (
            <article
              key={post.id}
              className="flex flex-col overflow-hidden rounded-lg shadow-lg transition-shadow hover:shadow-xl dark:bg-gray-800"
            >
              <div className="flex-shrink-0">
                <Image
                  className="h-48 w-full object-cover"
                  src={post.coverImage}
                  alt={post.title}
                  width={600}
                  height={400}
                />
              </div>
              <div className="flex flex-1 flex-col justify-between bg-white p-6 dark:bg-gray-800">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    {post.categories.map((category) => (
                      <Link
                        key={category}
                        href={`/blog/categories/${category.toLowerCase()}`}
                        className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                      >
                        {category}
                      </Link>
                    ))}
                  </div>
                  <Link href={`/blog/${post.slug}`} className="mt-2 block">
                    <p className="text-xl font-semibold text-gray-900 dark:text-white">{post.title}</p>
                    <p className="mt-3 text-base text-gray-500 dark:text-gray-400">{post.excerpt}</p>
                  </Link>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/blog/tags/${tag.toLowerCase()}`}
                        className="text-xs text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="mt-6 flex items-center">
                  <div className="flex-shrink-0">
                    <Image
                      className="h-10 w-10 rounded-full"
                      src={post.author.avatar}
                      alt={post.author.name}
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{post.author.name}</p>
                    <div className="flex space-x-1 text-sm text-gray-500 dark:text-gray-400">
                      <time dateTime={post.createdAt.toISOString()}>
                        {post.createdAt.toLocaleDateString('zh-CN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </time>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <nav className="inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <a
              href="#"
              className="inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 dark:ring-gray-700 dark:hover:bg-gray-800"
            >
              <span className="sr-only">上一页</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
            <a
              href="#"
              aria-current="page"
              className="relative inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              1
            </a>
            <a
              href="#"
              className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 dark:text-white dark:ring-gray-700 dark:hover:bg-gray-800"
            >
              2
            </a>
            <a
              href="#"
              className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 dark:text-white dark:ring-gray-700 dark:hover:bg-gray-800"
            >
              3
            </a>
            <a
              href="#"
              className="inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 dark:ring-gray-700 dark:hover:bg-gray-800"
            >
              <span className="sr-only">下一页</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </nav>
        </div>
      </div>
    </div>
  );
}
