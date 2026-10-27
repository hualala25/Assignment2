# Assignment2 · 个人作品集

> 新媒体交互设计课程作业 — 个人作品展示站
> 线上地址：**https://hualala25.github.io/Assignment2/**

---

## 这个站点能做什么

| 能力 | 说明 |
|---|---|
| **自动分类** | 分类由每篇作品的 frontmatter `category` 字段自动聚合，新增作品或新分类**无需改任何代码** |
| **作品原文件下载** | 每件作品可附源码压缩包，访客直接下载 |
| **在线预览** | 交互作品以 iframe 内嵌，可直接操作体验 |
| **论文类型** | `type: paper` 自动显示发表信息、关键词与 PDF 下载 |
| **图床托管** | 图片由 PicGo 上传至独立图床仓库，与站点同源，国内访问稳定 |
| **双主题** | 跟随系统的深浅色切换，手动选择会被记住 |
| **自动部署** | push 到 main 分支后由 GitHub Actions 自动构建上线 |

---

## 目录结构

```
Assignment2/
├── astro.config.mjs              # site / base 配置
├── public/
│   ├── downloads/                # 作品原文件（zip / pdf）
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Nav.astro             # 顶部导航
│   │   └── WorkCard.astro        # 作品卡片
│   ├── layouts/
│   │   └── Base.astro            # 页面骨架 + 全局交互脚本
│   ├── lib/
│   │   └── base.ts               # base 路径拼接工具（防 404）
│   ├── pages/
│   │   ├── index.astro           # 首页：作品墙 + 分类筛选
│   │   ├── about.astro           # 关于
│   │   ├── 404.astro
│   │   └── works/
│   │       ├── index.astro       # 全部作品
│   │       ├── [id].astro        # 作品详情
│   │       └── category/[cat].astro   # 自动生成分类页
│   ├── content/
│   │   └── works/                # 作品内容（Markdown + frontmatter）
│   └── styles/
│       └── global.css            # 设计系统
├── content.config.ts             # 内容集合 schema
└── .github/workflows/deploy.yml  # 自动部署
```

---

## 新增一件作品

**第一步**：在 `src/content/works/` 新建 `.md` 文件。

```markdown
---
title: 作品标题
summary: 一句话简介，显示在卡片上。
category: 交互作品          # 分类，自动出现在首页与分类页
type: showcase             # showcase=作品 | paper=论文
order: 4                   # 排序权重，越小越靠前
date: 2026-11-01
year: 2026
tags: [标签一, 标签二]
cover: https://hualala25.github.io/images/xxx.webp   # 封面图（图床链接）
preview: https://example.com/                          # 在线预览地址
embed: true                                            # 是否用 iframe 嵌入
download: my-work.zip        # 原文件名，放在 public/downloads/ 下
downloadSize: 8.8 MB
links:
  - label: 源码仓库
    url: https://github.com/hualala25/my-work
---

## 正文

用 Markdown 写，支持标题、列表、引用、代码块、表格。
```

**第二步**：把原文件放进 `public/downloads/`，提交推送。

```bash
git add .
git commit -m "feat: 新增作品 xxx"
git push
```

**约 1 分钟后自动上线。** 首页与分类页会自动出现新作品，分类计数同步更新。

### 论文类型额外字段

```markdown
type: paper
venue: 课程论文              # 发表载体
keywords: [关键词1, 关键词2]
pdf: paper-name.pdf          # 放在 public/downloads/ 下
```

---

## PicGo 图床配置

图床仓库：`hualala25/images`（独立仓库，开启了 GitHub Pages）

**PicGo → 图床设置 → GitHub**

| 配置项 | 值 |
|---|---|
| 仓库名 | `hualala25/images` |
| 分支名 | `main` |
| Token | GitHub Personal Access Token，勾选 `repo` 权限 |
| 存储路径 | 留空 |
| 自定义域名 | `https://hualala25.github.io/images` |

上传后 PicGo 返回的链接即为 `https://hualala25.github.io/images/文件名`，
可直接粘贴进 frontmatter 的 `cover` 字段。

> **Token 创建地址**：GitHub → Settings → Developer settings →
> Personal access tokens → Tokens (classic) → Generate new token，勾选 `repo`。

**Typora 联动**（可选，写作用）：Typora → 偏好设置 → 图像 →
插入图片时选「上传图片」→ 上传服务选「PicGo (app)」，
之后截图直接粘贴就会自动上传并插入链接。

---

## 本地开发

```bash
npm install
npm run dev        # 本地预览 http://localhost:4321/Assignment2/
npm run build      # 构建到 dist/
```

> ⚠️ 本机 Node 版本需 ≥ 22.12.0。Astro 版本锁定在 6.4.8，
> 因为 Astro 7 要求 Node ≥ 22.23.4。

---

## 两个容易踩的坑

**1. `base` 路径必须用 `src()` 拼接**

站点部署在 `/Assignment2/` 子路径下。Astro 在配置 `base` 后，
**写在 HTML 里的绝对路径不会自动加前缀**，会直接 404。

```astro
---
import { src } from '../lib/base';
---
<!-- ❌ 错误：会 404 -->
<img src="/images/a.png" />
<a href="/works/">作品</a>

<!-- ✅ 正确 -->
<img src={src('images/a.png')} />
<a href={src('works/')}>作品</a>
```

`src()` 已封装在 `src/lib/base.ts`，全站统一使用。

**2. 分类筛选为什么用脚本而不是 CSS**

作品卡片 `WorkCard.astro` 是独立组件，有自己的作用域标记。
首页的 scoped 样式**无法命中**组件内部的元素，纯 CSS 选择器不可靠。
因此筛选改用 `data-filter` / `data-cat` 属性 + 脚本控制显隐。

---

## 已有资源

| 仓库 | 内容 | 地址 |
|---|---|---|
| `hualala25/Assignment2` | 本作品集站点 | https://hualala25.github.io/Assignment2/ |
| `hualala25/images` | PicGo 图床 | https://hualala25.github.io/images/ |
| `hualala25/her-march` | 《她的行军》源文件 | https://hualala25.github.io/her-march/ |
| `hualala25/hualala25.github.io` | Assignment1 名著解说视频 | https://hualala25.github.io/Assignment1/ |
