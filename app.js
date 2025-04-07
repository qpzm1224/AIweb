// 全局变量
let currentProvider = APP_CONFIG.defaultProvider;
let currentModel = APP_CONFIG.defaultModel;
let history = [
  { role: 'system', content: API_CONFIG[currentProvider].systemMessage }
];
let typingInterval = null;
let isRecording = false;
// 移除重复声明的变量，因为后面已经声明过了
// 移除重复声明的变量，因为后面已经声明过了
// 移除重复声明，因为后面已经声明过了
// 获取DOM元素
const presetRoles = document.querySelector('.preset-roles');
const presetList = document.getElementById('presetList');
// 从本地存储中获取预设列表的展开状态
const isPresetListCollapsed = localStorage.getItem('presetListCollapsed') === 'true';
// 初始化预设列表状态
if (isPresetListCollapsed) {
  presetRoles.classList.add('collapsed');
}
// 切换预设列表的展开/收起状态
function togglePresetList() {
  presetRoles.classList.toggle('collapsed');
  // 保存状态到本地存储
  localStorage.setItem('presetListCollapsed', presetRoles.classList.contains('collapsed'));
}
let isTyping = false;
// 删除重复声明的变量
let totalTokens = 0;
let totalCost = 0;
let currentPreset = null; // 当前选中的预设角色

// DOM 元素
const elements = {
  chatMessages: document.getElementById('chatMessages'),
  inputText: document.getElementById('inputText'),
  sendButton: document.getElementById('sendButton'),
  modelName: document.getElementById('modelName'),
  modelDescription: document.getElementById('modelDescription'),
  providerIcon: document.getElementById('providerIcon'),
  sidebar: document.getElementById('sidebar'),
  modelSelector: document.getElementById('modelSelector'),
  presetList: document.getElementById('presetList'),
  loadingIndicator: document.getElementById('loadingIndicator'),
  temperatureSlider: document.getElementById('temperature'),
  temperatureValue: document.getElementById('temperatureValue'),
  maxTokens: document.getElementById('maxTokens'),
  tokenCount: document.getElementById('tokenCount'),
  maxTokenCount: document.getElementById('maxTokenCount'),
  tokenPrice: document.getElementById('tokenPrice'),
  clearChat: document.getElementById('clearChat'),
  exportChat: document.getElementById('exportChat'),
  uploadFile: document.getElementById('uploadFile'),
  voiceInput: document.getElementById('voiceInput'),
  modelInfoModal: document.getElementById('modelInfoModal'),
  themeToggle: document.getElementById('themeToggle'),
  themeIcon: document.getElementById('themeIcon')
};

// 初始化函数
async function init() {
  // 初始化事件监听器
  setupEventListeners();
  
  // 初始化模型选择器
  initializeModelSelector();
  
  // 初始化预设角色列表
  initializePresetList();
  
  // 初始化拖放上传
  setupDragAndDrop();
  
  // 更新模型信息
  updateModelInfo();

  // 初始化快捷键
  setupShortcuts();

  // 初始化代码高亮
  initializeCodeHighlight();

  // 初始化 marked
  initializeMarked();
  
  // 初始化主题设置
  initializeTheme();
  
  // 显示欢迎消息
  await showWelcomeMessage();
}

// 初始化主题设置
function initializeTheme() {
  // 从本地存储中获取主题设置
  const savedTheme = localStorage.getItem('theme');
  
  // 如果有保存的主题设置，应用它
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
  } else {
    // 默认使用浅色主题
    document.documentElement.setAttribute('data-theme', 'light');
    updateThemeIcon('light');
  }
}

// 切换主题
function toggleTheme() {
  // 获取当前主题
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  // 切换主题
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  // 应用新主题
  document.documentElement.setAttribute('data-theme', newTheme);
  // 更新图标
  updateThemeIcon(newTheme);
  // 保存到本地存储
  localStorage.setItem('theme', newTheme);
  
  // 显示提示
  showToast(`已切换到${newTheme === 'light' ? '明亮' : '暗黑'}主题`);
}

// 更新主题图标
function updateThemeIcon(theme) {
  const themeIcon = document.getElementById('themeIcon');
  if (theme === 'dark') {
    themeIcon.className = 'ri-sun-line';
  } else {
    themeIcon.className = 'ri-moon-line';
  }
}

