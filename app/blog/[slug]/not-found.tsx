import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="bg-white dark:bg-gray-900 min-h-[70vh] flex items-center justify-center">
      <div className="text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
          文章不存在
        </h2>
        <p className="mt-4 text-base text-gray-500 dark:text-gray-400">
          抱歉，您要查找的文章不存在或已被删除。
        </p>
        <div className="mt-6">
          <Link
            href="/blog"
            className="inline-flex items-center rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            返回博客列表
          </Link>
        </div>
      </div>
    </div>
  );
}
