'use client';

import React, { useState, useEffect } from 'react';

export default function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const updateProgress = () => {
      // 获取文档高度
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      // 获取当前滚动位置
      const scrollPosition = window.scrollY;
      // 计算进度百分比
      const currentProgress = (scrollPosition / totalHeight) * 100;
      setProgress(currentProgress);
    };
    
    // 添加滚动事件监听器
    window.addEventListener('scroll', updateProgress);
    
    // 初始化进度
    updateProgress();
    
    // 清理事件监听器
    return () => {
      window.removeEventListener('scroll', updateProgress);
    };
  }, []);
  
  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-800 z-50">
      <div
        className="h-full bg-indigo-600 transition-all duration-100 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
