<template>
  <view class="report-wrap">
    <view class="report-card">
      <view class="report-title">排盘摘要</view>
      <view class="report-intro"
        >这份报告可在本机复制或下载；本站不会将报告发送给 AI
        服务，也不提供付费解读。</view
      >
      <view class="report-text">{{ report }}</view>
      <view class="report-actions">
        <button class="report-button primary" @click="copyReport">
          一键复制
        </button>
        <!-- #ifdef H5 -->
        <button class="report-button" @click="downloadReport">下载 TXT</button>
        <!-- #endif -->
      </view>
      <view class="report-note"
        >如自行使用第三方
        AI，请先了解其隐私政策，不要上传不愿分享的个人信息。传统文化内容仅供学习参考，不用于医疗、财务等重要决策。</view
      >
    </view>
  </view>
</template>

<script setup>
import { computed } from "vue";
import { useDetailStore } from "@/store/detail";

const detail = useDetailStore();
const slots = ["year", "month", "day", "time"];
const labels = ["年柱", "月柱", "日柱", "时柱"];
const clean = (value) =>
  typeof value === "string" ? value : value == null ? "" : String(value);
const report = computed(() => {
  const lines = [
    "国学经典 · 排盘学习摘要",
    "公历：" + clean(detail.datetime?.solar),
    "农历：" + clean(detail.datetime?.lunar),
    "生肖：" + clean(detail.zodiac),
    "说明：以下是传统文化中的排盘术语，不代表确定的个人结论。",
    "",
  ];
  slots.forEach((key, index) => {
    lines.push(
      `${labels[index]}：${clean(detail.top?.[key])}${clean(detail.bottom?.[key])}  十神：${clean(detail.start?.main?.[key])}  纳音：${clean(detail.nayin?.[key])}  空亡：${clean(detail.empty?.[key])}`,
    );
  });
  lines.push("", "想进一步学习：查看本站“国学知识”中的基础概念与课程。");
  return lines.join("\n");
});

function copyReport() {
  uni.setClipboardData({
    data: report.value,
    success: () => uni.showToast({ title: "已复制报告", icon: "success" }),
    fail: () => uni.showToast({ title: "复制失败，请下载报告", icon: "none" }),
  });
}

function downloadReport() {
  const blob = new Blob([report.value], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "国学经典-排盘摘要.txt";
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
</script>

<style scoped>
.report-wrap {
  width: 100%;
  padding: 24px 16px;
  color: var(--site-ink);
}
.report-card {
  background: var(--site-surface);
  padding: 8px;
}
.report-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 10px;
}
.report-intro,
.report-note {
  color: #5d655f;
  font-size: 14px;
  line-height: 1.8;
}
.report-text {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  background: #f7f8f5;
  border: 1px solid #e6ebe3;
  border-radius: 10px;
  padding: 18px;
  margin: 22px 0;
  line-height: 1.9;
  font-size: 15px;
}
.report-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 18px;
}
.report-button {
  min-width: 140px;
  margin: 0;
  padding: 11px 24px;
  border: 1px solid var(--site-line);
  border-radius: 8px;
  background: var(--site-surface);
  color: var(--site-accent);
  font: 14px/1.5 var(--site-font);
}
.report-button::after {
  border: 0;
}
.report-button.primary {
  background: var(--site-accent);
  color: #fff;
  border-color: var(--site-accent);
}
</style>
