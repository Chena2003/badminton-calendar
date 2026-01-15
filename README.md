# 羽毛球赛程日历 | Badminton Calendar

一个基于 Next.js 15 的羽毛球赛事日历生成器，支持多语言、自定义筛选和日历导出功能。

A Next.js 15 badminton tournament calendar generator with multi-language support, custom filtering, and calendar export capabilities.

![Badminton Calendar](public/logo.png)

## ✨ 特性 | Features

- 🗓️ **动态日历生成** - 根据用户偏好生成自定义 ICS 日历文件
- 🌍 **多语言支持** - 支持简体中文、繁体中文（香港）
- 🎯 **灵活筛选** - 按赛事类型、级别、阶段筛选比赛
- ⏰ **时区支持** - 自动检测用户时区，支持手动切换
- 🔔 **赛前提醒** - 可设置比赛前 30/60/90/120 分钟提醒
- 🌓 **深色模式** - 支持浅色/深色主题切换
- 📱 **PWA 支持** - 可安装为桌面/移动应用
- 🎨 **Yonex 品牌配色** - 采用 Yonex 绿色主题

## 🛠️ 技术栈 | Tech Stack

- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **国际化**: next-intl
- **日期处理**: dayjs
- **日历格式**: ics (iCalendar)
- **分析**: Plausible Analytics

## 📦 安装 | Installation

```bash
# 克隆仓库
git clone https://github.com/yourusername/badminton-calendar.git
cd badminton-calendar

# 安装依赖
npm install

# 复制公共资源
npm run setPublicAssets

# 创建环境变量文件
cp .env.example .env.local
```

## ⚙️ 环境变量 | Environment Variables

在 `.env.local` 中配置以下变量：

```env
NEXT_PUBLIC_SITE_KEY=badminton
NEXT_PUBLIC_CURRENT_YEAR=2025
```

## 🚀 开发 | Development

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📁 项目结构 | Project Structure

```
badminton-calendar/
├── _db/                      # 数据文件
│   └── badminton/
│       ├── config.json       # 站点配置
│       ├── 2025.json         # 2025年赛事数据
│       └── 2026.json         # 2026年赛事数据
├── locales/                  # 国际化翻译文件
│   ├── zh/                   # 简体中文
│   └── zh-HK/                # 繁体中文（香港）
├── public/                   # 静态资源
├── src/
│   ├── app/
│   │   ├── [locale]/         # 多语言路由
│   │   └── api/              # API 路由
│   ├── components/           # React 组件
│   └── models/               # 数据模型
└── package.json
```

## 📅 日历 API | Calendar API

生成自定义日历：

```
GET /api/badminton-calendar?o=1&lc=1000&c=1&f=1&a=60&lang=zh
```

**查询参数 | Query Parameters**:
- `o` - 包含公开赛 (1/0) | Include open events
- `lc` - 最低级别 (1000/750/500/300/100/all) | Minimum category
- `c` - 包含锦标赛 (1/0) | Include championships
- `f` - 包含总决赛 (1/0) | Include finals
- `y` - 包含奥运会 (1/0) | Include Olympics
- `g` - 包含亚运会 (1/0) | Include Asian Games
- `m` - 仅重点赛事 (1/0) | Only major events
- `sg` - 包含小组赛 (1/0) | Include group stage
- `ss` - 包含半决赛 (1/0) | Include semifinals
- `sf` - 包含决赛 (1/0) | Include finals
- `a` - 提前提醒分钟数 (0/30/60/90/120) | Alarm minutes before
- `lang` - 语言 (zh/zh-HK) | Language

## 📝 添加赛事数据 | Adding Race Data

1. 编辑 `_db/badminton/YYYY.json` 添加赛事对象
2. 在 `locales/zh/localization.json` 中添加翻译
3. 确保包含所有必需字段：

```json
{
  "name": "Malaysia Open",
  "englishName": "Malaysia Open",
  "location": "Kuala Lumpur",
  "type": "open",
  "category": "1000",
  "startDate": "2025-01-07",
  "endDate": "2025-01-12",
  "sessions": {
    "day1": "2025-01-07T09:00:00+08:00",
    "semifinal": "2025-01-11T13:00:00+08:00",
    "final": "2025-01-12T13:00:00+08:00"
  },
  "sessionTypes": {
    "day1": "group",
    "semifinal": "semifinal",
    "final": "final"
  },
  "slug": "malaysia-open",
  "localeKey": "malaysia-open"
}
```

## 🎨 主题定制 | Theme Customization

主题通过 CSS 变量定义在 `src/app/[locale]/globals.css`：

```css
:root {
  --bg-color: #ffffff;
  --text-color: #000000;
  --card-bg: #f9fafb;
  /* ... */
}

.dark {
  --bg-color: #000000;
  --text-color: #ffffff;
  --card-bg: #1a1a1a;
  /* ... */
}
```

## 🤝 贡献 | Contributing

欢迎贡献！请随时提交 Pull Request。

Contributions are welcome! Feel free to submit a Pull Request.

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: add some amazing feature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证 | License

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢 | Acknowledgments

- 赛事数据来源：世界羽联 (BWF)
- Logo 设计灵感：Yonex 品牌
- 项目架构参考：[F1 Calendar](https://github.com/sportstimes/f1)

## 📧 联系 | Contact

如有问题或建议，请提交 [Issue](https://github.com/yourusername/badminton-calendar/issues)。

For questions or suggestions, please open an [Issue](https://github.com/yourusername/badminton-calendar/issues).
