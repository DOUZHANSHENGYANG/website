'use client';

import React from 'react';

interface ShareButtonsProps {
  title: string;
  url: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ title, url }) => {
  // 编码分享内容
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  // 分享链接
  const shareLinks = {
    weibo: `https://service.weibo.com/share/share.php?url=${encodedUrl}&title=${encodedTitle}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  };

  // 复制链接到剪贴板
  const copyToClipboard = () => {
    navigator.clipboard.writeText(url).then(
      () => {
        alert('链接已复制到剪贴板');
      },
      (err) => {
        console.error('无法复制链接: ', err);
      }
    );
  };

  return (
    <div className="flex flex-col space-y-4 mt-8">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">分享文章</h3>
      <div className="flex space-x-4">
        {/* 微博 */}
        <a
          href={shareLinks.weibo}
          target="_blank"
          rel="noopener noreferrer"
          className="text-red-600 hover:text-red-700"
          aria-label="分享到微博"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M10.096 18.857c-3.882.476-7.2-1.37-7.402-4.133-.202-2.762 2.767-5.413 6.648-5.89 3.882-.476 7.199 1.37 7.402 4.132.201 2.763-2.767 5.415-6.648 5.891zm.63-9.98c-1.856-.23-3.52.666-3.725 2.007-.205 1.34 1.12 2.635 2.977 2.864 1.856.23 3.52-.666 3.725-2.007.204-1.34-1.12-2.635-2.977-2.864zM23 13.252c0-1.437-1.436-2.7-3.213-2.7h-.747c-.67-2.354-2.436-4.415-4.597-5.77.017-.23.024-.47.024-.713 0-2.082-1.69-3.769-3.773-3.769s-3.773 1.687-3.773 3.77c0 .242.028.481.075.713-2.234 1.348-4.001 3.409-4.672 5.769h-.747c-1.775 0-3.212 1.208-3.212 2.7 0 1.437 1.437 2.7 3.212 2.7h.747c.67 2.354 2.437 4.415 4.597 5.77-.017.23-.024.47-.024.713 0 2.082 1.69 3.769 3.773 3.769s3.773-1.687 3.773-3.77c0-.242-.028-.481-.075-.713 2.234-1.348 4.002-3.409 4.672-5.769h.747c1.777 0 3.213-1.208 3.213-2.7z" />
          </svg>
        </a>

        {/* Twitter */}
        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-500"
          aria-label="分享到Twitter"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
          </svg>
        </a>

        {/* Facebook */}
        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-700"
          aria-label="分享到Facebook"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
              clipRule="evenodd"
            />
          </svg>
        </a>

        {/* LinkedIn */}
        <a
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-700 hover:text-blue-800"
          aria-label="分享到LinkedIn"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        </a>

        {/* 复制链接 */}
        <button
          onClick={copyToClipboard}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          aria-label="复制链接"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ShareButtons;
