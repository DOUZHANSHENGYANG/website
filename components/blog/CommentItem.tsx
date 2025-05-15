'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Comment, User } from '@/types';
import CommentForm from './CommentForm';

interface CommentItemProps {
  comment: Comment & { user?: User | null };
  currentUser?: User | null;
  onCommentSubmitted: () => void;
  onCommentDeleted: () => void;
  isReply?: boolean;
  level?: number;
}

export default function CommentItem({
  comment,
  currentUser,
  onCommentSubmitted,
  onCommentDeleted,
  isReply = false,
  level = 0
}: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 格式化日期
  const formattedDate = formatDistanceToNow(new Date(comment.createdAt), {
    addSuffix: true,
    locale: zhCN
  });
  
  // 处理回复
  const handleReply = () => {
    setIsReplying(true);
  };
  
  // 取消回复
  const handleCancelReply = () => {
    setIsReplying(false);
  };
  
  // 提交回复后的回调
  const handleReplySubmitted = () => {
    setIsReplying(false);
    onCommentSubmitted();
  };
  
  // 删除评论
  const handleDelete = async () => {
    if (!confirm('确定要删除这条评论吗？此操作不可撤销。')) {
      return;
    }
    
    try {
      setIsDeleting(true);
      setError(null);
      
      const response = await fetch(`/api/comments/${comment.id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '删除评论失败');
      }
      
      onCommentDeleted();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsDeleting(false);
    }
  };
  
  // 检查是否是评论作者或管理员
  const canDelete = currentUser && (
    currentUser.id === comment.userId || 
    currentUser.role === 'admin'
  );
  
  // 最大嵌套层级为3
  const canReply = level < 3;
  
  return (
    <div className={`${isReply ? 'ml-12 mt-4' : 'mt-6'}`}>
      <div className="flex space-x-4">
        {/* 用户头像 */}
        <div className="flex-shrink-0">
          {comment.user ? (
            <Image
              src={comment.user.avatar || '/images/avatar.svg'}
              alt={comment.user.username}
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
        
        {/* 评论内容 */}
        <div className="flex-1">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  {comment.user ? comment.user.username : '匿名用户'}
                </h4>
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                  {formattedDate}
                </span>
              </div>
              
              {/* 操作按钮 */}
              <div className="flex space-x-2">
                {canReply && (
                  <button
                    onClick={handleReply}
                    className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    回复
                  </button>
                )}
                {canDelete && (
                  <button
                    onClick={handleDelete}
                    className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    disabled={isDeleting}
                  >
                    {isDeleting ? '删除中...' : '删除'}
                  </button>
                )}
              </div>
            </div>
            
            {/* 评论内容 */}
            <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
              {comment.content}
            </div>
            
            {/* 错误提示 */}
            {error && (
              <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}
          </div>
          
          {/* 回复表单 */}
          {isReplying && (
            <div className="mt-4">
              <CommentForm
                postId={comment.postId}
                parentId={comment.id}
                currentUser={currentUser}
                onCommentSubmitted={handleReplySubmitted}
                onCancel={handleCancelReply}
                placeholder={`回复 ${comment.user ? comment.user.username : '匿名用户'}...`}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
