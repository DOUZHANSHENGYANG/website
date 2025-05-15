import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

export async function GET(request: NextRequest) {
  try {
    // 检查API密钥
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    
    if (key !== process.env.ADMIN_API_KEY) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }
    
    // 执行网站地图生成脚本
    const scriptPath = path.join(process.cwd(), 'scripts', 'generate-sitemap.js');
    const { stdout, stderr } = await execAsync(`node ${scriptPath}`);
    
    if (stderr) {
      console.error('生成网站地图时发生错误:', stderr);
      return NextResponse.json(
        { error: '生成网站地图失败', details: stderr },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: '网站地图已成功重新生成',
      details: stdout
    });
  } catch (error: any) {
    console.error('重新生成网站地图失败:', error);
    return NextResponse.json(
      { error: error.message || '重新生成网站地图失败' },
      { status: 500 }
    );
  }
}
