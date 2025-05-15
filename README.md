# 个人博客网站

基于Next.js 14开发的全栈个人博客网站，提供文章发布、管理、评论等功能。

## 当前开发进度

### 阶段一：项目初始化与基础设置

- ✅ 项目初始化与基础设置
- ✅ 配置Tailwind CSS和Shadcn UI
- ✅ 设置项目目录结构
- ✅ 配置ESLint和Prettier
- ✅ 设置Supabase项目
- ✅ 设计数据库模型
- ✅ 配置简单的认证系统（固定用户名密码）
- ✅ 创建基础布局组件（导航栏、页脚）

### 阶段二：核心功能开发

- ✅ 实现用户认证功能
- ✅ 开发文章列表页面
- ✅ 开发文章详情页面
- ✅ 实现Markdown渲染
- ✅ 开发文章管理界面
- ✅ 实现文章CRUD操作
- ✅ 开发分类和标签管理
- ✅ 添加常用内置标签和分类
- ✅ 实现图片上传功能
- ✅ 实现评论系统

### 阶段三：高级功能开发（进行中）

- ✅ 开发搜索功能
- ✅ 实现文章分享功能
- ✅ 开发数据统计仪表板
- ✅ 优化SEO
- ✅ 添加用户个人信息编辑功能
- ✅ 集成阿里云OSS服务和文档上传功能
- ✅ 添加网站地图
- ✅ 实现RSS订阅

## 功能特点

- 🚀 基于Next.js 14 App Router构建
- 💅 使用Tailwind CSS和Shadcn UI设计美观的用户界面
- 📝 支持Markdown编辑和渲染
- 🔍 文章搜索和过滤功能
- 🏷️ 分类和标签管理
- 💬 评论系统
- 📊 访问统计和数据分析
- 📱 响应式设计，支持各种设备
- 🔒 用户认证和权限管理
- 🖼️ 图片上传和管理

## 技术栈

- **前端**：Next.js 14, React, Tailwind CSS, Shadcn UI
- **后端**：Next.js API Routes
- **数据库**：Supabase (PostgreSQL)
- **认证**：自定义认证系统（固定用户名密码）
- **存储**：Supabase Storage
- **工具库**：date-fns, uuid, react-markdown
- **部署**：Vercel

## 快速开始

### 前提条件

- Node.js 18.0.0或更高版本
- npm或yarn或pnpm
- Supabase账号

### 安装

1. **克隆仓库**

```bash
git clone https://github.com/yourusername/personal-blog.git
cd personal-blog
```

2. **安装依赖**

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

3. **环境变量设置**

创建`.env.local`文件并添加以下变量：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

4. **启动开发服务器**

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

5. **打开浏览器访问** [http://localhost:3000](http://localhost:3000)

### 数据库设置

1. 在Supabase中创建新项目
2. 使用`/supabase/schema.sql`文件创建数据库表
3. 设置行级安全策略

## 项目结构

```plaintext
/
├── app/                    # Next.js App Router
│   ├── api/                # API路由
│   ├── admin/              # 管理员页面
│   ├── blog/               # 博客相关页面
│   ├── auth/               # 认证相关页面
│   └── ...
├── components/             # React组件
├── lib/                    # 工具函数和库
├── public/                 # 静态资源
├── styles/                 # 全局样式
├── types/                  # TypeScript类型定义
└── ...
```

## 部署

项目可以轻松部署到Vercel：

1. 在Vercel上创建新项目
2. 连接到GitHub仓库
3. 设置环境变量
4. 部署

## 贡献指南

1. Fork仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request

## 许可证

MIT

## 联系方式

如有任何问题或建议，请通过以下方式联系：

- 邮箱：[your.email@example.com](mailto:your.email@example.com)
- GitHub Issues
