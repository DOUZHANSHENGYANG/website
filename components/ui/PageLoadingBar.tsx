'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function PageLoadingBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // 监听路由变化
  useEffect(() => {
    // 重置进度条
    setLoading(true);
    setProgress(0);
    
    // 模拟进度
    const timer1 = setTimeout(() => setProgress(20), 100);
    const timer2 = setTimeout(() => setProgress(40), 300);
    const timer3 = setTimeout(() => setProgress(60), 600);
    const timer4 = setTimeout(() => setProgress(80), 1000);
    const timer5 = setTimeout(() => {
      setProgress(100);
      setTimeout(() => setLoading(false), 200);
    }, 1200);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [pathname, searchParams]);
  
  if (!loading) return null;
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div
        className="h-1 bg-indigo-600 transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
