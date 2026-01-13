# 羽毛球日历生成器

这是一个基于 Next.js 的羽毛球比赛日历生成器，支持自定义筛选和动态生成日历。

## 功能特性

- 📅 动态生成羽毛球比赛日历
- 🎯 自定义筛选：按赛事类型、等级、比赛日类型
- ⚠️ 比赛前闹钟提醒
- 🌐 多语言支持（目前支持中文）
- 📱 支持多种日历格式（WebCal、Google Calendar、ICS文件）

## 赛事类型

- **公开赛**：1000分、750分、500分、300分、100分
- **锦标赛**：世界锦标赛、洲际锦标赛等
- **总决赛**：世界羽联总决赛
- **奥运会**：羽毛球比赛
- **亚运会**：羽毛球比赛

## 比赛日类型

- 小组赛
- 半决赛
- 决赛

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

创建 `.env.local` 文件：

```env
NEXT_PUBLIC_SITE_KEY=badminton
NEXT_PUBLIC_CURRENT_YEAR=2025
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000 查看应用。

### 4. 构建生产版本

```bash
npm run build
npm start
```

## 数据结构

### 赛事数据 (_db/badminton/2025.json)

```json
{
  "races": [
    {
      "name": "马来西亚公开赛",
      "englishName": "Malaysia Open",
      "location": "吉隆坡",
      "latitude": 3.1390,
      "longitude": 101.6869,
      "type": "open",
      "category": "1000",
      "isMajor": true,
      "startDate": "2025-01-07",
      "endDate": "2025-01-12",
      "sessions": {
        "day1": {
          "date": "2025-01-07",
          "type": "group"
        },
        "day2": {
          "date": "2025-01-08",
          "type": "group"
        },
        "day4": {
          "date": "2025-01-10",
          "type": "semifinal"
        },
        "day5": {
          "date": "2025-01-11",
          "type": "final"
        }
      },
      "slug": "malaysia-open-2025",
      "localeKey": "malaysia-open"
    }
  ]
}
```

## API

### 动态生成日历

```
GET /api/badminton-calendar?
  o=1           # 是否包含公开赛 (1/0)
  lc=1000       # 公开赛最低等级 (1000/500/300/100/all)
  c=1           # 是否包含锦标赛 (1/0)
  f=1           # 是否包含总决赛 (1/0)
  y=1           # 是否包含奥运会 (1/0)
  g=1           # 是否包含亚运会 (1/0)
  m=1           # 是否只显示重点比赛 (1/0)
  sg=1          # 是否包含小组赛 (1/0)
  ss=1          # 是否包含半决赛 (1/0)
  sf=1          # 是否包含决赛 (1/0)
  a=30          # 闹钟分钟数 (0/30/60/90/120)
  lang=zh       # 语言 (zh/en)
```

返回 ICS 格式的日历文件。

### 示例

```bash
# 只看1000分以上公开赛
curl "http://localhost:3000/api/badminton-calendar?o=1&lc=1000&c=0&f=0&y=0&g=0&m=0&sg=1&ss=1&sf=1&a=0&lang=zh"

# 只看重点比赛（1000分、世锦赛、总决赛）
curl "http://localhost:3000/api/badminton-calendar?o=1&lc=1000&c=1&f=1&y=0&g=0&m=1&sg=0&ss=0&sf=1&a=30&lang=zh"
```

## 目录结构

```
badminton-calendar/
├── _db/
│   ├── sites.json                          # 站点配置
│   └── badminton/
│       ├── config.json                     # 羽毛球站点配置
│       ├── 2025.json                      # 2025年赛程数据
│       └── 2026.json                      # 2026年赛程数据
├── _public/
│   └── badminton/                         # 静态资源
├── locales/
│   └── zh/
│       └── localization.json               # 中文翻译
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── page.tsx                   # 主页
│   │   │   └── generate/
│   │   │       ├── page.tsx               # 日历生成页
│   │   │       └── badminton-form.tsx    # 羽毛球日历生成表单
│   │   ├── api/
│   │   │   └── badminton-calendar/
│   │   │       └── route.ts               # 羽毛球日历动态生成API
│   │   └── layout.tsx
│   └── components/                         # UI组件
├── next.config.js
├── package.json
└── tsconfig.json
```

## 添加新赛事

编辑 `_db/badminton/YYYY.json` 文件，添加新的赛事对象：

```json
{
  "name": "赛事名称",
  "englishName": "Event Name",
  "location": "城市",
  "latitude": 0,
  "longitude": 0,
  "type": "open|championship|finals|olympics|asiangames",
  "category": "1000|750|500|300|100",  // 仅当type为open时需要
  "isMajor": true,
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "sessions": {
    "day1": {
      "date": "YYYY-MM-DD",
      "type": "group|semifinal|final"
    }
  },
  "slug": "event-slug",
  "localeKey": "event-locale-key"
}
```

然后添加翻译到 `locales/zh/localization.json`：

```json
{
  "races": {
    "event-locale-key": "赛事中文名称"
  }
}
```

## 技术栈

- **Next.js 15** - React 框架
- **React 19** - UI库
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式
- **dayjs** - 日期处理
- **ics** - ICS文件生成
- **next-intl** - 国际化

## 许可证

ISC

## 致谢

基于 [F1 Calendar](https://github.com/sportstimes/f1) 项目开发。
