import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageLoadingBar from "@/components/ui/PageLoadingBar";
import BackToTop from "@/components/ui/BackToTop";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "个人博客",
    template: "%s | 个人博客"
  },
  description: "基于Next.js开发的个人博客网站，分享技术文章、教程和个人见解",
  keywords: ["博客", "技术", "Next.js", "React", "Web开发", "前端", "后端"],
  authors: [{ name: "博客作者" }],
  creator: "博客作者",
  publisher: "个人博客",
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "/",
    title: "个人博客",
    description: "基于Next.js开发的个人博客网站，分享技术文章、教程和个人见解",
    siteName: "个人博客",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "个人博客",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "个人博客",
    description: "基于Next.js开发的个人博客网站，分享技术文章、教程和个人见解",
    images: ["/images/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          // 在页面加载前应用主题，避免闪烁
          (function() {
            function getInitialTheme() {
              try {
                // 尝试从localStorage获取主题设置
                const storedTheme = localStorage.getItem('theme');

                // 如果是明确的light或dark主题，直接返回
                if (storedTheme === 'light' || storedTheme === 'dark') {
                  return storedTheme;
                }

                // 如果是system或未设置，则使用系统偏好
                if (storedTheme === 'system' || !storedTheme) {
                  const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                  return isDarkMode ? 'dark' : 'light';
                }

                // 默认返回light
                return 'light';
              } catch (e) {
                // 如果出错，默认返回light
                console.error('主题检测错误:', e);
                return 'light';
              }
            }

            // 应用主题
            const theme = getInitialTheme();
            document.documentElement.classList.remove('light', 'dark');
            document.documentElement.classList.add(theme);
            document.documentElement.style.colorScheme = theme;

            // 调试信息
            console.log('初始主题:', theme);
            console.log('系统偏好:', window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
            console.log('localStorage主题:', localStorage.getItem('theme'));
          })();
        ` }} />
      </head>
      <body className={`${inter.variable} ${robotoMono.variable} antialiased min-h-screen flex flex-col`}>
        <ThemeProvider>
          <PageLoadingBar />
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
          <BackToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
