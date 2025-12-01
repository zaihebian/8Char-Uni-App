/**
 * Test script for BaZi (Eight Characters) calculation
 * Tests with birthday: July 21, 1988 (Solar Calendar)
 */

const https = require('https');

// API endpoint
const API_BASE = 'https://api.app.yxbug.cn/api';

// Test data: July 21, 1987, 6:00:00 AM
// Format: yyyy-mm-dd hh:MM:ss
const testBirthday = {
  datetime: '1987-07-21 06:00:00',
  gender: 1, // 1 = male, 2 = female
  sect: 1    // 1 = late night hour counts as next day, 2 = same day
};

/**
 * Make HTTP POST request
 */
function makeRequest(url, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(url, options, (res) => {
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
            reject(new Error(`HTTP ${res.statusCode}: ${parsed.msg || responseData}`));
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
    console.log(`\nMain Stars (主星/十神):`);
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
 * Main test function
 */
async function runTest() {
  console.log('Testing BaZi Calculation API');
  console.log(`Birthday: ${testBirthday.datetime}`);
  console.log(`Gender: ${testBirthday.gender === 1 ? 'Male' : 'Female'}`);
  console.log(`Sect: ${testBirthday.sect === 1 ? 'Late night = next day' : 'Late night = same day'}`);
  
  try {
    console.log('\nFetching BaZi information...');
    const infoResult = await makeRequest(`${API_BASE}/8char/get-info`, testBirthday);
    
    if (infoResult && infoResult.data) {
      formatResults(infoResult.data);
    } else {
      formatResults(infoResult);
    }
    
    // Also try to get book references
    console.log('\nFetching classical references...');
    try {
      const bookResult = await makeRequest(`${API_BASE}/8char/get-book`, testBirthday);
      if (bookResult && bookResult.length > 0) {
        console.log('\nClassical References (古籍参考):');
        bookResult.forEach((item, index) => {
          console.log(`\n${index + 1}. ${item.title || 'Reference'}`);
          if (item.content) {
            console.log(`   ${item.content.substring(0, 200)}...`);
          }
        });
      }
    } catch (bookError) {
      console.log(`\nNote: Could not fetch classical references: ${bookError.message}`);
    }
    
  } catch (error) {
    console.error('\nError:', error.message);
    console.error('\nFull error:', error);
  }
}

// Run the test
runTest();

