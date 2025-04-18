# Aaachat 聊天应用

## 项目简介

Aaachat是一款功能强大的Web端AI聊天应用，为用户提供了与多种顶尖大语言模型交互的便捷平台。通过简洁直观的界面，用户可以无缝切换于通义千问、Kimi (Moonshot AI)、DeepSeek以及OpenRouter提供的各类先进模型之间，体验不同AI的独特能力。

本应用采用纯前端技术栈构建，无需复杂的后端部署，只需简单配置API密钥即可在本地浏览器中运行，为AI爱好者、开发者和普通用户提供了一个轻量级但功能完备的AI对话平台。
![image](https://github.com/user-attachments/assets/48d7bc93-9322-445c-841f-6ec461747714)

## 核心功能

- **多模型集成**：支持业界领先的多种AI大语言模型，包括：
  - 通义千问（Qwen-Turbo、Qwen-Plus、Qwen-Max）
  - Kimi（Moonshot-V1-8K、Moonshot-V1-32K、Moonshot-V1-128K）
  - DeepSeek（DeepSeek Chat、DeepSeek Reasoner）
  - OpenRouter提供的多种模型（Gemini 2.0/2.5、Qwen 2.5等）

- **智能角色预设**：内置多种专业角色预设，如翻译官、代码专家、文案大师等，一键切换AI助手的专业角色，满足不同场景需求

- **个性化用户中心**：提供完善的用户设置管理，包括API密钥配置、界面主题切换等功能，打造个性化使用体验

- **对话历史管理**：自动保存用户的对话历史，支持查看、管理和继续历史对话，提升使用连贯性

- **深浅主题切换**：支持深色和浅色显示主题，保护视力的同时提供舒适的视觉体验

- **响应式设计**：适配不同设备屏幕尺寸，在桌面和移动设备上均可流畅使用

## 使用说明

### 安装与配置

1. 克隆或下载本项目到本地

2. 打开`config.js`文件，配置您的API密钥：
   - 将`YOUR_QWEN_API_KEY`替换为您的通义千问API密钥
   - 将`YOUR_KIMI_API_KEY`替换为您的Kimi API密钥
   - 将`YOUR_DEEPSEEK_API_KEY`替换为您的DeepSeek API密钥
   - 将`YOUR_OPENROUTER_API_KEY`替换为您的OpenRouter API密钥

3. 使用浏览器打开`index.html`文件即可开始使用

### 使用方法

1. **选择模型**：在界面顶部选择您想要使用的AI模型

2. **选择角色预设**：可以选择预设的AI角色，如翻译官、代码专家等

3. **发送消息**：在底部输入框中输入您的问题或指令，点击发送按钮或按Enter键发送

4. **查看历史**：点击历史按钮查看您的对话历史记录

5. **用户设置**：点击用户图标进入用户中心，可以设置API密钥、切换主题等

## 技术栈

- 前端：HTML, CSS, JavaScript (原生)
- API集成：RESTful API
- 数据存储：浏览器本地存储 (LocalStorage)

## 注意事项

- 本应用需要有效的API密钥才能正常使用各AI模型功能
- 使用API可能会产生相应的费用，请参考各API提供商的计费规则
- 建议在本地开发时将包含API密钥的配置文件添加到.gitignore中
- 所有对话数据均存储在本地，不会上传至任何服务器，保障用户隐私安全
