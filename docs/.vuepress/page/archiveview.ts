import {createPage} from "vuepress";
import {groupBy} from "../utils";
import {categoryArchiveList} from "../categoryArchiveList";

export const prepareArchivePages = async (app): Promise<void> => {
    let pageToBeGenerated = []
    categoryArchiveList.forEach(category => {
        category.archiveList.forEach(archive => {
            archive.content.forEach(archiveItem=>{
                let id = archiveItem.match(/\d{3,4}/)[0]
                let page = app.pages.find(p => p.path === `/${category.category}/${id}/`)
                if (page === undefined) {
                    return
                }
                let frontmatter = page.frontmatter ?? {}
                frontmatter.permalink = `/${category.category}/archive/${archive.name}/${id}`
                frontmatter.type = "archive"
                frontmatter.archive = archive.name
                pageToBeGenerated.push({
                    path: frontmatter.permalink,
                    frontmatter: frontmatter,
                    content:page.content
                })
            })
        })
    })
    await Promise.all(
        Array.from(pageToBeGenerated).map((page) => {
            return createPage(app, page);
        })
    ).then((pages) => {
        app.pages.push(...pages);
    });
}
// 目录页面
export const prepareArchivePagesIndex = async (app): Promise<void> => {
    let archivePage = app.pages.filter(page => page.path.match(/^\/btnews\/archive\/.*\/\d{3,4}/))
    // 按 archive name 分组
    let archives = groupBy(archivePage, page=>{
        return page.frontmatter.archive
    })
    let pageToBeGenerated = new Set()
    for (let i in archives) {
        let item = archives[i]
        let res = {
            path: `/btnews/archive/${i}/`,
            frontmatter: {
                title: i,
            },
            content: ``
        }
        for (let i = 0; i <item.length; i++) {
            res.content += `\n### [${item[i].frontmatter.title}](${item[i].path})`
        }
        pageToBeGenerated.add(res)
    }
    await Promise.all(
        Array.from(pageToBeGenerated).map((page) => {
            return createPage(app, page);
        })
    ).then((pages) => {
        app.pages.push(...pages);
    });
}