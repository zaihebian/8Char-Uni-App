# Vercel Serverless Functions

This directory contains Vercel serverless functions for the BaZi application.

## Functions

### `/api/8char/deepseek-interpret`

Handles DeepSeek API calls for BaZi interpretation.

**Method**: POST

**Request Body**:
```json
{
  "baziData": {
    "realname": "Name",
    "datetime": { "solar": "...", "lunar": "..." },
    "top": { "year": "...", "month": "...", "day": "...", "time": "..." },
    "bottom": { "year": "...", "month": "...", "day": "...", "time": "..." },
    "start": { "main": { ... } },
    "nayin": { ... },
    "empty": { ... },
    "gods": [],
    "zodiac": "...",
    "constellation": "...",
    "element": { ... }
  }
}
```

**Response**:
```json
{
  "data": "AI interpretation text..."
}
```

**Environment Variables Required**:
- `DEEPSEEK_API_KEY`: Your DeepSeek API key

**Rate Limiting**: 10 requests per minute per IP address

**Error Responses**:
- `400`: Invalid BaZi data
- `429`: Rate limit exceeded
- `500`: Server error or DeepSeek API error

## Local Development

For local development, use the Express server in `backend-example/deepseek-proxy.js` instead of these serverless functions.

## Deployment

These functions are automatically deployed with your Vercel project. No additional configuration needed beyond setting the `DEEPSEEK_API_KEY` environment variable in Vercel.

