<template>
  <view class="website-page">
    <site-header active="chart" />
    <main class="site-shell home-main">
      <section class="home-hero" aria-labelledby="home-title">
        <view class="hero-intro"
          ><view class="hero-copy">
            <p class="hero-eyebrow">传统文化，从认识自己开始</p>
            <h1 id="home-title">从一张命盘，<br />认识传统文化</h1>
            <a class="hero-link" href="/learn/module-0.html"
              >初次接触？从入门课程开始 <span aria-hidden="true">↗</span></a
            >
          </view></view
        >
        <view class="chart-panel">
          <view class="chart-panel-heading"><h2>免费四柱排盘</h2></view>
          <sheet />
        </view>
      </section>
      <section class="learning-section" aria-labelledby="learning-title">
        <view class="section-heading"
          ><h2 id="learning-title">不止排盘，也把概念学明白</h2>
          <a href="/learn/"
            >浏览全部知识 <span aria-hidden="true">→</span></a
          ></view
        >
        <view class="learning-grid"
          ><a
            v-for="category in categories"
            :key="category.href"
            :href="category.href"
            class="learning-entry"
          >
            <span class="entry-symbol" aria-hidden="true">{{
              category.symbol
            }}</span>
            <view
              ><h3>{{ category.title }}</h3>
              <p>{{ category.description }}</p>
              <span class="entry-link">{{ category.label }} →</span></view
            >
          </a></view
        >
      </section>
      <section class="course-section" aria-labelledby="course-title">
        <view class="course-intro"
          ><h2 id="course-title">从零开始，循序渐进</h2>
          <p>
            六个学习模块，建立自己的知识框架。<br />也可以带着排盘中遇到的问题，随时回来查阅。
          </p>
          <a href="/learn/module-0.html">开始第一课 →</a></view
        >
        <view class="course-list"
          ><a v-for="course in courses" :key="course.href" :href="course.href"
            ><span>{{ course.title }}</span
            ><u-icon name="arrow-right" size="14" /></a
        ></view>
      </section>
    </main>
    <site-footer />
  </view>
