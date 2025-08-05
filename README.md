# 晨昏故人的AI工具星云

一个交互式的3D AI工具知识图谱可视化项目，以星云的形式展示个人常用的AI工具。

## 🌟 项目简介

这是一个使用 Three.js 和 React 构建的3D可视化应用，将AI工具按照功能分类为不同的"星座"：

- **开发星座** 💻 - 编程开发相关的AI工具
- **内容星座** 📝 - 内容创作和多媒体处理工具  
- **效率星座** ⚡ - 提升工作效率的自动化工具

## 🚀 在线访问

- **主站**: [starriver.chenggao.top](https://starriver.chenggao.top)
- **GitHub Pages**: [portfolio.chgr-cuhksz-gao.cn/StarRiver](https://portfolio.chgr-cuhksz-gao.cn/StarRiver/)

## 🛠️ 技术栈

- **前端**: React 18 + TypeScript + Vite
- **3D引擎**: Three.js + WebGL
- **样式**: Tailwind CSS + shadcn/ui
- **状态管理**: TanStack Query
- **路由**: Wouter
- **构建**: Vite + ESBuild
- **部署**: GitHub Actions + GitHub Pages

## 📦 项目结构

```
├── client/                 # 前端应用
│   ├── src/
│   │   ├── components/     # UI组件
│   │   ├── pages/          # 页面组件
│   │   ├── hooks/          # 自定义Hooks
│   │   ├── data/           # 数据文件
│   │   └── assets/         # 静态资源
│   └── public/             # 公共文件
├── server/                 # 后端服务
├── shared/                 # 共享类型
├── AI工具图标/              # 图标资源
├── 中转文件夹/              # 临时文件（已忽略）
└── dist/                   # 构建输出
```

## 🎮 功能特性

- **3D交互式星云**: 使用Three.js渲染的3D粒子星云效果
- **工具分类展示**: AI工具按功能分为三大星座
- **响应式设计**: 支持桌面端和移动端访问
- **图标展示**: 支持本地图标文件和emoji备用方案
- **键盘快捷键**: 
  - `G` - 全局视图
  - `1` - 开发星座
  - `2` - 内容星座  
  - `3` - 效率星座
  - `ESC` - 关闭详情面板

## 🔧 本地开发

### 环境要求

- Node.js 18+
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:5000](http://localhost:5000)

### 构建生产版本

```bash
npm run build
```

## 🎨 自定义配置

### 添加新的AI工具

编辑 `client/src/data/ai-tools.ts` 文件：

```typescript
{
  id: 'tool-id',
  name: '工具名称',
  category: '所属星座',
  description: '工具描述',
  usage: '使用场景',
  proficiency: 85, // 熟练度 0-100
  icon: '🔧', // emoji图标
  features: ['特性1', '特性2']
}
```

### 添加工具图标

1. 将图标文件放入 `client/src/assets/icons/` 目录
2. 在 `client/src/assets/tool-logos.ts` 中添加导入和映射

### 修改星座配色

编辑 `client/src/data/ai-tools.ts` 中的 `constellations` 数组，修改 `color` 属性（16进制颜色值）。

## 🚀 部署

项目使用 GitHub Actions 自动部署到 GitHub Pages。

### 自动部署流程

1. 推送代码到 `main` 分支
2. GitHub Actions 自动触发构建
3. 构建完成后自动部署到 GitHub Pages

### 手动部署

```bash
npm run build
# 将 dist/ 目录内容部署到静态服务器
```

## 📁 中转文件夹

`中转文件夹/` 目录用于存放临时文件、开发中的资源等，已添加到 `.gitignore` 中，不会被提交到版本控制。

用途：
- 临时图标文件
- 开发测试文件
- 备份文件
- 其他临时资源

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 📄 开源协议

本项目采用 MIT 协议 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 👨‍💻 作者

**晨昏故人**
- 个人主页: [chenggao.top](https://chenggao.top)
- GitHub: [@chgr9527](https://github.com/chgr9527)

## 🙏 致谢

- [Three.js](https://threejs.org/) - 3D图形库
- [React](https://reactjs.org/) - UI框架
- [Vite](https://vitejs.dev/) - 构建工具
- [Tailwind CSS](https://tailwindcss.com/) - CSS框架
- [shadcn/ui](https://ui.shadcn.com/) - UI组件库

---

⭐ 如果这个项目对你有帮助，请给它一个星标！