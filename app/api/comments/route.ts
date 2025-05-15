import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/db/supabase';
import { Comment } from '@/types';

// 获取评论列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 必须提供文章ID
    const postId = searchParams.get('postId');
    if (!postId) {
      return NextResponse.json(
        { error: '必须提供文章ID' },
        { status: 400 }
      );
    }
    
    // 分页参数
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    
    // 排序参数
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    
    // 计算偏移量
    const offset = (page - 1) * pageSize;
    
    // 构建查询
    let commentsQuery = supabase
      .from('comments')
      .select(`
        *,
        user:userId(id, username, avatar)
      `, { count: 'exact' })
      .eq('postId', postId)
      .order(sortBy as any, { ascending: sortOrder === 'asc' })
      .range(offset, offset + pageSize - 1);
    
    // 执行查询
    const { data: comments, error, count } = await commentsQuery;
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // 格式化响应
    const formattedComments = comments.map((comment: any) => ({
      ...comment,
      user: comment.user || null
    }));
    
    return NextResponse.json({
      data: formattedComments,
      meta: {
        total: count || 0,
        page,
        pageSize,
        pageCount: Math.ceil((count || 0) / pageSize)
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 创建新评论
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 验证必填字段
    if (!body.content || !body.postId) {
      return NextResponse.json(
        { error: '评论内容和文章ID是必填字段' },
        { status: 400 }
      );
    }
    
    // 创建评论
    const { data: comment, error } = await supabase
      .from('comments')
      .insert({
        content: body.content,
        postId: body.postId,
        userId: body.userId || null, // 支持匿名评论
        parentId: body.parentId || null, // 支持嵌套评论
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .select(`
        *,
        user:userId(id, username, avatar)
      `)
      .single();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // 格式化响应
    const formattedComment = {
      ...comment,
      user: comment.user || null
    };
    
    return NextResponse.json(formattedComment, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