// 设置事件监听器
function setupEventListeners() {
  // 发送按钮点击事件
  elements.sendButton.addEventListener('click', handleSendMessage);
  
  // 输入框事件
  elements.inputText.addEventListener('keydown', handleInputKeydown);
  elements.inputText.addEventListener('input', handleInputChange);
  elements.inputText.addEventListener('paste', handlePaste);
  
  // 温度滑块事件
  elements.temperatureSlider.addEventListener('input', (e) => {
    elements.temperatureValue.textContent = e.target.value;
    APP_CONFIG.temperature = parseFloat(e.target.value);
    showToast(`已设置随机性为 ${e.target.value}`);
  });
  
  // 最大 token 数量事件
  elements.maxTokens.addEventListener('change', (e) => {
    const value = parseInt(e.target.value);
    if (value < 100) {
      e.target.value = 100;
      showToast('最小 token 数量为 100');
      return;
    }
    if (value > API_CONFIG[currentProvider].models[currentModel].maxTokens) {
      e.target.value = API_CONFIG[currentProvider].models[currentModel].maxTokens;
      showToast(`当前模型最大支持 ${API_CONFIG[currentProvider].models[currentModel].maxTokens} tokens`);
      return;
    }
    APP_CONFIG.maxTokens = value;
    elements.maxTokenCount.textContent = value;
    showToast(`已设置最大长度为 ${value} tokens`);
  });
  
  // 清空聊天记录事件
  elements.clearChat.addEventListener('click', () => {
    if (confirm('确定要清空所有聊天记录吗？')) {
      clearChat();
      showToast('已清空聊天记录');
    }
  });
  
  // 导出聊天记录事件
  elements.exportChat.addEventListener('click', exportChat);
  
  // 上传文件事件
  elements.uploadFile.addEventListener('click', handleFileUpload);
  
  // 语音输入事件
  elements.voiceInput.addEventListener('click', handleVoiceInput);

  // 消息点击事件（复制功能）
  elements.chatMessages.addEventListener('click', handleMessageClick);
  
  // 窗口大小改变事件
  window.addEventListener('resize', handleResize);
  
  // 主题切换按钮事件
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);
}

// 处理输入框按键事件
function handleInputKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSendMessage();
  }
  
  // Ctrl/Cmd + Enter 换行
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    const start = this.selectionStart;
    const end = this.selectionEnd;
    const value = this.value;
    this.value = value.substring(0, start) + '\n' + value.substring(end);
    this.selectionStart = this.selectionEnd = start + 1;
  }
}

// 处理输入框变化事件
function handleInputChange() {
  // 自动调整文本框高度
  this.style.height = 'auto';
  this.style.height = Math.min(this.scrollHeight, 200) + 'px';
  
  // 更新 token 计数
  const tokenCount = estimateTokenCount(this.value);
  updateTokenCount(tokenCount);
  
  // 启用/禁用发送按钮
  elements.sendButton.disabled = !this.value.trim();
}

// 处理粘贴事件
async function handlePaste(e) {
  // 处理粘贴的文件
  const items = (e.clipboardData || e.originalEvent.clipboardData).items;
  for (const item of items) {
    if (item.kind === 'file') {
      e.preventDefault();
      const file = item.getAsFile();
      await handleFile(file);
      return;
    }
  }
}

// 处理文件
async function handleFile(file) {
  try {
    showLoading(true);
    const content = await readFileContent(file);
    elements.inputText.value = `文件内容：\n${content}`;
    elements.inputText.dispatchEvent(new Event('input'));
    showToast(`已读取文件：${file.name}`);
  } catch (error) {
    showToast('文件读取失败：' + error.message);
  } finally {
    showLoading(false);
  }
}

// 处理消息点击事件
function handleMessageClick(e) {
  const messageContent = e.target.closest('.message-content');
  if (!messageContent) return;
  
  // 复制消息内容
  const text = messageContent.textContent;
  navigator.clipboard.writeText(text)
    .then(() => showToast('已复制消息内容'))
    .catch(() => showToast('复制失败'));
}

// 处理窗口大小改变
function handleResize() {
  const sidebar = elements.sidebar;
  const mainContent = document.querySelector('.main-content');
  
  if (window.innerWidth > 768) {
    sidebar.classList.remove('open');
    mainContent.classList.remove('sidebar-open');
    document.body.style.overflow = '';
  }
}

// 设置快捷键
function setupShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + / 切换侧边栏
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
      e.preventDefault();
      toggleSidebar();
    }
    
    // Esc 关闭侧边栏
    if (e.key === 'Escape' && elements.sidebar.classList.contains('open')) {
      toggleSidebar();
    }
    
    // Ctrl/Cmd + L 清空聊天
    if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
      e.preventDefault();
      if (confirm('确定要清空所有聊天记录吗？')) {
        clearChat();
        showToast('已清空聊天记录');
      }
    }
  });
}

// 初始化代码高亮
function initializeCodeHighlight() {
  // 加载 highlight.js
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js';
  script.onload = () => {
    // 加载完成后初始化
    hljs.configure({ ignoreUnescapedHTML: true });
    hljs.highlightAll();
  };
  document.head.appendChild(script);
  
  // 加载样式
  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github.min.css';
  document.head.appendChild(style);
}

