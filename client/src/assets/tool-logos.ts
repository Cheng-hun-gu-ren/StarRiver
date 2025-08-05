// Import local icons
import cursorIcon from './icons/Cursor.png';
import rooCodeIcon from './icons/Roo Code.png';
import wisprFlowIcon from './icons/Wispr flow.png';
import boltIcon from './icons/bolt.png';
import deepseekIcon from './icons/deepseek-color.png';
import geminiIcon from './icons/gemini-color.png';
import lovableIcon from './icons/lovable.ico';
import n8nIcon from './icons/n8n.ico';
import replitIcon from './icons/repllit.webp';
import jimengIcon from './icons/即梦.ico';
import claudeIcon from './icons/claude.ico';
import v0Icon from './icons/v0.png';
import doubaoIcon from './icons/豆包.png';

// Tool logo URLs - using local icons only
export const toolLogos: Record<string, string> = {
  'cursor': cursorIcon,
  'bolt': boltIcon,
  'deepseek-api': deepseekIcon,
  'gemini': geminiIcon,
  'wispr-flow': wisprFlowIcon,
  'n8n': n8nIcon,
  'replit': replitIcon,
  'jimeng': jimengIcon,
  'lovable': lovableIcon,
  'roo-code': rooCodeIcon,
  'claude-code': claudeIcon,
  'claude-web': claudeIcon,
  'v0': v0Icon,
  'doubao': doubaoIcon
  // 其他工具将使用emoji备用图标
};

// Fallback emoji icons if logos fail to load
export const toolEmojis: Record<string, string> = {
  'claude-code': '🤖',
  'claude-web': '💬',
  'cursor': '⌨️',
  'bolt': '⚡',
  'deepseek-api': '🔌',
  'gemini': '💎',
  'gamma': '📊',
  'wispr-flow': '🎙️',
  'n8n': '🔄',
  'notebookllm': '📚',
  'v0': '🎨',
  'replit': '🚀',
  'jimeng': '🎬',
  'doubao': '🌱',
  'perplexity': '🔍',
  'lovable': '💝',
  'roo-code': '🦘'
};