import bijian from "@/static/icon/ten-gods/full/bijian.png";
import jiecai from "@/static/icon/ten-gods/full/jiecai.png";
import shishen from "@/static/icon/ten-gods/full/shishen.png";
import shangguan from "@/static/icon/ten-gods/full/shangguan.png";
import zhengcai from "@/static/icon/ten-gods/full/zhengcai.png";
import piancai from "@/static/icon/ten-gods/full/piancai.png";
import zhengguan from "@/static/icon/ten-gods/full/zhengguan.png";
import qisha from "@/static/icon/ten-gods/full/qisha.png";
import zhengyin from "@/static/icon/ten-gods/full/zhengyin.png";
import pianyin from "@/static/icon/ten-gods/full/pianyin.png";

const TEN_GODS = {
  比肩: { slug: "bijian", image: bijian },
  劫财: { slug: "jiecai", image: jiecai },
  食神: { slug: "shishen", image: shishen },
  伤官: { slug: "shangguan", image: shangguan },
  正财: { slug: "zhengcai", image: zhengcai },
  偏财: { slug: "piancai", image: piancai },
  正官: { slug: "zhengguan", image: zhengguan },
  七杀: { slug: "qisha", image: qisha },
  正印: { slug: "zhengyin", image: zhengyin },
  偏印: { slug: "pianyin", image: pianyin },
};

export function tenGodImage(label) {
  return TEN_GODS[label]?.image || "";
}

export function tenGodSlug(label) {
  return TEN_GODS[label]?.slug || "";
}
