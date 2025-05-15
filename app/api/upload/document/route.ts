import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { parseDocxToMarkdown } from '@/lib/document/parser';
import { uploadToOSS } from '@/lib/oss/client';
import supabase from '@/lib/db/supabase';

// 处理文档上传
export async function POST(request: NextRequest) {
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
    
    // 解析multipart/form-data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: '未提供文件' },
        { status: 400 }
      );
    }
    
    // 检查文件类型
    if (!file.name.endsWith('.docx')) {
      return NextResponse.json(
        { error: '仅支持.docx格式的Word文档' },
        { status: 400 }
      );
    }
    
    // 读取文件内容
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // 解析文档内容
    const { content, title, excerpt } = await parseDocxToMarkdown(buffer);
    
    // 生成唯一文件名
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;
    
    // 上传原始文档到OSS
    const fileUrl = await uploadToOSS(buffer, fileName);
    
    // 获取管理员用户信息
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('username', 'douzhan')
      .single();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: '获取用户信息失败' },
        { status: 500 }
      );
    }
    
    // 生成文章slug
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50) + '-' + timestamp.toString().substring(6);
    
    // 创建文章
    const { data: post, error: postError } = await supabase
      .from('posts')
      .insert({
        title,
        slug,
        content,
        excerpt,
        author_id: user.id,
        published: false,
        featured: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        source_url: fileUrl,
        source_type: 'docx',
      })
      .select()
      .single();
    
    if (postError) {
      return NextResponse.json(
        { error: '创建文章失败: ' + postError.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      post: {
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        sourceUrl: fileUrl,
      },
    });
  } catch (error: any) {
    console.error('文档上传处理失败:', error);
    return NextResponse.json(
      { error: error.message || '文档上传处理失败' },
      { status: 500 }
    );
  }
}
