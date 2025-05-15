'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';

interface RssButtonProps {
  category?: string;
  className?: string;
}

export default function RssButton({ category, className = '' }: RssButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // 处理点击外部关闭下拉菜单
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);
  
  // 构建RSS链接
  const baseUrl = '/api/rss';
  const rssUrl = category ? `${baseUrl}?category=${category}&format=rss` : `${baseUrl}?format=rss`;
  const atomUrl = category ? `${baseUrl}?category=${category}&format=atom` : `${baseUrl}?format=atom`;
  const jsonUrl = category ? `${baseUrl}?category=${category}&format=json` : `${baseUrl}?format=json`;
  
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 text-orange-500 hover:text-orange-600 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 3a1 1 0 000 2c5.523 0 10 4.477 10 10a1 1 0 102 0C17 8.373 11.627 3 5 3z" />
          <path d="M4 9a1 1 0 011-1 7 7 0 017 7 1 1 0 11-2 0 5 5 0 00-5-5 1 1 0 01-1-1z" />
          <path d="M3 15a2 2 0 114 0 2 2 0 01-4 0z" />
        </svg>
        <span>订阅</span>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700">
          <div className="py-1">
            <Link
              href="/rss"
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsOpen(false)}
            >
              RSS订阅页面
            </Link>
            <hr className="my-1 border-gray-200 dark:border-gray-700" />
            <a
              href={rssUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsOpen(false)}
            >
              RSS 2.0
            </a>
            <a
              href={atomUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsOpen(false)}
            >
              Atom
            </a>
            <a
              href={jsonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsOpen(false)}
            >
              JSON Feed
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
