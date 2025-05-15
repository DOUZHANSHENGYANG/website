'use client';

import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/Alert';

export default function SiteSettingsPage() {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-6">网站设置</h1>
      
      <Alert className="mb-6 bg-blue-50 text-blue-800 border-blue-200">
        <AlertDescription>网站设置功能正在开发中，敬请期待。</AlertDescription>
      </Alert>
    </div>
  );
}
