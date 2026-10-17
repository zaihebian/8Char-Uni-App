<template>
  <view class="chart-form">
    <view class="form-row">
      <label class="field"
        ><span class="field-label">姓名 <small>选填</small></span
        ><input
          v-model="form.realname"
          class="name-input"
          placeholder="为这份命盘起个名字"
          :disabled="isSubmitting"
          maxlength="30"
      /></label>
      <view class="field"
        ><view class="field-label">性别</view
        ><view class="gender-options"
          ><u-radio-group v-model="form.gender"
            ><u-radio
              v-for="item in genderOptions"
              :key="item.value"
              :name="item.value"
              :disabled="isSubmitting"
              active-color="#285b48"
              >{{ item.label }}</u-radio
            ></u-radio-group
          ></view
        ></view
      >
    </view>
    <view class="field">
      <view class="field-label">出生日期与时间</view>
      <button class="date-input" :disabled="isSubmitting" @click="selectTime">
        <span :class="{ placeholder: !dateLabel }">{{
          dateLabel || "请选择公历日期与时间"
        }}</span
        ><u-icon name="calendar" size="32" />
      </button>
      <view v-if="lunarLabel" class="lunar-note">农历：{{ lunarLabel }}</view>
    </view>
    <view class="field">
      <view class="field-label">晚子时换日 <small>23:00 至 23:59</small></view>
      <u-radio-group v-model="form.sect"
        ><u-radio
          v-for="item in sectOptions"
          :key="item.value"
          :name="item.value"
          :disabled="isSubmitting"
          active-color="#285b48"
          >{{ item.label }}</u-radio
        ></u-radio-group
      >
    </view>
    <view v-if="errorMessage" class="form-error" role="alert">{{
      errorMessage
    }}</view>
    <button
      class="submit-button"
      :disabled="isSubmitting"
      :loading="isSubmitting"
      @click="submitChart"
    >
      {{ isSubmitting ? "正在生成命盘…" : "开始排盘" }}
      <span v-if="!isSubmitting" aria-hidden="true">→</span>
    </button>
    <p class="form-note">
      出生信息将用于生成排盘。<a href="/learn/privacy.html">了解隐私政策</a>
    </p>
    <u-picker
      v-model="solarSelectShow"
      :params="timePickerOptions"
      :default-time="defaultTime"
      mode="time"
      start-year="1900"
      end-year="2100"
      confirm-color="#285b48"
      @confirm="confirmDate"
    />
  </view>
</template>
<script setup>
import { computed, reactive, ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { Solar } from "lunar-javascript";
import {
  deleteLocalStorage,
  getLocalStorage,
  setLocalStorage,
} from "@/utils/cache";
import { GetBook, GetInfo } from "@/api/default";
import { useDetailStore } from "@/store/detail";
import { useTendStore } from "@/store/tend";
import { useBookStore } from "@/store/book";
import { timeFormat } from "@/utils/transform";
import { toDetail } from "@/utils/router";

const genderOptions = [
  { value: 1, label: "男" },
  { value: 2, label: "女" },
];
const sectOptions = [
  { value: 1, label: "日柱算次日" },
  { value: 2, label: "日柱算当日" },
];
const timePickerOptions = {
  year: true,
  month: true,
  day: true,
  hour: true,
  minute: true,
  second: false,
};
const form = reactive({
  realname: "",
  gender: 1,
  sect: 1,
  timestamp: null,
});
const detailStore = useDetailStore();
const tendStore = useTendStore();
const bookStore = useBookStore();
const solarSelectShow = ref(false);
const isSubmitting = ref(false);
const errorMessage = ref("");

function validTimestamp(value) {
  if (value === null || value === undefined || value === "") return null;
  const timestamp = Number(value);
  const date = new Date(timestamp);
  return Number.isFinite(timestamp) &&
    date.getFullYear() >= 1 &&
    date.getFullYear() <= 9999
    ? timestamp
    : null;
}

const lunar = computed(() =>
  form.timestamp === null
    ? null
    : Solar.fromDate(new Date(form.timestamp)).getLunar(),
);
const lunarLabel = computed(() =>
  lunar.value ? `${lunar.value.toString()} ${lunar.value.getTimeZhi()}时` : "",
);
const dateLabel = computed(() =>
  form.timestamp === null ? "" : timeFormat(new Date(form.timestamp)),
);
const defaultTime = computed(() => {
  const date = new Date(form.timestamp);
  // The calendar widget has a narrower range than four-pillar searches.
  if (form.timestamp === null || date.getFullYear() < 1900 || date.getFullYear() > 2100)
    return "2001-01-01 00:00:00";
  return timeFormat(date, "yyyy-mm-dd hh:MM:ss");
});
onLoad((query = {}) => {
  if (query.time) {
    form.timestamp = validTimestamp(query.time);
    form.gender = Number(query.gender) === 2 ? 2 : 1;
    return;
  }
  const cached = getLocalStorage("info");
  if (!cached) return;
  try {
    const data = JSON.parse(cached);
    form.timestamp = validTimestamp(data?.timestamp);
    form.realname =
      typeof data?.realname === "string" && data.realname !== "不知名网友"
        ? data.realname.slice(0, 30)
        : "";
    form.gender = Number(data?.gender) === 2 ? 2 : 1;
    form.sect = Number(data?.sect) === 2 ? 2 : 1;
  } catch {
    deleteLocalStorage("info");
  }
});

function selectTime() {
  errorMessage.value = "";
  solarSelectShow.value = true;
}

function confirmDate({ year, month, day, hour, minute }) {
  form.timestamp = validTimestamp(
    new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
    ).getTime(),
  );
}

