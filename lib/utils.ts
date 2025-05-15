import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 合并Tailwind CSS类名
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 格式化日期
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * 截取文本
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * 生成随机ID
 */
export function generateId(length: number = 8): string {
  return Math.random().toString(36).substring(2, 2 + length);
}

/**
 * 从Markdown中提取纯文本
 */
export function extractTextFromMarkdown(markdown: string): string {
  // 移除标题
  let text = markdown.replace(/#+\s+(.*)/g, '$1');
  
  // 移除链接，保留链接文本
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  
  // 移除图片
  text = text.replace(/!\[([^\]]*)\]\([^)]+\)/g, '');
  
  // 移除粗体和斜体
  text = text.replace(/(\*\*|__)(.*?)\1/g, '$2');
  text = text.replace(/(\*|_)(.*?)\1/g, '$2');
  
  // 移除代码块
  text = text.replace(/```[\s\S]*?```/g, '');
  
  // 移除行内代码
  text = text.replace(/`([^`]+)`/g, '$1');
  
  // 移除HTML标签
  text = text.replace(/<[^>]*>/g, '');
  
  // 移除多余空格和换行
  text = text.replace(/\n+/g, ' ');
  text = text.replace(/\s+/g, ' ');
  
  return text.trim();
}

/**
 * 从Markdown中提取摘要
 */
export function extractExcerptFromMarkdown(markdown: string, maxLength: number = 160): string {
  const text = extractTextFromMarkdown(markdown);
  return truncateText(text, maxLength);
}

/**
 * 从URL中获取文件扩展名
 */
export function getFileExtension(url: string): string {
  return url.split('.').pop()?.toLowerCase() || '';
}

/**
 * 检查URL是否为图片
 */
export function isImageUrl(url: string): boolean {
  const extension = getFileExtension(url);
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension);
}

/**
 * 生成图片的alt文本
 */
export function generateImageAlt(filename: string, fallback: string = '图片'): string {
  if (!filename) return fallback;
  
  // 移除扩展名和路径
  const name = filename.split('/').pop()?.split('.')[0] || '';
  
  // 将连字符和下划线替换为空格
  const cleanName = name.replace(/[-_]/g, ' ');
  
  return cleanName || fallback;
}
