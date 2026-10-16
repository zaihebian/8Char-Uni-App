<template>
  <view class="website-page result-page">
    <site-header active="chart" />
    <main v-if="hasChart" class="site-shell result-main">
      <view class="result-heading"
        ><view
          ><h1>你的四柱命盘</h1>
          <p>查看基本信息，深入了解术语，或保存一份学习摘要。</p></view
        ><a href="/">重新排盘 →</a></view
      >
      <view class="result-profile"><header-view /></view>
      <view class="result-tabs" role="tablist" aria-label="命盘内容">
        <button
          v-for="(tab, index) in tabs"
          :id="`chart-tab-${index}`"
          :key="tab"
          role="tab"
          :aria-selected="currentTab === index"
          aria-controls="chart-panel"
          :class="{ 'is-active': currentTab === index }"
          @click="currentTab = index"
        >
          {{ tab }}
        </button>
      </view>
      <view
        id="chart-panel"
        class="result-content"
        role="tabpanel"
        :aria-labelledby="`chart-tab-${currentTab}`"
      >
        <basic v-if="currentTab === 0" />
        <major v-else-if="currentTab === 1" />
        <report-export v-else />
      </view>
      <view class="result-help"
        ><span>遇到不熟悉的术语？</span><a href="/learn/basics/">查基础概念</a
        ><a href="/learn/ten-gods/">了解十神</a
        ><a href="/learn/module-5.html">学习怎么看一盘</a></view
      >
    </main>
    <site-footer />
  </view>
</template>
<script setup>
import { computed, onMounted, ref } from "vue";
import SiteHeader from "@/components/site/SiteHeader.vue";
import SiteFooter from "@/components/site/SiteFooter.vue";
import HeaderView from "./components/index/common/header/header.vue";
import Basic from "./components/index/basic/basic.vue";
import Major from "./components/index/major/major.vue";
import ReportExport from "./components/index/report-export/report-export.vue";
import { toHome } from "@/utils/router";
import { useDetailStore } from "@/store/detail";
const detailStore = useDetailStore();
const tabs = ["基本命盘", "专业细盘", "保存报告"];
const currentTab = ref(0);
const hasChart = computed(() => detailStore.timestamp !== null);
onMounted(() => {
  if (!hasChart.value) toHome();
});
</script>
<style scoped>
.result-main {
  padding-top: 28px;
  position: relative;
}
.result-main::before {
  content: "";
  position: absolute;
  inset: 0 0 auto;
  height: 280px;
  z-index: 0;
  pointer-events: none;
  background: radial-gradient(circle at 82% 16%, rgba(184,137,59,.13), transparent 34%), radial-gradient(circle at 12% 0, rgba(40,91,72,.12), transparent 36%);
}
.result-main > * { position: relative; z-index: 1; }
.result-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 22px;
}
.result-heading h1 {
  font: 600 29px/1.4 var(--site-serif);
  margin: 0 0 8px;
}
.result-heading p {
  font-size: 14px;
  color: var(--site-muted);
  margin: 0;
}
.result-heading > a {
  font-size: 14px;
  white-space: nowrap;
}
.result-profile {
  border: 1px solid var(--site-line);
  border-radius: 16px;
  overflow: hidden;
  padding: 12px;
  background: linear-gradient(135deg, #fff 0%, #f5f8f1 100%);
  box-shadow: 0 14px 34px rgba(31, 62, 49, .08);
}
.result-tabs {
  display: flex;
  border-bottom: 1px solid var(--site-line);
  margin-top: 24px;
  gap: 8px;
}
.result-tabs button {
  flex: 1;
  max-width: 220px;
  background: transparent;
  color: var(--site-muted);
  font: 15px/1.5 var(--site-font);
  padding: 16px 8px;
  margin: 0;
  border-radius: 0;
}
.result-tabs button::after {
  border: 0;
}
.result-tabs button.is-active {
  color: var(--site-accent);
  font-weight: 600;
  box-shadow: inset 0 -3px var(--site-accent);
}
.result-content {
  background: var(--site-surface);
  border: 1px solid var(--site-line);
  border-top: 0;
  padding: 20px;
  border-radius: 0 0 16px 16px;
  min-width: 0;
  overflow-x: auto;
  box-shadow: 0 16px 38px rgba(31, 62, 49, .07);
}
.result-help {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 22px;
  padding: 24px 0;
  font-size: 14px;
}
.result-help span {
  color: var(--site-muted);
}
@media (max-width: 767px) {
  .result-main {
    padding-top: 22px;
  }
  .result-heading {
    align-items: flex-start;
    flex-direction: column;
    gap: 10px;
  }
  .result-heading h1 {
    font-size: 26px;
  }
  .result-heading p {
    font-size: 13px;
  }
  .result-content {
    padding: 8px 0;
  }
  .result-profile {
    padding: 8px 0;
  }
  .result-tabs button {
    font-size: 14px;
  }
  .result-help {
    font-size: 13px;
    gap: 10px 16px;
  }
}
</style>
