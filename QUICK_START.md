# DeepSeek 集成快速启动指南

## ✅ API Key 已配置

你的 DeepSeek API Key 需要从 https://platform.deepseek.com/ 获取

## 🚀 快速启动（2个步骤）

### 步骤 1: 启动后端服务器

**方法 A: 使用启动脚本（推荐）**
```powershell
.\start-backend.ps1
```

**方法 B: 手动启动**
```powershell
cd backend-example
# 创建 .env 文件（如果还没有）
# 内容：DEEPSEEK_API_KEY=your_api_key_here
npm install
npm start
```

后端服务器将在 **http://localhost:3000** 运行

### 步骤 2: 启动前端

**方法 A: 使用启动脚本（推荐）**
```powershell
# 新开一个终端窗口
.\start-frontend.ps1
```

**方法 B: 手动启动**
```powershell
# 创建 .env.development 文件（如果还没有）
# 内容：VITE_API_URL=http://localhost:3000
npm run dev:h5
```

前端将在浏览器中自动打开

## 🧪 测试 AI 解读功能

1. 在浏览器中输入你的生日信息（例如：1987-07-21 06:00）
2. 点击"开始排盘"
3. 切换到 **"AI解读"** 标签
4. 点击 **"AI 智能解读"** 按钮
5. 等待 AI 生成解读结果

## ✅ 检查清单

- [ ] 后端服务器正在运行（http://localhost:3000）
- [ ] 前端开发服务器正在运行
- [ ] 浏览器已打开应用
- [ ] 可以正常排盘
- [ ] AI解读按钮可以点击

## 🐛 故障排除

### 后端启动失败
- 检查 Node.js 是否安装：`node -v`
- 检查端口 3000 是否被占用
- 确认 `backend-example/.env` 文件存在且包含 API Key

### 前端无法连接后端
- 确认后端正在运行
- 检查 `.env.development` 文件中的 `VITE_API_URL=http://localhost:3000`
- 重启前端开发服务器

### AI 解读失败
- 检查浏览器控制台的错误信息
- 确认 API Key 正确
- 检查后端服务器日志

## 📝 注意事项

- 后端和前端需要在**不同的终端窗口**运行
- 确保后端先启动，再启动前端
- API Key 已包含在启动脚本中，会自动创建配置文件

