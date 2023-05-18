import {contentMap} from "../scanfile";
import {groupBy} from "../custom/node/utils";

type md = {
    path:string
    frontmatter: {
        date?:Date
        title?:string
    }
}
const zfill = (num, size) => {
    let s = num + ""
    while (s.length < size) s = "0" + s
    return s
}
let pagesGroupByDate = (pages:md[]) => {
    let year = groupBy(pages, page => {
        return page.frontmatter.date.getFullYear()+""
    })
    let yearKeys = Object.keys(year)
    let res = {}
    for(let i = 0; i < yearKeys.length; i++){
        res[yearKeys[i]] = groupBy(year[yearKeys[i]], page => {
            let month = page.frontmatter.date.getMonth()+1
            return yearKeys[i] + "/" + zfill(month,2)
        })
    }
    return res
}

const generateSidebarByDate = (mds:md[], prefix:string):any => {
    let datePage = pagesGroupByDate(mds)
    let yearSideBar = []
    for(let year in datePage){
        // todo 日期过滤
        if (year == undefined || !["2019","2020","2021","2022","2023"].includes(year)) {
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
                    let day = page.frontmatter.date.getDate()
                    return {
                        text: page.frontmatter.title,
                        link: `${zfill(day,2)}/`,
                    }
                })
            }
            yearSB.children.push(monthSB)
        }
        yearSideBar.push(yearSB)
    }
    return yearSideBar
}
// export const yearSB = []
export const yearSB = generateSidebarByDate(Array.from(contentMap.values()), "btnews")