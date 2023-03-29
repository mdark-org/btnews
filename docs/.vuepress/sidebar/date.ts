import {contentMap} from "../scanfile";
import {groupBy} from "../utils";

type md = {
    path:string
    frontmatter: {
        date?:string
        title?:string
    }
}

let pagesGroupByDate = (pages:md[]) => {
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

const generateSidebarByDate = (mds:md[], prefix:string):any => {
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
            prefix: `/${prefix}/${year}/`,
            children: []
        }
        let months = datePage[year]
        for(let monthKey in months){
            let month = monthKey.split("/")[1]
            let monthSB = {
                text: `${year}年${month}月`,
                collapsible: true,
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

export const yearSB = generateSidebarByDate(Array.from(contentMap.values()), "btnews")