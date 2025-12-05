<template>
  <view class="u-p-y-30 u-p-x-20">
    <yx-sheet :margin="[0, 0]" :round="3" :shadow="2">
      <view v-if="!interpretation && !loading">
        <view class="u-flex u-row-center">
          <u-image :height="400" :src="getUrl(`static/icon/other/coding.svg`)" :width="400"
                   class="u-m-t-40 u-m-b-30"></u-image>
        </view>
        <u-button :loading="loading" class="u-m-b-30" type="primary" @click="getInterpretation">
          AI 智能解读
        </u-button>
        <view class="u-font-24 u-type-info u-text-center u-m-b-20">
          <text>使用 DeepSeek AI 进行专业命理解读</text>
        </view>
      </view>
      
      <view v-if="loading" class="u-p-y-40">
        <view class="u-flex u-row-center u-col-center">
          <view class="loading-spinner u-m-r-20"></view>
          <text class="u-font-26 u-type-info">AI 正在分析中，请稍候...</text>
        </view>
      </view>
      
      <view v-if="interpretation && !loading" class="interpretation-content">
        <view class="u-flex u-row-center u-m-b-30">
          <text class="yx-text-weight-b u-font-32">AI 智能解读</text>
        </view>
        <view class="u-font-28 u-line-height-2" decode>{{ interpretation }}</view>
        <view class="u-m-t-30 u-flex u-row-center">
          <u-button size="small" type="primary" @click="getInterpretation">重新解读</u-button>
        </view>
      </view>
      
      <view v-if="error" class="u-m-t-20">
        <view class="u-p-20 u-bg-error-light u-border-radius u-m-b-20">
          <text class="u-font-26 u-type-error">{{ error }}</text>
        </view>
        <u-button class="u-m-t-20" size="small" type="primary" @click="getInterpretation">重试</u-button>
      </view>
    </yx-sheet>
  </view>
</template>

<script setup>
import {ref} from 'vue';
import {interpretBaziWithDeepSeek} from '@/api/deepseek';
import {getUrl} from "@/utils/file";
import {useDetailStore} from "@/store/detail";

const detailStore = useDetailStore();
const interpretation = ref('');
const loading = ref(false);
const error = ref('');

// Get DeepSeek API key from environment or config
// In production, this should be stored securely on the backend
const getDeepSeekApiKey = () => {
  // Option 1: Get from environment variable (for development)
  // return import.meta.env.VITE_DEEPSEEK_API_KEY;
  
  // Option 2: Get from backend API (recommended for production)
  // This keeps the API key secure on the server
  return null; // Will need to implement backend endpoint
};

async function getInterpretation() {
  if (!detailStore.timestamp) {
    uni.$u.toast('请先进行排盘');
    return;
  }

  loading.value = true;
  error.value = '';
  interpretation.value = '';

  try {
    // Get API key - in production, this should come from your backend
    const apiKey = getDeepSeekApiKey();
    
    if (!apiKey) {
      // If no API key, try to use backend endpoint
      // This is the recommended approach for production
      uni.showLoading({ title: '请求解读中...' });
      
      // Call local backend API which has the DeepSeek key
      const LOCAL_API = (import.meta.env.VITE_API_URL || "http://localhost:3000") + "/api";
      
      uni.request({
        url: LOCAL_API + '/8char/deepseek-interpret',
        method: 'POST',
        data: {
          ...detailStore.defaultPayload,
          baziData: {
            realname: detailStore.realname,
            datetime: detailStore.datetime,
            top: detailStore.top,
            bottom: detailStore.bottom,
            start: detailStore.start,
            nayin: detailStore.nayin,
            empty: detailStore.empty,
            gods: detailStore.gods,
            zodiac: detailStore.zodiac,
            constellation: detailStore.constellation,
            element: detailStore.element
          }
        },
        header: {
          'Content-Type': 'application/json'
        },
        success: (res) => {
          uni.hideLoading();
          console.log('AI Interpretation Full Response:', JSON.stringify(res, null, 2));
          console.log('Response statusCode:', res.statusCode);
          console.log('Response data:', res.data);
          console.log('Response data type:', typeof res.data);
          
          if (res.statusCode === 200) {
            // Backend returns: { data: "interpretation text" }
            // uni.request wraps it, so we need to check res.data structure
            let result = null;
            
            // Try different response formats
            if (typeof res.data === 'string') {
              // Direct string response
              result = res.data;
            } else if (res.data && res.data.data) {
              // Wrapped format: { data: "text" }
              result = res.data.data;
            } else if (res.data && typeof res.data === 'object') {
              // Check if it's already the text
              if (Array.isArray(res.data)) {
                console.error('Response is an array:', res.data);
                error.value = '获取解读失败：服务器返回格式错误';
                return;
              }
              // Try to find text in object
              result = res.data.content || res.data.message || res.data.text || res.data.interpretation;
            }
            
            console.log('Final result:', result);
            console.log('Final result type:', typeof result);
            console.log('Final result length:', result ? (typeof result === 'string' ? result.length : 'not string') : 'null/undefined');
            
            if (result && typeof result === 'string' && result.length > 0) {
              interpretation.value = result;
              console.log('Successfully set interpretation, length:', result.length);
            } else {
              error.value = `获取解读失败：响应为空或格式不正确 (类型: ${typeof result}, 值: ${JSON.stringify(result)})`;
              console.error('Invalid result:', result);
              console.error('Full response data for debugging:', JSON.stringify(res.data, null, 2));
            }
          } else {
            error.value = res.data?.msg || res.data?.error || `获取解读失败 (${res.statusCode})`;
            console.error('API Error:', res.statusCode, res.data);
          }
        },
        fail: (err) => {
          uni.hideLoading();
          error.value = '网络请求失败，请检查网络连接';
          console.error('DeepSeek API request failed:', err);
        }
      });
    } else {
      // Direct API call (for development/testing only)
      const baziData = {
        realname: detailStore.realname,
        datetime: detailStore.datetime,
        top: detailStore.top,
        bottom: detailStore.bottom,
        start: detailStore.start,
        nayin: detailStore.nayin,
        empty: detailStore.empty,
        gods: detailStore.gods,
        zodiac: detailStore.zodiac,
        constellation: detailStore.constellation,
        element: detailStore.element
      };
      
      const result = await interpretBaziWithDeepSeek(baziData, apiKey);
      interpretation.value = result;
    }
  } catch (err) {
    error.value = err.message || '获取AI解读失败，请稍后重试';
    console.error('DeepSeek interpretation error:', err);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.interpretation-content {
  white-space: pre-wrap;
  word-wrap: break-word;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #2979ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>

