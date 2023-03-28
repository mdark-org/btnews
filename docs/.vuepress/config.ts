import { defineUserConfig } from 'vuepress'
import { hopeTheme } from "vuepress-theme-hope";
import { searchProPlugin } from "vuepress-plugin-search-pro";
import {archiveRouterPlugin} from "./router";
import { sidebarCfg } from "./sidebar";
export default defineUserConfig({
    lang: 'zh-CN',
    title: '睡前消息文稿集合',
    description: '睡前消息文稿集合，通过 whisper 模型进行语音识别，生成往期文稿集合',
    theme: hopeTheme({
        navbar: [
            {
                text: "索引",
                link: "/",
                icon: "lightbulb",
            },
            {
                text: "2020",
                link: "/btnews/2020/",
            },
            {
                text: "2021",
                link: "/btnews/2021/",
            },
            {
                text: "2022",
                link: "/btnews/2022/",
            },
            {
                text: "标签",
                link: "/tag",
                icon: "lightbulb",
            },
            {
                text: "分类",
                link: "/category",
                icon: "lightbulb",
            },
            // {
            //     text: "合集",
            //     icon: "lightbulb",
            //     children: [{
            //         text:"高流说航天",
            //         link: "/btnews/archive/高流说航天",
            //         },
            //         {
            //             text:"新朋友正威集团",
            //             link: "/btnews/archive/新朋友正威集团",
            //         }
            //     ]
            // },

        ],
        repo: "https://github.com/ktKongTong/btnews",
        sidebar: sidebarCfg,
        plugins: {
            blog: true,
            mdEnhance: {
                tabs: true,
            },
            components: {
                components: [
                    "BiliBili",
                    "YouTube",
                    "XiGua"
                ],
            }
        }
    }),
    plugins: [
        archiveRouterPlugin(),
        searchProPlugin({
            indexContent: true,
        }),
    ],
})