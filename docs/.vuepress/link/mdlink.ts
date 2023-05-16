// @ts-ignore
import MarkdownIt from 'markdown-it'
import {contentMap} from "../scanfile";
// @ts-ignore
import path from "path";
import {getCategoryFromFilename, getIdFromFilename, getIndependentIdFromFilename} from "../utils";
// export const mdlink = (md: MarkdownIt, options: any) => {
//     md.core.ruler.after('inline', 'mdlink', (state) => {
//         let tokens = state.tokens
//         tokens.forEach((token, index) => {
//             if (token.type === 'inline') {
//                 let children = token.children
//                 children.forEach((child, index) => {
//                     if (child.type === 'link_open') {
//                         let href = child.attrGet('href')
//                         if (href.startsWith('mdlink:')) {
//                             let id = href.slice(7)
//                             let info = contentMap[id]
//                             if (info) {
//                                 child.attrSet('href', info.frontmatter.permalink)
//                             }
//                         }
//                     }
//                 })
//             }
//         })
//     })
// }
// 替换 markdown 中对其他文件的引用链接
export const replaceLink =  function (link, env, token, htmlToken) {
    if (path.isAbsolute(link)){
        return link
    }
    const imageExtensions = ['.jpg', '.png', '.gif', '.svg', '.tif', '.GIF', '.jpeg', '.webp','.jfif','.emf','.tiff']
    if (imageExtensions.includes(path.extname(link))){
        return replaceImageLink(link, env, token, htmlToken)
    }
    if (path.extname(link) != ".md") {
        return link
    }
    let category = getCategoryFromFilename(link)
    let file = contentMap.get(getIndependentIdFromFilename(link))
    let id = getIdFromFilename(link)
    if (!file) {
        return link
    }
    if (env.frontmatter.type === "index") {
        return `/${category}/${id}/`
    }
    if (env.frontmatter.type === "archive") {
        return `/${category}/${id}/`
    }
    let date = file.frontmatter.date
    if (!date) {
        return link
    }
    let y = date.split("-")[0]
    let m = date.split("-")[1]
    let d = date.split("-")[2]
    return `/${category}/${y}/${m}/${d}/`
}

const replaceImageLink = (link, env, token, htmlToken):string =>{
    if (!link.startsWith("/")){
        return "https://cdn.jsdelivr.net/gh/ktKongTong/btnews@master/docs/.vuepress/public/"+link
    }
    return link
}