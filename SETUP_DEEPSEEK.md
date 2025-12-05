# DeepSeek API 设置指南

## 快速开始

### 方法 1: 使用后端代理（推荐）

#### 步骤 1: 获取 API Key
1. 访问 https://platform.deepseek.com/
2. 注册/登录账号
3. 在 Dashboard 创建 API Key
4. 复制你的 API Key

#### 步骤 2: 设置后端服务器

1. **进入后端目录：**
   ```powershell
   cd backend-example
   ```

2. **安装依赖：**
   ```powershell
   npm install
   ```

3. **创建 `.env` 文件：**
   在 `backend-example` 目录下创建 `.env` 文件，内容：
   ```
   DEEPSEEK_API_KEY=你的API密钥
   PORT=3000
   ```

4. **启动后端服务器：**
   ```powershell
   npm start
   ```

   服务器会在 `http://localhost:3000` 运行

#### 步骤 3: 配置前端 API 地址

创建 `.env.development` 文件（项目根目录）：
```
VITE_API_URL=http://localhost:3000
```

#### 步骤 4: 测试

1. 启动前端开发服务器：
   ```powershell
   npm run dev:h5
   ```

2. 在浏览器中：
   - 输入生日信息
   - 点击"开始排盘"
   - 切换到"AI解读"标签
   - 点击"AI 智能解读"按钮

---

### 方法 2: 直接测试脚本（仅用于测试）

#### 步骤 1: 设置环境变量

**Windows PowerShell:**
```powershell
$env:DEEPSEEK_API_KEY="你的API密钥"
```

**Windows CMD:**
```cmd
set DEEPSEEK_API_KEY=你的API密钥
```

**Linux/Mac:**
```bash
export DEEPSEEK_API_KEY=你的API密钥
```

#### 步骤 2: 运行测试脚本

```powershell
node test-birthday-deepseek.js
```

---

## 故障排除

### 问题：后端服务器启动失败
- 检查 Node.js 是否安装：`node -v`
- 检查依赖是否安装：`npm install`
- 检查端口 3000 是否被占用

### 问题：API 请求失败
- 确认 API Key 正确
- 检查后端服务器是否运行
- 查看浏览器控制台的错误信息
- 检查 CORS 设置

### 问题：前端无法连接后端
- 确认 `.env.development` 中的 `VITE_API_URL` 正确
- 重启开发服务器
- 检查后端是否在运行

---

## 安全提示

⚠️ **重要：**
- 永远不要将 API Key 提交到 Git 仓库
- 在生产环境中使用后端代理
- 将 `.env` 文件添加到 `.gitignore`

