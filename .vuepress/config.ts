
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
import { commentPlugin } from './waline';
import { videoPlugin } from './video';
import { prepareHomePage } from './homepage';
// import path from "path";
import { getDirname, path } from "@vuepress/utils";
const __dirname = getDirname(import.meta.url);
export default defineUserConfig({
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
    pagePatterns:[
    '**/*.md', 
    '!**/README.md', 
    '!.*',
    '!node_modules',
    '!backup',
    '!docs',
    '!images',
    '!README.md',
],
    lang: 'zh-CN',
    title: '睡前消息文稿合集',
    head: [
        ['link', { rel: 'icon', href: '/images/favicon.png' }],
        ['meta', { name: 'keywords', content: '睡前消息文稿合集,睡前消息,合集,bedtimenews,btnews'}],

        ],
    description: '睡前消息文稿合集',
    shouldPrefetch:false,
    extendsMarkdown: (md) => {
        md.use(rplink,{replaceLink: replaceLink})
    },
    extendsPageOptions: (pageOptions, app) => {
        pageOptions.frontmatter = pageOptions.frontmatter ?? {}
        if (pageOptions.filePath?.startsWith(app.dir.source("btnews"))) {
            let id = util.getIdFromFilename(pageOptions.filePath)
            if (!id) {
                return
            }
            id = id?.replace("_", ".")
            pageOptions.frontmatter.permalink = `/btnews/idx/${id}/`
            pageOptions.frontmatter.idx = id
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
        await prepareHomePage(app)
    },

    theme: hopeTheme({
        logo: "/images/favicon.png",
        fullscreen: true,
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
        blog: {
            sidebarDisplay:"none"
        },
        plugins: {
            blog: true,        
            comment: {
                provider: "Waline",
                serverURL: "https://waline-btnews.vercel.app/",
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
    },{
        custom:true
    }),
    plugins: [
        googleAnalyticsPlugin({
            id: "G-Q682X1H6PN",
            debug: false
          }),
        searchProPlugin({
            indexContent: true,
        }),
        commentPlugin({
                serverURL: "https://waline-btnews.vercel.app/",
            },),
        videoPlugin({}),
    ],
    clientConfigFile: path.join(__dirname, "./client.ts"),
    alias: {
        "@theme-hope/modules/blog/components/TagList": path.resolve(
          __dirname,
          "./components/TagList.vue"
        ),
        "@theme-hope/modules/info/components/TagInfo": path.resolve(
          __dirname,
          "./components/PageTag.vue"
        ),
      },
})
