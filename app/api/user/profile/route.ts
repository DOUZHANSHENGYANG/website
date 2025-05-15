import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import supabase from '@/lib/db/supabase';

// 获取用户个人信息
export async function GET(request: NextRequest) {
  try {
    // 检查登录状态
    const cookieStore = cookies();
    const isLoggedIn = cookieStore.has('isLoggedIn');

    if (!isLoggedIn) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      );
    }

    // 获取管理员用户信息
    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', 'douzhan')
      .single();

    // 转换字段名称以匹配前端
    const user = userData ? {
      ...userData,
      githubUrl: userData.github_url,
      googleEmail: userData.google_email
    } : null;

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || '获取用户信息失败' },
      { status: 500 }
    );
  }
}

// 更新用户个人信息
export async function PUT(request: NextRequest) {
  try {
    // 检查登录状态
    const cookieStore = cookies();
    const isLoggedIn = cookieStore.has('isLoggedIn');

    if (!isLoggedIn) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      );
    }

    // 获取请求体
    const body = await request.json();

    // 验证必填字段
    if (!body.username || !body.email) {
      return NextResponse.json(
        { error: '用户名和邮箱是必填字段' },
        { status: 400 }
      );
    }

    // 更新用户信息
    const { data: user, error } = await supabase
      .from('users')
      .update({
        username: body.username,
        email: body.email,
        bio: body.bio || null,
        avatar: body.avatar || null,
        github_url: body.githubUrl || null,
        google_email: body.googleEmail || null,
        updated_at: new Date().toISOString()
      })
      .eq('username', 'douzhan')
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || '更新用户信息失败' },
      { status: 500 }
    );
  }
}
