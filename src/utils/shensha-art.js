import shenshaSprite from "@/static/icon/shensha/sprite.png";

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

export function shenshaSpriteStyle(label) {
  const index = SHENSHA_INDEX.get(label) ?? fallbackIndex(label);
  const column = index % 4;
  const row = Math.floor(index / 4);
  return {
    backgroundImage: `url(${shenshaSprite})`,
    backgroundPosition: `${column * (100 / 3)}% ${row * (100 / 3)}%`,
    backgroundSize: "400% 400%",
    backgroundRepeat: "no-repeat",
  };
}
