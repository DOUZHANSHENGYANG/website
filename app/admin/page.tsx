'use client';

import { useState } from 'react';
import Link from 'next/link';

// 模拟统计数据
const stats = [
  { name: '文章总数', value: '12' },
  { name: '评论总数', value: '48' },
  { name: '访问量', value: '2,450' },
  { name: '用户数', value: '18' },
];

// 模拟最近文章数据
const recentPosts = [
  {
    id: '1',
    title: '开始使用Next.js构建现代Web应用',
    status: '已发布',
    date: '2023-01-15',
    views: 324,
    comments: 12,
  },
  {
    id: '2',
    title: 'Tailwind CSS：实用优先的CSS框架',
    status: '已发布',
    date: '2023-02-20',
    views: 156,
    comments: 8,
  },
  {
    id: '3',
    title: '使用Supabase构建后端服务',
    status: '草稿',
    date: '2023-03-10',
    views: 0,
    comments: 0,
  },
];

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [initLoading, setInitLoading] = useState(false);
  const [initSuccess, setInitSuccess] = useState<string | null>(null);
  const [initError, setInitError] = useState<string | null>(null);

  // 初始化数据
  const handleInitData = async () => {
    if (!confirm('确定要初始化标签和分类数据吗？这将添加预定义的标签和分类。')) {
      return;
    }

    try {
      setInitLoading(true);
      setInitSuccess(null);
      setInitError(null);

      const response = await fetch('/api/admin/init-data?key=init-data-key');

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '初始化数据失败');
      }

      const data = await response.json();

      // 计算添加的标签和分类数量
      const tagsAdded = data.results.tags.success.length;
      const categoriesAdded = data.results.categories.success.length;

      setInitSuccess(`初始化成功！添加了 ${tagsAdded} 个标签和 ${categoriesAdded} 个分类。`);
    } catch (err: any) {
      setInitError(err.message);
    } finally {
      setInitLoading(false);
    }
  };

  return (
    <div className="min-h-full">
      <div className="flex flex-col">
        <div className="flex-1 flex flex-col">
          <main className="flex-1 pb-8">
            {/* 页面标题 */}
            <div className="bg-white shadow dark:bg-gray-800">
              <div className="px-4 sm:px-6 lg:px-8 py-6">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">仪表板</h1>
              </div>
            </div>

            <div className="mt-8">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* 统计卡片 */}
                <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {stats.map((stat) => (
                    <div
                      key={stat.name}
                      className="bg-white overflow-hidden shadow rounded-lg dark:bg-gray-800"
                    >
                      <div className="p-5">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="ml-5 w-0 flex-1">
                              <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate dark:text-gray-400">
                                  {stat.name}
                                </dt>
                                <dd>
                                  <div className="text-lg font-medium text-gray-900 dark:text-white">
                                    {stat.value}
                                  </div>
                                </dd>
                              </dl>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 最近文章 */}
                {/* 管理功能快捷入口 */}
                <div className="mt-8">
                  <h2 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">管理功能</h2>

                  {/* 初始化数据提示 */}
                  {initSuccess && (
                    <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                      {initSuccess}
                    </div>
                  )}

                  {initError && (
                    <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                      {initError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Link
                      href="/admin/posts"
                      className="bg-white overflow-hidden shadow rounded-lg p-6 hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <p className="text-base font-medium text-gray-900 dark:text-white">文章管理</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">管理所有博客文章</p>
                        </div>
                      </div>
                    </Link>

                    <Link
                      href="/admin/dashboard"
                      className="bg-white overflow-hidden shadow rounded-lg p-6 hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <p className="text-base font-medium text-gray-900 dark:text-white">数据统计</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">查看网站数据分析</p>
                        </div>
                      </div>
                    </Link>

                    <Link
                      href="/admin/categories"
                      className="bg-white overflow-hidden shadow rounded-lg p-6 hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <p className="text-base font-medium text-gray-900 dark:text-white">分类管理</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">管理文章分类</p>
                        </div>
                      </div>
                    </Link>

                    <Link
                      href="/admin/tags"
                      className="bg-white overflow-hidden shadow rounded-lg p-6 hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <p className="text-base font-medium text-gray-900 dark:text-white">标签管理</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">管理文章标签</p>
                        </div>
                      </div>
                    </Link>

                    <Link
                      href="/admin/posts/create"
                      className="bg-white overflow-hidden shadow rounded-lg p-6 hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <p className="text-base font-medium text-gray-900 dark:text-white">创建文章</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">发布新的博客文章</p>
                        </div>
                      </div>
                    </Link>

                    <Link
                      href="/admin/settings/profile"
                      className="bg-white overflow-hidden shadow rounded-lg p-6 hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-pink-500 rounded-md p-3">
                          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <p className="text-base font-medium text-gray-900 dark:text-white">设置</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">管理个人信息和网站设置</p>
                        </div>
                      </div>
                    </Link>

                    <Link
                      href="/admin/upload"
                      className="bg-white overflow-hidden shadow rounded-lg p-6 hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-teal-500 rounded-md p-3">
                          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <p className="text-base font-medium text-gray-900 dark:text-white">上传文档</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">上传Word文档并转换为文章</p>
                        </div>
                      </div>
                    </Link>
                  </div>

                  {/* 初始化数据按钮 */}
                  <div className="mt-6">
                    <button
                      onClick={handleInitData}
                      disabled={initLoading}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {initLoading ? '初始化中...' : '初始化标签和分类数据'}
                    </button>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      点击此按钮将添加预定义的常用标签和分类
                    </p>
                  </div>
                </div>

                {/* 最近文章 */}
                <div className="mt-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">最近文章</h2>
                    <Link
                      href="/admin/posts/create"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      新建文章
                    </Link>
                  </div>
                  <div className="mt-4 flex flex-col">
                    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                      <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg dark:border-gray-700">
                          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                              <tr>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300"
                                >
                                  标题
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300"
                                >
                                  状态
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300"
                                >
                                  日期
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300"
                                >
                                  浏览量
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300"
                                >
                                  评论数
                                </th>
                                <th scope="col" className="relative px-6 py-3">
                                  <span className="sr-only">编辑</span>
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                              {recentPosts.map((post) => (
                                <tr key={post.id}>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                      {post.title}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        post.status === '已发布'
                                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                      }`}
                                    >
                                      {post.status}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {post.date}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {post.views}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {post.comments}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link
                                      href={`/admin/posts/edit/${post.id}`}
                                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                    >
                                      编辑
                                    </Link>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