// 显示欢迎消息
async function showWelcomeMessage() {
  const currentModelInfo = API_CONFIG[currentProvider].models[currentModel];
  const welcomeMessage = `你好！我是 ${currentModelInfo.name}，请问有什么可以帮您的？

您可以：
• 直接输入问题开始对话
• 点击左上角按钮选择不同的模型
• 使用快捷键 Ctrl/Cmd + / 打开设置
• 点击消息可以复制内容
• 拖放文件或粘贴截图上传
• 使用语音输入（需要浏览器支持）`;

  await addMessage('assistant', welcomeMessage);
}

// 添加消息到聊天界面
async function addMessage(role, content, isTyping = false) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', role);
  
  // 添加头像
  const avatar = document.createElement('div');
  avatar.classList.add('message-avatar');
  if (role === 'assistant') {
    avatar.classList.add('ai-avatar');
  }
  avatar.innerHTML = `<img src="${role === 'user' ? './image/user.jpg' : elements.providerIcon.src}" alt="${role === 'user' ? '用户头像' : 'AI 头像'}">`;
  messageDiv.appendChild(avatar);
  
  // 添加消息内容
  const messageContent = document.createElement('div');
  messageContent.classList.add('message-content');
  
  // 处理 markdown 和代码高亮
  if (role === 'assistant') {
    if (isTyping) {
      messageContent.textContent = content;
    } else {
      messageContent.innerHTML = marked.parse(content);
      // 高亮代码块
      messageContent.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
      });
    }
  } else {
    messageContent.textContent = content;
  }
  
  messageDiv.appendChild(messageContent);
  
  // 添加到聊天区域
  elements.chatMessages.appendChild(messageDiv);
  
  if (isTyping) {
    await typeWriter(messageContent, content);
  }
  
  // 滚动到底部
  scrollToBottom();
  
  return messageDiv;
}

// 打字机效果
async function typeWriter(element, text) {
  return new Promise((resolve) => {
    let i = 0;
    clearInterval(typingInterval);
    
    typingInterval = setInterval(() => {
      if (i < text.length) {
        i += Math.max(1, Math.floor(text.length / 100)); // 动态调整速度
        const currentText = text.substring(0, i);
        if (element.closest('.message').classList.contains('assistant')) {
          element.innerHTML = marked.parse(currentText);
          // 高亮代码块
          element.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block);
          });
        } else {
          element.textContent = currentText;
        }
        scrollToBottom();
      } else {
        clearInterval(typingInterval);
        resolve();
      }
    }, APP_CONFIG.typingSpeed);
  });
}

// 处理语音输入
function handleVoiceInput() {
  if (!('webkitSpeechRecognition' in window)) {
    showToast('您的浏览器不支持语音识别');
    return;
  }
  
  const recognition = new webkitSpeechRecognition();
  recognition.lang = 'zh-CN';
  recognition.continuous = false;
  recognition.interimResults = true;
  
  recognition.onstart = () => {
    isRecording = true;
    elements.voiceInput.classList.add('recording');
    elements.voiceInput.innerHTML = '<i class="ri-stop-circle-line"></i>';
    showToast('开始录音...');
  };
  
  recognition.onend = () => {
    stopRecording();
  };
  
  recognition.onerror = (event) => {
    showToast('语音识别失败：' + event.error);
    stopRecording();
  };
  
  function stopRecording() {
    isRecording = false;
    elements.voiceInput.classList.remove('recording');
    elements.voiceInput.innerHTML = '<i class="ri-mic-line"></i>';
  }
  
  if (isRecording) {
    recognition.stop();
  } else {
    recognition.start();
  }
}

// 更新 token 计数
function updateTokenCount(count) {
  elements.tokenCount.textContent = count;
  
  // 更新预估费用
  const modelInfo = API_CONFIG[currentProvider].models[currentModel];
  const price = parseFloat(modelInfo.price.match(/¥([\d.]+)/)[1]);
  const estimatedCost = (count / 1000) * price;
  elements.tokenPrice.textContent = `预计费用: ¥${estimatedCost.toFixed(3)}`;
  
  // 显示警告
  if (count > APP_CONFIG.maxTokens * 0.9) {
    showToast('接近最大 token 限制');
  }
}

// 估算 token 数量
function estimateTokenCount(text) {
  // 简单估算：中文字符算2个token，英文和数字算1个token
  return Array.from(text).reduce((count, char) => {
    return count + (/[\u4e00-\u9fa5]/.test(char) ? 2 : 1);
  }, 0);
}

