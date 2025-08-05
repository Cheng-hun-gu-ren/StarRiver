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

### 📝 添加新的AI工具

**第一步：编辑工具数据**

打开 `client/src/data/ai-tools.ts` 文件，在 `aiTools` 数组中添加新工具：

```typescript
{
  id: 'my-new-tool',           // 唯一标识符（英文，用连字符）
  name: 'ChatGPT',             // 显示名称
  category: '开发星座',         // 所属星座：开发星座/内容星座/效率星座
  description: 'OpenAI开发的强大对话AI，支持代码生成、文本创作等多种任务',
  usage: '代码助手、写作辅助、问题解答',
  proficiency: 90,             // 熟练度 0-100
  icon: '🤖',                  // emoji图标（备用显示）
  features: ['对话交互', '代码生成', '多语言支持', '推理能力']
}
```

**第二步：将工具添加到对应星座**

在同文件的 `constellations` 数组中，找到对应星座，将工具ID添加到 `tools` 数组：

```typescript
{
  name: "开发星座", 
  nameEn: "Development",
  color: 0x3b82f6,
  tools: ['cursor', 'deepseek-api', 'v0', 'roo-code', 'claude-code', 'bolt', 'replit', 'lovable', 'my-new-tool'], // 添加到末尾
  description: "编程开发相关的AI工具集合"
}
```

### 🎯 调整工具所在星座

如需将现有工具移动到不同星座：

1. **修改工具的category属性**（可选，用于显示）
2. **从原星座的tools数组中移除**该工具ID
3. **添加到目标星座的tools数组中**

**示例：将Cursor从开发星座移动到效率星座**

```typescript
// 1. 修改工具定义（可选）
{
  id: 'cursor',
  name: 'Cursor',
  category: '效率星座',  // 改为目标星座
  // ... 其他属性保持不变
}

// 2. 从开发星座移除
{
  name: "开发星座",
  tools: ['deepseek-api', 'v0', 'roo-code', 'claude-code', 'bolt', 'replit', 'lovable'], // 移除cursor
}

// 3. 添加到效率星座
{
  name: "效率星座",
  tools: ['n8n', 'notebookllm', 'perplexity', 'cursor'], // 添加cursor
}
```

### 🖼️ 添加工具图标

**方法一：使用本地图标文件（推荐）**

1. **准备图标文件**
   - 支持格式：PNG、ICO、WebP等
   - 建议尺寸：16x16 或 32x32 像素
   - 文件命名：使用清晰的英文名称

2. **放置图标文件**
   ```bash
   # 将图标文件复制到icons目录
   cp your-icon.png client/src/assets/icons/
   ```

3. **添加图标导入**
   
   编辑 `client/src/assets/tool-logos.ts`：
   ```typescript
   // 添加导入
   import myToolIcon from './icons/your-icon.png';
   
   // 添加到toolLogos映射
   export const toolLogos: Record<string, string> = {
     // ... 现有映射
     'my-new-tool': myToolIcon,  // 工具ID对应图标
   };
   ```

**方法二：使用emoji图标（简单快速）**

只需在工具定义中设置合适的emoji即可：
```typescript
{
  id: 'my-tool',
  icon: '🚀', // 直接使用emoji
  // ... 其他属性
}
```

### 🎨 修改星座配色和样式

**修改星座颜色**

编辑 `client/src/data/ai-tools.ts` 中的 `constellations` 数组：

```typescript
{
  name: "开发星座",
  color: 0x3b82f6,  // 16进制颜色值，去掉#号
  // 常用颜色参考：
  // 蓝色: 0x3b82f6    绿色: 0x10b981    橙色: 0xf59e0b
  // 紫色: 0x8b5cf6    红色: 0xef4444    黄色: 0xfacc15
}
```

**添加新星座**

```typescript
// 在constellations数组中添加
{
  name: "新星座名称",
  nameEn: "NewConstellation", 
  color: 0x8b5cf6,  // 紫色
  tools: ['tool1', 'tool2'],  // 包含的工具ID
  description: "新星座的描述"
}
```

**修改导航图标**

编辑 `client/src/components/ui/navigation-buttons.tsx`：
```typescript
const icons: Record<string, string> = {
  '开发星座': '💻',
  '内容星座': '📝', 
  '效率星座': '⚡',
  '新星座名称': '🌟'  // 添加新星座图标
};
```

### 🔄 应用更改

1. **保存所有修改的文件**
2. **重启开发服务器**：
   ```bash
   # 停止当前服务器 (Ctrl+C)
   npm run dev
   ```
3. **访问 http://localhost:5000 查看效果**

### ⚡ 快速操作清单

**添加新工具**：
- [ ] 在 `ai-tools.ts` 添加工具定义
- [ ] 添加到对应星座的 `tools` 数组
- [ ] 添加图标（可选）
- [ ] 重启服务器

**移动工具**：
- [ ] 从原星座移除工具ID
- [ ] 添加到目标星座 
- [ ] 更新工具的 `category`（可选）
- [ ] 重启服务器

**修改颜色**：
- [ ] 修改星座的 `color` 值
- [ ] 重启服务器

### 🐛 常见问题

**Q: 添加工具后页面空白？**
A: 检查 `ai-tools.ts` 语法，确保没有遗漏逗号或括号

**Q: 图标不显示？**  
A: 检查图标文件路径和 `tool-logos.ts` 中的映射是否正确

**Q: 星座颜色没变？**
A: 确保颜色值是16进制格式（如 `0x3b82f6`），并重启服务器

**Q: 工具显示在错误的星座？**
A: 检查 `constellations` 数组中 `tools` 的配置，确保工具ID正确

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