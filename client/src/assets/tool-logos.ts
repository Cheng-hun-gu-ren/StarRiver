// Tool logo URLs from CDN services
export const toolLogos: Record<string, string> = {
  'claude-code': 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/claude-ai-icon.svg',
  'claude-web': 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/claude-ai-icon.svg',
  'cursor': 'https://raw.githubusercontent.com/getcursor/cursor/main/resources/app/resources/win32/cursor.ico',
  'bolt': 'https://www.bolt.com/favicon.ico',
  'deepseek-api': 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/deepseek-logo-icon.svg',
  'gemini': 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-gemini-icon.svg',
  'gamma': 'https://gamma.app/favicon.ico',
  'wispr-flow': 'https://wispr.com/favicon.ico',
  'n8n': 'https://n8n.io/favicon.ico',
  'notebookllm': 'https://notebooklm.google.com/favicon.ico'
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
  'notebookllm': '📚'
};