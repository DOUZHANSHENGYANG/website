'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { User } from '@/types';

interface CommentFormProps {
  postId: string;
  parentId?: string;
  currentUser?: User | null;
  onCommentSubmitted: () => void;
  onCancel?: () => void;
  placeholder?: string;
}

export default function CommentForm({
  postId,
  parentId,
  currentUser,
  onCommentSubmitted,
  onCancel,
  placeholder = '写下你的评论...'
}: CommentFormProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 提交评论
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('评论内容不能为空');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content,
          postId,
          userId: currentUser?.id,
          parentId: parentId || null
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '提交评论失败');
      }
      
      // 重置表单
      setContent('');
      
      // 通知父组件评论已提交
      onCommentSubmitted();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
      <div className="flex space-x-4">
        {/* 用户头像 */}
        <div className="flex-shrink-0">
          {currentUser ? (
            <Image
              src={currentUser.avatar || '/images/avatar.svg'}
              alt={currentUser.username}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          )}
        </div>
        
        {/* 评论表单 */}
        <div className="flex-1">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <textarea
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                rows={3}
                placeholder={placeholder}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
            
            {/* 错误提示 */}
            {error && (
              <div className="mb-3 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}
            
            <div className="flex justify-end space-x-2">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                  disabled={isSubmitting}
                >
                  取消
                </button>
              )}
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? '提交中...' : '提交评论'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
