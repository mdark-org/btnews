import { defineUserConfig } from 'vuepress'
import { hopeTheme } from "vuepress-theme-hope";
import { searchProPlugin } from "vuepress-plugin-search-pro";
import { autoCatalogPlugin } from "vuepress-plugin-auto-catalog";
// @ts-ignore
// @ts-ignore
// @ts-ignore
export default defineUserConfig({
    lang: 'zh-CN',
    title: '睡前消息文稿集合',
    description: '睡前消息文稿集合，通过 whisper 模型进行语音识别，生成往期文稿集合',
    extendsPageOptions: (pageOptions, app) => {

            // pageOptions.frontmatter = pageOptions.frontmatter ?? {}
            // pageOptions.frontmatter.permalinkPattern = '/:year/:month/:day'
    },
    theme: hopeTheme({
        navbar: [
            {
                text: "目录",
                link: "/",
                icon: "lightbulb",
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
            {
                text: "合集",
                children: [{
                    text: "2020",
                    link: "/index/2020",
                }, {
                    text: "2021",
                    link: "/index/2021",
                },
                {
                    text: "2022",
                    link: "/index/2022",
                },
                ],
            },
        ],
        repo: "https://github.com/ktKongTong/btnews",
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
        // autoCatalogPlugin(),
        searchProPlugin({
            // 索引全部内容
            indexContent: true,
        }),
    ],
})