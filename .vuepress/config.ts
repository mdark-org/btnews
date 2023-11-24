
import { defineUserConfig } from 'vuepress'
import { viteBundler } from '@vuepress/bundler-vite'
import { hopeTheme } from "vuepress-theme-hope";
import { searchProPlugin } from "vuepress-plugin-search-pro";
import { googleAnalyticsPlugin } from "@vuepress/plugin-google-analytics";

import {archiveNavbar} from "./archives";
import { sidebarCfg } from "./sidebar";
import { customPlugin } from './custom';
export default defineUserConfig({
    lang: 'zh-CN',
    title: '睡前消息文稿合集',
    description: '睡前消息文稿合集',
    head: [
        ['link', { rel: 'icon', href: '/images/favicon.png' }],
        ['meta', { name: 'keywords', content: '睡前消息文稿合集,睡前消息,合集,bedtimenews,btnews'}],
    ],
    pagePatterns:['**/*.md',  '!**/README.md', '!.*', '!node_modules','!images', '!README.md',],
    bundler: viteBundler({
        viteOptions: {
            experimental: {
                renderBuiltUrl(filename: string, {hostId, hostType, type}: {
                    hostId: string,
                    hostType: 'js' | 'css' | 'html',
                    type: 'public' | 'asset'
                }) {
                    if(filename.startsWith("images")) {
                        return 'https://cdn.jsdelivr.net/gh/ktKongTong/btnews@master/' + filename
                    }
                }
            },
        },
    }),

    shouldPrefetch:false,
    theme: hopeTheme({
        logo: "/images/favicon.png",
        hostname: "https://btnews.ktlab.io",
        navbar: [
            {
                text: "索引",
                link: "/btnews/idx/",
                icon: "lightbulb",
            },
            {
                text: "2019",
                link: "/btnews/2019/",
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
                text: "2023",
                link: "/btnews/2023/",
            },
            {
                text: "标签",
                link: "/tag",
                icon: "lightbulb",
            },
            {
                text: "合集",
                icon: "lightbulb",
                children: archiveNavbar(),
            },

        ],
        sidebar: sidebarCfg,
        sidebarSorter: "date",
        repo: "https://github.com/ktKongTong/btnews",
        docsBranch: "master",
        docsDir: "docs",
        pageInfo:["Date", "ReadingTime", "Tag"],
        blog: {
            sidebarDisplay:"none"
        },
        plugins: {
            blog: {
                excerptFilter: (page): boolean => {
                    return page.frontmatter.description == undefined
                }
            },        
            comment: {
                provider: "Waline",
                serverURL: "https://waline-btnews.vercel.app/",
                login:'disable',
                emoji: ['//unpkg.com/@waline/emojis@1.1.0/weibo','//unpkg.com/@waline/emojis@1.1.0/weibo',
                        '//unpkg.com/@waline/emojis@1.1.0/bilibili','//unpkg.com/@waline/emojis@1.1.0/tieba',
                        '//unpkg.com/@waline/emojis@1.1.0/qq']
            },
            autoCatalog:{
                shouldIndex(page) {
                    return page.frontmatter.type === "index"
                },
                exclude: [
                ],
                orderGetter: (page) => {
                    let date = page.date
                    if (date === undefined) {
                        return 0
                    }
                    let [year, month, day] = date.split("-")
                    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).getTime()
                }
            },
            mdEnhance: {
                tabs: true,
                figure: true,
                imgLazyload: true,
                imgMark: true,
                imgSize: true,
            },
            components: {
                components: ["BiliBili","YouTube","XiGua"],
            },
            feed:{
                rss: true,
                filter: ({ frontmatter }):boolean => frontmatter.type === "index",
            },
            readingTime:{

            }
        }
    },{
        custom:true
    }),
    plugins: [
        googleAnalyticsPlugin({
            id: "G-Q682X1H6PN",
            debug: false
          }),
        // searchProPlugin({
        //     indexContent: true,
        // }),
        customPlugin,
    ],
})
