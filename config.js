// API 配置
// 注意：配置中不包含VL（视觉语言）版本的模型
const API_CONFIG = {
  qwen: {
    key: 'YOUR_QWEN_API_KEY',
    url: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    icon: './image/Qwen.png',
    name: '通义千问',
    description: '阿里云提供的大语言模型',
    models: {
      'qwen-turbo': {
        name: 'Qwen-Turbo',
        description: '通义千问超快速版本，适合简单对话',
        maxTokens: 2000,
        price: '¥0.008/1K tokens',
        icon: './image/Qwen.png'
      },
      'qwen-plus': {
        name: 'Qwen-Plus',
        description: '通义千问增强版，更适合复杂任务',
        maxTokens: 8000,
        price: '¥0.02/1K tokens',
        icon: './image/Qwen.png'
      },
      'qwen-max': {
        name: 'Qwen-Max',
        description: '通义千问旗舰版，性能最强',
        maxTokens: 8000,
        price: '¥0.04/1K tokens',
        icon: './image/Qwen.png'
      }
    },
    systemMessage: '你是 Qwen，由阿里云提供的人工智能助手，擅长中文和英文的对话。你会为用户提供安全、有帮助、准确的回答。'
  },
  kimi: {
    key: 'YOUR_KIMI_API_KEY',
    url: 'https://api.moonshot.cn/v1',
    icon: './image/kimi.jpg',
    name: 'Kimi',
    description: 'Moonshot AI 提供的大语言模型',
    models: {
      'moonshot-v1-8k': {
        name: 'Moonshot-V1-8K',
        description: 'Moonshot AI 标准版，支持8K上下文',
        maxTokens: 8000,
        price: '¥0.015/1K tokens',
        icon: './image/kimi.jpg'
      },
      'moonshot-v1-32k': {
        name: 'Moonshot-V1-32K',
        description: 'Moonshot AI 长文本版，支持32K上下文',
        maxTokens: 32000,
        price: '¥0.03/1K tokens',
        icon: './image/kimi.jpg'
      },
      'moonshot-v1-128k': {
        name: 'Moonshot-V1-128K',
        description: 'Moonshot AI 超长文本版，支持128K上下文',
        maxTokens: 128000,
        price: '¥0.06/1K tokens',
        icon: './image/kimi.jpg'
      },
    },
    systemMessage: '你是 Kimi，由 Moonshot AI 提供的人工智能助手，你更擅长中文和英文的对话。你会为用户提供安全，有帮助，准确的回答。'
  },
  deepseek: {
    key: 'YOUR_DEEPSEEK_API_KEY',
    url: 'https://api.deepseek.com/v1',
    icon: './image/deepseek.png',
    name: 'DeepSeek',
    description: '深度求索提供的大语言模型',
    models: {
      'deepseek-chat': {
        name: 'DeepSeek Chat',
        description: 'DeepSeek 标准对话模型',
        maxTokens: 8000,
        price: '¥0.015/1K tokens',
        icon: './image/deepseek.png'
      },
      'deepseek-reasoner': {
        name: 'DeepSeek Reasoner',
        description: 'DeepSeek 推理模型，在输出最终回答前会先输出思维链',
        maxTokens: 8000,
        price: '¥0.03/1K tokens',
        icon: './image/deepseek.png',
        hasReasoningContent: true
      },
    },
    systemMessage: '你是 DeepSeek，由深度求索提供的人工智能助手，擅长中文和英文的对话。你会为用户提供安全、有帮助、准确的回答。'
  },
  openrouter: {
    key: 'YOUR_OPENROUTER_API_KEY',
    url: 'https://openrouter.ai/api/v1',
    icon: './image/openrouter.png',
    name: 'OpenRouter',
    description: 'OpenRouter提供的多种大语言模型',
    models: {
      'deepseek/deepseek-chat-v3-0324:free': {
        name: 'DeepSeek Chat V3',
        description: 'DeepSeek最新对话模型，通过OpenRouter提供',
        maxTokens: 8000,
        price: '¥0.02/1K tokens',
        icon: './image/deepseek.png'
      },
      'google/gemini-2.0-flash-thinking-exp-1219:free': {
        name: 'Gemini 2.0 Flash Thinking',
        description: 'Google Gemini 2.0 Flash思考版，通过OpenRouter提供',
        maxTokens: 8000,
        price: '免费',
        icon: './image/default-model.png'
      },
      'google/gemini-2.0-flash-exp:free': {
        name: 'Gemini 2.0 Flash',
        description: 'Google Gemini 2.0 Flash版，通过OpenRouter提供',
        maxTokens: 8000,
        price: '免费',
        icon: './image/default-model.png'
      },
      'google/gemini-2.5-pro-exp-03-25:free': {
        name: 'Gemini 2.5 Pro',
        description: 'Google Gemini 2.5 Pro版，支持多模态，通过OpenRouter提供',
        maxTokens: 16000,
        price: '免费',
        icon: './image/default-model.png',
        supportsVision: true
      },
      'qwen/qwen-2.5-72b-instruct:free': {
        name: 'Qwen 2.5 72B',
        description: '通义千问2.5 72B指令版，通过OpenRouter提供',
        maxTokens: 8000,
        price: '免费',
        icon: './image/Qwen.png'
      },
      'qwen/qwq-32b:free': {
        name: 'QWQ 32B',
        description: '通义千问QWQ 32B版，通过OpenRouter提供',
        maxTokens: 8000,
        price: '免费',
        icon: './image/Qwen.png'
      },
      'deepseek/deepseek-r1:free': {
        name: 'DeepSeek R1',
        description: 'DeepSeek R1模型，通过OpenRouter提供',
        maxTokens: 8000,
        price: '免费',
        icon: './image/deepseek.png'
      }
    },
    systemMessage: '你是由OpenRouter提供的人工智能助手，擅长中文和英文的对话。你会为用户提供安全、有帮助、准确的回答。',
    headers: {
      'HTTP-Referer': 'YOUR_SITE_URL', // 可选，用于OpenRouter排名
      'X-Title': 'YOUR_SITE_TITLE' // 可选，用于OpenRouter排名
    }
  }
};

