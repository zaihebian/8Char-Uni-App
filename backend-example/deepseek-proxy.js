/**
 * Example Backend Endpoint for DeepSeek API Proxy
 * 
 * This is a Node.js/Express example. Adapt to your backend framework.
 * 
 * Installation:
 *   npm install express dotenv
 * 
 * Usage:
 *   node deepseek-proxy.js
 * 
 * Environment Variables:
 *   DEEPSEEK_API_KEY=your_api_key_here
 *   PORT=3000 (optional)
 */

const express = require('express');
const https = require('https');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting (simple example - use express-rate-limit for production)
const requestCounts = new Map();
const RATE_LIMIT = 10; // requests per minute
const RATE_WINDOW = 60 * 1000; // 1 minute

function rateLimit(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  
  if (!requestCounts.has(ip)) {
    requestCounts.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return next();
  }
  
  const record = requestCounts.get(ip);
  
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + RATE_WINDOW;
    return next();
  }
  
  if (record.count >= RATE_LIMIT) {
    return res.status(429).json({ msg: 'Rate limit exceeded. Please try again later.' });
  }
  
  record.count++;
  next();
}

// Format BaZi data for interpretation
function formatBaziForInterpretation(baziData) {
  const {
    realname = '',
    datetime = {},
    top = {},
    bottom = {},
    start = {},
    nayin = {},
    empty = {},
    gods = [],
    zodiac = '',
    constellation = '',
    element = {},
  } = baziData;

  return `请作为专业的命理师，详细解读以下八字排盘结果。请用通俗易懂的语言，结合传统命理学知识进行深入分析。

【基本信息】
${realname ? `姓名：${realname}\n` : ''}${datetime.solar ? `公历：${datetime.solar}\n` : ''}${datetime.lunar ? `农历：${datetime.lunar}\n` : ''}${zodiac ? `生肖：${zodiac}\n` : ''}${constellation ? `星座：${constellation}\n` : ''}

【四柱八字】
年柱：${top.year || ''}${bottom.year || ''} ${start.main?.year || ''}
月柱：${top.month || ''}${bottom.month || ''} ${start.main?.month || ''}
日柱：${top.day || ''}${bottom.day || ''} ${start.main?.day || ''}
时柱：${top.time || ''}${bottom.time || ''} ${start.main?.time || ''}

【十神关系】
年柱十神：${start.main?.year || 'N/A'}
月柱十神：${start.main?.month || 'N/A'}
日柱十神：${start.main?.day || 'N/A'}
时柱十神：${start.main?.time || 'N/A'}

【纳音五行】
年柱纳音：${nayin.year || 'N/A'}
月柱纳音：${nayin.month || 'N/A'}
日柱纳音：${nayin.day || 'N/A'}
时柱纳音：${nayin.time || 'N/A'}

【空亡】
年柱空亡：${empty.year || 'N/A'}
月柱空亡：${empty.month || 'N/A'}
日柱空亡：${empty.day || 'N/A'}
时柱空亡：${empty.time || 'N/A'}

${gods.length > 0 ? `【神煞】\n${gods.join('、')}\n` : ''}

${element.pro_decl && element.pro_decl.length > 0 ? `【五行分析】\n${element.pro_decl.join('、')}\n` : ''}

请从以下几个方面进行详细解读：
1. 命格特点：分析日主的强弱、喜忌用神
2. 性格特征：根据十神和五行分析性格特点
3. 事业财运：分析事业发展方向和财运状况
4. 感情婚姻：分析感情和婚姻运势
5. 健康运势：分析健康方面需要注意的问题
6. 人生建议：给出人生发展建议和注意事项

请用专业但通俗的语言进行解读，避免过于玄学的表述，注重实用性和可理解性。`;
}

// DeepSeek interpretation endpoint
app.post('/api/8char/deepseek-interpret', rateLimit, async (req, res) => {
  try {
    if (!process.env.DEEPSEEK_API_KEY) {
      return res.status(500).json({ msg: 'DeepSeek API key not configured' });
    }

    const { baziData } = req.body;
    
    if (!baziData) {
      return res.status(400).json({ msg: 'BaZi data is required' });
    }

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
      max_tokens: 2000,
      stream: false
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
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const httpsReq = https.request(options, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          
          if (response.statusCode === 200 && parsed.choices?.[0]?.message) {
            res.json({ 
              data: parsed.choices[0].message.content 
            });
          } else {
            console.error('DeepSeek API Error:', parsed);
            res.status(500).json({ 
              msg: parsed.error?.message || 'DeepSeek API error' 
            });
          }
        } catch (e) {
          console.error('Parse error:', e);
          res.status(500).json({ msg: 'Failed to parse DeepSeek response' });
        }
      });
    });

    httpsReq.on('error', (error) => {
      console.error('Request error:', error);
      res.status(500).json({ msg: error.message });
    });

    httpsReq.write(postData);
    httpsReq.end();

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`DeepSeek proxy server running on port ${PORT}`);
  console.log(`Make sure DEEPSEEK_API_KEY is set in environment variables`);
});

