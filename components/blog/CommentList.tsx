'use client';

import React, { useState, useEffect } from 'react';
import { Comment, User } from '@/types';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';

interface CommentListProps {
  postId: string;
  currentUser?: User | null;
}

export default function CommentList({ postId, currentUser }: CommentListProps) {
  const [comments, setComments] = useState<(Comment & { user?: User | null; replies?: (Comment & { user?: User | null })[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  
  // 获取评论
  const fetchComments = async (pageNum = 1, append = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/comments?postId=${postId}&page=${pageNum}&pageSize=20`);
      
      if (!response.ok) {
        throw new Error('获取评论失败');
      }
      
      const data = await response.json();
      
      // 处理评论数据，将回复组织成树形结构
      const commentMap = new Map();
      const rootComments: any[] = [];
      
      // 首先，将所有评论放入Map中
      data.data.forEach((comment: Comment & { user?: User | null }) => {
        commentMap.set(comment.id, { ...comment, replies: [] });
      });
      
      // 然后，组织成树形结构
      commentMap.forEach((comment) => {
        if (comment.parentId) {
          // 这是一个回复
          const parentComment = commentMap.get(comment.parentId);
          if (parentComment) {
            parentComment.replies.push(comment);
          } else {
            // 如果找不到父评论，就作为根评论处理
            rootComments.push(comment);
          }
        } else {
          // 这是一个根评论
          rootComments.push(comment);
        }
      });
      
      // 更新状态
      if (append) {
        setComments((prev) => [...prev, ...rootComments]);
      } else {
        setComments(rootComments);
      }
      
      // 检查是否有更多评论
      setHasMore(pageNum < data.meta.pageCount);
      setPage(pageNum);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // 初始加载
  useEffect(() => {
    fetchComments();
  }, [postId]);
  
  // 加载更多评论
  const handleLoadMore = () => {
    fetchComments(page + 1, true);
  };
  
  // 评论提交后刷新列表
  const handleCommentSubmitted = () => {
    fetchComments();
  };
  
  // 评论删除后刷新列表
  const handleCommentDeleted = () => {
    fetchComments();
  };
  
  // 渲染评论及其回复
  const renderCommentWithReplies = (comment: Comment & { user?: User | null; replies?: (Comment & { user?: User | null })[] }, level = 0) => {
    return (
      <React.Fragment key={comment.id}>
        <CommentItem
          comment={comment}
          currentUser={currentUser}
          onCommentSubmitted={handleCommentSubmitted}
          onCommentDeleted={handleCommentDeleted}
          isReply={level > 0}
          level={level}
        />
        
        {/* 渲染回复 */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="ml-12">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                currentUser={currentUser}
                onCommentSubmitted={handleCommentSubmitted}
                onCommentDeleted={handleCommentDeleted}
                isReply={true}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </React.Fragment>
    );
  };
  
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">评论</h2>
      
      {/* 评论表单 */}
      <CommentForm
        postId={postId}
        currentUser={currentUser}
        onCommentSubmitted={handleCommentSubmitted}
      />
      
      {/* 评论列表 */}
      <div className="mt-8">
        {loading && comments.length === 0 ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            暂无评论，成为第一个评论的人吧！
          </div>
        ) : (
          <div>
            {comments.map((comment) => renderCommentWithReplies(comment))}
            
            {/* 加载更多按钮 */}
            {hasMore && (
              <div className="mt-6 text-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-300 rounded-md hover:bg-indigo-50 dark:bg-gray-800 dark:text-indigo-400 dark:border-indigo-700 dark:hover:bg-gray-700"
                >
                  {loading ? '加载中...' : '加载更多评论'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
