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
    category: '终端AI工具',
    description: '主力AI工具，终端命令行AI助手，深度集成开发工作流程。提供实时代码建议、系统诊断和工作流优化。',
    usage: '日常编程、系统管理、问题解决',
    proficiency: 95,
    icon: '🤖',
    features: ['命令行集成', '代码生成', '系统诊断', '工作流优化', '实时建议']
  },
  {
    id: 'claude-web',
    name: 'Claude (网页版)',
    category: '对话AI',
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
    id: 'gemini',
    name: 'Gemini',
    category: '多模态AI',
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
    category: '语音AI工具',
    description: '先进的语音转文字AI工具，支持实时转录和多语言识别，准确率极高。',
    usage: '语音转录、会议记录、内容创作',
    proficiency: 85,
    icon: '🎙️',
    features: ['实时转录', '多语言支持', '高准确率', '标点智能', '格式化输出']
  },
  {
    id: 'n8n',
    name: 'n8n',
    category: '自动化工具',
    description: '开源的工作流自动化平台，可以连接各种服务和AI工具，创建复杂的自动化流程。',
    usage: '工作流自动化、数据集成、任务编排',
    proficiency: 80,
    icon: '🔄',
    features: ['可视化编排', '丰富集成', '自定义节点', '开源免费', '企业级']
  },
  {
    id: 'notebookllm',
    name: 'NotebookLM',
    category: '研究AI工具',
    description: 'Google的AI研究助手，能够基于用户文档创建个性化的AI研究伙伴。',
    usage: '文档分析、研究辅助、知识提取',
    proficiency: 72,
    icon: '📚',
    features: ['文档理解', '知识提取', '个性化AI', '研究助手', '引用追踪']
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
    tools: ['claude-code', 'cursor', 'bolt', 'deepseek-api'],
    description: "编程开发相关的AI工具集合"
  },
  { 
    name: "内容星座", 
    nameEn: "Content",
    color: 0xf472b6, 
    tools: ['claude-web', 'gemini', 'gamma', 'wispr-flow'],
    description: "内容创作和多媒体处理工具"
  },
  { 
    name: "效率星座", 
    nameEn: "Productivity",
    color: 0xfacc15, 
    tools: ['n8n', 'notebookllm'],
    description: "提升工作效率的自动化工具"
  }
];
