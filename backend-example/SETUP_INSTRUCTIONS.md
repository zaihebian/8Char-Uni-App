# DeepSeek API 设置说明

## 步骤 1: 创建 .env 文件

在 `backend-example` 目录下创建 `.env` 文件，内容如下：

```
DEEPSEEK_API_KEY=your_api_key_here
PORT=3000
```

## 步骤 2: 安装依赖

```powershell
cd backend-example
npm install
```

## 步骤 3: 启动后端服务器

```powershell
npm start
```

服务器将在 http://localhost:3000 运行

## 步骤 4: 配置前端

在项目根目录创建 `.env.development` 文件：

```
VITE_API_URL=http://localhost:3000
```

## 步骤 5: 测试

1. 启动前端（新终端）：
   ```powershell
   npm run dev:h5
   ```

2. 在浏览器中测试 AI 解读功能

