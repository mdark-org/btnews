import {createPage} from "vuepress";
import {groupBy} from "../utils";

export const prepareDatePages = async (category,app): Promise<void> => {
    let regStr = `^/${category}/idx/\\d{4}(.5)?`
    let pages = app.pages.filter(page => page.path.match(new RegExp(regStr, "g")))
    for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        // deep copy frontmatter to avoid side effect
        let frontmatter = page.frontmatter ?? {}
        if (page.frontmatter.date == undefined) {
            continue
        }
        frontmatter = JSON.parse(JSON.stringify(frontmatter))
        let date = page.frontmatter.date;
        let d = date.getDate();
        let m = date.getMonth() + 1;
        let y = date.getFullYear();
        frontmatter.permalink = `/${category}/${y}/${(m<=9 ? '0' + m : m)}/${(d <= 9 ? '0' + d : d)}/`
        frontmatter.type = "date"
        frontmatter.commentID = frontmatter?.commentID

        let p = await createPage(app, {
            path: frontmatter.permalink,
            frontmatter: frontmatter,
            content:page.content
        })
        app.pages.push(p)
    }
    await prepareDatePagesIndex(category,app)
}

export const prepareDatePagesIndex = async(category,app): Promise<void> => {
    let regStr = `^/${category}/\\d{4}/\\d{2}/\\d{2}/`
    let datePage = app.pages.filter(page => page.path.match(new RegExp(regStr, "g")))
    // 按年分组
    let year = groupBy(datePage, page => {
        return page.frontmatter.date.getFullYear()
    })
    let yearKeys = Object.keys(year)
    let res = {}
    for (let i = 0; i < yearKeys.length; i++) {
        res[yearKeys[i]] = groupBy(year[yearKeys[i]], page => {
            let m = page.frontmatter.date.getMonth() + 1
            return yearKeys[i] + "/" + (m < 10 ? "0" + m : m)
        })
    }
    let pageToBeGenerated = new Set()
    const generateMonthPage = (month): any => {
        let page = month[0]
        let year = page.frontmatter.date.getFullYear()
        let m = page.frontmatter.date.getMonth() + 1
        let res = {
            path: `/${category}/${year}/${(m < 10) ? "0" + m : m}/`,
            frontmatter: {
                title: `${year}年${(m < 10) ? "0" + m : m}月`,
            },
            content: ``
        }
        for (let i = 0; i < month.length; i++) {
            res.content += `\n### [${month[i].frontmatter.title}](${month[i].path})`
        }
        return res
    }
    for (let year in res) {
        let page = {
            path: `/${category}/${year}/`,
            frontmatter: {
                title: `${year}年`,
            },
            content: `# ${year}年`
        }
        for (let month in res[year]) {
            let monthPage = generateMonthPage(res[year][month])
            page.content += `\n## [${monthPage.frontmatter.title}](${monthPage.path})`
            page.content += monthPage.content
            pageToBeGenerated.add(monthPage)
        }
        pageToBeGenerated.add(page)
    }
    await Promise.all(
        Array.from(pageToBeGenerated).map((page) => {
            return createPage(app, page);
        })
    ).then((pages) => {
        app.pages.push(...pages);
    });
}
