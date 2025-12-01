/**
 * DeepSeek API Integration for BaZi Interpretation
 * DeepSeek API Documentation: https://api-docs.deepseek.com/
 */

import {APP_API, Post} from '@/utils/request';

// DeepSeek API endpoint
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

/**
 * Format BaZi data into a comprehensive prompt for AI interpretation
 */
export function formatBaziForInterpretation(baziData) {
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
    festival = {}
  } = baziData;

  let prompt = `请作为专业的命理师，详细解读以下八字排盘结果。请用通俗易懂的语言，结合传统命理学知识进行深入分析。

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

  return prompt;
}

/**
 * Call DeepSeek API to interpret BaZi results
 * @param {Object} baziData - The BaZi calculation results
 * @param {String} apiKey - DeepSeek API key
 * @param {Object} options - Additional options (model, temperature, etc.)
 * @returns {Promise<String>} AI interpretation text
 */
export async function interpretBaziWithDeepSeek(baziData, apiKey, options = {}) {
  if (!apiKey) {
    throw new Error('DeepSeek API key is required');
  }

  const prompt = formatBaziForInterpretation(baziData);
  
  const requestBody = {
    model: options.model || 'deepseek-chat',
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
    temperature: options.temperature || 0.7,
    max_tokens: options.max_tokens || 2000,
    stream: false
  };

  try {
    // For Node.js environment (test script)
    if (typeof uni === 'undefined') {
      const https = require('https');
      return new Promise((resolve, reject) => {
        const postData = JSON.stringify(requestBody);
        
        const url = new URL(DEEPSEEK_API_URL);
        const options = {
          hostname: url.hostname,
          port: 443,
          path: url.pathname,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'Content-Length': Buffer.byteLength(postData)
          }
        };

        const req = https.request(options, (res) => {
          let responseData = '';

          res.on('data', (chunk) => {
            responseData += chunk;
          });

          res.on('end', () => {
            try {
              const parsed = JSON.parse(responseData);
              if (res.statusCode >= 200 && res.statusCode < 300) {
                if (parsed.choices && parsed.choices[0] && parsed.choices[0].message) {
                  resolve(parsed.choices[0].message.content);
                } else {
                  reject(new Error('Invalid response format from DeepSeek API'));
                }
              } else {
                reject(new Error(`DeepSeek API Error: ${parsed.error?.message || responseData}`));
              }
            } catch (e) {
              reject(new Error(`Parse error: ${e.message}`));
            }
          });
        });

        req.on('error', (error) => {
          reject(error);
        });

        req.write(postData);
        req.end();
      });
    } else {
      // For Uni-APP environment
      return new Promise((resolve, reject) => {
        uni.request({
          url: DEEPSEEK_API_URL,
          method: 'POST',
          header: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          data: requestBody,
          success: (res) => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
              if (res.data.choices && res.data.choices[0] && res.data.choices[0].message) {
                resolve(res.data.choices[0].message.content);
              } else {
                reject(new Error('Invalid response format from DeepSeek API'));
              }
            } else {
              reject(new Error(`DeepSeek API Error: ${res.data.error?.message || 'Unknown error'}`));
            }
          },
          fail: (err) => {
            reject(err);
          }
        });
      });
    }
  } catch (error) {
    throw new Error(`DeepSeek API request failed: ${error.message}`);
  }
}

/**
 * Get DeepSeek interpretation via backend API (if you have a backend proxy)
 * This is safer as it keeps the API key on the server
 */
export const GetDeepSeekInterpretation = (data) => {
  return Post('/8char/deepseek-interpret', data, APP_API);
};

