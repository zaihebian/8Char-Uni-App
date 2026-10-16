<template>
  <yx-sheet :margin="[20, 20]" :padding="[30, 30]" :round="3" :shadow="10">
    <view class="u-flex u-m-b-30">
      <view class="u-flex u-flex-6 flex-row-center">
        <view class="yx-text-weight-b">
          <u-icon name="hourglass-half-fill"></u-icon>
          <text class="u-m-l-10">五行数据</text>
        </view>
      </view>
      <view class="u-flex-6">
        <view class="u-flex u-row-right u-col-center">
          <text :font-size="28" class="yx-text-weight-b u-p-r-16">包含藏干</text>
          <view>
            <u-switch v-model="isInclude" size="32"></u-switch>
          </view>
        </view>
      </view>
    </view>
    <template v-for="(item, index) in els">
      <view class="u-flex u-row-center u-m-y-20">
        <view class="element-mark" :style="elementStyle(index)" aria-hidden="true"></view>
        <text class="yx-text-weight-b u-p-r-16">{{ ELEMENT.labels[index] }}</text>
        <view style="width: 100%;">
          <u-line-progress
              :active-color="colors[index]"
              :height="32"
              :percent="item.sacle"
              striped
          >
            <text></text>
          </u-line-progress>
        </view>
        <view class="yx-text-weight-b u-text-right" style="width: 200rpx;">
          {{ item.total + '个 ' + detailStore.element.relation[index] }}
        </view>
      </view>
    </template>
    <view class="u-m-t-40">
      <pro-decl auto></pro-decl>
    </view>
  </yx-sheet>
</template>

<script setup>
import {ref, computed} from 'vue';
import ProDecl from '../../../common/pro-decl/pro-decl.vue';
import {useDetailStore} from "@/store/detail";
import {ELEMENT} from "@/config/map";
import {getUrl} from "@/utils/file";

const detailStore = useDetailStore();
const colors = ELEMENT.colors;
const isInclude = ref(false)

const els = computed(()=>{
  const key = isInclude.value?"include":"ninclude"
  return detailStore.element[key].list
})

function elementStyle(index) {
  return {
    backgroundImage: `url(${getUrl('static/icon/element-new/sprite.png')})`,
    backgroundPosition: `${index * 25}% 50%`,
  }
}
</script>

<style scoped>
.element-mark {
  width: 64rpx;
  height: 64rpx;
  flex: 0 0 64rpx;
  margin-right: 12rpx;
  border-radius: 50%;
  background-size: 500% 100%;
  background-repeat: no-repeat;
  background-color: #f4f4ec;
  box-shadow: 0 5rpx 14rpx rgba(35,60,52,.10);
}
</style>