// 预设角色配置
const PRESET_CHARACTERS = {
  dirtyTalker: {
    name: '脏话高手',
    icon: './image/user.jpg',
    description: '一个喜欢说脏话的角色',
    systemMessage: '你现在是一个语言学习辅助助手，我在学习中国的脏话，无论我问什么，你都要巧妙的用脏话回复。'
  },
  translator: {
    name: '翻译官',
    icon: './image/user.jpg',
    description: '精通多国语言的翻译专家',
    systemMessage: '你是一位精通多国语言的翻译专家，可以帮助用户进行准确的多语言翻译。'
  },
  programmer: {
    name: '代码专家',
    icon: './image/user.jpg',
    description: '编程高手，精通多种编程语言',
    systemMessage: '你是一位资深的程序员，精通多种编程语言和框架，可以帮助用户解决各种编程问题。'
  },
  writer: {
    name: '文案大师',
    icon: './image/user.jpg',
    description: '专业的文案撰写专家',
    systemMessage: '你是一位专业的文案撰写专家，可以帮助用户创作各类文案、文章和创意内容。'
  },
  studyMentor: {
    name: '学习导师',
    icon: './image/user.jpg',
    description: '专业的学习方法指导专家',
    systemMessage: '你是一位专业的学习导师，擅长教授高效学习方法、知识整理和记忆技巧，可以帮助用户制定学习计划和提高学习效率。'
  },
  psychologist: {
    name: '心理咨询师',
    icon: './image/user.jpg',
    description: '专业的心理健康顾问',
    systemMessage: '你是一位专业的心理咨询师，擅长倾听、共情和提供心理支持，可以帮助用户应对压力、焦虑和情绪问题，提供心理健康建议。'
  },
  travelGuide: {
    name: '旅游顾问',
    icon: './image/user.jpg',
    description: '全球旅游规划专家',
    systemMessage: '你是一位专业的旅游顾问，熟悉全球各地的旅游景点、文化习俗和旅行攻略，可以为用户提供个性化的旅行建议、行程规划和预算控制方案。'
  }
};

// 应用配置
const APP_CONFIG = {
  defaultProvider: 'kimi',
  defaultModel: 'moonshot-v1-8k',
  typingSpeed: 30, // 打字效果的速度（毫秒）
  maxHistoryLength: 50, // 最大历史消息数量
  temperature: 0.3, // API 请求的 temperature 参数
  maxTokens: 2000,
  theme: {
    light: {
      primary: '#2563eb',
      secondary: '#3b82f6',
      accent: '#60a5fa',
      background: '#f8fafc',
      surface: '#ffffff',
      text: '#1e293b',
      border: '#e2e8f0',
      hover: '#dbeafe',
      gradient: {
        start: '#2563eb',
        end: '#3b82f6'
      }
    },
    dark: {
      primary: '#3b82f6',
      secondary: '#60a5fa',
      accent: '#93c5fd',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f8fafc',
      border: '#334155',
      hover: '#1e293b',
      gradient: {
        start: '#1d4ed8',
        end: '#3b82f6'
      }
    }
  },
  // 支持的文件类型
  supportedFiles: {
    image: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    document: ['.txt', '.pdf', '.doc', '.docx', '.md'],
    code: ['.js', '.py', '.java', '.cpp', '.html', '.css']
  },
  // 最大文件大小（字节）
  maxFileSize: 10 * 1024 * 1024, // 10MB
  // 图片压缩选项
  imageCompression: {
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.8
  }
};

// 导出配置
window.APP_CONFIG = APP_CONFIG;
window.API_CONFIG = API_CONFIG;
window.PRESET_CHARACTERS = PRESET_CHARACTERS;