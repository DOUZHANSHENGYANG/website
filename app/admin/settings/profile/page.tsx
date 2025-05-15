'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import ImageUploader from '@/components/ui/ImageUploader';

export default function ProfileSettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // 表单状态
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [googleEmail, setGoogleEmail] = useState('');
  
  // 获取用户信息
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/user/profile');
        
        if (!response.ok) {
          throw new Error('获取用户信息失败');
        }
        
        const userData = await response.json();
        setUser(userData);
        
        // 设置表单初始值
        setUsername(userData.username || '');
        setEmail(userData.email || '');
        setBio(userData.bio || '');
        setAvatar(userData.avatar || '');
        setGithubUrl(userData.githubUrl || '');
        setGoogleEmail(userData.googleEmail || '');
      } catch (err: any) {
        console.error('获取用户信息错误:', err);
        setError(err.message || '获取用户信息失败');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, []);
  
  // 保存用户信息
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          bio,
          avatar,
          githubUrl,
          googleEmail,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '保存用户信息失败');
      }
      
      const updatedUser = await response.json();
      setUser(updatedUser);
      setSuccess('个人信息已成功更新');
      
      // 3秒后清除成功消息
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err: any) {
      console.error('保存用户信息错误:', err);
      setError(err.message || '保存用户信息失败');
    } finally {
      setSaving(false);
    }
  };
  
  // 处理头像上传
  const handleAvatarUpload = (url: string) => {
    setAvatar(url);
  };
  
  // 验证GitHub URL
  const validateGithubUrl = (url: string) => {
    if (!url) return true;
    return url.startsWith('https://github.com/');
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-6">个人信息设置</h1>
          
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                {/* 头像上传 */}
                <div className="space-y-2">
                  <Label htmlFor="avatar">头像</Label>
                  <div className="flex items-center space-x-4">
                    <div className="relative h-24 w-24 rounded-full overflow-hidden">
                      <OptimizedImage
                        src={avatar || '/images/avatar.svg'}
                        alt="用户头像"
                        fill
                        className="object-cover"
                        wrapperClassName="h-24 w-24 rounded-full"
                      />
                    </div>
                    <ImageUploader onUpload={handleAvatarUpload} />
                  </div>
                </div>
              </div>
              
              {/* 用户名 */}
              <div className="space-y-2">
                <Label htmlFor="username">用户名</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              
              {/* 邮箱 */}
              <div className="space-y-2">
                <Label htmlFor="email">邮箱</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              {/* GitHub链接 */}
              <div className="space-y-2">
                <Label htmlFor="githubUrl">GitHub链接</Label>
                <Input
                  id="githubUrl"
                  type="url"
                  placeholder="https://github.com/yourusername"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                />
                {githubUrl && !validateGithubUrl(githubUrl) && (
                  <p className="text-sm text-red-500">请输入有效的GitHub链接，以https://github.com/开头</p>
                )}
              </div>
              
              {/* 谷歌邮箱 */}
              <div className="space-y-2">
                <Label htmlFor="googleEmail">谷歌邮箱</Label>
                <Input
                  id="googleEmail"
                  type="email"
                  placeholder="youremail@gmail.com"
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                />
              </div>
              
              {/* 个人简介 */}
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="bio">个人简介</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  placeholder="介绍一下自己..."
                />
              </div>
            </div>
            
            {/* 提交按钮 */}
            <div className="flex justify-end">
              <Button type="submit" disabled={saving || (githubUrl && !validateGithubUrl(githubUrl))}>
                {saving ? '保存中...' : '保存更改'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