// 显示提示消息
function showToast(message, duration = 3000) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  
  // 如果已有 toast，移除它
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }
  
  document.body.appendChild(toast);
  
  // 添加动画
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// 处理发送消息
async function handleSendMessage() {
  const inputText = elements.inputText.value.trim();
  if (!inputText) {
    showToast('请输入内容！');
    return;
  }
  
  // 禁用输入和发送按钮
  elements.inputText.disabled = true;
  elements.sendButton.disabled = true;
  
  try {
    // 添加用户消息
    addMessage('user', inputText);
    
    // 清空输入框
    elements.inputText.value = '';
    elements.inputText.style.height = 'auto';
    
    // 添加到历史记录
    history.push({ role: 'user', content: inputText });
    
    // 限制历史记录长度
    if (history.length > APP_CONFIG.maxHistoryLength) {
      history = [
        history[0],
        ...history.slice(-APP_CONFIG.maxHistoryLength + 1)
      ];
    }
    
    // 发送请求
    showLoading(true);
    
    // 检查当前模型是否是DeepSeek Reasoner
    const modelInfo = API_CONFIG[currentProvider].models[currentModel];
    const isReasonerModel = modelInfo.hasReasoningContent;
    
    if (isReasonerModel) {
      // 使用流式响应处理DeepSeek Reasoner模型
      await handleReasonerResponse(inputText);
    } else {
      // 处理普通模型响应
      const response = await sendRequest(inputText);
      const result = response.choices[0].message.content;
      
      // 添加 AI 回复
      addMessage('assistant', result, true);
      
      // 添加到历史记录
      history.push({ role: 'assistant', content: result });
      
      // 更新 token 统计
      updateTokenStats(response.usage);
    }
  } catch (error) {
    console.error('请求失败：', error);
    showToast(error.message || '请求失败，请稍后重试');
  } finally {
    // 恢复输入和发送按钮
    elements.inputText.disabled = false;
    elements.sendButton.disabled = false;
    showLoading(false);
  }
}

