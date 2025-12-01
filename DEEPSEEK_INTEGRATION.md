# DeepSeek AI Integration for BaZi Interpretation

This document explains how to integrate DeepSeek AI model to interpret BaZi (八字) calculation results.

## Overview

The DeepSeek integration allows you to get AI-powered interpretations of BaZi charts, providing detailed analysis of:
- 命格特点 (Life Pattern Characteristics)
- 性格特征 (Personality Traits)
- 事业财运 (Career and Wealth)
- 感情婚姻 (Relationships and Marriage)
- 健康运势 (Health Fortune)
- 人生建议 (Life Advice)

## Files Created

1. **`src/api/deepseek.js`** - DeepSeek API service
2. **`src/utils/deepseek.js`** - Utility functions
3. **`src/pages/detail/components/index/ai-interpretation/ai-interpretation.vue`** - Vue component for displaying interpretation
4. **`test-birthday-deepseek.js`** - Test script with DeepSeek integration

## Setup

### 1. Get DeepSeek API Key

1. Visit [DeepSeek Platform](https://platform.deepseek.com/)
2. Sign up or log in
3. Create an API key from the dashboard
4. Copy your API key

### 2. Configure API Key

#### Option A: Environment Variable (Development/Testing)

Create a `.env` file in the project root:

```env
DEEPSEEK_API_KEY=your_api_key_here
```

For Windows PowerShell:
```powershell
$env:DEEPSEEK_API_KEY="your_api_key_here"
```

For Linux/Mac:
```bash
export DEEPSEEK_API_KEY=your_api_key_here
```

#### Option B: Backend Proxy (Recommended for Production)

For security, it's recommended to proxy the DeepSeek API calls through your backend server. This keeps your API key secure.

1. Create a backend endpoint: `/api/8char/deepseek-interpret`
2. Store the API key on your server
3. The frontend calls your backend, which then calls DeepSeek

Example backend implementation (Node.js/Express):

```javascript
app.post('/api/8char/deepseek-interpret', async (req, res) => {
  const { formatBaziForInterpretation, interpretBaziWithDeepSeek } = require('./deepseek');
  
  try {
    const baziData = req.body;
    const interpretation = await interpretBaziWithDeepSeek(
      baziData, 
      process.env.DEEPSEEK_API_KEY
    );
    res.json({ data: interpretation });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});
```

## Usage

### In Test Script

Run the test script with DeepSeek interpretation:

```bash
node test-birthday-deepseek.js
```

Make sure to set the `DEEPSEEK_API_KEY` environment variable first.

### In Vue Component

Add the AI interpretation component to your detail page:

```vue
<template>
  <view>
    <!-- Other components -->
    <ai-interpretation></ai-interpretation>
  </view>
</template>

<script setup>
import AiInterpretation from './components/index/ai-interpretation/ai-interpretation.vue';
</script>
```

Or add it as a new tab in the detail page tabs.

### Direct API Call

```javascript
import { interpretBaziWithDeepSeek, formatBaziForInterpretation } from '@/api/deepseek';

const baziData = {
  // Your BaZi data from the API
  datetime: { solar: '1987-07-21 06:00', lunar: '...' },
  top: { year: '丁', month: '丁', day: '辛', time: '辛' },
  bottom: { year: '卯', month: '未', day: '未', time: '卯' },
  start: { main: { year: '七杀', month: '七杀', day: '元男', time: '比肩' } },
  // ... other data
};

const interpretation = await interpretBaziWithDeepSeek(baziData, 'your_api_key');
console.log(interpretation);
```

## API Reference

### `formatBaziForInterpretation(baziData)`

Formats BaZi data into a comprehensive prompt for AI interpretation.

**Parameters:**
- `baziData` (Object): BaZi calculation results

**Returns:**
- `String`: Formatted prompt text

### `interpretBaziWithDeepSeek(baziData, apiKey, options)`

Calls DeepSeek API to interpret BaZi results.

**Parameters:**
- `baziData` (Object): BaZi calculation results
- `apiKey` (String): DeepSeek API key
- `options` (Object, optional):
  - `model` (String): Model name, default: `'deepseek-chat'`
  - `temperature` (Number): Temperature for generation, default: `0.7`
  - `max_tokens` (Number): Maximum tokens, default: `2000`

**Returns:**
- `Promise<String>`: AI interpretation text

## Cost Considerations

DeepSeek API pricing:
- Check current pricing at [DeepSeek Pricing](https://platform.deepseek.com/pricing)
- Typical cost: ~$0.001-0.01 per interpretation depending on length

## Security Best Practices

1. **Never commit API keys to version control**
2. **Use environment variables** for local development
3. **Use backend proxy** for production to keep keys secure
4. **Implement rate limiting** to prevent abuse
5. **Cache interpretations** for the same BaZi data to reduce API calls

## Troubleshooting

### Error: "DeepSeek API key is required"
- Make sure you've set the `DEEPSEEK_API_KEY` environment variable
- Or configure the backend proxy endpoint

### Error: "Invalid response format"
- Check that the API key is valid
- Verify your network connection
- Check DeepSeek API status

### Interpretation is too generic
- Adjust the `temperature` parameter (higher = more creative)
- Modify the prompt in `formatBaziForInterpretation` function
- Increase `max_tokens` for longer responses

## Example Output

The AI interpretation will provide detailed analysis in Chinese, covering:
- 命格特点分析
- 性格特征解读
- 事业财运预测
- 感情婚姻分析
- 健康运势提醒
- 人生发展建议

## License

This integration follows the same license as the main project (GPL-3.0).

