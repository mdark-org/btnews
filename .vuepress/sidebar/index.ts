import {sidebar} from "vuepress-theme-hope";
import {archiveSideBar} from "./archive";
import {yearSB} from "./date";

export const sidebarCfg = sidebar({
    "/" : "structure",
    "/btnews/2019/": yearSB,
    "/btnews/2020/": yearSB,
    "/btnews/2021/": yearSB,
    "/btnews/2022/": yearSB,
    "/btnews/2023/": yearSB,
    "/btnews/archive/":archiveSideBar(),
})