async function submitChart() {
  if (isSubmitting.value) return;
  if (form.timestamp === null) {
    selectTime();
    return;
  }
  isSubmitting.value = true;
  errorMessage.value = "";
  const payload = {
    realname: form.realname.trim() || "不知名网友",
    timestamp: form.timestamp,
    gender: form.gender,
    sect: form.sect,
  };
  const request = {
    datetime: timeFormat(new Date(payload.timestamp), "yyyy-mm-dd hh:MM:ss"),
    gender: payload.gender,
    sect: payload.sect,
  };
  try {
    const [info, book] = await Promise.all([
      GetInfo(request),
      GetBook(request),
    ]);
    if (!info || !book)
      throw new Error("排盘服务暂未返回完整数据，请稍后重试。");
    detailStore.set({ ...payload, ...info });
    bookStore.set(book);
    tendStore.pull(payload);
    setLocalStorage("info", JSON.stringify(payload));
    toDetail();
  } catch (error) {
    errorMessage.value =
      error?.message || "暂时无法连接排盘服务，请检查网络后重试。";
  } finally {
    isSubmitting.value = false;
  }
}
</script>
<style scoped>
.chart-form {
  min-width: 0;
}
.form-row {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
  gap: 20px;
}
.field {
  display: block;
  min-width: 0;
  margin-bottom: 18px;
}
.field-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--site-ink);
  margin-bottom: 8px;
  display: block;
}
.field-label small {
  font-size: 11px;
  font-weight: 400;
  color: var(--site-muted);
  margin-left: 8px;
}
.name-input {
  width: 100%;
  height: 44px;
  min-height: 44px;
  border: 1px solid var(--site-line);
  border-radius: 8px;
  background: var(--site-surface);
  padding: 0 12px;
  font-size: 14px;
  color: var(--site-ink);
}
.gender-options {
  display: flex;
  align-items: center;
  min-height: 44px;
}
.gender-options :deep(.u-radio-group) {
  flex-wrap: nowrap;
}
.gender-options :deep(.u-radio:last-child) {
  margin-right: 0;
}
.chart-form :deep(.u-radio__label) {
  font-size: 14px !important;
  color: var(--site-ink) !important;
}
.chart-form :deep(.u-radio) {
  margin-right: 16px;
}
.chart-form button::after {
  border: 0;
}
.date-input {
  width: 100%;
  min-height: 46px;
  padding: 10px 13px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  border: 1px solid var(--site-line);
  border-radius: 8px;
  background: var(--site-surface);
  color: var(--site-ink);
  font: 14px/1.6 var(--site-font);
  text-align: left;
}
.date-input .placeholder {
  color: var(--site-muted);
}
.lunar-note {
  font-size: 12px;
  color: var(--site-muted);
  margin-top: 6px;
}
.submit-button {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  min-height: 46px;
  margin: 8px 0 0;
  background: #285b48;
  color: #fff;
  border-radius: 8px;
  font: 600 15px/1.6 var(--site-font);
  padding: 12px 18px;
}
.submit-button:hover {
  background: #1f4939;
}
.submit-button[disabled] {
  background: #5f7e6d;
  color: #fff;
}
.form-note {
  font-size: 11px;
  text-align: center;
  color: var(--site-muted);
  line-height: 1.7;
  margin: 12px 0 0;
}
.form-note a {
  color: var(--site-accent);
}
.form-error {
  font-size: 13px;
  color: #9e3434;
  background: #fff1f0;
  padding: 10px 12px;
  margin-bottom: 12px;
  border-radius: 6px;
}
@media (max-width: 380px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }
  .gender-options {
    min-height: 28px;
  }
  .chart-form :deep(.u-radio) {
    margin-right: 12px;
  }
}
</style>
