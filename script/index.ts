import { getArticle } from "./utils/getArticleMetaFromMP";
import { buildFrontmatter } from './utils/frontmatter';
import parseHTMLtoMD from './parse';
import fs from 'fs'
import path from "path";
import 'dotenv/config'
import * as ghac from '@actions/core';
import { Command } from 'commander';
import { indexToRange, msg } from "./utils";
import { BedtimeNewsFrontmatter } from "./interfaces";
import * as cheerio from "cheerio";
import {extractFrontMatter} from "./parse/frontmatter";

require('dotenv').config()
const isGitHubAction = process.env.GITHUB_ACTIONS
export const bizId = process.env.MP_BIZ_ID as string
export const albumId = process.env.MP_ALBUM_ID as string
export const imageSavePolicy = process.env.IMAGE_SAVE_POLICY as string
export const imageStorageHost = process.env.IMAGE_STORAGE_HOST as string
export const imageStorageToken = process.env.IMAGE_STORAGE_TOKEN as string
console.log(`bizId: ${bizId}`)
console.log(`albumId: ${albumId}`)
console.log(`imageSavePolicy`, imageSavePolicy)
console.log(`imageStorageHost`, imageStorageHost)
console.log(`imageStorageToken`, imageStorageToken)

export interface Options {
    url?:string,
    bv?:string,
    yt?:string,
    wb?:string,
    xg?:string,
    title?: string,
    date?: string,
    path?:string,
    overwrite?:boolean,
    localDir:string,
    ghac:boolean,
    index?: string,
    category?: string,
}

const program = new Command();
function getOptions() {
    program
      .option('--bv [string]')
      .option('--yt [string]')
      .option('--wb [string]')
      .option('--xg [string]')
      .option('--url [string]')
      .option('--type [string]')
      .option('--title [string]')
      .option('--date [string]')
      .option('--path [string]')
      .option('--index [string]')
      .option('--local-dir [string]')
      .option('--ghac')
      .option('--category [string]', 'category')
      .option('-o, --overwrite [boolean]');55

    const options = program.opts();
    program.parse(process.argv);
    console.log(options)

    const url = options.url!==""?(typeof options.url == "boolean" ?undefined:options.url):undefined;
    const bv = options.bv!==""?(typeof options.bv == "boolean" ?undefined:options.bv):undefined;
    const yt = options.yt!==""?(typeof options.yt == "boolean" ?undefined:options.yt):undefined;
    const wb = options.wb!==""?(typeof options.wb == "boolean" ?undefined:options.wb):undefined;
    const xg = options.xg!==""?(typeof options.xg == "boolean" ?undefined:options.xg):undefined;
    const title = options.title!==""?(typeof options.title == "boolean" ?undefined:options.title):undefined;
    const path = options.path!==""?(typeof options.path == "boolean" ?undefined:options.path):undefined;
    const date = options.date!==""?(typeof options.date == "boolean" ?undefined:options.date):undefined;
    const category = options.category!==""?(typeof options.category == "boolean" ?undefined:options.category):undefined;
    const index = options.index!==""?(typeof options.index == "boolean" ?undefined:options.index):undefined;
    let overwrite = false
    if (options.overwrite!==undefined) {
        if (options.overwrite == "false") {
            overwrite = false
        }else if (options.overwrite == "true") {
            overwrite = true
        }else {
            overwrite = options.overwrite
        }
    }
    const ghac = options.ghac !== undefined;
    let localDir = "."
    if (options.localDir!==undefined) {
        localDir = options.localDir
    }
    return {
        url,bv,yt,wb,xg,overwrite,localDir,ghac,title,path,date,category,index
    }
}


export const options = getOptions()
console.log(options)


async function fetchFromSpecifiedURL(url:string,options:Options) {
    let articleHTML = await (await fetch(url)).text()
    let $ = cheerio.load(articleHTML)
    let frontmatter = await extractFrontMatter($,options)
    return {
        frontmatter,
        articleHTML:$
    }
}

async function fetchFromTag(options:Options) {
    const res = await getArticle(bizId,albumId,1)
    if (res == null) {
        throw new Error("获取文章失败")
    }
    let frontmatter = await buildFrontmatter(res,options)

    let articleHTML = cheerio.load(await (await fetch(res.url)).text())
    return {
        frontmatter,
        articleHTML
    }
}

async function fetchByOptions(options:Options) {
    if (options.url) {
        return await fetchFromSpecifiedURL(options.url,options)
    }
    return await fetchFromTag(options)
}

export function getRelativePath(frontmatter:BedtimeNewsFrontmatter) {
    let relativePath = `btnews/${frontmatter.category}`
    // if(frontmatter.category !== 'opinion' && frontmatter.category !== 'commercial'){
    relativePath = path.join(relativePath, indexToRange(parseInt(frontmatter.index)))
    // }
    return relativePath
}

function buildPrefix(frontmatter:BedtimeNewsFrontmatter, options:Options) {
    let prefixTemplate = `---
title: ${frontmatter.title}
description: ${frontmatter.description}
tag: []
date: ${frontmatter.date}
category: ${frontmatter.category}
ytid: ${frontmatter.ytid}
bvid: ${frontmatter.bvid}
---
`
    return prefixTemplate
}

async function main() {
    const {frontmatter,articleHTML} = await fetchByOptions(options)
    console.log(frontmatter)
    if (isGitHubAction) {
        ghac.setOutput('branch', `${frontmatter.category}-${frontmatter.index}`);
        ghac.setOutput('title', frontmatter.title);
        ghac.setOutput('date', frontmatter.date);
        ghac.setOutput('category', frontmatter.category);
    }
    let relativePath = getRelativePath(frontmatter)
    let targetPath = path.join("docs",relativePath, `${frontmatter.category}_${frontmatter.index.toString().padStart(4,'0')}.md`)
    if(options.path) {
        targetPath = options.path
    }
    let repoRawContentBase = `https://raw.githubusercontent.com/ktKongTong/btnews/master`
    let outputUrl = `${repoRawContentBase}/${targetPath}`
    console.log("fetch")
    let response = await fetch(outputUrl)
    if (response.status == 200 && !options.overwrite) {
        console.log(targetPath,"已存在")
        if(isGitHubAction) {
            ghac.setOutput('return', true);
        }
        return
    }
    if (isGitHubAction) {
        ghac.setOutput('return', false);
    }
    console.log("prepare to parse")
    let parserResult = await parseHTMLtoMD(articleHTML,frontmatter)
    let filepath = `${options.localDir}/${path.dirname(targetPath)}`
    console.log(filepath)
    if (!fs.existsSync(filepath)) {
        fs.mkdirSync(filepath,{
            recursive: true
        });
    }
    fs.writeFileSync(path.resolve(filepath,path.basename(targetPath)),buildPrefix(frontmatter,options)+parserResult)
    if (isGitHubAction) {
        ghac.setOutput('msg', msg);
    }
}

main()