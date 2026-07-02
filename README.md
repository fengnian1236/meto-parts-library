# Meto 零件素材库

一个用于管理 Meto 买量素材的 Web 应用，支持本地存储和云端同步。

🔗 **在线访问**: https://meto-parts-library.pages.dev

## 功能特性

- 📁 **7 大素材分类**: 种草、直播、1V1、匹配、真实展示、剧情、原生
- 🏷️ **二级钩子标签**: 每类下支持多种钩子类型（如美女推荐、真人出镜等）
- 🎨 **三阶段结构**: 前3秒钩子 / 中部内容 / CTA 行动号召
- 🌍 **地区标记**: 支持 EU、SEA 等地区标识
- 💾 **本地存储**: 自动保存到浏览器 localStorage
- ☁️ **云端同步**: 接入 JSONBin.io，支持团队多人实时协作
- 📅 **YT 素材管理**: 独立的 IOS/AND 素材库，支持标签和日期筛选
- ↩️ **撤销功能**: 支持撤销最近操作
- 🌓 **主题切换**: 明亮/暗黑模式

## 云同步配置

1. 访问 [jsonbin.io](https://jsonbin.io) 注册免费账号
2. 创建两个 Private Bin：
   - `meto-parts` - 存储零件数据
   - `meto-yt` - 存储 YT 素材数据
3. 获取你的 **Master Key**（从 API Keys 页面）
4. 在网页中点击 **"☁️ 同步"** 按钮，填入：
   - 零件数据 Bin ID 和 Master Key
   - 素材数据 Bin ID 和 Master Key（可选）
5. 点击 **"保存并同步"**

## 自动备份

本项目配置了 GitHub Actions 自动备份：

- ⏰ **频率**: 每天凌晨 3:00 (UTC+8)
- 📂 **位置**: `backup/` 目录
- 📝 **格式**: `parts-YYYY-MM-DD.json` 和 `yt-YYYY-MM-DD.json`
- 🔒 **安全**: 使用 GitHub Secrets 存储 API Key

## 本地开发

```bash
# 启动本地服务器
node server.js

# 访问 http://localhost:3000
```

## 技术栈

- 纯 HTML/CSS/JavaScript（无框架）
- JSONBin.io 云存储
- Cloudflare Pages 部署
- GitHub Actions 自动化

## 项目结构

```
meto-parts-library/
├── index.html          # 主页面
├── server.js           # 本地开发服务器
├── deploy.ps1          # 部署脚本
├── backup/             # 自动备份目录
│   ├── parts-YYYY-MM-DD.json
│   └── yt-YYYY-MM-DD.json
└── .github/
    └── workflows/
        └── daily-backup.yml  # 自动备份工作流
```

## 最近更新

- ✅ 修复 Private Bin 401 错误（添加 X-Master-Key 认证头）
- ✅ 接入 JSONBin.io 云数据库
- ✅ YT 素材增加日期范围筛选
- ✅ 卡片编辑按钮常驻可见
- ✅ 支持模态框编辑（替代 prompt）

## License

MIT
