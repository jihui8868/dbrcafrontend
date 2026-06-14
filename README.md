# DBRCA Chat Frontend

智能对话前端应用，使用 React + TypeScript 开发。

## 功能特性

✨ **用户认证**
- 用户注册和登录
- JWT 令牌管理
- 自动认证状态恢复

💬 **对话管理**
- 多对话支持
- 对话历史列表
- 新建对话
- 对话内容持久化

📤 **消息功能**
- 实时消息发送
- Server-Sent Events (SSE) 流式响应
- 自动滚动到最新消息
- 发送状态指示

📎 **文件上传**
- 支持多文件上传
- 文件信息在消息中显示
- 文件预览

📝 **内容渲染**
- Markdown 支持
- 代码高亮 (语法突出显示)
- 表格渲染
- 图片显示
- 链接支持
- 列表、引用等

🎨 **UI/UX**
- Tailwind CSS 样式
- 响应式设计 (移动/平板/桌面)
- 深色侧边栏设计
- 自适应消息框大小
- 流畅的交互动画

📱 **响应式设计**
- 桌面版完整布局
- 移动版侧边栏隐藏
- 触摸友好的交互

## 快速开始

### 1. 安装依赖

```bash
cd frontend
npm install
# 或
yarn install
```

### 2. 启动开发服务器

```bash
npm run dev
# 或
yarn dev
```

访问 `http://localhost:3000`

### 3. 登录

使用测试账户:
- 用户名: `swaggertest`
- 密码: `test123456`

或创建新账户

### 4. 构建生产版本

```bash
npm run build
# 或
yarn build
```

## 项目结构

```
frontend/
├── src/
│   ├── components/           # React 组件
│   │   ├── ChatWindow.tsx   # 主对话窗口
│   │   ├── Sidebar.tsx      # 左侧边栏
│   │   ├── ChatInput.tsx    # 输入框
│   │   ├── MessageItem.tsx  # 消息项
│   │   └── MessageContent.tsx # 消息内容渲染
│   ├── pages/               # 页面组件
│   │   ├── LoginPage.tsx    # 登录页面
│   │   └── ChatPage.tsx     # 对话页面
│   ├── services/            # API 服务
│   │   └── api.ts          # API 客户端
│   ├── store/              # 状态管理 (Zustand)
│   │   ├── auth.ts         # 认证状态
│   │   └── chat.ts         # 对话状态
│   ├── types/              # TypeScript 类型
│   │   └── index.ts        # 类型定义
│   ├── App.tsx             # 主应用
│   ├── main.tsx            # 入口点
│   └── index.css           # 全局样式
├── vite.config.ts          # Vite 配置
├── tailwind.config.js      # Tailwind 配置
├── tsconfig.json           # TypeScript 配置
└── package.json            # 项目依赖
```

## 技术栈

- **React 18**: UI 框架
- **TypeScript**: 类型安全
- **Vite**: 构建工具
- **Tailwind CSS**: 样式库
- **Zustand**: 状态管理
- **Axios**: HTTP 客户端
- **React Router**: 路由管理
- **React Markdown**: Markdown 渲染
- **React Syntax Highlighter**: 代码高亮
- **Lucide React**: 图标库

## API 集成

前端与后端 API 通信:

### 认证接口
- `POST /auth/register` - 用户注册
- `POST /auth/login` - 用户登录
- `GET /auth/me` - 获取当前用户

### 对话接口
- `GET /chat/sessions` - 获取对话列表
- `POST /chat/sessions` - 创建新对话
- `POST /chat/{id}/message` - 发送消息 (SSE 流式)

## 环境配置

### 开发环境

在 `vite.config.ts` 中配置后端 API 代理:

```typescript
proxy: {
  '/api': {
    target: 'http://localhost:8000',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, ''),
  },
}
```

### 生产环境

修改 `src/services/api.ts` 中的基 URL:

```typescript
baseURL: 'https://api.example.com'
```

## 主要功能详解

### 登录和认证

1. 用户在登录页面输入用户名和密码
2. 后端返回 JWT token
3. Token 存储在 localStorage
4. 后续请求自动附带 token
5. Token 过期时自动重定向到登录页

### 对话系统

1. 用户可以创建多个对话
2. 对话列表显示在左侧边栏
3. 点击对话可以查看历史消息
4. 新建对话后可以立即开始对话

### 消息系统

1. 用户输入消息，点击发送或按 Enter
2. 消息立即显示在对话框
3. 后端返回流式响应
4. 前端逐步显示 AI 回复
5. 消息自动保存到数据库

### 内容渲染

支持多种内容格式:
- 纯文本
- Markdown 格式
- 代码块 (带语法高亮)
- 表格
- 图片
- 链接
- 列表
- 引用

### 文件上传

1. 点击 + 按钮选择文件
2. 文件显示在输入框上方
3. 消息发送时包含文件信息
4. 后端可以访问文件信息

## 快捷键

- **Enter**: 发送消息
- **Shift+Enter**: 换行
- **Ctrl/Cmd+Enter**: 发送消息

## 样式定制

### Tailwind 主色

编辑 `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#10a37f',      // 主色 (绿色)
      secondary: '#343541',    // 次色
      tertiary: '#ececf1',     // 三级色
    },
  },
}
```

### Markdown 样式

编辑 `src/components/MessageContent.tsx` 中的 `components` 配置

## 常见问题

### Q: 如何修改 API 地址?

A: 编辑 `src/services/api.ts` 中的 `baseURL`

### Q: 如何自定义样式?

A: 编辑 `src/index.css` 或 `tailwind.config.js`

### Q: 如何添加新功能?

A: 
1. 在 `src/services/api.ts` 添加 API 方法
2. 在 `src/store/` 添加状态管理
3. 在 `src/components/` 添加 UI 组件
4. 在 `src/pages/` 添加页面

### Q: 如何处理 CORS 问题?

A: 配置 `vite.config.ts` 中的代理或后端启用 CORS

## 部署

### 构建

```bash
npm run build
```

生成 `dist/` 目录

### 部署方式

1. **静态托管** (Vercel, Netlify, GitHub Pages)
   ```bash
   npm run build
   # 上传 dist/ 目录
   ```

2. **Docker**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "run", "preview"]
   ```

3. **服务器**
   - 安装 Node.js
   - `npm install` 和 `npm run build`
   - 使用 pm2 或 systemd 启动
   - 配置 Nginx 反向代理

## 性能优化

- ✅ 代码分割和懒加载
- ✅ 图片优化
- ✅ 自动滚动虚拟化 (可选)
- ✅ 消息流式渲染
- ✅ Zustand 轻量级状态管理

## 浏览器支持

- Chrome/Edge: 最新版本
- Firefox: 最新版本
- Safari: 最新版本
- iOS Safari: iOS 12+
- Android Browser: Android 5+

## 许可证

MIT

## 相关项目

- 后端: [DBRCA Chat API](../backend)

---

**更新时间**: 2026-06-14  
**版本**: 0.1.0  
**状态**: 开发中 ✨
