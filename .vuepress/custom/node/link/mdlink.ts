// @ts-ignore
import {contentMap} from "../../../scanfile";
// @ts-ignore
import path from "path";
import {getCategoryFromFilename, getIdFromFilename, getIndependentIdFromFilename} from "../utils";
// 替换 markdown 中对其他文件的引用链接
export const replaceLink =  function (link, env, token, htmlToken) {
    if(link.startsWith("/images")){
        return replaceImageLink(link, env, token, htmlToken)        
    }
    if (path.isAbsolute(link)){
        return link
    }
    const imageExtensions = ['.jpg', '.png', '.gif', '.svg', '.tif', '.GIF', '.jpeg', '.webp','.jfif','.emf','.tiff']
    if (link.startsWith("/images") || imageExtensions.includes(path.extname(link))){
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
    let date = file.frontmatter.date as Date
    if (!date) {
        return link
    }
    
    let y = date.getFullYear()
    let m = date.getMonth() + 1
    let d = date.getDate() 
    return `/${category}/${y}/${zfill(m,2)}/${zfill(d,2)}/`
}
const zfill = (num, size) => {
    let s = num + ""
    while (s.length < size) s = "0" + s
    return s
}

const replaceImageLink = (link, env, token, htmlToken):string =>{
    if (!link.startsWith("/")){
        return "https://cdn.jsdelivr.net/gh/ktKongTong/btnews@master/"+link
    }else if (link.startsWith("/images")){
        // console.log("replaceImageLink", link)
        return "https://cdn.jsdelivr.net/gh/ktKongTong/btnews@master"+link
    }
    return link
}