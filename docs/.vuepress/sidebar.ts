import { sidebar } from "vuepress-theme-hope";
import {fs} from "@vuepress/utils";
import {createPage} from "vuepress";

type  opts = {
    exclude:RegExp[]
    match:RegExp[]
}
const scanDir = async (dir: string, options: opts): Promise<string[]> => {
    let result = []
    // 读取目录中的所有文件和子目录
    let files = await fs.readdir(dir);
    for (let file of files) {
        let path = dir + '/' + file;
        if (options.exclude.filter(exclude => path.match(exclude)).length > 0){
            continue
        }
        let stats = await fs.stat(path)
        if (stats.isDirectory()) {
            result.push(...await scanDir(path, options))
        }else if (options.match.filter(match => path.match(match)).length > 0) {
            result.push(path);
        }
    }
    return result;
}
// map
let groupBy = (array, f) => {
    let groups = {};
    array.forEach(function (o) {
        let group = f(o);
        groups[group] = groups[group] || [];
        groups[group].push(o);
    });
    return groups
}


type md = {
    path:string
    frontmatter: {
        date?:string
        title?:string
    }
}

let pagesGroupByDate = (pages:md[]) =>{
    let year = groupBy(pages, page => {
        return page.frontmatter.date?.split('-')[0]
    })
    let yearKeys = Object.keys(year)
    let res = {}
    for(let i = 0; i < yearKeys.length; i++){
        res[yearKeys[i]] = groupBy(year[yearKeys[i]], page => {
            return yearKeys[i] + "/" + page.frontmatter.date?.split('-')[1]
        })
    }
    return res
}

const generateSidebarByDate = (mds:md[], prefix:string):any[][] => {
    let datePage = pagesGroupByDate(mds)
    let yearSideBar = []
    for(let year in datePage){
        // todo 日期过滤
        if (year == undefined || !["2020","2021","2022","2023"].includes(year)) {
            continue
        }
        let yearSB = {
            text: year + "年",
            collapsible: true,
            // link: `/${prefix}/${year}/`,
            prefix: `/${prefix}/${year}/`,
            children: []
        }
        let months = datePage[year]
        for(let monthKey in months){
            let month = monthKey.split("/")[1]
            let monthSB = {
                text: `${year}年${month}月`,
                collapsible: true,
                // link: `/${prefix}/${year}/${month}/`,
                prefix: `/${prefix}/${year}/${month}/`,
                children: months[monthKey].map(page => {
                    let day = page.frontmatter.date.split('-')[2]
                    return {
                        text: page.frontmatter.title,
                        link: `${day}/`,
                    }
                })
            }
            yearSB.children.push(monthSB)
        }
        yearSideBar.push(yearSB)
    }
    return yearSideBar
}


const sb = async ():Promise<any> => {
    let res =await scanDir('./docs', {match: [/\.md$/], exclude: [/\.vuepress/]})
    let mds = res.map(path => {
        let frontmatter = {}
        let mdfile=fs.readFileSync(path, 'utf8')
        let match = mdfile.match(/^---\n([\s\S]+?)\n---/)
        if (match){
            let fm = match[1]
            let lines = fm.split('\n')
            lines.forEach(line => {
                let [key, value] = line.split(':')
                frontmatter[key.trim()] = value.trim()
            })
        }
        return {path: path,frontmatter: frontmatter}
    })
    return generateSidebarByDate(mds, "btnews")
}

// @ts-ignore
const yearSB = await sb()
// bfs yearSB
const prepareDateIndexPages = async (app): Promise<void> => {
    // 从
    let datePage = app.pages.filter(page => page.path.match(/^\/btnews\/20[1,2][0-9]\/[0,1][0-9]\//))
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
            path: `/btnews/${year}/${(m<10) ? "0" + m:m}/`,
            frontmatter: {
                title: `${year}年${(m<10) ? "0" + m:m}月`,
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
            path: `/btnews/${year}/`,
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



export const sidebarCfg = sidebar({
    "/" : "structure",
    "/btnews/2019": yearSB,
    "/btnews/2020": yearSB,
    "/btnews/2021": yearSB,
    "/btnews/2022": yearSB,
    "/btnews/2023": yearSB,
})



export default prepareDateIndexPages