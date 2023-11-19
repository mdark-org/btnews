import * as cheerio from "cheerio";
import {v4 as uuidv4} from "uuid";
import path from "path";
import {MDImage} from "../type";
import {getURLTitle} from "./getURLTitle";
const linkPattern = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
const wechat_img_pattern = /https:\/\/mmbiz.qpic.cn\/mmbiz_.*/

let imgCnt = 1
// @ts-ignore
export const extractItem = async (cnt:string,elem,pathPrefix:string,imgPath:string,images:MDImage[]): string => {
    let ans = ""
    if (elem?.data) {
        // 文本匹配，如果文本是链接，先访问内容获取标题
        if (linkPattern.test(elem.data)) {
            let title = await getURLTitle(elem.data)
            if (title == undefined || title == "") {
                title = elem.data
            }
            return `\n> [${title}](${elem.data})\n`
        }
        return elem.data
    }
    switch (elem.name) {
        case "br":
            return "\n\n"
        case "strong":
            // @ts-ignore
            if (cheerio.text(elem.children)==""){
                for (let item of elem.children) {
                    ans += await extractItem(cnt,item, pathPrefix, imgPath, images)
                }
            }else {
                // @ts-ignore
                return `**${cheerio.text(elem.children)}**`
            }
            return ans
        case "p":
        case "section":
            for (let item of elem.children) {
                ans += await extractItem(cnt,item, pathPrefix, imgPath, images)
            }
            return ans
        case "img":
            let src = elem.attribs["data-src"]
            // let fn = `${uuidv4()}.${getPicTypeByURL(src)}`
            let fn = `${cnt}_${imgCnt}.webp`
            let filePath = path.join(pathPrefix,imgPath,fn)
            imgCnt++
            images.push({url:src,savePath:filePath})
            ans +=`\n\n![](${path.join(imgPath,fn)})\n`
            return ans
        case "span":
            for (let item of elem.children) {
                ans += await extractItem(cnt,item,pathPrefix,imgPath,images)
            }
            return ans
        case "h3":
            ans += "#"
        case "h2":
            ans += "#"
        case "h1":
            ans += "# " + await extractItem(cnt,elem.children,pathPrefix,imgPath,images) + "\n"
            return ans
        case "table":
            let text = "\n\n"
            // @ts-ignore
            for (let item of elem.children) {
                text += await extractItem(cnt,item,pathPrefix,imgPath,images)
            }
            return text
        case "tbody":
            let body = ""
            let w = elem.children[0].children.length
            body += `${await extractItem(cnt,elem.children[0],pathPrefix,imgPath,images)}\n`
            body += "|" + Array(w).fill("---").join("|") + "|\n";
            for (let item of elem.children.slice(1)) {
                body += await extractItem(cnt,item,pathPrefix,imgPath,images) + "\n";
            }
            return body
        case "tr":
            ans = "|"
            for (let item of elem.children) {
                ans += `${await extractItem(cnt,item,pathPrefix,imgPath,images)} |`
            }
            return ans
        case "td":
            // @ts-ignore
            ans += cheerio.text(elem.children)
            return ans
    }
    return ans
}



const getPicTypeByURL = (url:string) => {
    if (!wechat_img_pattern.test(url)) {
        return "jpg";
    }
    let p = new RegExp("https://mmbiz.qpic.cn/mmbiz_[a-zA-Z]*/");
    // @ts-ignore
    let m = p.exec(url)[0].split("/")
    return  m[m.length - 2].split("_").pop();
}
