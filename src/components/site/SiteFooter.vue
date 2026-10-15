<template>
  <footer class="web-footer site-shell">
    <view
      ><strong>国学经典</strong>
      <p>了解传统概念，也保留独立思考。</p></view
    >
    <view class="web-footer-links"
      ><a href="/learn/about.html">关于本站</a
      ><a href="/learn/privacy.html">隐私政策</a
      ><a
        href="https://github.com/zaihebian/8Char-Uni-App/issues"
        target="_blank"
        rel="noopener"
        >反馈建议</a
      ></view
    >
    <p class="web-footer-note">
      © {{ year }} 国学经典。内容仅供传统文化学习与参考。<a
        href="https://github.com/axbug/8Char-H5"
        target="_blank"
        rel="noopener"
        >排盘开源项目</a
      >
    </p>
  </footer>
</template>
<script setup>
const year = new Date().getFullYear();
</script>
