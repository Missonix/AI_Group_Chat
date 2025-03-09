# AI Chat Web Application

一个基于Vue3框架和Robyn的AI聊天应用，提供智能对话和用户管理功能。

## 项目概述

该项目是一个现代化的AI聊天网站，前端使用Vue3开发，后端使用Python的Robyn框架开发。项目采用前后端分离架构，提供流畅的用户体验和可靠的后端服务。
## 页面展示

**PC端界面**
<br><img src="https://github.com/user-attachments/assets/afd8d703-42e5-4d99-a0c0-28fff830649f" width="950" height="450" alt="PC端界面">
<br>
**移动端界面**

| 图片1 | 图片2 |
|-------|-------|
| ![移动端界面1](https://github.com/user-attachments/assets/87da3d2a-6c7e-47fa-9938-cb98deec8f04) | ![移动端界面2](https://github.com/user-attachments/assets/4d8fcedd-e967-40b6-a1a8-b4fe9eb5f43e) |

## 技术栈

### 前端 (client)
- Vue 3
- TypeScript
- Pinia (状态管理)
- Vue Router
- Element Plus
- Axios
- WebSocket
- SCSS
- Vite (构建工具)

### 后端 (server)
- Python
- Robyn (Web框架)
- SQLAlchemy (ORM)
- Redis (缓存)
- WebSocket
- JWT (认证)

## 主要功能

### 用户系统
- 用户注册/登录
- 邮箱验证
- 密码重置
- 用户信息管理

### AI聊天
- 实时对话
- 会话管理
- 消息历史记录
- 流式响应
- 智能上下文理解

### 其他功能
- 响应式设计
- 多主题支持
- 实时通知
- 数据持久化

## 项目结构

```
├── client/                 # 前端项目目录
│   ├── src/               # 源代码
│   │   ├── api/          # API接口
│   │   ├── assets/       # 静态资源
│   │   ├── components/   # 组件
│   │   ├── composables/  # 组合式函数
│   │   ├── router/       # 路由配置
│   │   ├── stores/       # Pinia状态管理
│   │   └── views/        # 页面视图
│   └── package.json      # 项目依赖
│
├── server/                # 后端项目目录
│   ├── apps/             # 应用模块
│   │   ├── chat/         # 聊天模块
│   │   ├── users/        # 用户模块
│   │   └── products/     # 产品模块
│   ├── core/             # 核心功能
│   └── requirements.txt  # Python依赖
```

## 快速开始

### 前端开发
```bash
# 进入前端目录
cd client

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

### 后端开发
```bash
# 进入后端目录
cd server

# 创建虚拟环境
python -m venv venv

# 激活虚拟环境
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# 安装依赖
pip install -r requirements.txt

# 启动服务器
python main.py
```

## API文档

详细的API文档请参考 [server/API_DOCUMENTATION.md](server/API_DOCUMENTATION.md)

## 环境要求

### 前端
- Node.js >= 16.0.0
- npm >= 8.0.0

### 后端
- Python >= 3.8
- Redis >= 6.0
- MySQL >= 8.0

## 部署说明

### 前端部署
1. 执行`npm run build`生成静态文件
2. 将`dist`目录下的文件部署到Web服务器

### 后端部署
1. 配置环境变量
2. 安装依赖
3. 配置数据库连接
4. 使用gunicorn或uvicorn启动服务

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交Pull Request

## 许可证

[MIT License](LICENSE)

## 联系方式

- 项目维护者: [Your Name]
- Email: [your.email@example.com]
- 项目链接: [https://github.com/yourusername/project-name] 
