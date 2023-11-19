import * as cheerio from 'cheerio'
import {MDImage, ParserResult} from "../type";
import {extractItem} from "./contentExtractor";
interface Frontmatter {
    title: string,
    date: string,
    description: string,
    tags: string[],
    cnt: string
}

export const parserToMd = async (frontmatter:Frontmatter, articleHTML: string, pathPrefix: string, imgPath: string):Promise<ParserResult> => {
    const $ = cheerio.load(articleHTML);
    const content = $("#js_content")
    const children = content.children()
    let mdContent = 
    `---
title: ${frontmatter.title}
date: ${frontmatter.date}
description: ${frontmatter.description}
tags: [${frontmatter.tags.join(",")}]
---
`
    let images:MDImage[] = []
    for (let child of children) {
        mdContent += await extractItem(frontmatter.cnt,child, pathPrefix, imgPath,images)
    }
    // remove redundant \n
    mdContent = mdContent.replace(/\n\n\n/g,"\n\n")

    return {
        content:mdContent,
        images: images
    }
}
