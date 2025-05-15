import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 这个中间件将在每个请求之前运行
export function middleware(request: NextRequest) {
  // 获取当前路径
  const path = request.nextUrl.pathname;
  
  // 检查是否是后台路径
  const isAdminPath = path.startsWith('/admin');
  
  // 检查是否已登录（从cookie中获取）
  const isLoggedIn = request.cookies.has('isLoggedIn');
  
  // 如果是后台路径但未登录，重定向到登录页面
  if (isAdminPath && !isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  
  // 如果已登录且访问登录页面，重定向到后台
  if (path === '/auth/login' && isLoggedIn) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }
  
  return NextResponse.next();
}

// 配置中间件应用的路径
export const config = {
  matcher: ['/admin/:path*', '/auth/login'],
};
