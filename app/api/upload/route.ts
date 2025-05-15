import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import supabase from '@/lib/db/supabase';

// 允许的文件类型
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml'
];

// 最大文件大小 (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    // 解析multipart/form-data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    // 验证文件是否存在
    if (!file) {
      return NextResponse.json(
        { error: '未提供文件' },
        { status: 400 }
      );
    }
    
    // 验证文件类型
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: '不支持的文件类型，仅支持JPEG、PNG、GIF、WebP和SVG' },
        { status: 400 }
      );
    }
    
    // 验证文件大小
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: '文件大小超过限制，最大5MB' },
        { status: 400 }
      );
    }
    
    // 生成唯一文件名
    const fileExtension = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    
    // 获取文件内容
    const fileBuffer = await file.arrayBuffer();
    
    // 上传到Supabase Storage
    const { data, error } = await supabase
      .storage
      .from('images')
      .upload(`uploads/${fileName}`, fileBuffer, {
        contentType: file.type,
        cacheControl: '3600'
      });
    
    if (error) {
      console.error('上传文件到Supabase失败:', error);
      return NextResponse.json(
        { error: '上传文件失败' },
        { status: 500 }
      );
    }
    
    // 获取公共URL
    const { data: publicUrlData } = supabase
      .storage
      .from('images')
      .getPublicUrl(`uploads/${fileName}`);
    
    return NextResponse.json({
      success: true,
      url: publicUrlData.publicUrl,
      fileName: fileName
    });
  } catch (error: any) {
    console.error('上传文件过程中发生错误:', error);
    return NextResponse.json(
      { error: error.message || '上传文件失败' },
      { status: 500 }
    );
  }
}
