import * as cheerio from 'cheerio'
import {MDImage, ParserResult} from "../type";
import {extractItem} from "./contentExtractor";


export const parserToMd = async (title: string, date: string, articleHTML: string, pathPrefix: string, imgPath: string):Promise<ParserResult> => {
    const $ = cheerio.load(articleHTML);
    const content = $("#js_content")
    const children = content.children()
    let mdContent = `---\ntitle: ${title}\ndate: ${date}\n---\n`
    let images:MDImage[] = []
    for (let child of children) {
        mdContent +="\n\n" + await extractItem(child, pathPrefix, imgPath,images)
    }
    return {
        content:mdContent,
        images: images
    }
}