// 发送 API 请求
async function sendRequest(content, retryCount = 0, stream = false) {
  const config = API_CONFIG[currentProvider];
  const endpoint = '/chat/completions';
  
  try {
    let requestBody = {
      model: currentModel,
      messages: history,
      temperature: APP_CONFIG.temperature,
      max_tokens: APP_CONFIG.maxTokens
    };
    
    // 如果是流式响应，添加stream参数
    if (stream) {
      requestBody.stream = true;
    }
    
    // 处理OpenRouter特殊情况
    let headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.key}`
    };
    
    // 如果是OpenRouter，添加额外的请求头
    if (currentProvider === 'openrouter' && config.headers) {
      headers = {...headers, ...config.headers};
    }
    
    const response = await fetch(`${config.url}${endpoint}`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestBody)
    });

    if (response.status === 429 && retryCount < 3) {
      // 如果遇到限流，等待一段时间后重试
      const retryAfter = response.headers.get('Retry-After') || 5;
      showToast(`请求过于频繁，${retryAfter}秒后重试...`);
      await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
      return sendRequest(content, retryCount + 1, stream);
    }
    
    if (!response.ok) {
      throw new Error(`HTTP 错误！状态码: ${response.status}`);
    }
    
    // 如果是流式响应，返回response对象
    if (stream) {
      return response;
    }
    
    // 否则解析JSON响应
    const data = await response.json();
    if (!data.choices || !data.choices.length) {
      throw new Error('API 返回数据异常');
    }
    
    return data;
  } catch (error) {
    console.error('请求失败:', error);
    if (retryCount < 3) {
      // 其他错误也进行重试
      await new Promise(resolve => setTimeout(resolve, 2000));
      return sendRequest(content, retryCount + 1, stream);
    }
    throw error;
  }
}

// 处理DeepSeek Reasoner模型的流式响应
async function handleReasonerResponse(content) {
  try {
    // 发送流式请求
    const response = await sendRequest(content, 0, true);
    
    // 获取响应的reader
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    
    let reasoningContent = '';
    let finalContent = '';
    let isCollectingReasoning = true; // 标记是否正在收集推理内容
    
    // 创建消息元素，但暂不显示内容
    const messageDiv = await addMessage('assistant', '', false, '');
    const messageContent = messageDiv.querySelector('.message-content');
    const reasoningBody = messageDiv.querySelector('.reasoning-body');
    
    // 处理流式响应
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      // 解码响应数据
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');
      
      for (const line of lines) {
        if (!line.trim() || !line.startsWith('data:')) continue;
        
        try {
          // 解析JSON数据
          const jsonData = JSON.parse(line.substring(5).trim());
          
          // 检查是否有推理内容
          if (jsonData.choices[0].delta.reasoning_content) {
            reasoningContent += jsonData.choices[0].delta.reasoning_content;
            if (reasoningBody) {
              reasoningBody.innerHTML = marked.parse(reasoningContent);
              // 高亮代码块
              reasoningBody.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block);
              });
            }
            isCollectingReasoning = true;
          } 
          // 检查是否有最终内容
          else if (jsonData.choices[0].delta.content) {
            // 如果之前在收集推理内容，现在开始收集最终内容
            if (isCollectingReasoning) {
              isCollectingReasoning = false;
            }
            
            finalContent += jsonData.choices[0].delta.content;
            if (messageContent) {
              messageContent.innerHTML = marked.parse(finalContent);
              // 高亮代码块
              messageContent.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block);
              });
            }
          }
          
          // 滚动到底部
          scrollToBottom();
        } catch (e) {
          console.error('解析流式响应出错:', e);
        }
      }
    }
    
    // 添加到历史记录（只保存最终回答，不保存推理过程）
    history.push({ role: 'assistant', content: finalContent });
    
    // 更新消息元素，确保显示完整内容
    if (messageContent) {
      messageContent.innerHTML = marked.parse(finalContent);
      // 高亮代码块
      messageContent.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
      });
    }
    
    if (reasoningBody) {
      reasoningBody.innerHTML = marked.parse(reasoningContent);
      // 高亮代码块
      reasoningBody.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
      });
    }
    
    // 滚动到底部
    scrollToBottom();
    
  } catch (error) {
    console.error('处理流式响应失败:', error);
    throw error;
  }
}

// 更新 token 统计
function updateTokenStats(usage) {
  if (!usage) return;
  
  const modelInfo = API_CONFIG[currentProvider].models[currentModel];
  const price = parseFloat(modelInfo.price.match(/¥([\d.]+)/)[1]);
  const cost = (usage.total_tokens / 1000) * price;
  
  elements.tokenCount.textContent = usage.total_tokens;
  elements.tokenPrice.textContent = `费用: ¥${cost.toFixed(3)}`;
}

// 清空聊天记录
function clearChat() {
  elements.chatMessages.innerHTML = '';
  history = [
    { role: 'system', content: API_CONFIG[currentProvider].systemMessage }
  ];
  showWelcomeMessage();
}

// 导出聊天记录
function exportChat() {
  const messages = history.slice(1); // 排除系统消息
  const chatLog = messages.map(msg => `${msg.role}: ${msg.content}`).join('\n\n');
  
  const blob = new Blob([chatLog], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `chat-log-${new Date().toISOString().slice(0, 10)}.txt`;
  a.click();
  
  URL.revokeObjectURL(url);
}

// 处理文件上传
async function handleFileUpload() {
  const input = document.createElement('input');
  input.type = 'file';
  input.multiple = true;
  input.accept = Object.values(APP_CONFIG.supportedFiles).flat().join(',');
  
  input.onchange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    
    try {
      showLoading(true);
      
      for (const file of files) {
        // 检查文件大小
        if (file.size > APP_CONFIG.maxFileSize) {
          showToast(`文件 ${file.name} 超过大小限制 (${APP_CONFIG.maxFileSize / 1024 / 1024}MB)`);
          continue;
        }
        
        // 处理图片文件
        if (file.type.startsWith('image/')) {
          await handleImageUpload(file);
        } else {
          // 处理其他文件
          const content = await readFileContent(file);
          elements.inputText.value += `\n文件内容 (${file.name})：\n${content}\n`;
        }
      }
      
      // 调整输入框高度
      elements.inputText.style.height = 'auto';
      elements.inputText.style.height = Math.min(elements.inputText.scrollHeight, 200) + 'px';
      
      // 更新 token 计数
      updateTokenCount(estimateTokenCount(elements.inputText.value));
    } catch (error) {
      showToast('文件处理失败：' + error.message);
    } finally {
      showLoading(false);
    }
  };
  
  input.click();
}

// 处理图片上传
async function handleImageUpload(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        // 压缩图片
        const compressedImage = await compressImage(e.target.result);
        
        // 添加图片到输入框
        const timestamp = new Date().getTime();
        const filename = `${timestamp}_${file.name}`;
        
        // 保存图片到本地存储
        localStorage.setItem(`image_${timestamp}`, compressedImage);
        
        // 在输入框中添加图片标记
        const imageTag = `\n![${file.name}](${compressedImage})\n`;
        elements.inputText.value += imageTag;
        
        resolve();
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// 压缩图片
async function compressImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // 计算压缩后的尺寸
      let { width, height } = img;
      const maxWidth = APP_CONFIG.imageCompression.maxWidth;
      const maxHeight = APP_CONFIG.imageCompression.maxHeight;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }
      
      // 设置 canvas 尺寸
      canvas.width = width;
      canvas.height = height;
      
      // 绘制图片
      ctx.drawImage(img, 0, 0, width, height);
      
      // 导出压缩后的图片
      const compressedDataUrl = canvas.toDataURL('image/jpeg', APP_CONFIG.imageCompression.quality);
      resolve(compressedDataUrl);
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

// 支持拖放上传
function setupDragAndDrop() {
  const dropZone = document.body;
  
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.add('drag-over');
  });
  
  dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove('drag-over');
  });
  
  dropZone.addEventListener('drop', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove('drag-over');
    
    const files = Array.from(e.dataTransfer.files);
    if (!files.length) return;
    
    try {
      showLoading(true);
      
      for (const file of files) {
        if (file.size > APP_CONFIG.maxFileSize) {
          showToast(`文件 ${file.name} 超过大小限制 (${APP_CONFIG.maxFileSize / 1024 / 1024}MB)`);
          continue;
        }
        
        if (file.type.startsWith('image/')) {
          await handleImageUpload(file);
        } else {
          const content = await readFileContent(file);
          elements.inputText.value += `\n文件内容 (${file.name})：\n${content}\n`;
        }
      }
      
      elements.inputText.style.height = 'auto';
      elements.inputText.style.height = Math.min(elements.inputText.scrollHeight, 200) + 'px';
      updateTokenCount(estimateTokenCount(elements.inputText.value));
    } catch (error) {
      showToast('文件处理失败：' + error.message);
    } finally {
      showLoading(false);
    }
  });
}

// 读取文件内容
async function readFileContent(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
}

// 切换侧边栏
function toggleSidebar() {
  const sidebar = elements.sidebar;
  const mainContent = document.querySelector('.main-content');
  
  sidebar.classList.toggle('open');
  mainContent.classList.toggle('sidebar-open');
  
  // 在移动端时，当侧边栏打开时禁止背景滚动
  if (window.innerWidth <= 768) {
    document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
  }
}

// 初始化个人中心
function setupUserCenter() {
  // 确保DOM元素已加载
  const userCenterBtn = document.getElementById('userCenterBtn');
  const userCenterPanel = document.getElementById('userCenterPanel');
  
  if (!userCenterBtn || !userCenterPanel) return;
  
  // 为菜单项添加点击事件
  const menuItems = document.querySelectorAll('.user-menu-item');
  menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const action = e.currentTarget.textContent.trim();
      handleUserMenuAction(action);
      userCenterPanel.classList.remove('show');
    });
  });
}

// 切换个人中心面板显示/隐藏
function toggleUserCenter() {
  const userCenterPanel = document.getElementById('userCenterPanel');
  userCenterPanel.classList.toggle('show');
  
  // 阻止事件冒泡，防止立即被document点击事件关闭
  event.stopPropagation();
}

// 处理个人中心菜单项点击
function handleUserMenuAction(action) {
  switch(action) {
    case '个人设置':
      showToast('个人设置功能即将上线');
      break;
    case '历史记录':
      showToast('历史记录功能即将上线');
      break;
    case '收藏夹':
      showToast('收藏夹功能即将上线');
      break;
    case '退出登录':
      if (confirm('确定要退出登录吗？')) {
        showToast('已退出登录');
        // 这里可以添加实际的退出登录逻辑
      }
      break;
    default:
      break;
  }
}

// 显示加载状态
function showLoading(show) {
  elements.loadingIndicator.classList.toggle('active', show);
}

// 滚动到底部
function scrollToBottom() {
  elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
}

// 初始化 marked
function initializeMarked() {
  marked.setOptions({
    renderer: new marked.Renderer(),
    highlight: function(code, lang) {
      if (hljs.getLanguage(lang)) {
        return hljs.highlight(code, { language: lang }).value;
      }
      return code;
    },
    pedantic: false,
    gfm: true,
    breaks: true,
    sanitize: false,
    smartypants: false,
    xhtml: false
  });
}

// 显示图片预览
function showImagePreview(src) {
  const modal = document.createElement('div');
  modal.className = 'modal image-preview-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>图片预览</h3>
        <button class="close-button">&times;</button>
      </div>
      <div class="modal-body">
        <img src="${src}" alt="预览图片" style="max-width: 100%; height: auto;">
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  modal.classList.add('active');
  
  const closeButton = modal.querySelector('.close-button');
  closeButton.onclick = () => {
    modal.classList.remove('active');
    setTimeout(() => modal.remove(), 300);
  };
  
  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      setTimeout(() => modal.remove(), 300);
    }
  };
}

// 初始化模型选择器
function initializeModelSelector() {
  const modelSelector = elements.modelSelector;
  modelSelector.innerHTML = '';
  
  // 遍历所有提供商
  Object.entries(API_CONFIG).forEach(([providerId, provider]) => {
    // 添加提供商标题
    const providerTitle = document.createElement('div');
    providerTitle.className = 'provider-title';
    providerTitle.textContent = provider.name;
    modelSelector.appendChild(providerTitle);
    
    // 添加模型选项
    Object.entries(provider.models).forEach(([modelId, model]) => {
      const option = document.createElement('div');
      option.className = 'model-option';
      option.dataset.provider = providerId;
      option.dataset.model = modelId;
      
      if (providerId === currentProvider && modelId === currentModel) {
        option.classList.add('selected');
      }
      
      option.innerHTML = `
        <img src="${model.icon}" alt="${model.name}" class="model-icon">
        <div class="model-info">
          <div class="model-name">${model.name}</div>
          <div class="model-description">${model.description}</div>
        </div>
      `;
      
      option.addEventListener('click', () => switchModel(providerId, modelId));
      modelSelector.appendChild(option);
    });
  });
}
// 更新模型信息
function updateModelInfo() {
  const provider = API_CONFIG[currentProvider];
  const model = provider.models[currentModel];
  
  elements.modelName.textContent = model.name;
  elements.modelDescription.textContent = model.description;
  elements.providerIcon.src = model.icon;
  elements.providerIcon.alt = `${model.name} 图标`;
  elements.maxTokenCount.textContent = model.maxTokens;
  elements.maxTokens.value = Math.min(APP_CONFIG.maxTokens, model.maxTokens);
  
  // 更新所有AI消息的头像
  document.querySelectorAll('.message.assistant .ai-avatar img').forEach(img => {
    img.src = model.icon;
    img.alt = `${model.name} 图标`;
  });
}

// 切换模型
async function switchModel(provider, modelId) {
  currentProvider = provider;
  currentModel = modelId;
  
  // 更新选中状态
  document.querySelectorAll('.model-option').forEach(option => {
    option.classList.remove('selected');
  });
  document.querySelector(`[data-model="${modelId}"]`).classList.add('selected');
  
  // 更新系统消息
  history = [
    { role: 'system', content: API_CONFIG[provider].systemMessage }
  ];
  
  // 更新界面
  updateModelInfo();
  elements.chatMessages.innerHTML = '';
  await showWelcomeMessage();
  
  // 关闭侧边栏
  toggleSidebar();
}

// 初始化预设角色列表
function initializePresetList() {
  const presetList = elements.presetList;
  presetList.innerHTML = '';
  
  // 加载自定义预设角色
  const customPresets = JSON.parse(localStorage.getItem('customPresets') || '{}');
  
  // 合并预设角色和自定义角色
  const allPresets = { ...PRESET_CHARACTERS, ...customPresets };
  
  // 确保自定义角色有正确的category属性
  Object.keys(customPresets).forEach(presetId => {
    if (!customPresets[presetId].category) {
      customPresets[presetId].category = 'assistant';
    }
  });
  
  // 获取当前选中的分类
  const currentCategory = document.querySelector('.preset-category.active')?.dataset.category || 'all';
  
  // 为每个预设角色分配默认分类
  const presetCategories = {
    dirtyTalker: 'creative',
    wangYangming: 'professional',
    atoli: 'creative',
    translator: 'assistant',
    programmer: 'professional',
    writer: 'creative'
  };
  
  // 遍历所有预设角色
  Object.entries(allPresets).forEach(([presetId, preset]) => {
    // 获取角色分类，如果没有则默认为'assistant'
    const category = preset.category || presetCategories[presetId] || 'assistant';
    
    // 如果选择了特定分类且当前角色不属于该分类，则跳过
    if (currentCategory !== 'all' && category !== currentCategory) {
      return;
    }
    
    const option = document.createElement('div');
    option.className = 'preset-option';
    option.dataset.preset = presetId;
    option.dataset.category = category;
    
    if (currentPreset === presetId) {
      option.classList.add('selected');
    }
    
    option.innerHTML = `
      <img src="${preset.icon}" alt="${preset.name}" class="preset-icon">
      <div class="preset-info">
        <div class="preset-name">${preset.name}</div>
        <div class="preset-description">${preset.description}</div>
      </div>
    `;
    
    option.addEventListener('click', () => selectPreset(presetId));
    presetList.appendChild(option);
  });
  
  // 添加分类标签点击事件
  document.querySelectorAll('.preset-category').forEach(category => {
    category.addEventListener('click', (e) => {
      e.stopPropagation(); // 阻止事件冒泡，防止触发折叠
      
      // 更新选中状态
      document.querySelectorAll('.preset-category').forEach(cat => {
        cat.classList.remove('active');
      });
      category.classList.add('active');
      
      // 重新初始化预设列表
      initializePresetList();
    });
  });
}

// 选择预设角色
function selectPreset(presetId) {
  currentPreset = presetId;
  
  // 获取自定义预设角色
  const customPresets = JSON.parse(localStorage.getItem('customPresets') || '{}');
  
  // 从预设角色或自定义角色中获取
  let preset = null;
  
  // 检查是否是自定义角色（以custom_开头的ID）
  if (presetId.startsWith('custom_')) {
    preset = customPresets[presetId];
  } else {
    preset = PRESET_CHARACTERS[presetId];
  }
  
  if (!preset) {
    showToast('找不到该预设角色');
    return;
  }
  
  // 更新选中状态
  document.querySelectorAll('.preset-option').forEach(option => {
    option.classList.remove('selected');
  });
  document.querySelector(`[data-preset="${presetId}"]`).classList.add('selected');
  
  // 更新系统消息
  history = [
    { role: 'system', content: preset.systemMessage }
  ];
  
  // 更新界面
  elements.chatMessages.innerHTML = '';
  showToast(`已切换到角色：${preset.name}`);
  showWelcomeMessage();
  
  // 关闭侧边栏
  toggleSidebar();
}

// 添加新预设角色
function addPreset() {
  // 创建模态框
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content preset-modal">
      <div class="modal-header">
        <h3><i class="ri-user-add-line"></i> 添加预设角色</h3>
        <button class="close-button">
          <i class="ri-close-line"></i>
        </button>
      </div>
      <div class="modal-body">
        <div class="preset-form">
          <div class="preset-avatar-selector">
            <div class="avatar-preview">
              <img src="./image/user.jpg" id="selectedAvatar" alt="角色头像">
            </div>
            <div class="avatar-options">
              <div class="avatar-option selected" data-avatar="./image/user.jpg">
                <img src="./image/user.jpg" alt="默认头像">
              </div>
              <div class="avatar-option" data-avatar="./image/Qwen.png">
                <img src="./image/Qwen.png" alt="通义千问">
              </div>
              <div class="avatar-option" data-avatar="./image/deepseek.png">
                <img src="./image/deepseek.png" alt="DeepSeek">
              </div>
              <div class="avatar-option" data-avatar="./image/kimi.jpg">
                <img src="./image/kimi.jpg" alt="Kimi">
              </div>
              <div class="avatar-option" data-avatar="./image/default-model.png">
                <img src="./image/default-model.png" alt="默认模型">
              </div>
            </div>
          </div>
          
          <div class="form-group">
            <label for="presetName">角色名称</label>
            <input type="text" id="presetName" placeholder="输入角色名称" class="styled-input">
            <small class="input-tip">为你的AI助手起一个独特的名字</small>
          </div>
          
          <div class="form-group">
            <label for="presetDescription">角色描述</label>
            <input type="text" id="presetDescription" placeholder="输入角色描述" class="styled-input">
            <small class="input-tip">简短描述这个角色的特点和用途</small>
          </div>
          
          <div class="form-group">
            <label for="presetSystemMessage">系统提示词</label>
            <textarea id="presetSystemMessage" placeholder="输入系统提示词，定义AI的行为和专业领域" rows="5" class="styled-textarea"></textarea>
            <small class="input-tip">详细定义AI的行为、知识领域和回答风格</small>
          </div>
          
          <div class="form-actions">
            <button id="cancelPreset" class="secondary-button">取消</button>
            <button id="savePreset" class="primary-button"><i class="ri-save-line"></i> 保存角色</button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  modal.classList.add('active');
  
  // 关闭按钮事件
  const closeButton = modal.querySelector('.close-button');
  closeButton.onclick = () => {
    modal.classList.remove('active');
    setTimeout(() => modal.remove(), 300);
  };
  
  // 点击模态框背景关闭
  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      setTimeout(() => modal.remove(), 300);
    }
  };
  
  // 设置头像选择功能
  const avatarOptions = modal.querySelectorAll('.avatar-option');
  const selectedAvatar = modal.querySelector('#selectedAvatar');
  let selectedAvatarPath = './image/user.jpg'; // 默认头像
  
  avatarOptions.forEach(option => {
    option.addEventListener('click', () => {
      // 移除之前选中的样式
      avatarOptions.forEach(opt => opt.classList.remove('selected'));
      // 添加当前选中的样式
      option.classList.add('selected');
      // 更新预览图
      const avatarPath = option.getAttribute('data-avatar');
      selectedAvatar.src = avatarPath;
      selectedAvatarPath = avatarPath;
    });
  });
  
  // 取消按钮事件
  const cancelButton = modal.querySelector('#cancelPreset');
  cancelButton.onclick = () => {
    modal.classList.remove('active');
    setTimeout(() => modal.remove(), 300);
  };
  
  // 保存按钮事件
  const saveButton = modal.querySelector('#savePreset');
  saveButton.onclick = () => {
    const name = modal.querySelector('#presetName').value.trim();
    const description = modal.querySelector('#presetDescription').value.trim();
    const systemMessage = modal.querySelector('#presetSystemMessage').value.trim();
    
    if (!name || !systemMessage) {
      showToast('请填写角色名称和系统提示词');
      return;
    }
    
    // 生成唯一ID
    const presetId = 'custom_' + Date.now();
    
    // 保存到本地存储
    const customPresets = JSON.parse(localStorage.getItem('customPresets') || '{}');
    customPresets[presetId] = {
      name,
      description,
      systemMessage,
      icon: selectedAvatarPath, // 使用选中的头像
      isCustom: true,
      category: 'assistant' // 默认分类为助手
    };
    localStorage.setItem('customPresets', JSON.stringify(customPresets));
    
    // 添加到全局对象
    PRESET_CHARACTERS[presetId] = customPresets[presetId];
    
    // 更新列表
    initializePresetList();
    
    // 关闭模态框
    modal.classList.remove('active');
    setTimeout(() => modal.remove(), 300);
    
    showToast('已添加新角色');
  };
}

// 初始化应用
init();