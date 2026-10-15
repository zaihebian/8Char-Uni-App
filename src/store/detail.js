import {defineStore} from 'pinia';
import {timeFormat} from "@/utils/transform";

const createPillars = () => ({year: '', month: '', day: '', time: ''});

export const useDetailStore = defineStore('detail', {
    state: () => {
        return {
            realname: "",
            gender: 1,
            timestamp: null,
            sect:0,
            datetime: {
                solar: "",
                lunar: ""
            },
            festival: {
                pre: {
                    label: "",time: ""
                },
                next: {
                    label: "",time: ""
                }
            },
            constellation: "",
            zodiac: "",
            top: createPillars(),
            bottom: createPillars(),
            bottom_hide: {
                year: [],month: [],day: [],time: []
            },
            empty: createPillars(),
            start: {
                main: createPillars(),
                assiste: createPillars(),
            },
            trend: createPillars(),
            nayin: createPillars(),
            element: {
                relation: [],
                pro_decl: new Array(5).fill(''),
                include: [],
                ninclude: []
            },
            selfsit: createPillars(),
            embryo: [Array.from({length: 3}, () => [])],
            tb_relation: {top:[],bottom:[]},
            gods: [],
            start_tend:createPillars()
        };
    },
    actions: {
        set(data) {
            for (let key in data) {
                this[key] = data[key];
            }
        }
    },
    getters: {
        dayGan(state) {
            return state.top.day
        },
        startTendDate(state){
            let label = '出生后';
            const { start_tend } = state;
            const map = {year: "年",month: "月",day: "日",time: "时"}
            for(let key in map){
                if(start_tend[key]){
                    label = label + start_tend[key] + map[key]
                }
            }
            label += '后起运';
            return label;
        },
        defaultPayload(state){
            return {
                datetime: timeFormat(new Date(state.timestamp),'yyyy-mm-dd hh:MM:ss'),
                gender: state.gender,
                sect: state.sect,
            }
        }
    }
});
