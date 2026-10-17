<template>
  <header class="web-header">
    <nav class="web-nav site-shell" aria-label="网站导航">
      <a class="web-brand" href="/"
        >国学经典<span>中华古籍｜传统文化｜互动体验</span></a
      >
      <button
        class="web-menu-button"
        :aria-expanded="menuOpen"
        aria-controls="web-menu"
        @click="menuOpen = !menuOpen"
      >
        {{ menuOpen ? "收起菜单" : "浏览栏目" }}
        <u-icon :name="menuOpen ? 'arrow-up' : 'list'" size="18" />
      </button>
      <view id="web-menu" class="web-links" :class="{ 'is-open': menuOpen }">
        <a href="/" :aria-current="active === 'chart' ? 'page' : undefined"
          >免费排盘</a
        >
        <a href="/learn/">国学知识</a><a href="/learn/about.html">关于本站</a>
      </view>
    </nav>
  </header>
</template>
<script setup>
import { ref } from "vue";
defineProps({ active: { type: String, default: "" } });
const menuOpen = ref(false);
</script>
