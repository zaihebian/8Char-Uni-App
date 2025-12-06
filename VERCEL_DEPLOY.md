# Vercel 部署指南

本指南将帮助你将 Uni-APP 项目部署到 Vercel。

## 前置要求

1. **Vercel 账号**：如果没有，请访问 [vercel.com](https://vercel.com) 注册
2. **GitHub/GitLab/Bitbucket 账号**：用于连接代码仓库
3. **DeepSeek API Key**：用于 AI 解读功能（可选，但推荐）

## 部署步骤

### 方法一：通过 Vercel Dashboard（推荐）

1. **登录 Vercel**
   - 访问 [vercel.com](https://vercel.com)
   - 使用 GitHub/GitLab/Bitbucket 账号登录

2. **导入项目**
   - 点击 "Add New..." → "Project"
   - 选择你的代码仓库（GitHub/GitLab/Bitbucket）
   - 如果仓库不存在，先推送到远程仓库

3. **配置项目**
   - **Framework Preset**: 选择 "Other" 或 "Vite"
   - **Root Directory**: 留空（使用根目录）
   - **Build Command**: `npm run build:h5`（已自动配置在 `vercel.json`）
   - **Output Directory**: `dist/build/h5`（已自动配置在 `vercel.json`）
   - **Install Command**: `npm install`（已自动配置在 `vercel.json`）

4. **配置环境变量**
   点击 "Environment Variables" 添加以下变量：
   
   ```
   DEEPSEEK_API_KEY=your_deepseek_api_key_here
   ```
   
   **重要说明**：
   - **必需**：`DEEPSEEK_API_KEY` - 你的 DeepSeek API Key（从 [platform.deepseek.com](https://platform.deepseek.com/) 获取）
   - **可选**：`VITE_API_URL` - 仅在需要自定义后端时设置（默认使用内置的 Vercel Serverless Function）
   - 项目已包含 Vercel Serverless Function，无需单独部署后端服务器
   - API Key 安全存储在 Vercel 环境变量中，不会暴露给前端

5. **部署**
   - 点击 "Deploy"
   - 等待构建完成（通常 2-5 分钟）

### 方法二：通过 Vercel CLI

1. **安装 Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **登录 Vercel**
   ```bash
   vercel login
   ```

3. **部署项目**
   ```bash
   vercel
   ```
   
   首次部署会提示：
   - 是否链接到现有项目？选择 "No"
   - 项目名称：使用默认或自定义
   - 输出目录：使用默认 `dist/build/h5`
   - 是否覆盖设置？选择 "Yes"

4. **配置环境变量**
   ```bash
   vercel env add DEEPSEEK_API_KEY
   ```
   输入你的 DeepSeek API Key
   
   （可选）如果需要自定义后端：
   ```bash
   vercel env add VITE_API_URL
   ```
   输入你的后端 API URL

5. **生产环境部署**
   ```bash
   vercel --prod
   ```

## 环境变量配置

### 必需的环境变量

- **`DEEPSEEK_API_KEY`**: DeepSeek API Key（必需）
  - 从 [DeepSeek Platform](https://platform.deepseek.com/) 获取
  - 在 Vercel Dashboard 的 "Environment Variables" 中设置
  - 安全存储在 Vercel，不会暴露给前端代码

### 可选的环境变量

- **`VITE_API_URL`**: 自定义后端 API 地址（可选）
  - 仅在需要使用自定义后端服务器时设置
  - 如果不设置，将自动使用内置的 Vercel Serverless Function
  - 开发环境：`http://localhost:3000`（用于本地开发）
  - 生产环境：留空（使用 Vercel Serverless Function）

- **`VITE_APP_BASE_URL`**: 应用基础路径（默认：`./`）

## 内置 Serverless Function

项目已包含 Vercel Serverless Function（位于 `api/8char/deepseek-interpret.js`），无需单独部署后端服务器。

### 工作原理

1. 前端调用 `/api/8char/deepseek-interpret`
2. Vercel 自动路由到 Serverless Function
3. Function 使用 `DEEPSEEK_API_KEY` 环境变量调用 DeepSeek API
4. 返回结果给前端

### 优势

- ✅ 无需单独部署后端服务器
- ✅ API Key 安全存储在 Vercel 环境变量中
- ✅ 自动扩展，无需管理服务器
- ✅ 全球 CDN 加速
- ✅ 内置 CORS 支持

### 本地开发

本地开发时，可以：
1. 使用 `backend-example/deepseek-proxy.js` 作为本地后端
2. 设置 `VITE_API_URL=http://localhost:3000` 环境变量
3. 运行 `npm start` 启动本地后端（参考 `backend-example/README.md`）

## 常见问题

### 1. 构建失败

**问题**：`npm run build:h5` 失败

**解决方案**：
- 检查 Node.js 版本（需要 16+）
- 确保所有依赖已安装
- 检查 `package.json` 中的构建脚本

### 2. 页面 404

**问题**：刷新页面后出现 404

**解决方案**：
- `vercel.json` 中已配置 `rewrites` 规则
- 确保路由模式为 `hash`（已在 `src/manifest.json` 中配置）

### 3. API 请求失败

**问题**：网络请求异常

**解决方案**：
- 检查 `DEEPSEEK_API_KEY` 环境变量是否已设置
- 确保环境变量已应用到生产环境（在 Vercel Dashboard 中检查）
- 检查浏览器控制台的错误信息
- 查看 Vercel Function 日志（在 Vercel Dashboard → Deployments → Function Logs）

### 4. DeepSeek 功能不可用

**问题**：AI 解读返回空结果或错误

**解决方案**：
- 确认 `DEEPSEEK_API_KEY` 环境变量已正确设置
- 检查 API Key 是否有效（在 DeepSeek Platform 验证）
- 查看 Vercel Function 日志以获取详细错误信息
- 确认 API Key 有足够的配额
- 检查请求是否超过速率限制（默认 10 次/分钟）

## 更新部署

### 通过 Git 推送自动部署

1. 推送代码到 GitHub/GitLab/Bitbucket
2. Vercel 会自动检测并部署

### 手动重新部署

1. 在 Vercel Dashboard 中点击项目
2. 进入 "Deployments" 标签
3. 点击 "Redeploy"

## 自定义域名

1. 在 Vercel Dashboard 中进入项目设置
2. 点击 "Domains"
3. 添加你的域名
4. 按照提示配置 DNS 记录

## 性能优化建议

1. **启用 Vercel Analytics**（可选）
2. **使用 CDN**：Vercel 自动提供全球 CDN
3. **压缩资源**：Vite 构建已自动优化
4. **缓存策略**：Vercel 自动处理静态资源缓存

## 安全注意事项

- ✅ 不要在代码中硬编码 API Key
- ✅ 使用环境变量存储敏感信息
- ✅ 确保后端服务器验证请求
- ✅ 启用 HTTPS（Vercel 自动提供）
- ✅ 定期更新依赖包

## 支持

如果遇到问题：
1. 查看 Vercel 构建日志
2. 检查浏览器控制台错误
3. 参考 [Vercel 文档](https://vercel.com/docs)
4. 查看项目 GitHub Issues

