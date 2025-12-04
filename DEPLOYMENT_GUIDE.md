# Deployment Guide for BaZi App with DeepSeek Integration

This guide covers deploying the BaZi (八字排盘) app with DeepSeek AI interpretation feature.

## Prerequisites

- Node.js 16+ installed
- DeepSeek API key from [https://platform.deepseek.com/](https://platform.deepseek.com/)
- Backend server (for secure API key storage) - recommended
- Domain/server for hosting (for H5 deployment)

## Deployment Options

### Option 1: H5 Web Deployment (Recommended for Quick Start)

#### Step 1: Build the H5 Version

```bash
# Install dependencies
yarn install

# Build for production
yarn run build:h5
```

The built files will be in the `dist/build/h5` directory.

#### Step 2: Set Up Backend API Endpoint

**Important**: For security, you MUST set up a backend endpoint to proxy DeepSeek API calls. Never expose your API key in frontend code.

Create a backend endpoint (Node.js/Express example):

```javascript
// backend/routes/deepseek.js
const express = require('express');
const router = express.Router();
const https = require('https');

router.post('/api/8char/deepseek-interpret', async (req, res) => {
  const { baziData } = req.body;
  
  // Format the prompt
  const prompt = formatBaziForInterpretation(baziData);
  
  const requestBody = {
    model: 'deepseek-chat',
    messages: [
      {
        role: 'system',
        content: '你是一位资深的中国传统命理师，精通八字命理学。请用专业、准确、通俗易懂的语言解读八字排盘结果。'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 2000
  };

  const postData = JSON.stringify(requestBody);
  const url = new URL('https://api.deepseek.com/v1/chat/completions');
  
  const options = {
    hostname: url.hostname,
    port: 443,
    path: url.pathname,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`, // From environment variable
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = https.request(options, (response) => {
    let data = '';
    response.on('data', (chunk) => { data += chunk; });
    response.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        if (response.statusCode === 200 && parsed.choices?.[0]?.message) {
          res.json({ data: parsed.choices[0].message.content });
        } else {
          res.status(500).json({ msg: parsed.error?.message || 'DeepSeek API error' });
        }
      } catch (e) {
        res.status(500).json({ msg: 'Parse error' });
      }
    });
  });

  req.on('error', (error) => {
    res.status(500).json({ msg: error.message });
  });

  req.write(postData);
  req.end();
});

function formatBaziForInterpretation(baziData) {
  // Copy the formatting function from src/api/deepseek.js
  // ... (implementation)
}

module.exports = router;
```

Set environment variable on your server:
```bash
export DEEPSEEK_API_KEY=your_api_key_here
```

#### Step 3: Configure API URL

Update your backend API URL in the app:

Create `.env.production`:
```env
VITE_API_URL=https://your-backend-domain.com
```

Or update `src/utils/request.js` to use your backend URL.

#### Step 4: Deploy H5 Files

Upload the contents of `dist/build/h5` to your web server:
- Nginx
- Apache
- Any static file hosting (Vercel, Netlify, GitHub Pages, etc.)

**Example Nginx configuration:**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist/build/h5;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Option 2: Mini-Program Deployment (WeChat, Alipay, etc.)

#### Step 1: Build for Mini-Program

```bash
# For WeChat Mini-Program
yarn run build:mp-weixin

# For Alipay Mini-Program
yarn run build:mp-alipay

# For other platforms, see package.json scripts
```

#### Step 2: Configure Mini-Program Settings

1. Update `src/manifest.json` with your mini-program appid
2. Set up backend API endpoint (same as H5)
3. Configure domain whitelist in mini-program platform

#### Step 3: Upload to Mini-Program Platform

- WeChat: Use WeChat Developer Tools to upload
- Alipay: Use Alipay Developer Tools
- Others: Follow respective platform guidelines

### Option 3: Mobile App (iOS/Android)

#### Step 1: Build App Package

```bash
yarn run build:app
```

#### Step 2: Use HBuilderX

1. Open project in HBuilderX
2. Configure app settings in `src/manifest.json`
3. Build and package through HBuilderX
4. Submit to App Store / Google Play

## Environment Configuration

### Development

Create `.env.development`:
```env
VITE_API_URL=http://localhost:3000
VITE_DEEPSEEK_API_KEY=your_key_here  # Only for testing, not for production
```

### Production

Create `.env.production`:
```env
VITE_API_URL=https://your-backend-domain.com
# Do NOT include DEEPSEEK_API_KEY here - it should be on backend only
```

## Security Checklist

- [ ] ✅ API key stored on backend server only
- [ ] ✅ Backend endpoint validates requests
- [ ] ✅ Rate limiting implemented on backend
- [ ] ✅ HTTPS enabled for production
- [ ] ✅ CORS properly configured
- [ ] ✅ No API keys in frontend code
- [ ] ✅ Environment variables secured

## Testing Before Deployment

1. **Test BaZi Calculation:**
   ```bash
   node test-birthday-deepseek.js
   ```

2. **Test Local Build:**
   ```bash
   yarn run build:h5
   # Serve locally and test
   ```

3. **Test Backend Endpoint:**
   ```bash
   curl -X POST https://your-backend.com/api/8char/deepseek-interpret \
     -H "Content-Type: application/json" \
     -d '{"baziData": {...}}'
   ```

## Cost Considerations

- **DeepSeek API**: ~$0.001-0.01 per interpretation
- **Backend Hosting**: Varies by provider
- **Frontend Hosting**: Many free options available (Vercel, Netlify, etc.)

**Recommendation**: Implement caching to reduce API calls for same BaZi data.

## Troubleshooting

### Issue: "API key not found"
- **Solution**: Ensure backend has `DEEPSEEK_API_KEY` environment variable set

### Issue: CORS errors
- **Solution**: Configure CORS on backend to allow your frontend domain

### Issue: Build fails
- **Solution**: Check Node.js version (16+), clear node_modules and reinstall

### Issue: Mini-program upload fails
- **Solution**: Check appid in manifest.json, verify domain whitelist

## Production Checklist

- [ ] Backend API endpoint implemented and tested
- [ ] API key stored securely on backend
- [ ] Rate limiting configured
- [ ] Error handling implemented
- [ ] HTTPS enabled
- [ ] Domain configured
- [ ] Analytics/monitoring set up (optional)
- [ ] Backup strategy in place

## Support

For issues or questions:
- Check `DEEPSEEK_INTEGRATION.md` for API details
- Review backend logs for API errors
- Test with `test-birthday-deepseek.js` script

## License

This project is licensed under GPL-3.0. Ensure compliance when deploying.



