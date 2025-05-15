import mammoth from 'mammoth';
import { extractExcerptFromMarkdown } from '@/lib/utils';

// 解析Word文档为Markdown
export async function parseDocxToMarkdown(buffer: Buffer): Promise<{
  content: string;
  title: string;
  excerpt: string;
}> {
  try {
    // 使用mammoth将docx转换为HTML
    const result = await mammoth.convertToHtml({ buffer });
    const html = result.value;
    
    // 提取标题（假设第一个h1或h2是标题）
    let title = '';
    const titleMatch = html.match(/<h[12][^>]*>(.*?)<\/h[12]>/i);
    if (titleMatch && titleMatch[1]) {
      title = titleMatch[1].replace(/<[^>]+>/g, '').trim();
    } else {
      // 如果没有找到h1或h2标签，使用文档的前几个字作为标题
      const textMatch = html.replace(/<[^>]+>/g, ' ').trim().match(/^(.{1,50})/);
      title = textMatch ? textMatch[1] + '...' : '未命名文档';
    }
    
    // 将HTML转换为Markdown
    const markdown = htmlToMarkdown(html);
    
    // 提取摘要
    const excerpt = extractExcerptFromMarkdown(markdown, 200);
    
    return {
      content: markdown,
      title,
      excerpt,
    };
  } catch (error) {
    console.error('解析Word文档失败:', error);
    throw error;
  }
}

// 简单的HTML到Markdown转换
function htmlToMarkdown(html: string): string {
  let markdown = html;
  
  // 替换标题
  markdown = markdown.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n');
  markdown = markdown.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n');
  markdown = markdown.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n');
  markdown = markdown.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n');
  markdown = markdown.replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n\n');
  markdown = markdown.replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n\n');
  
  // 替换段落
  markdown = markdown.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');
  
  // 替换粗体和斜体
  markdown = markdown.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
  markdown = markdown.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
  markdown = markdown.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
  markdown = markdown.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');
  
  // 替换链接
  markdown = markdown.replace(/<a[^>]*href="(.*?)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');
  
  // 替换图片
  markdown = markdown.replace(/<img[^>]*src="(.*?)"[^>]*alt="(.*?)"[^>]*>/gi, '![$2]($1)');
  markdown = markdown.replace(/<img[^>]*alt="(.*?)"[^>]*src="(.*?)"[^>]*>/gi, '![$1]($2)');
  markdown = markdown.replace(/<img[^>]*src="(.*?)"[^>]*>/gi, '![]($1)');
  
  // 替换列表
  markdown = markdown.replace(/<ul[^>]*>(.*?)<\/ul>/gis, '$1\n');
  markdown = markdown.replace(/<ol[^>]*>(.*?)<\/ol>/gis, '$1\n');
  markdown = markdown.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');
  
  // 替换引用
  markdown = markdown.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, '> $1\n\n');
  
  // 替换代码块
  markdown = markdown.replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gis, '```\n$1\n```\n\n');
  
  // 替换行内代码
  markdown = markdown.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');
  
  // 替换水平线
  markdown = markdown.replace(/<hr[^>]*>/gi, '---\n\n');
  
  // 替换表格（简单处理）
  markdown = markdown.replace(/<table[^>]*>(.*?)<\/table>/gis, '$1\n\n');
  markdown = markdown.replace(/<tr[^>]*>(.*?)<\/tr>/gis, '$1\n');
  markdown = markdown.replace(/<th[^>]*>(.*?)<\/th>/gi, '| $1 ');
  markdown = markdown.replace(/<td[^>]*>(.*?)<\/td>/gi, '| $1 ');
  
  // 清理HTML标签
  markdown = markdown.replace(/<[^>]+>/g, '');
  
  // 清理多余空行
  markdown = markdown.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  return markdown.trim();
}
