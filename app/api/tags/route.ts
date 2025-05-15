import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/db/supabase';
import { Tag } from '@/types';

// 获取标签列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 分页参数
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '50');
    
    // 搜索参数
    const query = searchParams.get('query') || '';
    
    // 排序参数
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = searchParams.get('sortOrder') || 'asc';
    
    // 计算偏移量
    const offset = (page - 1) * pageSize;
    
    // 构建查询
    let tagsQuery = supabase
      .from('tags')
      .select('*', { count: 'exact' })
      .order(sortBy as any, { ascending: sortOrder === 'asc' })
      .range(offset, offset + pageSize - 1);
    
    // 添加搜索条件
    if (query) {
      tagsQuery = tagsQuery.ilike('name', `%${query}%`);
    }
    
    // 执行查询
    const { data: tags, error, count } = await tagsQuery;
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({
      data: tags,
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

// 创建新标签
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 验证必填字段
    if (!body.name) {
      return NextResponse.json(
        { error: '标签名称是必填字段' },
        { status: 400 }
      );
    }
    
    // 生成slug
    const slug = body.slug || generateSlug(body.name);
    
    // 检查标签名称是否已存在
    const { data: existingTag, error: checkError } = await supabase
      .from('tags')
      .select('id')
      .eq('name', body.name)
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
    
    // 创建标签
    const { data: tag, error } = await supabase
      .from('tags')
      .insert({
        name: body.name,
        slug
      })
      .select()
      .single();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(tag, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 生成slug
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
