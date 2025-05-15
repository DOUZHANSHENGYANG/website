'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

// 注册Chart.js组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

// 定义统计数据类型
interface Stats {
  summary: {
    postsCount: number;
    publishedPostsCount: number;
    commentsCount: number;
    totalViews: number;
  };
  popularPosts: Array<{
    id: string;
    title: string;
    slug: string;
    view_count: number;
    created_at: string;
    author: {
      id: string;
      username: string;
      avatar: string;
    };
  }>;
  recentComments: Array<{
    id: string;
    content: string;
    created_at: string;
    post: {
      id: string;
      title: string;
      slug: string;
    };
    user: {
      id: string;
      username: string;
      avatar: string;
    } | null;
  }>;
  categoryStats: Array<{
    id: string;
    name: string;
    slug: string;
    count: number;
  }>;
  tagStats: Array<{
    id: string;
    name: string;
    slug: string;
    count: number;
  }>;
  monthlyPosts: Record<string, number>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState('all'); // all, month, week, day

  // 获取统计数据
  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/stats?period=${period}`);
      
      if (!response.ok) {
        throw new Error('获取统计数据失败');
      }

      const data = await response.json();
      setStats(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载和时间段变化时获取统计数据
  useEffect(() => {
    fetchStats();
  }, [period]);

  // 准备分类统计图表数据
  const categoryChartData = {
    labels: stats?.categoryStats.map(cat => cat.name) || [],
    datasets: [
      {
        label: '文章数',
        data: stats?.categoryStats.map(cat => cat.count) || [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // 准备标签统计图表数据
  const tagChartData = {
    labels: stats?.tagStats.slice(0, 10).map(tag => tag.name) || [],
    datasets: [
      {
        label: '文章数',
        data: stats?.tagStats.slice(0, 10).map(tag => tag.count) || [],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  // 准备月度文章发布统计图表数据
  const monthlyPostsData = {
    labels: stats ? Object.keys(stats.monthlyPosts).sort() : [],
    datasets: [
      {
        label: '文章发布数',
        data: stats ? Object.keys(stats.monthlyPosts).sort().map(month => stats.monthlyPosts[month]) : [],
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">数据统计仪表板</h1>
        <div className="flex space-x-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="all">全部时间</option>
            <option value="month">最近一个月</option>
            <option value="week">最近一周</option>
            <option value="day">最近一天</option>
          </select>
          <button
            onClick={fetchStats}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            刷新
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 p-4 rounded-md text-red-700 mb-6">
          {error}
        </div>
      ) : stats ? (
        <div className="space-y-8">
          {/* 统计卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-700">文章总数</h2>
              <p className="text-3xl font-bold text-indigo-600 mt-2">{stats.summary.postsCount}</p>
              <p className="text-sm text-gray-500 mt-1">已发布: {stats.summary.publishedPostsCount}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-700">评论总数</h2>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.summary.commentsCount}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-700">总访问量</h2>
              <p className="text-3xl font-bold text-blue-600 mt-2">{stats.summary.totalViews}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-700">平均阅读量</h2>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {stats.summary.publishedPostsCount > 0
                  ? Math.round(stats.summary.totalViews / stats.summary.publishedPostsCount)
                  : 0}
              </p>
              <p className="text-sm text-gray-500 mt-1">每篇文章</p>
            </div>
          </div>

          {/* 图表区域 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 分类统计 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">分类统计</h2>
              <div className="h-64">
                <Pie data={categoryChartData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>

            {/* 标签统计 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">热门标签 (Top 10)</h2>
              <div className="h-64">
                <Bar data={tagChartData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>

            {/* 月度文章发布统计 */}
            <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">月度文章发布统计</h2>
              <div className="h-64">
                <Line data={monthlyPostsData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
          </div>

          {/* 热门文章 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">热门文章</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">标题</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">作者</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">发布日期</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">浏览量</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.popularPosts.map((post) => (
                    <tr key={post.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{post.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 relative">
                            <Image
                              src={post.author?.avatar || '/images/avatar.svg'}
                              alt={post.author?.username || ''}
                              fill
                              className="rounded-full"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{post.author?.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(post.created_at).toLocaleDateString('zh-CN')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{post.view_count}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link href={`/blog/${post.slug}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                          查看
                        </Link>
                        <Link href={`/admin/posts/${post.id}/edit`} className="text-indigo-600 hover:text-indigo-900">
                          编辑
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 最近评论 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">最近评论</h2>
            <div className="space-y-4">
              {stats.recentComments.map((comment) => (
                <div key={comment.id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 relative">
                      <Image
                        src={comment.user?.avatar || '/images/avatar.svg'}
                        alt={comment.user?.username || '匿名用户'}
                        fill
                        className="rounded-full"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900">
                          {comment.user?.username || '匿名用户'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(comment.created_at).toLocaleDateString('zh-CN')}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        评论文章: <Link href={`/blog/${comment.post.slug}`} className="text-indigo-600 hover:underline">{comment.post.title}</Link>
                      </p>
                      <p className="mt-2 text-sm text-gray-700">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
