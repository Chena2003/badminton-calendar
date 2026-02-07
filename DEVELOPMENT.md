# 开发指南 | Development Guide

本文档提供详细的开发说明，帮助开发者快速上手并参与项目开发。

This document provides detailed development instructions to help developers get started quickly.

## 📚 目录 | Table of Contents

- [环境设置](#环境设置)
- [开发工作流](#开发工作流)
- [代码规范](#代码规范)
- [组件开发](#组件开发)
- [数据管理](#数据管理)
- [国际化](#国际化)
- [部署指南](#部署指南)
- [常见问题](#常见问题)

## 🚀 环境设置 | Environment Setup

### 系统要求 | System Requirements

- Node.js 22.x 或更高版本
- npm 9.x 或更高版本
- Git

### 安装步骤 | Installation Steps

```bash
# 1. 克隆仓库
git clone https://github.com/yourusername/badminton-calendar.git
cd badminton-calendar

# 2. 安装依赖
npm install

# 3. 复制公共资源（图标、favicon 等）
npm run setPublicAssets

# 4. 创建环境变量文件
cp .env.sample .env.local
```

### 环境变量配置 | Environment Variables

在 `.env.local` 中配置以下变量：

```env
# 必需 | Required
NEXT_PUBLIC_SITE_KEY=badminton
NEXT_PUBLIC_CURRENT_YEAR=2025

# 可选 | Optional
NEXT_PUBLIC_PLAUSIBLE_KEY=your-plausible-domain
NEXT_PUBLIC_GOOGLE_VERIFICATION=google-verification-code

# 通知服务（可选）
# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email

# Postmark (邮件)
POSTMARK_API_KEY=your-postmark-api-key

# Novu (通知)
NOVU_API_KEY=your-novu-api-key
NOVU_APPLICATION_ID=your-novu-app-id
```

## 🛠️ 开发工作流 | Development Workflow

### 启动开发服务器

```bash
# 启动开发服务器（热重载）
npm run dev

# 应用将在 http://localhost:3000 启动
```

### 构建生产版本

```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

### 代码检查

```bash
# 运行 ESLint
npx eslint src/

# 自动修复问题
npx eslint --fix src/

# 类型检查（如果配置了）
npx tsc --noEmit
```

## 📝 代码规范 | Code Standards

### TypeScript 配置

- **严格模式**: 已启用 `strict: true`
- **空值检查**: 已放宽 `strictNullChecks: false`
- **路径别名**:
  - `@components/*` → `src/components/*`
  - `@models/*` → `src/models/*`
  - `@_db/*` → `_db/*`

### 组件规范

#### 组件文件命名

- 组件文件使用 PascalCase: `MyComponent.tsx`
- 组件目录使用 PascalCase: `components/Card/`
- 每个组件一个目录，包含主文件和可能的子组件

```typescript
// 正确示例
components/Card/
└── Card.tsx

components/Header/
├── Header.tsx
└── Header.tsx
```

#### 组件模板

```typescript
'use client';  // 仅当组件使用客户端特性时添加

import React from 'react';
import { useTranslations } from 'next-intl';

interface Props {
  children?: React.ReactNode;
  // 添加其他 props
}

const MyComponent: React.FC<Props> = ({ children }: Props) => {
  const t = useTranslations('All');

  // Hooks 必须在组件顶部
  const [state, setState] = useState(initialValue);

  return (
    <div className="...">
      {/* JSX 内容 */}
    </div>
  );
};

export default MyComponent;
```

#### 服务器组件 vs 客户端组件

```typescript
// 服务器组件 - 默认（不使用 'use client'）
// 适用于：数据获取、SEO、性能优化
export default async function ServerComponent() {
  const data = await fetchData();
  return <div>{data}</div>;
}

// 客户端组件 - 必须使用 'use client'
// 适用于：交互、状态管理、浏览器 API
'use client';
import React, { useState } from 'react';

export default function ClientComponent() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

### 样式规范

#### Tailwind CSS 使用

```typescript
// 使用 Tailwind 工具类
<div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
    标题
  </h2>
</div>

// 响应式设计
<div className="px-4 md:px-8 lg:px-16">
  内容
</div>

// 状态样式
<button className="bg-green-600 hover:bg-green-700 active:bg-green-800">
  按钮
</button>
```

#### 自定义主题变量

```css
/* src/app/[locale]/globals.css */

:root {
  --bg-color: #ffffff;
  --text-color: #000000;
  --card-bg: #f9fafb;
  --theme-color: #0d6c48; /* Yonex 绿色 */
}

.dark {
  --bg-color: #000000;
  --text-color: #ffffff;
  --card-bg: #1a1a1a;
}
```

### 导入组织

```typescript
// 1. 外部库（React、Next.js、第三方）
import React from 'react';
import { NextRequest } from 'next/server';
import dayjs from 'dayjs';

// 2. 内部导入（使用路径别名）
import Layout from 'components/Layout/Layout';
import RaceModel from 'models/RaceModel';
import { useTranslations } from 'next-intl';

// 3. 相对导入（避免使用）
// import something from '../../../components/...';
```

## 🧩 组件开发 | Component Development

### 创建新组件

```bash
# 创建组件目录和文件
mkdir -p src/components/NewComponent
touch src/components/NewComponent/NewComponent.tsx
```

### 示例：赛事卡片组件

```typescript
'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import Card from 'components/Card/Card';
import { RaceModel } from 'models/RaceModel';

interface Props {
  race: RaceModel;
}

const RaceCard: React.FC<Props> = ({ race }: Props) => {
  const t = useTranslations('All');

  return (
    <Card className="mb-4">
      <h3 className="text-lg font-semibold">{race.name}</h3>
      <p className="text-gray-600">{race.location}</p>
      <p className="text-sm text-gray-500">
        {race.startDate} - {race.endDate}
      </p>
    </Card>
  );
};

export default RaceCard;
```

### 使用 Context

```typescript
'use client';

import React, { useContext } from 'react';
import { useUserContext } from 'components/UserContext';

const MyComponent = () => {
  const { timezone, timeFormat, theme } = useUserContext();

  return (
    <div>
      <p>时区: {timezone}</p>
      <p>时间格式: {timeFormat}</p>
      <p>主题: {theme}</p>
    </div>
  );
};

export default MyComponent;
```

## 📊 数据管理 | Data Management

### 赛事数据结构

赛事数据存储在 `_db/badminton/YYYY.json` 中：

```json
{
  "races": [
    {
      "name": "马来西亚公开赛",
      "englishName": "Malaysia Open",
      "location": "吉隆坡",
      "englishLocation": "Kuala Lumpur",
      "latitude": 3.139,
      "longitude": 101.6869,
      "type": "open",
      "category": "1000",
      "isMajor": true,
      "startDate": "2025-01-07",
      "endDate": "2025-01-12",
      "sessions": {
        "day1": "2025-01-07",
        "day2": "2025-01-08",
        "semifinal": "2025-01-11T13:00:00+08:00",
        "final": "2025-01-12T13:00:00+08:00"
      },
      "sessionTypes": {
        "day1": "group",
        "day2": "group",
        "semifinal": "semifinal",
        "final": "final"
      },
      "slug": "malaysia-open-2025",
      "localeKey": "malaysia-open",
      "tbc": false,
      "canceled": false
    }
  ]
}
```

### 站点配置

配置文件位于 `_db/badminton/config.json`：

```json
{
  "siteKey": "badminton",
  "url": "badminton-calendar.com",
  "calendarOutputYear": 2026,
  "availableYears": [2025, 2026],
  "featuredSessions": [],
  "collapsedSessions": [],
  "eventTypes": [
    {
      "key": "open",
      "name": "公开赛",
      "categories": ["1000", "750", "500", "300", "100", "series"],
      "majorCategories": ["1000"]
    },
    {
      "key": "championship",
      "name": "锦标赛",
      "majorEvent": true
    }
  ],
  "sessionTypes": {
    "group": {
      "key": "group",
      "name": "小组赛",
      "order": 1
    },
    "semifinal": {
      "key": "semifinal",
      "name": "半决赛",
      "order": 2
    },
    "final": {
      "key": "final",
      "name": "决赛",
      "order": 3
    }
  }
}
```

### 添加新赛事

1. **更新赛事数据** (`_db/badminton/YYYY.json`):

```json
{
  "races": [
    {
      "name": "新赛事名称",
      "englishName": "New Tournament Name",
      "location": "赛事地点",
      "englishLocation": "Tournament Location",
      "latitude": 0.0,
      "longitude": 0.0,
      "type": "open",
      "category": "500",
      "isMajor": false,
      "startDate": "2025-XX-XX",
      "endDate": "2025-XX-XX",
      "sessions": {
        "day1": "2025-XX-XX",
        "semifinal": "2025-XX-XXT13:00:00+08:00",
        "final": "2025-XX-XXT13:00:00+08:00"
      },
      "sessionTypes": {
        "day1": "group",
        "semifinal": "semifinal",
        "final": "final"
      },
      "slug": "new-tournament-2025",
      "localeKey": "new-tournament",
      "tbc": false,
      "canceled": false
    }
  ]
}
```

2. **添加翻译** (`locales/zh/localization.json`):

```json
{
  "All": {
    "races": {
      "new-tournament": "新赛事名称"
    }
  }
}
```

3. **添加其他语言的翻译**:
   - `locales/en/localization.json`
   - `locales/zh-HK/localization.json`

## 🌍 国际化 | Internationalization

### 添加新语言

1. 创建新的语言目录：

```bash
mkdir -p locales/your-language
touch locales/your-language/localization.json
```

2. 添加翻译文件：

```json
{
  "All": {
    "date": "Date",
    "time": "Time"
    // ... 其他翻译
  }
}
```

3. 更新配置：

```typescript
// src/i18n.ts
const locales = [
  'zh',
  'zh-HK',
  'en',
  'your-language', // 添加新语言
];
```

```typescript
// src/middleware.ts
export default createMiddleware({
  locales: [
    'en',
    'zh',
    'zh-HK',
    'your-language', // 添加新语言
  ],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
});
```

### 使用翻译

```typescript
// 服务器组件
import { getTranslations } from 'next-intl/server';

export default async function Page() {
  const t = await getTranslations('All');

  return <h1>{t('form.title')}</h1>;
}

// 客户端组件
'use client';
import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations('All');

  return <h1>{t('form.title')}</h1>;
}
```

### 翻译文件结构

```json
{
  "All": {
    "date": "日期",
    "time": "时间",
    "badges": {
      "tbc": "TBC",
      "canceled": "已取消"
    },
    "badminton": {
      "title": "羽毛球赛程日历",
      "subtitle": "世界羽联官方赛程"
    },
    "races": {
      "malaysia-open": "马来西亚公开赛"
    },
    "form": {
      "title": "生成日历",
      "button": "生成"
    }
  }
}
```

## 🚀 部署指南 | Deployment Guide

### 本地构建测试

```bash
# 构建生产版本
npm run build

# 测试生产版本
npm start
```

### 部署到 EdgeOne Pages

本项目支持部署到腾讯云 EdgeOne Pages：

```bash
# 1. 构建项目
npm run build

# 2. 使用 EdgeOne Pages MCP 工具部署
# 该工具会自动：
# - 检测项目类型（fullstack Next.js）
# - 部署 .next 目录
# - 配置 server functions
# - 返回部署 URL
```

部署输出示例：

```json
{
  "url": "https://badminton-calendar.edgeone.cool",
  "projectId": "pages-xxxxx",
  "consoleUrl": "https://console.tencentcloud.com/edgeone/pages/project/...",
  "projectName": "badminton-calendar"
}
```

### 部署后配置

1. **环境变量**: 在 EdgeOne 控制台配置生产环境变量
2. **自定义域名**: 绑定自定义域名（可选）
3. **监控**: 查看部署日志和性能指标

### 其他部署平台

本项目也可以部署到：

- Vercel
- Netlify
- 自定义服务器 (Node.js)

## ❓ 常见问题 | FAQ

### Q: 如何添加新的赛事类型？

A:

1. 更新 `_db/badminton/config.json` 中的 `eventTypes` 数组
2. 添加对应的翻译到 `locales/*/localization.json`
3. 在数据文件中使用新的 `type` 值

### Q: 如何更改主题颜色？

A:

1. 编辑 `src/app/[locale]/globals.css` 中的 CSS 变量
2. 更新 Tailwind 配置中的主题颜色
3. 重新构建项目

### Q: PWA 不工作怎么办？

A:

1. 确保运行 `npm run build` 后生成 `.next/static/` 中的 PWA 文件
2. 检查 `public/manifest.json` 是否正确配置
3. 确保使用 HTTPS（本地开发使用 http://localhost:3000）

### Q: 如何调试 API 路由？

A:

1. 在 API 路由中添加 `console.log()` 语句
2. 在终端查看输出
3. 使用 Postman 或 curl 测试 API 端点

### Q: 时区转换不正确？

A:

1. 确保 dayjs 配置了 utc 和 timezone 插件
2. 检查数据中的时区格式（如 `+08:00`）
3. 在组件中使用正确的时区值

## 📚 参考资源 | Resources

- [Next.js 文档](https://nextjs.org/docs)
- [React 文档](https://react.dev)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [next-intl 文档](https://next-intl-docs.vercel.app/)
- [dayjs 文档](https://day.js.org/)
- [TypeScript 文档](https://www.typescriptlang.org/docs/)

## 🤝 贡献指南 | Contributing

欢迎贡献！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: add some amazing feature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### Commit 消息规范

使用 Conventional Commits 规范：

```
feat: 添加新功能
fix: 修复错误
docs: 更新文档
style: 代码格式（不影响功能）
refactor: 重构代码
perf: 性能优化
test: 添加测试
chore: 构建过程或辅助工具的变动
```

## 📄 许可证 | License

MIT License - 详见 [LICENSE](LICENSE) 文件
