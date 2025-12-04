/**
 * Test script for BaZi (Eight Characters) calculation with DeepSeek AI interpretation
 * Tests with birthday: July 21, 1987, 6:00 AM
 */

const https = require('https');

// API endpoint
const API_BASE = 'https://api.app.yxbug.cn/api';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// Test data: July 21, 1987, 6:00:00 AM
const testBirthday = {
  datetime: '1987-07-21 06:00:00',
  gender: 1, // 1 = male, 2 = female
  sect: 1    // 1 = late night hour counts as next day, 2 = same day
};

// DeepSeek API Key - Set this in environment variable or replace here
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || '';

/**
 * Make HTTP POST request
 */
function makeRequest(url, data, headers = {}) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        ...headers
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
            resolve(parsed);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${parsed.error?.message || parsed.msg || responseData}`));
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
}

/**
 * Format BaZi data into a comprehensive prompt for AI interpretation
 */
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
 */
async function interpretBaziWithDeepSeek(baziData, apiKey) {
  if (!apiKey) {
    throw new Error('DeepSeek API key is required. Please set DEEPSEEK_API_KEY environment variable.');
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

  return makeRequest(DEEPSEEK_API_URL, requestBody, {
    'Authorization': `Bearer ${apiKey}`
  });
}

/**
 * Format BaZi data for display
 */
function formatResults(data) {
  console.log('\n' + '='.repeat(60));
  console.log('BAZI (EIGHT CHARACTERS) RESULTS');
  console.log('='.repeat(60));
  
  if (data.realname) {
    console.log(`\nName: ${data.realname}`);
  }
  
  if (data.datetime) {
    console.log(`\nDate & Time:`);
    console.log(`  Solar: ${data.datetime.solar || 'N/A'}`);
    console.log(`  Lunar: ${data.datetime.lunar || 'N/A'}`);
  }
  
  if (data.top && data.bottom) {
    console.log(`\nFour Pillars (四柱):`);
    console.log(`  Year Pillar (年柱):   ${data.top.year}${data.bottom.year}`);
    console.log(`  Month Pillar (月柱): ${data.top.month}${data.bottom.month}`);
    console.log(`  Day Pillar (日柱):   ${data.top.day}${data.bottom.day}`);
    console.log(`  Hour Pillar (时柱):  ${data.top.time}${data.bottom.time}`);
  }
  
  if (data.start && data.start.main) {
    console.log(`\nTen Gods (十神):`);
    console.log(`  Year:  ${data.start.main.year || 'N/A'}`);
    console.log(`  Month: ${data.start.main.month || 'N/A'}`);
    console.log(`  Day:   ${data.start.main.day || 'N/A'}`);
    console.log(`  Hour:  ${data.start.main.time || 'N/A'}`);
  }
  
  if (data.nayin) {
    console.log(`\nNayin (纳音):`);
    console.log(`  Year:  ${data.nayin.year || 'N/A'}`);
    console.log(`  Month: ${data.nayin.month || 'N/A'}`);
    console.log(`  Day:   ${data.nayin.day || 'N/A'}`);
    console.log(`  Hour:  ${data.nayin.time || 'N/A'}`);
  }
  
  if (data.empty) {
    console.log(`\nEmpty Death (空亡):`);
    console.log(`  Year:  ${data.empty.year || 'N/A'}`);
    console.log(`  Month: ${data.empty.month || 'N/A'}`);
    console.log(`  Day:   ${data.empty.day || 'N/A'}`);
    console.log(`  Hour:  ${data.empty.time || 'N/A'}`);
  }
  
  if (data.gods && data.gods.length > 0) {
    console.log(`\nGods & Demons (神煞):`);
    data.gods.forEach((god, index) => {
      console.log(`  ${index + 1}. ${god}`);
    });
  }
  
  if (data.zodiac) {
    console.log(`\nZodiac: ${data.zodiac}`);
  }
  
  if (data.constellation) {
    console.log(`Constellation: ${data.constellation}`);
  }
  
  if (data.element) {
    console.log(`\nFive Elements Analysis (五行分析):`);
    if (data.element.pro_decl && data.element.pro_decl.length > 0) {
      console.log(`  Element Declaration: ${data.element.pro_decl.join(', ')}`);
    }
  }
  
  console.log('\n' + '='.repeat(60));
}

/**
 * Display AI interpretation
 */
function displayInterpretation(interpretation) {
  console.log('\n' + '='.repeat(60));
  console.log('DEEPSEEK AI INTERPRETATION');
  console.log('='.repeat(60));
  console.log('\n' + interpretation);
  console.log('\n' + '='.repeat(60));
}

/**
 * Main test function
 */
async function runTest() {
  console.log('Testing BaZi Calculation with DeepSeek AI Interpretation');
  console.log(`Birthday: ${testBirthday.datetime}`);
  console.log(`Gender: ${testBirthday.gender === 1 ? 'Male' : 'Female'}`);
  console.log(`Sect: ${testBirthday.sect === 1 ? 'Late night = next day' : 'Late night = same day'}`);
  
  try {
    console.log('\nFetching BaZi information...');
    const infoResult = await makeRequest(`${API_BASE}/8char/get-info`, testBirthday);
    
    const baziData = infoResult && infoResult.data ? infoResult.data : infoResult;
    formatResults(baziData);
    
    // Get DeepSeek interpretation
    if (DEEPSEEK_API_KEY) {
      console.log('\n\nRequesting AI interpretation from DeepSeek...');
      try {
        const deepseekResult = await interpretBaziWithDeepSeek(baziData, DEEPSEEK_API_KEY);
        
        if (deepseekResult.choices && deepseekResult.choices[0] && deepseekResult.choices[0].message) {
          const interpretation = deepseekResult.choices[0].message.content;
          displayInterpretation(interpretation);
        } else {
          console.log('\nError: Invalid response format from DeepSeek API');
        }
      } catch (deepseekError) {
        console.log(`\n\nDeepSeek Interpretation Error: ${deepseekError.message}`);
        console.log('\nNote: To use DeepSeek interpretation, please set DEEPSEEK_API_KEY environment variable.');
        console.log('Example: set DEEPSEEK_API_KEY=your_api_key_here (Windows)');
        console.log('         export DEEPSEEK_API_KEY=your_api_key_here (Linux/Mac)');
      }
    } else {
      console.log('\n\nNote: DeepSeek API key not found.');
      console.log('To enable AI interpretation, please set DEEPSEEK_API_KEY environment variable.');
      console.log('Example: set DEEPSEEK_API_KEY=your_api_key_here (Windows)');
      console.log('         export DEEPSEEK_API_KEY=your_api_key_here (Linux/Mac)');
      console.log('\nYou can get your API key from: https://platform.deepseek.com/');
    }
    
  } catch (error) {
    console.error('\nError:', error.message);
    console.error('\nFull error:', error);
  }
}

// Run the test
runTest();



