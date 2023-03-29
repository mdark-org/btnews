import { defineUserConfig } from 'vuepress'
import { hopeTheme } from "vuepress-theme-hope";
import { searchProPlugin } from "vuepress-plugin-search-pro";
import { sidebarCfg } from "./sidebar";
import {replaceLink, rplink} from "./link";
import * as path from "path";
import {prepareArchivePages, prepareArchivePagesIndex, prepareDatePages, prepareDatePagesIndex} from "./page";
import {archiveNavbar} from "./categoryArchiveList";
export default defineUserConfig({
    lang: 'zh-CN',
    title: '睡前消息文稿集合',
    description: '睡前消息文稿集合，通过 whisper 模型进行语音识别，生成往期文稿集合',
    extendsMarkdown: (md) => {
        md.use(rplink,{replaceLink: replaceLink})
    },
    extendsPageOptions: (pageOptions, app) => {
        pageOptions.frontmatter = pageOptions.frontmatter ?? {}
        if (pageOptions.filePath?.startsWith(app.dir.source("btnews"))) {
            pageOptions.frontmatter.category = "睡前消息"
            let filename = path.basename(pageOptions.filePath)
            let id = filename.match(/[0-9]{3,4}/)?.at(0)
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
                text: "合集",
                icon: "lightbulb",
                children: archiveNavbar(),
            },

        ],
        sidebar: sidebarCfg,
        repo: "https://github.com/ktKongTong/btnews",
        docsBranch: "master",
        docsDir: "docs",
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
        searchProPlugin({
            indexContent: true,
        }),
    ],
})