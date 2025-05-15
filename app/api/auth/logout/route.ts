import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    // 删除登录cookie
    const cookieStore = cookies();
    cookieStore.delete('isLoggedIn');
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || '登出失败' },
      { status: 500 }
    );
  }
}
