# Backend Proxy for DeepSeek API

This is an example backend server to proxy DeepSeek API calls securely.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
DEEPSEEK_API_KEY=your_api_key_here
PORT=3000
```

3. Start the server:
```bash
npm start
```

## Features

- ✅ Secure API key storage (server-side only)
- ✅ Rate limiting (10 requests per minute per IP)
- ✅ CORS enabled
- ✅ Error handling
- ✅ Health check endpoint

## Endpoints

- `POST /api/8char/deepseek-interpret` - Get AI interpretation
- `GET /health` - Health check

## Production Deployment

For production, consider:
- Using `express-rate-limit` for better rate limiting
- Adding authentication/authorization
- Using a reverse proxy (Nginx)
- Adding logging/monitoring
- Implementing caching
- Using HTTPS

## Adapt to Your Backend

This is an Express.js example. Adapt the logic to your backend framework:
- Python (Flask/FastAPI)
- PHP
- Java (Spring Boot)
- Go
- etc.



