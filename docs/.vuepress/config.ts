import { defineUserConfig } from 'vuepress'
import { viteBundler } from '@vuepress/bundler-vite'
import { hopeTheme } from "vuepress-theme-hope";
import { searchProPlugin } from "vuepress-plugin-search-pro";
import { sidebarCfg } from "./sidebar";
import {replaceLink, rplink} from "./link";
import {prepareArchivePages, prepareArchivePagesIndex, prepareDatePages, prepareDatePagesIndex} from "./page";
import {archiveNavbar} from "./categoryArchiveList";
import * as util from "./utils";
import { googleAnalyticsPlugin } from "@vuepress/plugin-google-analytics";
// import * as path from "path";
// import fs from 'fs'

// function stripImage () {
//     return {
//       name: 'strip-image',
//       resolveId (source) {
//         return source === 'virtual-module' ? source : null
//       },
//       renderStart (outputOptions, inputOptions) {
//         const outDir = outputOptions.dir;
//         const imageDir = path.resolve(outDir, 'images');
//         fs.rm(imageDir, { recursive: true }, () => console.log(`Deleted ${imageDir}`))
//       }
//     }
//   }

export default defineUserConfig({
    bundler: viteBundler({
        viteOptions: {
            // plugins:[stripImage()],
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
    lang: 'zh-CN',
    title: '睡前消息文稿合集',
    head: [
        ['link', { rel: 'icon', href: '/images/favicon.png' }],
        ['meta', { name: 'keywords', content: '睡前消息文稿合集,睡前消息,合集,bedtimenews,btnews'}],

        ],
    description: '睡前消息文稿合集',
    shouldPrefetch:(file, type) => {
        // console.log("file", file)
        // console.log("type", type)
        return false
    },
    extendsMarkdown: (md) => {
        md.use(rplink,{replaceLink: replaceLink})
    },
    extendsPageOptions: (pageOptions, app) => {
        pageOptions.frontmatter = pageOptions.frontmatter ?? {}
        if (pageOptions.filePath?.startsWith(app.dir.source("btnews"))) {
            // pageOptions.frontmatter.category = "睡前消息"
            // let filename = path.basename(pageOptions.filePath)
            let id = util.getIdFromFilename(pageOptions.filePath)
            id = id?.replace("_", ".")
            pageOptions.frontmatter.permalink = `/btnews/${id}/`
            pageOptions.frontmatter.type = "index"
        }
    },
    onInitialized: async (app): Promise<void> => {
        // 生成年月视图的 page
        await prepareDatePages(app)
        await prepareDatePagesIndex(app)
        // 生成合集 page
        await prepareArchivePages(app)
        await prepareArchivePagesIndex(app)
    },

    theme: hopeTheme({
        logo: "/images/favicon.png",
        fullscreen: true,
        themeColor: {
            blue: "#2196f3",
            // red: "#f26d6d",
            // green: "#3eaf7c",
            // orange: "#fb9b5f",
        },

        navbar: [
            {
                text: "索引",
                link: "/btnews/",
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
        blog: {
            sidebarDisplay:"none"
        },
        plugins: {
            blog: true,
            autoCatalog:{
                shouldIndex(page) {
                    return page.frontmatter.type === "index"
                },
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
                // 启用 figure
                figure: true,
                // 启用图片懒加载
                imgLazyload: true,
                // 启用图片标记
                imgMark: true,
                // 启用图片大小
                imgSize: true,
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
        googleAnalyticsPlugin({
            id: "G-Q682X1H6PN",
            debug: false
          }),
        searchProPlugin({
            indexContent: true,
        }),
    ],
})
