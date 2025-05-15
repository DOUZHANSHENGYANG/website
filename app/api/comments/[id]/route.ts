import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/db/supabase';

// 获取单个评论
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // 执行查询
    const { data: comment, error } = await supabase
      .from('comments')
      .select(`
        *,
        user:userId(id, username, avatar)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: error.code === 'PGRST116' ? 404 : 500 }
      );
    }
    
    if (!comment) {
      return NextResponse.json({ error: '评论不存在' }, { status: 404 });
    }
    
    // 格式化响应
    const formattedComment = {
      ...comment,
      user: comment.user || null
    };
    
    return NextResponse.json(formattedComment);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 更新评论
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    
    // 验证必填字段
    if (!body.content) {
      return NextResponse.json(
        { error: '评论内容是必填字段' },
        { status: 400 }
      );
    }
    
    // 更新评论
    const { data: comment, error } = await supabase
      .from('comments')
      .update({
        content: body.content,
        updatedAt: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        user:userId(id, username, avatar)
      `)
      .single();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    if (!comment) {
      return NextResponse.json({ error: '评论不存在' }, { status: 404 });
    }
    
    // 格式化响应
    const formattedComment = {
      ...comment,
      user: comment.user || null
    };
    
    return NextResponse.json(formattedComment);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 删除评论
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // 检查是否有子评论
    const { data: childComments, error: checkError } = await supabase
      .from('comments')
      .select('id')
      .eq('parentId', id);
    
    if (checkError) {
      return NextResponse.json({ error: checkError.message }, { status: 500 });
    }
    
    // 如果有子评论，先删除子评论
    if (childComments && childComments.length > 0) {
      const childIds = childComments.map(comment => comment.id);
      
      const { error: deleteChildrenError } = await supabase
        .from('comments')
        .delete()
        .in('id', childIds);
      
      if (deleteChildrenError) {
        return NextResponse.json({ error: deleteChildrenError.message }, { status: 500 });
      }
    }
    
    // 删除评论
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id);
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
