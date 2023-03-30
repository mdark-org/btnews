// @ts-ignore
import MarkdownIt from 'markdown-it'
import {contentMap} from "../scanfile";
// @ts-ignore
import path from "path";
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
    if (path.extname(link) != ".md") {
        return link
    }
    let filename = path.basename(link)
    let prefix = filename.split("_")[0]
    let id = filename.split("_")[1].replace(".md", "")
    // check 是否是mdlink
    let file = contentMap.get(filename)
    if (!file) {
        return link
    }
    if (env.frontmatter.type === "index") {
        return `/${prefix}/${id}/`
    }
    if (env.frontmatter.type === "archive") {
        return `/${prefix}/${id}/`
    }
    let date = file.frontmatter.date
    if (!date) {
        return link
    }
    let y = date.split("-")[0]
    let m = date.split("-")[1]
    let d = date.split("-")[2]
    return `/${prefix}/${y}/${m}/${d}/`
}