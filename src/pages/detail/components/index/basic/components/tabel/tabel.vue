<template>
  <view>
    <template v-for="(ditem, dindex) in detail" :key="ditem.key || 'heading'">
      <view class="u-flex u-col-top u-p-y-16" :class="{'bg-white':dindex%2===0}">
        <view v-for="(kitem, kindex) in ['label', 'year', 'month', 'day', 'time']" :key="kitem" :class="{ left: kindex === 0 }" class="item">
          <view class="term-cell" v-if="kindex === 0 || ditem.type === 'default'" @click="showTips(ditem.key,ditem.data[kitem])">
            <view v-if="relationIndex(ditem.data[kitem]) !== -1" class="deity-icon" :style="relationSpriteStyle(ditem.data[kitem])"></view>
            <text class="yx-text-weight-b">{{ ditem.data[kitem] }}</text>
          </view>
          <view
              v-else-if="ditem.type === 'pillar'"
              class="u-flex u-row-center u-col-center"
          >
            <view
                :class="GetPillarColor(ditem.data[kitem], dindex)"
                class="yx-text-weight-b u-font-44"
            >{{ ditem.data[kitem] }}</view>
            <view class="element-icon u-m-l-4" :style="elementSpriteStyle(ditem.data[kitem])"></view>
          </view>
          <view
              v-else-if="ditem.type === 'list'"
              v-for="(citem, cindex) in ditem.data[kitem]"
              :key="cindex"
              class="yx-text-weight-b u-m-b-8"
              :class="[
                ditem.key === 'bottom_hide' ? `u-type-${getElAttr(citem)}` : '',
                ditem.key === 'gods' ? `u-type-primary` : ''
              ]"
              @click="showTips(ditem.key,citem)"
          >
            <view v-if="relationIndex(citem) !== -1" class="deity-icon deity-icon-small" :style="relationSpriteStyle(citem)"></view>
            <view v-if="ditem.key === 'gods'" class="shensha-icon" :style="shenshaSpriteStyle(citem)"></view>
            {{ citem + (ditem.key==='bottom_hide'?getElAttr(citem,'label'):'') }}
          </view>
        </view>
      </view>
    </template>
    <yx-book-tips ref="tips"></yx-book-tips>
  </view>
</template>

<script setup>
import {computed, ref} from 'vue';
import {useDetailStore} from "@/store/detail";
import {getElAttr} from "@/utils/transform";
import {shenshaSpriteStyle} from "@/utils/shensha-art";
import elementSprite from "@/static/icon/element-new/sprite.png";
import tenGodSprite from "@/static/icon/ten-gods/sprite.png";

const detailStore = useDetailStore();
const tips = ref();

const detail = computed(()=>{
  const map = [
    {label:"主星",key:"main"},{label:"天干",key:"top"},{label:"地支",key:"bottom"},
    {label:"藏干",key:"bottom_hide"},{label:"副星",key:"assiste"},{label:"星运",key:"trend"},
    {label:"自坐",key:"selfsit"},{label:"纳音",key:"nayin"},{label:"空亡",key:"empty"},{label:"神煞",key:"gods"}
  ];
  const list = [
    {
      type:"default",
      data:{
        label: '\\',year: '年柱',month: '月柱',day: '日柱',time: '时柱'
      },
    },
  ];

  for(let item of map){
    const data = {
      type:"default",
      data:{
        label:"",year: '',month: '',
        day: '',time: ''
      }
    }
    if(["main","assiste"].includes(item.key)){
      data.data = detailStore.start[item.key];
      data.type = item.key === "main" ? "default" : "list";
    }else if(["top","bottom"].includes(item.key)){
      data.type = "pillar";
      data.data = detailStore[item.key];
    }else if(["bottom_hide","gods"].includes(item.key)){
      data.type = "list"
      data.data = detailStore[item.key];
    }else{
      data.data = detailStore[item.key];
    }
    data.key = item.key
    data.data = {...data.data, label: item.label};
    list.push(data)
  }
  return list
});

function GetPillarColor(str) {
  return [`u-type-${getElAttr(str)}`,];
}

function elementSpriteStyle(str) {
  const index = getElAttr(str,'index');
  return {
    backgroundImage: `url(${elementSprite})`,
    backgroundPosition: `${index * 25}% 50%`,
  }
}

const relations = ['比肩','劫财','食神','伤官','正财','偏财','正官','七杀','正印','偏印'];
function relationIndex(label) {
  return relations.indexOf(label);
}
function relationSpriteStyle(label) {
  const index = relationIndex(label);
  const column = index % 5;
  const row = Math.floor(index / 5);
  return {
    backgroundImage: `url(${tenGodSprite})`,
    backgroundPosition: `${column * 25}% ${row * 100}%`,
  }
}

function showTips(type,label){
  const white = {
    main:"relation",
    trend:"trend",
    selfsit:"trend",
    assiste:"relation",
    nayin:"nayin",
    gods:"gods"
  };
  if(white[type] && !["元男","元女"].includes(label)){
    tips.value.setDetail(white[type],label)
  }
}
</script>

<style lang="scss" scoped>
.item {
  width: 22%;
  text-align: center;
  min-width: 0;
}

.left {
  width: 12%;
  text-align: center;
}

.bg-white{
  //background: #ffffff;
  //border: 0px solid rgb(230, 230, 230);
  //box-shadow: rgba(51, 51, 51, 0.07) 0px 0.15625rem 0.375rem;
}
.term-cell { display:flex; align-items:center; justify-content:center; gap:8rpx; min-height:46rpx; }
.deity-icon { width:48rpx; height:48rpx; flex:0 0 48rpx; border-radius:50%; background-repeat:no-repeat; background-size:500% 200%; background-color:#f3f6ef; }
.deity-icon-small { display:inline-block; width:34rpx; height:34rpx; vertical-align:middle; margin-right:4rpx; }
.shensha-icon { display:inline-block; width:38rpx; height:38rpx; vertical-align:middle; margin-right:5rpx; border-radius:50%; background-color:#f3f6ef; }
.element-icon { width:46rpx; height:46rpx; flex:0 0 46rpx; border-radius:50%; background-repeat:no-repeat; background-size:500% 100%; background-color:#f5f2e9; }
@media (max-width: 767px) {
  .deity-icon { width:38rpx; height:38rpx; flex-basis:38rpx; }
  .element-icon { width:38rpx; height:38rpx; flex-basis:38rpx; }
  .term-cell { flex-direction:column; gap:2rpx; }
}
</style>
