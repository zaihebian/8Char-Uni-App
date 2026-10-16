<template>
  <yx-sheet :margin="[0, 0]" :padding="[0, 10]">
    <view class="u-flex u-row-center u-col-center">
      <view class="u-flex u-row-center u-col-start">
        <view id="index-main-header-left" class="u-m-r-30 u-row-center" style="width: 160rpx;">
          <view class="u-flex u-row-center u-col-center">
            <view class="zodiac-avatar" :style="detail.pic" role="img" :aria-label="`${detail.zodiac}生肖形象`"></view>
          </view>
          <view class="u-m-t-10 u-flex u-row-center u-col-center">
            <view class="yx-text-weight-b u-font-24 u-line-1">{{ isHide ? '*'.repeat(detail.realname.length) : detail.realname }}</view>
            <u-icon
                :font-size="24"
                :name="isHide ? 'eye-fill' : 'eye-off'"
                class="u-p-l-10"
                @click="isHide = !isHide"
            ></u-icon>
          </view>
        </view>
        <view id="index-main-header-right">
          <view class="u-flex u-m-b-20">
            <view class="yx-text-weight-b">{{ detail.lunar }}</view>
            <view class="yx-text-weight-b u-type-primary-dark u-m-l-6">{{ detail.type }}</view>
          </view>
          <view class="yx-text-weight-b">{{ detail.solar }}</view>
        </view>
      </view>
    </view>
  </yx-sheet>
</template>

<script setup>
import {deleteFirstElement} from '@/utils/transform';
import {useDetailStore} from "@/store/detail";
import {computed, ref} from "vue";
import {LunarUtil} from "lunar-javascript";
import {getUrl} from "@/utils/file";

const isHide = ref(false);
const detailStore = useDetailStore();

const detail = computed(()=>{
  const type = detailStore.gender===1?"乾造":"坤造"
  return {
    pic:GetChineseZodiac(detailStore.zodiac),
    lunar:`阴历：${detailStore.datetime.lunar}`,
    solar:`阳历：${detailStore.datetime.solar}`,
    realname:detailStore.realname,
    zodiac:detailStore.zodiac,
    type:`(${type})`,
  }
})

function GetChineseZodiac(sx){
  const index = deleteFirstElement(LunarUtil.SHENGXIAO).indexOf(sx);
  if (index !== -1) {
    const column = index % 6;
    const row = Math.floor(index / 6);
    return {
      backgroundImage: `url(${getUrl('static/icon/zodiac-new/sprite.png')})`,
      backgroundPosition: `${column * 20}% ${row * 100}%`,
    }
  }
  return {backgroundImage: `url(${getUrl('static/icon/site/logo.svg')})`};
}
</script>

<style scoped>
.zodiac-avatar {
  width: 104rpx;
  height: 104rpx;
  border-radius: 50%;
  background-color: #f1f6ef;
  background-repeat: no-repeat;
  background-size: 600% 200%;
  box-shadow: 0 8px 22px rgba(37, 77, 60, 0.14);
  border: 2rpx solid rgba(255,255,255,.9);
}
</style>
