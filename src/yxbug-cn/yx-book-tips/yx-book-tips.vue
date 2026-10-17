<template>
  <u-modal
      v-model="config.show"
      :title="config.label"
      :title-style="{
        paddingTop:'.5em',
      }"
      :show-confirm-button="false"
      :show-cancel-button="false"
      :mask-close-able="true"
      @confirm="onClose"
      @cancel="onClose"
  >
    <scroll-view scroll-y="true" style="height: 760rpx;">
      <view class="u-p-20">
        <view v-if="portrait || shenshaArtwork" class="tips-portrait">
          <image v-if="portrait" :src="portrait" :alt="`${config.label}神灵简笔画全身形象`" mode="aspectFit"></image>
          <view v-else class="shensha-portrait" :style="shenshaArtwork" role="img" :aria-label="`${config.label}神煞象征图标`"></view>
          <a v-if="detailUrl" :href="detailUrl" class="portrait-link">查看完整图文解读 →</a>
        </view>
        <template v-for="item in detail">
          <view class="title u-m-y-10">{{item.title}}</view>
          <view class="content u-m-t-10 u-m-b-30"><text decode>{{item.content}}</text></view>
        </template>
      </view>
    </scroll-view>
  </u-modal>
</template>

<script setup>
import {ref,computed} from "vue";
import {useTipsStore} from "@/store/tips";
import {shenshaSpriteStyle} from "@/utils/shensha-art";
import bijianPortrait from "@/static/icon/ten-gods/full/bijian.png";
import jiecaiPortrait from "@/static/icon/ten-gods/full/jiecai.png";
import shishenPortrait from "@/static/icon/ten-gods/full/shishen.png";
import shangguanPortrait from "@/static/icon/ten-gods/full/shangguan.png";
import zhengcaiPortrait from "@/static/icon/ten-gods/full/zhengcai.png";
import piancaiPortrait from "@/static/icon/ten-gods/full/piancai.png";
import zhengguanPortrait from "@/static/icon/ten-gods/full/zhengguan.png";
import qishaPortrait from "@/static/icon/ten-gods/full/qisha.png";
import zhengyinPortrait from "@/static/icon/ten-gods/full/zhengyin.png";
import pianyinPortrait from "@/static/icon/ten-gods/full/pianyin.png";

const config = ref({
  show:false,
  type:"",
  label:"",
  detail:{}
})

const store = useTipsStore()

async function setDetail(type,label){
  config.value.type = type;
  config.value.label = label;
  const detail = store[type].find(item => item.label === label)
  config.value.detail = detail;
  if(detail?.label) config.value.show = true;
}

const relationSlugs = {
  比肩:"bijian", 劫财:"jiecai", 食神:"shishen", 伤官:"shangguan",
  正财:"zhengcai", 偏财:"piancai", 正官:"zhengguan", 七杀:"qisha",
  正印:"zhengyin", 偏印:"pianyin",
};

const relationPortraits = {
  bijian: bijianPortrait,
  jiecai: jiecaiPortrait,
  shishen: shishenPortrait,
  shangguan: shangguanPortrait,
  zhengcai: zhengcaiPortrait,
  piancai: piancaiPortrait,
  zhengguan: zhengguanPortrait,
  qisha: qishaPortrait,
  zhengyin: zhengyinPortrait,
  pianyin: pianyinPortrait,
};

const relationSlug = computed(() => config.value.type === "relation" ? relationSlugs[config.value.label] : "");
const portrait = computed(() => relationPortraits[relationSlug.value] || "");
const shenshaArtwork = computed(() => config.value.type === "gods" ? shenshaSpriteStyle(config.value.label) : null);
const detailUrl = computed(() => relationSlug.value ? `/learn/ten-gods/${relationSlug.value}.html` : "");

const detail = computed(()=>{
  const data = config.value.detail;
  const map = {
    tip:"精评",
    formula:"古决",
    func:"十神功能",
    seek:"查法",
  }
  const list = [];
  for(let key in data){
    if(map[key]){
      list.push({
        title:map[key],
        content:data[key]
      })
    }else if(key === "books"){
      list.push(...data[key])
    }
  }
  return list;
})

const onClose = () => config.value.show = false;

defineExpose({
  setDetail,
})
</script>

<style lang="scss" scoped>
.title{
  color:$u-type-warning-dark;
  font-size: 32rpx;
  font-weight: 800;
}

.content{
  color:$u-content-color;
  font-size: 26rpx;
}
.tips-portrait {
  width: 100%;
  padding: 16rpx 16rpx 22rpx;
  margin-bottom: 26rpx;
  border-radius: 20rpx;
  background: linear-gradient(145deg, #ffffff, #eef4ed);
  border: 1px solid #dce5de;
  text-align: center;
}
.tips-portrait image {
  display: block;
  width: 320rpx;
  height: 320rpx;
  margin: 0 auto 10rpx;
}
.shensha-portrait {
  width: 360rpx;
  height: 360rpx;
  margin: 0 auto 10rpx;
}
.portrait-link {
  color: #285b48;
  font-size: 26rpx;
  font-weight: 700;
  text-decoration: none;
}
</style>
