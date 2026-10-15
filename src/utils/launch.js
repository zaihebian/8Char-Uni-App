import {checkVersion} from "@/utils/version";
import {setTipsToStore} from "@/utils/tips";

export const init = () => {
    checkVersion()
    setTipsToStore().catch(() => {
        // Optional terminology hints must not prevent the chart form from loading.
        console.warn('术语提示暂时无法加载。');
    })
}
