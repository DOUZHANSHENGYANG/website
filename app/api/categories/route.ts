import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/db/supabase';
import { Category } from '@/types';

// 获取分类列表
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
    let categoriesQuery = supabase
      .from('categories')
      .select('*', { count: 'exact' })
      .order(sortBy as any, { ascending: sortOrder === 'asc' })
      .range(offset, offset + pageSize - 1);
    
    // 添加搜索条件
    if (query) {
      categoriesQuery = categoriesQuery.or(`name.ilike.%${query}%, description.ilike.%${query}%`);
    }
    
    // 执行查询
    const { data: categories, error, count } = await categoriesQuery;
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({
      data: categories,
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

// 创建新分类
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 验证必填字段
    if (!body.name) {
      return NextResponse.json(
        { error: '分类名称是必填字段' },
        { status: 400 }
      );
    }
    
    // 生成slug
    const slug = body.slug || generateSlug(body.name);
    
    // 检查分类名称是否已存在
    const { data: existingCategory, error: checkError } = await supabase
      .from('categories')
      .select('id')
      .eq('name', body.name)
      .maybeSingle();
    
    if (checkError) {
      return NextResponse.json({ error: checkError.message }, { status: 500 });
    }
    
    if (existingCategory) {
      return NextResponse.json(
        { error: '分类名称已存在' },
        { status: 400 }
      );
    }
    
    // 创建分类
    const { data: category, error } = await supabase
      .from('categories')
      .insert({
        name: body.name,
        slug,
        description: body.description || null
      })
      .select()
      .single();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(category, { status: 201 });
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