</template>
<script setup>
import SiteHeader from "@/components/site/SiteHeader.vue";
import SiteFooter from "@/components/site/SiteFooter.vue";
import Sheet from "./components/index/sheet/sheet.vue";
const categories = [
  {
    symbol: "五",
    title: "五行与干支",
    description: "认识四柱、五行、天干与地支。",
    label: "基础概念",
    href: "/learn/basics/",
  },
  {
    symbol: "十",
    title: "十神关系",
    description: "理解日主与其他干支的关系。",
    label: "十神详解",
    href: "/learn/ten-gods/",
  },
  {
    symbol: "星",
    title: "神煞知识",
    description: "了解传统命理中的辅助标记。",
    label: "神煞索引",
    href: "/learn/shensha/",
  },
  {
    symbol: "局",
    title: "格局入门",
    description: "梳理常见格局与取用思路。",
    label: "格局目录",
    href: "/learn/geju/",
  },
];
const courses = [
  { title: "八字是什么", href: "/learn/module-0.html" },
  { title: "五行、干支与纳音", href: "/learn/module-1.html" },
  { title: "读懂十神", href: "/learn/module-2.html" },
  { title: "认识神煞", href: "/learn/module-3.html" },
  { title: "理解格局", href: "/learn/module-4.html" },
  { title: "拿到命盘怎么看", href: "/learn/module-5.html" },
];
</script>
<style scoped>
.home-main {
  padding-top: 28px;
}
.home-hero {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  border: 1px solid var(--site-line);
  border-radius: 20px;
  overflow: hidden;
  background: #eff3ec;
  box-shadow: 0 24px 60px rgba(31, 62, 49, .10);
}
.hero-intro {
  position: relative;
  background-image:
    linear-gradient(
      180deg,
      rgba(249, 250, 245, 0.96) 0%,
      rgba(249, 250, 245, 0.76) 46%,
      rgba(249, 250, 245, 0) 80%
    ),
    url("/learn/assets/images/ink-landscape.jpg");
  background-size: auto 100%;
  background-position: 58% bottom;
  min-height: 540px;
  padding: 48px 38px;
}
.hero-eyebrow {
  font-size: 12px;
  letter-spacing: 3px;
  color: var(--site-accent);
  margin: 0 0 20px;
}
.hero-copy h1 {
  font: 600 clamp(29px, 3vw, 40px) / 1.5 var(--site-serif);
  letter-spacing: 1px;
  color: #233c34;
  margin: 0 0 20px;
}
.hero-link {
  font-size: 14px;
  font-weight: 600;
  display: inline-flex;
  gap: 12px;
  align-items: center;
}
.chart-panel {
  background: var(--site-surface);
  padding: 30px 36px;
}
.chart-panel-heading {
  display: flex;
  align-items: center;
  gap: 14px;
  justify-content: space-between;
}
.chart-panel h2 {
  font-size: 23px;
  font-weight: 600;
  margin: 0;
}
.learning-section {
  margin-top: 40px;
}
.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}
.section-heading h2,
.course-intro h2 {
  font: 600 25px/1.5 var(--site-serif);
  margin: 0;
}
.section-heading > a {
  font-size: 13px;
  white-space: nowrap;
}
.learning-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  border: 1px solid var(--site-line);
  border-radius: var(--site-radius);
  background: var(--site-surface);
  overflow: hidden;
}
.learning-entry {
  padding: 26px 22px;
  display: flex;
  gap: 14px;
  align-items: flex-start;
  border-right: 1px solid var(--site-line);
  transition: background 0.2s;
  position: relative;
}
.learning-entry:last-child {
  border-right: 0;
}
.learning-entry:hover {
  background: var(--site-tint);
  text-decoration: none !important;
}
.entry-symbol {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 38px;
  height: 42px;
  border: 1px solid #c8d7cc;
  border-radius: 6px;
  font: 22px var(--site-serif);
  color: var(--site-accent);
  background: linear-gradient(145deg,#f8fbf5,#e5eee6);
  box-shadow: inset 0 0 0 3px rgba(255,255,255,.65), 0 7px 16px rgba(40,91,72,.09);
}
.learning-entry h3 {
  font-size: 16px;
  margin: 0 0 7px;
  color: var(--site-ink);
  font-weight: 600;
}
.learning-entry p {
  font-size: 12px;
  line-height: 1.8;
  color: var(--site-muted);
  margin: 0 0 12px;
}
.entry-link {
  font-size: 12px;
}
.course-section {
  display: grid;
  grid-template-columns: 1fr 1.25fr;
  gap: 48px;
  margin-top: 40px;
  border: 1px solid var(--site-line);
  padding: 32px 36px;
  border-radius: var(--site-radius);
  background: var(--site-tint);
}
.course-intro p {
  font-size: 14px;
  color: var(--site-muted);
  line-height: 1.9;
  margin: 12px 0 18px;
}
.course-intro a {
  font-size: 14px;
  font-weight: 600;
}
.course-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 24px;
}
.course-list a {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 0;
  border-bottom: 1px solid #d3ded4;
  font-size: 14px;
}
.course-list a:nth-last-child(-n + 2) {
  border: 0;
}
@media (max-width: 1023px) {
  .hero-intro {
    padding: 36px 26px;
  }
  .chart-panel {
    padding: 28px 24px;
  }
  .learning-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .learning-entry:nth-child(2) {
    border-right: 0;
  }
  .learning-entry:nth-child(-n + 2) {
    border-bottom: 1px solid var(--site-line);
  }
  .course-section {
    gap: 28px;
    padding: 28px;
  }
}
@media (max-width: 767px) {
  .home-main {
    padding-top: 18px;
  }
  .home-hero {
    grid-template-columns: 1fr;
    border-radius: 16px;
  }
  .hero-intro {
    min-height: 0;
    padding: 30px 24px 36px;
    background-size: cover;
    background-position: center;
  }
  .hero-copy h1 {
    font-size: 30px;
    margin-bottom: 12px;
  }
  .hero-eyebrow {
    margin-bottom: 12px;
    font-size: 11px;
    letter-spacing: 2px;
  }
  .hero-link {
    font-size: 13px;
  }
  .chart-panel {
    padding: 24px 20px;
  }
  .chart-panel h2 {
    font-size: 21px;
  }
  .learning-section {
    margin-top: 30px;
  }
  .section-heading {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
  }
  .section-heading h2,
  .course-intro h2 {
    font-size: 23px;
  }
  .learning-grid {
    grid-template-columns: 1fr;
  }
  .learning-entry {
    padding: 22px;
    border-right: 0;
    border-bottom: 1px solid var(--site-line);
  }
  .learning-entry:last-child {
    border-bottom: 0;
  }
  .learning-entry p {
    font-size: 13px;
    margin-bottom: 7px;
  }
  .learning-entry h3 {
    font-size: 17px;
  }
  .entry-symbol {
    width: 44px;
    height: 48px;
  }
  .course-section {
    grid-template-columns: 1fr;
    gap: 10px;
    margin-top: 28px;
    padding: 24px;
  }
  .course-list {
    grid-template-columns: 1fr;
  }
  .course-list a:nth-last-child(2) {
    border-bottom: 1px solid #d3ded4;
  }
}
</style>
