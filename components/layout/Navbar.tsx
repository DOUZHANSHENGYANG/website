'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ThemeToggle from '@/components/theme/ThemeToggle';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // 检查登录状态
  useEffect(() => {
    // 从cookie中检查登录状态
    // 由于无法直接访问HTTP-only cookie，我们需要通过API检查
    const checkLoginStatus = async () => {
      try {
        const response = await fetch('/api/auth/status');
        const data = await response.json();
        setIsLoggedIn(data.isLoggedIn);
      } catch (error) {
        console.error('检查登录状态失败:', error);
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  // 处理登出
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      // 重定向到首页
      router.push('/');
      // 刷新页面以确保状态更新
      router.refresh();
    } catch (error) {
      console.error('登出失败:', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm dark:bg-gray-900 dark:border-b dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-indigo-600 dark:text-indigo-400 flex items-center">
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
                </svg>
                个人博客
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className="nav-link border-transparent hover:border-indigo-300 hover:text-indigo-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium dark:hover:text-indigo-400 transition-colors"
              >
                首页
              </Link>
              <Link
                href="/blog"
                className="nav-link border-transparent hover:border-indigo-300 hover:text-indigo-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium dark:hover:text-indigo-400 transition-colors"
              >
                博客
              </Link>
              <Link
                href="/blog/categories"
                className="nav-link border-transparent hover:border-indigo-300 hover:text-indigo-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium dark:hover:text-indigo-400 transition-colors"
              >
                分类
              </Link>
              <Link
                href="/blog/tags"
                className="nav-link border-transparent hover:border-indigo-300 hover:text-indigo-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium dark:hover:text-indigo-400 transition-colors"
              >
                标签
              </Link>
              <Link
                href="/about"
                className="nav-link border-transparent hover:border-indigo-300 hover:text-indigo-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium dark:hover:text-indigo-400 transition-colors"
              >
                关于
              </Link>
              <Link
                href="/search"
                className="nav-link border-transparent hover:border-indigo-300 hover:text-indigo-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium dark:hover:text-indigo-400 transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                搜索
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="ml-3 relative flex items-center space-x-4">
              <ThemeToggle />
              {isLoggedIn ? (
                <>
                  <Link
                    href="/admin"
                    className="nav-link px-3 py-2 rounded-md text-sm font-medium"
                  >
                    管理后台
                  </Link>
                  <Link
                    href="/admin/settings/profile"
                    className="nav-link px-3 py-2 rounded-md text-sm font-medium"
                  >
                    设置
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="nav-link px-3 py-2 rounded-md text-sm font-medium"
                  >
                    登出
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/login"
                  className="nav-link px-3 py-2 rounded-md text-sm font-medium"
                >
                  登录
                </Link>
              )}
            </div>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:hover:bg-gray-800 dark:hover:text-indigo-400 transition-colors"
              aria-expanded="false"
            >
              <span className="sr-only">打开主菜单</span>
              {isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className="bg-indigo-50 border-indigo-500 text-indigo-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium dark:bg-gray-800/80 dark:border-indigo-400 dark:text-indigo-300"
            >
              首页
            </Link>
            <Link
              href="/blog"
              className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-indigo-300 hover:text-indigo-600 block pl-3 pr-4 py-2 border-l-4 text-base font-medium dark:text-gray-300 dark:hover:bg-gray-800/80 dark:hover:text-indigo-400 transition-colors"
            >
              博客
            </Link>
            <Link
              href="/blog/categories"
              className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-indigo-300 hover:text-indigo-600 block pl-3 pr-4 py-2 border-l-4 text-base font-medium dark:text-gray-300 dark:hover:bg-gray-800/80 dark:hover:text-indigo-400 transition-colors"
            >
              分类
            </Link>
            <Link
              href="/blog/tags"
              className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-indigo-300 hover:text-indigo-600 block pl-3 pr-4 py-2 border-l-4 text-base font-medium dark:text-gray-300 dark:hover:bg-gray-800/80 dark:hover:text-indigo-400 transition-colors"
            >
              标签
            </Link>
            <Link
              href="/about"
              className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-indigo-300 hover:text-indigo-600 block pl-3 pr-4 py-2 border-l-4 text-base font-medium dark:text-gray-300 dark:hover:bg-gray-800/80 dark:hover:text-indigo-400 transition-colors"
            >
              关于
            </Link>
            <Link
              href="/search"
              className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-indigo-300 hover:text-indigo-600 block pl-3 pr-4 py-2 border-l-4 text-base font-medium dark:text-gray-300 dark:hover:bg-gray-800/80 dark:hover:text-indigo-400 transition-colors"
            >
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                搜索
              </div>
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700/80">
            <div className="px-4 py-2 flex items-center">
              <span className="text-base font-medium text-gray-500 dark:text-gray-300 mr-2">主题：</span>
              <ThemeToggle />
            </div>
            <div className="mt-3 space-y-1">
              {isLoggedIn ? (
                <>
                  <Link
                    href="/admin"
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-indigo-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-indigo-400 dark:hover:bg-gray-800/80 transition-colors"
                  >
                    管理后台
                  </Link>
                  <Link
                    href="/admin/settings/profile"
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-indigo-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-indigo-400 dark:hover:bg-gray-800/80 transition-colors"
                  >
                    设置
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-indigo-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-indigo-400 dark:hover:bg-gray-800/80 transition-colors"
                  >
                    登出
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/login"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-indigo-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-indigo-400 dark:hover:bg-gray-800/80 transition-colors"
                >
                  登录
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
