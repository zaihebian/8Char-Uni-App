import icon0 from "@/static/icon/shensha/individual/0.png";
import icon1 from "@/static/icon/shensha/individual/1.png";
import icon2 from "@/static/icon/shensha/individual/2.png";
import icon3 from "@/static/icon/shensha/individual/3.png";
import icon4 from "@/static/icon/shensha/individual/4.png";
import icon5 from "@/static/icon/shensha/individual/5.png";
import icon6 from "@/static/icon/shensha/individual/6.png";
import icon7 from "@/static/icon/shensha/individual/7.png";
import icon8 from "@/static/icon/shensha/individual/8.png";
import icon9 from "@/static/icon/shensha/individual/9.png";
import icon10 from "@/static/icon/shensha/individual/10.png";
import icon11 from "@/static/icon/shensha/individual/11.png";
import icon12 from "@/static/icon/shensha/individual/12.png";
import icon13 from "@/static/icon/shensha/individual/13.png";
import icon14 from "@/static/icon/shensha/individual/14.png";
import icon15 from "@/static/icon/shensha/individual/15.png";

const SHENSHA_IMAGES = [
  icon0, icon1, icon2, icon3,
  icon4, icon5, icon6, icon7,
  icon8, icon9, icon10, icon11,
  icon12, icon13, icon14, icon15,
];

const SHENSHA_GROUPS = [
  ["学堂", "词馆", "十灵日", "六秀日"],
  ["文昌贵人", "德秀贵人"],
  ["天乙贵人", "天德合", "月德合"],
  ["太极贵人"],
  ["天德贵人", "天赦", "天医"],
  ["月德贵人", "红鸾", "天喜"],
  ["三奇贵人", "国印"],
  ["福星贵人", "天厨贵人", "禄神", "金舆"],
  ["华盖", "孤辰", "寡宿", "孤鸾煞"],
  ["驿马", "天转", "地转", "流霞"],
  ["桃花", "红艳煞"],
  ["羊刃", "飞刃", "血刃", "劫煞", "灾煞"],
  ["魁罡", "亡神", "金神", "四废"],
  ["空亡", "元辰", "阴差阳错", "十恶大败", "八专", "九丑", "童子煞"],
  ["天罗地网", "天罗", "地网", "勾绞煞", "丧门", "吊客", "披麻"],
  ["将星", "拱禄"],
];

const SHENSHA_INDEX = new Map(
  SHENSHA_GROUPS.flatMap((labels, index) =>
    labels.map((label) => [label, index]),
  ),
);

function fallbackIndex(label = "") {
  return Array.from(label).reduce((sum, char) => sum + char.charCodeAt(0), 0) % 16;
}

export function shenshaImage(label) {
  const index = SHENSHA_INDEX.get(label) ?? fallbackIndex(label);
  return SHENSHA_IMAGES[index];
}
