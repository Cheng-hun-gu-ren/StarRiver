export interface AITool {
  id: string;
  name: string;
  category: string;
  description: string;
  usage: string;
  proficiency: number;
  icon: string;
  features: string[];
}

export const aiTools: AITool[] = [
  {
    id: 'claude-code',
    name: 'Claude Code',
    category: '开发AI工具',
    description: '主力AI工具，终端命令行AI助手，深度集成开发工作流程。提供实时代码建议、系统诊断和工作流优化。',
    usage: '日常编程、系统管理、问题解决',
    proficiency: 95,
    icon: '🤖',
    features: ['命令行集成', '代码生成', '系统诊断', '工作流优化', '实时建议']
  },
  {
    id: 'claude-web',
    name: 'Claude (网页版)',
    category: '内容创作',
    description: '最早接触的AI工具，用于学习、研究和内容创作。强大的自然语言处理能力，支持复杂任务推理。',
    usage: '研究分析、写作辅助、学习讨论',
    proficiency: 90,
    icon: '💬',
    features: ['自然对话', '研究分析', '创作辅助', '多语言支持', '推理能力']
  },
  {
    id: 'cursor',
    name: 'Cursor',
    category: '开发AI工具',
    description: '革命性的AI编程编辑器，将AI深度集成到开发环境中，提供智能代码补全和重构建议。',
    usage: '代码编写、重构、调试',
    proficiency: 88,
    icon: '⌨️',
    features: ['智能补全', 'AI重构', '代码解释', '快速修复', '上下文感知']
  },
  {
    id: 'bolt',
    name: 'Bolt',
    category: '开发AI工具',
    description: '快速原型和全栈开发AI助手，能够从想法快速生成可运行的应用程序。',
    usage: '快速原型、全栈开发、想法验证',
    proficiency: 75,
    icon: '⚡',
    features: ['快速原型', '全栈生成', '即时预览', '部署集成', '模板库']
  },
  {
    id: 'deepseek-api',
    name: 'DeepSeek API',
    category: '开发AI工具',
    description: '高性能的AI API服务，提供强大的推理能力和代码生成功能，成本效益极高。',
    usage: 'API集成、自动化任务、批量处理',
    proficiency: 82,
    icon: '🔌',
    features: ['高性能API', '代码生成', '批量处理', '成本效益', '易集成']
  },
  {
    id: 'v0',
    name: 'v0 by Vercel',
    category: '开发AI工具',
    description: 'AI驱动的UI生成器，将自然语言描述转换为React组件，支持Tailwind CSS和shadcn/ui。',
    usage: 'UI组件生成、快速原型、前端开发',
    proficiency: 80,
    icon: '🎨',
    features: ['文本到UI', 'React组件', 'Tailwind CSS', '即时预览', '多模态输入']
  },
  {
    id: 'replit',
    name: 'Replit Agent',
    category: '开发AI工具',
    description: '云端AI开发平台，将自然语言转换为完整应用，包含前后端、数据库和部署。',
    usage: '全栈开发、快速原型、协作编程',
    proficiency: 85,
    icon: '🚀',
    features: ['AI Agent', '云端IDE', '一键部署', '实时协作', '多语言支持']
  },
  {
    id: 'lovable',
    name: 'Lovable',
    category: '开发AI工具',
    description: 'AI全栈应用构建器，通过自然语言生成完整Web应用，提供代码所有权。',
    usage: 'MVP开发、应用原型、无代码开发',
    proficiency: 75,
    icon: '💝',
    features: ['自然语言编程', '全栈生成', 'GitHub集成', '实时预览', '代码导出']
  },
  {
    id: 'roo-code',
    name: 'Roo Code',
    category: '开发AI工具',
    description: 'VS Code中的AI开发团队，提供多种专门模式的自主编程助手。',
    usage: 'VS Code开发、代码审查、架构设计',
    proficiency: 78,
    icon: '🦘',
    features: ['多模式AI', '自主开发', 'MCP集成', '浏览器自动化', '成本优化']
  },
  {
    id: 'gemini',
    name: 'Gemini',
    category: '内容创作',
    description: 'Google的多模态AI模型，在图像理解、视频分析和复杂推理方面表现卓越。',
    usage: '多模态分析、图像处理、视频理解',
    proficiency: 78,
    icon: '💎',
    features: ['多模态处理', '图像分析', '视频理解', '复杂推理', '大上下文']
  },
  {
    id: 'gamma',
    name: 'Gamma',
    category: '内容创作',
    description: 'AI驱动的演示文稿和文档创建工具，能够快速生成专业级的视觉内容。',
    usage: '演示文稿、文档设计、视觉内容',
    proficiency: 70,
    icon: '📊',
    features: ['自动设计', '模板生成', '内容优化', '协作功能', '导出选项']
  },
  {
    id: 'wispr-flow',
    name: 'Wispr Flow',
    category: '内容创作',
    description: '先进的语音转文字AI工具，支持实时转录和多语言识别，准确率极高。',
    usage: '语音转录、会议记录、内容创作',
    proficiency: 85,
    icon: '🎙️',
    features: ['实时转录', '多语言支持', '高准确率', '标点智能', '格式化输出']
  },
  {
    id: 'jimeng',
    name: '即梦 AI',
    category: '内容创作',
    description: '字节跳动的AI视频生成平台，支持文本和图像生成高质量短视频。',
    usage: '视频创作、社交媒体、营销内容',
    proficiency: 72,
    icon: '🎬',
    features: ['文本生成视频', '图像生成视频', '智能画布', '故事创作', '中文优化']
  },
  {
    id: 'doubao',
    name: '豆包 AI',
    category: '内容创作',
    description: '字节跳动的旗舰AI助手，中国最受欢迎的消费级AI应用，支持多模态功能。',
    usage: '对话交互、图像生成、内容创作',
    proficiency: 76,
    icon: '🌱',
    features: ['多模态AI', '图像生成', '视频生成', '3D生成', '极低价格']
  },
  {
    id: 'n8n',
    name: 'n8n',
    category: '效率工具',
    description: '开源的工作流自动化平台，可以连接各种服务和AI工具，创建复杂的自动化流程。',
    usage: '工作流自动化、数据集成、任务编排',
    proficiency: 80,
    icon: '🔄',
    features: ['可视化编排', '丰富集成', '自定义节点', '开源免费', '企业级']
  },
  {
    id: 'notebookllm',
    name: 'NotebookLM',
    category: '效率工具',
    description: 'Google的AI研究助手，能够基于用户文档创建个性化的AI研究伙伴。',
    usage: '文档分析、研究辅助、知识提取',
    proficiency: 72,
    icon: '📚',
    features: ['文档理解', '知识提取', '个性化AI', '研究助手', '引用追踪']
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    category: '效率工具',
    description: 'AI驱动的搜索引擎，提供实时准确的答案，带有引用来源。',
    usage: '研究搜索、实时信息、知识获取',
    proficiency: 83,
    icon: '🔍',
    features: ['实时搜索', '引用来源', '深度研究', 'API访问', '多模态搜索']
  }
];

export interface Constellation {
  name: string;
  nameEn: string;
  color: number;
  tools: string[];
  description: string;
}

export const constellations: Constellation[] = [
  { 
    name: "开发星座", 
    nameEn: "Development",
    color: 0x60a5fa, 
    tools: ['cursor', 'deepseek-api', 'v0', 'roo-code', 'claude-code', 'bolt', 'replit', 'lovable'],
    description: "编程开发相关的AI工具集合"
  },
  { 
    name: "内容星座", 
    nameEn: "Content",
    color: 0xf472b6, 
    tools: ['gemini', 'jimeng', 'v0', 'claude-web', 'gamma', 'wispr-flow', 'doubao', 'notebookllm', 'perplexity'],
    description: "内容创作和多媒体处理工具"
  },
  { 
    name: "效率星座", 
    nameEn: "Productivity",
    color: 0xfacc15, 
    tools: ['n8n', 'claude-code', 'bolt', 'replit', 'lovable', 'claude-web', 'gamma', 'wispr-flow', 'doubao', 'notebookllm', 'perplexity'],
    description: "提升工作效率的自动化工具"
  }
];
