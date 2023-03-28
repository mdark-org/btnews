import * as path from "path";
import {createPage} from "vuepress";
import prepareDateIndexPages from "./sidebar";

export const archiveRouterPlugin = () => {
    return (app) => {
        return {
            name: 'archive-router-plugin',
            extendsPageOptions: (pageOptions, app) => {
                pageOptions.frontmatter = pageOptions.frontmatter ?? {}
                if (pageOptions.filePath?.startsWith(app.dir.source("btnews"))) {
                    pageOptions.frontmatter.category = "睡前消息"
                    let filename = path.basename(pageOptions.filePath)
                    let id = filename.match(/[0-9]{3,4}/)?.at(0)
                    pageOptions.frontmatter.permalink = `/btnews/${id}/`
                }
            },
            onInitialized: async (app): Promise<void> => {
                // 生成年月目录
                let pages = app.pages.filter(page => page.path.match(/\/btnews\/[0-9]{3,4}/))
                for (let i = 0; i < pages.length; i++) {
                    const page = pages[i];
                    let frontmatter = page.frontmatter ?? {}
                    if (page.frontmatter.date == undefined) {
                        continue
                    }
                    let date = page.frontmatter.date;
                    let d = date.getDate();
                    let m = date.getMonth() + 1;
                    let y = date.getFullYear();
                    frontmatter.permalink = `/btnews/${y}/${(m<=9 ? '0' + m : m)}/${(d <= 9 ? '0' + d : d)}/`
                    let p = await createPage(app, {
                        path: frontmatter.permalink,
                        frontmatter: frontmatter,
                        content:page.content
                    })
                    app.pages.push(p)
                }
                await prepareDateIndexPages(app)


                // 绝对路径？
                // /qcnews  快评新闻
                // /refnews 参考消息
                // /btnews  睡前消息
                // /growplace 生长的地方
                // /everthsource 万物由来


                // /btnews/0012, 通过 permalinkPattern 生成
                // /btnews/2021/
                // /btnews/2021/01/
                // /archive 自定义合集
                // /archive/高流说航天
                // /archive/戈尔巴乔夫
                // /archive/ai与新闻...
                // tag 关键词？
                return Promise.resolve()
            },
        }
    }
}