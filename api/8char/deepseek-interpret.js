/**
 * Vercel Serverless Function for DeepSeek API Proxy
 * 
 * This function securely handles DeepSeek API calls without exposing the API key to the frontend.
 * 
 * Environment Variables Required:
 *   DEEPSEEK_API_KEY - Your DeepSeek API key
 */

const https = require('https');

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

// Simple rate limiting (in-memory, resets on serverless function restart)
const requestCounts = new Map();
const RATE_LIMIT = 10; // requests per minute per IP
const RATE_WINDOW = 60 * 1000; // 1 minute

function rateLimit(ip) {
  const now = Date.now();
  
  if (!requestCounts.has(ip)) {
    requestCounts.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }
  
  const record = requestCounts.get(ip);
  
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + RATE_WINDOW;
    return true;
  }
  
  if (record.count >= RATE_LIMIT) {
    return false;
  }
  
  record.count++;
  return true;
}

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ msg: 'Method not allowed' });
  }

  try {
    // Check API key
    if (!process.env.DEEPSEEK_API_KEY) {
      console.error('DeepSeek API key not configured');
      return res.status(500).json({ msg: 'DeepSeek API key not configured' });
    }

    // Rate limiting
    const clientIP = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';
    if (!rateLimit(clientIP)) {
      return res.status(429).json({ msg: 'Rate limit exceeded. Please try again later.' });
    }

    // Extract BaZi data
    const baziData = req.body.baziData || req.body;
    
    if (!baziData || (!baziData.top && !baziData.datetime)) {
      console.error('Invalid baziData:', baziData);
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

    return new Promise((resolve) => {
      const httpsReq = https.request(options, (response) => {
        let data = '';
        
        response.on('data', (chunk) => {
          data += chunk;
        });
        
        response.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            console.log('DeepSeek API Response Status:', response.statusCode);
            
            if (response.statusCode === 200 && parsed.choices?.[0]?.message) {
              const interpretation = parsed.choices[0].message.content;
              
              if (!interpretation || interpretation.length === 0) {
                console.error('Interpretation is empty!');
                resolve(res.status(500).json({ 
                  msg: 'DeepSeek returned empty interpretation' 
                }));
              } else {
                resolve(res.status(200).json({ 
                  data: interpretation 
                }));
              }
            } else {
              console.error('DeepSeek API Error:', parsed);
              resolve(res.status(500).json({ 
                msg: parsed.error?.message || 'DeepSeek API error',
                error: parsed.error 
              }));
            }
          } catch (e) {
            console.error('Parse error:', e);
            console.error('Raw response data:', data);
            resolve(res.status(500).json({ msg: 'Failed to parse DeepSeek response' }));
          }
        });
      });

      httpsReq.on('error', (error) => {
        console.error('Request error:', error);
        resolve(res.status(500).json({ msg: error.message }));
      });

      httpsReq.write(postData);
      httpsReq.end();
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ msg: 'Internal server error' });
  }
}

