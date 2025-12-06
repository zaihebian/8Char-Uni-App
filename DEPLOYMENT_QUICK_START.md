# Quick Start: Deploy to Vercel

This guide will help you deploy the BaZi app to Vercel with full DeepSeek AI integration.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub/GitLab/Bitbucket Account**: For connecting your repository
3. **DeepSeek API Key**: Get one from [platform.deepseek.com](https://platform.deepseek.com/)

## Deployment Steps

### Step 1: Push to Git Repository

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### Step 2: Deploy to Vercel

#### Option A: Via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and log in
2. Click **"Add New..."** → **"Project"**
3. Import your Git repository
4. Vercel will auto-detect settings from `vercel.json` - no changes needed
5. Click **"Environment Variables"** and add:
   - **Name**: `DEEPSEEK_API_KEY`
   - **Value**: Your DeepSeek API key (e.g., `sk-...`)
6. Click **"Deploy"**

#### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variable
vercel env add DEEPSEEK_API_KEY production
# Enter your API key when prompted

# Deploy to production
vercel --prod
```

### Step 3: Verify Deployment

1. Wait for build to complete (2-5 minutes)
2. Visit your deployment URL
3. Test the app:
   - Enter a birthday and click "开始排盘" (Start Calculation)
   - Go to "AI解读" (AI Interpretation) tab
   - Click "AI 智能解读" (AI Smart Interpretation)
   - Verify that AI interpretation appears

## Environment Variables

### Required

- **`DEEPSEEK_API_KEY`**: Your DeepSeek API key
  - Get it from: https://platform.deepseek.com/
  - Set in Vercel Dashboard → Project Settings → Environment Variables

### Optional

- **`VITE_API_URL`**: Custom backend URL (only if using external backend)
  - Leave empty to use built-in Vercel serverless function
  - Set to `http://localhost:3000` for local development

## How It Works

1. **Frontend**: Built with Uni-APP, outputs to `dist/build/h5`
2. **API**: Vercel serverless function at `/api/8char/deepseek-interpret`
3. **DeepSeek**: API key stored securely in Vercel environment variables
4. **Auto-deploy**: Every Git push triggers a new deployment

## Troubleshooting

### Build Fails

- Check Node.js version (needs 16+)
- Verify all dependencies in `package.json`
- Check build logs in Vercel Dashboard

### AI Interpretation Not Working

- Verify `DEEPSEEK_API_KEY` is set in environment variables
- Check that it's applied to **Production** environment
- View function logs in Vercel Dashboard → Deployments → Function Logs
- Verify API key is valid and has quota

### 404 Errors

- Already handled by `vercel.json` rewrites
- Ensure routing mode is `hash` (configured in `src/manifest.json`)

## Local Development

For local development with DeepSeek:

1. Start local backend:
   ```bash
   cd backend-example
   npm install
   # Create .env file with DEEPSEEK_API_KEY
   node deepseek-proxy.js
   ```

2. Start frontend:
   ```bash
   # Create .env.development with:
   # VITE_API_URL=http://localhost:3000
   npm run dev:h5
   ```

## Security Notes

✅ API key stored in Vercel environment variables (not in code)  
✅ Serverless function handles all DeepSeek API calls  
✅ CORS enabled for frontend access  
✅ Rate limiting implemented (10 req/min per IP)  
✅ HTTPS automatically enabled by Vercel  

## Next Steps

- Add custom domain in Vercel Dashboard → Settings → Domains
- Enable Vercel Analytics for performance monitoring
- Set up preview deployments for pull requests

## Support

- Check [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md) for detailed documentation
- View Vercel logs for debugging
- Check [Vercel Documentation](https://vercel.com/docs)

