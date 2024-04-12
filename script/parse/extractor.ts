import * as cheerio from "cheerio";
import getURLTitle from "../utils/getURLTitle";
import { BedtimeNewsFrontmatter } from "../interfaces";
import { ImageSaver } from "../utils/imageSaver";
import { getRelativePath } from "..";
import path from "path";

const linkPattern = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
const wechat_img_pattern = /https:\/\/mmbiz.qpic.cn\/mmbiz_.*/
let imgCnt = 1
export const extractItem = async (frontmatter:BedtimeNewsFrontmatter,elem:any): Promise<string> => {
  let ans = ""
  if (elem?.data) {
    // 链接，先访问内容获取标题
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
          ans += await extractItem(frontmatter, item)
        }
      }else {
        // @ts-ignore
        return `**${cheerio.text(elem.children)}**`
      }
      return ans
    case "p":
    case "section":
      for (let item of elem.children) {
        ans += await extractItem(frontmatter,item)
      }
      return ans
    case "img":
      let src = elem.attribs["data-src"]
      let fn = `${frontmatter.category}_${frontmatter.index.toString().padStart(4,'0')}_${imgCnt}.png`
      imgCnt++
      const img = await ImageSaver.getInstance().saveImage({
        url:src,
        name:fn,
        tmpPath: path.join(getRelativePath(frontmatter),frontmatter.index.toString().padStart(4,'0')),
        index:frontmatter.index
      })
      ans +=`\n${img}\n`
      return ans
    case "span":
      for (let item of elem.children) {
        ans += await extractItem(frontmatter,item)
      }
      return ans
    case "h3":
      ans += "###"
    case "h2":
      ans += "##"
    case "h1":
      ans += "# " + await extractItem(frontmatter,elem.children) + "\n"
      return ans
    case "table":
      let text = "\n\n"
      // @ts-ignore
      for (let item of elem.children) {
        text += await extractItem(frontmatter,item)
      }
      return text
    case "tbody":
      let body = ""
      let w = elem.children[0].children.length
      body += `${await extractItem(frontmatter,elem.children[0])}\n`
      body += "|" + Array(w).fill("---").join("|") + "|\n";
      for (let item of elem.children.slice(1)) {
        body += await extractItem(frontmatter,item) + "\n";
      }
      return body
    case "tr":
      ans = "|"
      for (let item of elem.children) {
        ans += `${await extractItem(frontmatter,item)} |`
      }
      return ans
    case "td":
      // @ts-ignore
      ans += cheerio.text(elem.children)
      return ans
  }
  return ans
}