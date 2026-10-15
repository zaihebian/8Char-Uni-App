<template>
  <yx-nav-header></yx-nav-header>
  <head-box></head-box>
  <sheet></sheet>
  <!-- #ifdef H5 -->
  <view class="site-info">
    <view class="site-info__title">排盘免费，知识也免费</view>
    <view class="site-info__text">输入出生时间即可免费查看命盘与基础解读，也可复制或下载报告。遇到不熟悉的术语，可从入门课程和概念库开始了解。本站不提供付费 AI 解读，也不会消耗站长的 AI token。</view>
    <view class="site-info__links">
      <a href="/learn/">国学知识首页</a>
      <a href="/learn/module-0.html">从零开始</a>
      <a href="/learn/basics/">查概念</a>
    </view>
    <view class="site-info__footer">
      <a href="/learn/about.html">关于本站</a>
      <a href="/learn/privacy.html">隐私政策</a>
      <a href="https://github.com/axbug/8Char-H5" target="_blank" rel="noopener">上游项目</a>
    </view>
  </view>
  <!-- #endif -->
</template>

<script setup>
import HeadBox from './components/index/head/head.vue';
import Sheet from './components/index/sheet/sheet.vue';
</script>

<style scoped>
.site-info{max-width:760px;margin:18px auto 36px;padding:22px 24px;background:#fff;border:1px solid #e7e2d8;border-radius:14px;color:#2b2b2b;line-height:1.7}
.site-info__title{font-size:20px;font-weight:700;margin-bottom:8px}
.site-info__text{color:#5d5a52}
.site-info__links,.site-info__footer{display:flex;flex-wrap:wrap;gap:12px 20px;margin-top:18px}
.site-info__footer{padding-top:14px;border-top:1px solid #e7e2d8;font-size:13px}
.site-info a{color:#2c5d7c;text-decoration:none}
.site-info a:hover{text-decoration:underline}
</style>
