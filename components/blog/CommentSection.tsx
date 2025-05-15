'use client';

import React, { useState, useEffect } from 'react';
import CommentList from './CommentList';
import { User } from '@/types';

interface CommentSectionProps {
  postId: string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // 获取当前用户信息
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setIsLoading(true);
        
        // 这里应该是从API获取当前用户信息
        // 现在使用模拟数据
        const mockUser: User = {
          id: 'user1',
          username: '张三',
          email: 'zhangsan@example.com',
          avatar: '/images/avatar.svg',
          role: 'admin',
          createdAt: new Date('2022-01-01'),
          updatedAt: new Date('2022-01-01')
        };
        
        // 模拟API延迟
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setCurrentUser(mockUser);
      } catch (error) {
        console.error('获取用户信息失败:', error);
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCurrentUser();
  }, []);
  
  return (
    <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
      <CommentList postId={postId} currentUser={currentUser} />
    </div>
  );
}
