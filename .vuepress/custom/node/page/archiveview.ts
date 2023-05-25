import {createPage} from "vuepress";
import {groupBy} from "../utils";

export const prepareArchivePages = async (categoryArchiveList, app): Promise<void> => {
    let pageToBeGenerated:any = []
    categoryArchiveList.forEach(category => {
        category.archiveList.forEach(archive => {
            archive.content.forEach(archiveItem=>{
                let fileId = archiveItem.match(/\d{4}(_5)?/)
                if (fileId === null) {
                    return
                }
                let id = fileId[0].replace("_", ".")
                let page = app.pages?.find(p => p.path === `/${category.category}/idx/${id}/`)
                if (page === undefined) {
                    return
                }
                // deep copy frontmatter to avoid side effect
                let frontmatter = page.frontmatter ?? {}
                frontmatter = JSON.parse(JSON.stringify(frontmatter))
                frontmatter.permalink = `/${category.category}/archive/${archive.name}/${id}`
                frontmatter.type = "archive"
                frontmatter.archive = archive.name
                frontmatter.commentID = frontmatter?.commentID
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
    categoryArchiveList.forEach(async ({ category }) => {
        await prepareArchivePagesIndex(category, app);
    })
}
// 目录页面
export const prepareArchivePagesIndex = async (category:string,app): Promise<void> => {
    
    let regStr = `^/${category}/archive/.*/\\d{4}(_5)?`
    let archivePage = app.pages.filter(page => page.path.match(new RegExp(regStr, "g")))
    let archives = groupBy(archivePage, page=>{
        return page.frontmatter.archive
    })
    let pageToBeGenerated = new Set()

    let archiveIndexPage = {
        path: `/${category}/archive/`,
        frontmatter: {
            title: "Archive",
        },
        content: ``
    }
    for (let i in archives) {
        let item = archives[i]
        let res = {
            path: `/${category}/archive/${i}/`,
            frontmatter: {
                title: i,
            },
            content: ``
        }
        for (let i = 0; i <item.length; i++) {
            res.content += `\n### [${item[i].frontmatter.title}](${item[i].path})`
        }
        archiveIndexPage.content += `\n### [${i}](${res.path})`
        pageToBeGenerated.add(res)
    }
    pageToBeGenerated.add(archiveIndexPage)
    await Promise.all(
        Array.from(pageToBeGenerated).map((page) => {
            return createPage(app, page);
        })
    ).then((pages) => {
        app.pages.push(...pages);
    });
}