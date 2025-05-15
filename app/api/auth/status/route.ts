import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // 检查登录cookie
    const cookieStore = cookies();
    const isLoggedIn = cookieStore.has('isLoggedIn');
    
    return NextResponse.json({ isLoggedIn });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || '检查登录状态失败', isLoggedIn: false },
      { status: 500 }
    );
  }
}
