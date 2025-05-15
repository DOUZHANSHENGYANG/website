import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/db/supabase';

// 获取单个标签
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // 检查是否是slug而不是ID
    const isSlug = isNaN(parseInt(id));
    
    // 构建查询
    let query = supabase.from('tags').select('*');
    
    // 根据ID或slug查询
    if (isSlug) {
      query = query.eq('slug', id);
    } else {
      query = query.eq('id', id);
    }
    
    // 执行查询
    const { data: tag, error } = await query.single();
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: error.code === 'PGRST116' ? 404 : 500 }
      );
    }
    
    if (!tag) {
      return NextResponse.json({ error: '标签不存在' }, { status: 404 });
    }
    
    return NextResponse.json(tag);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 更新标签
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    
    // 验证必填字段
    if (!body.name) {
      return NextResponse.json(
        { error: '标签名称是必填字段' },
        { status: 400 }
      );
    }
    
    // 检查标签名称是否已存在（排除当前标签）
    const { data: existingTag, error: checkError } = await supabase
      .from('tags')
      .select('id')
      .eq('name', body.name)
      .neq('id', id)
      .maybeSingle();
    
    if (checkError) {
      return NextResponse.json({ error: checkError.message }, { status: 500 });
    }
    
    if (existingTag) {
      return NextResponse.json(
        { error: '标签名称已存在' },
        { status: 400 }
      );
    }
    
    // 更新标签
    const { data: tag, error } = await supabase
      .from('tags')
      .update({
        name: body.name,
        slug: body.slug
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    if (!tag) {
      return NextResponse.json({ error: '标签不存在' }, { status: 404 });
    }
    
    return NextResponse.json(tag);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 删除标签
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // 检查标签是否被文章使用
    const { data: usedByPosts, error: checkError } = await supabase
      .from('post_tags')
      .select('postId')
      .eq('tagId', id);
    
    if (checkError) {
      return NextResponse.json({ error: checkError.message }, { status: 500 });
    }
    
    if (usedByPosts && usedByPosts.length > 0) {
      return NextResponse.json(
        { error: '该标签正在被文章使用，无法删除' },
        { status: 400 }
      );
    }
    
    // 删除标签
    const { error } = await supabase
      .from('tags')
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
