
import {getArticle} from "./article"
import {parserToMd} from "./parser";
import * as path from "path";
import {saveToMd} from "./saver";
import {SourceInfo} from "./type";
import { Command } from 'commander';
import * as ghac from '@actions/core';

const isGitHubAction = process.env.GITHUB_ACTIONS


let frontmatter = {
    title: "",
    date: "",
    description: "",
    tags: [],
    index: "0001",
    bvid: "",
    ytid: "",
}

const timestmapToStr = (ts:string) => {
    let date = new Date(parseInt(ts) * 1000);
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    let d = date.getDate();
    return `${y}-${m < 10 ? '0' + m : m}-${d < 10 ? ('0' + d) : d}`
}
const getTitle = (title:string):string => {
    let titlePattern = /睡前消息\d{3}期?文稿/
    let ans = titlePattern.exec(title)
    // @ts-ignore
    let g = ans["0"]
    let res = `【睡前消息${g.slice(4,7)}】${title.slice(g.length+1)}`
    frontmatter.index = "0"+g.slice(4,7)
    if (isGitHubAction) {
        ghac.setOutput('index', frontmatter.index);
    }
    return res
}
const getRangeById = (id:string):string => {
    let i = parseInt(id);
    let start = Math.floor(i / 100);
    if (i % 100 == 0) {
        start -= 1;
    }
    let s = start * 100 + 1;
    let e = s + 99;
    return `${s.toString().padStart(4, "0")}_${e.toString().padStart(4, "0")}`;
}



const get = async (res: SourceInfo) => {
    let url = res.url
    let content = await fetch(url)
    let a =await content.text()
    let title = getTitle(res.title)
    let id = title.slice(5,8).padStart(4, "0")
    let filename = `btnews_${id}.md`
    let imgPathPrefix = path.resolve(`${__dirname}/../`)
    let imagePath = `/images/btnews/${getRangeById(id)}/${id}/`
    let filePath = path.resolve(`${__dirname}/../btnews/${getRangeById(id)}/${filename}`)
    frontmatter.title = title
    frontmatter.date = timestmapToStr(res.date)
    if (isGitHubAction) {
        ghac.setOutput('title', frontmatter.title);
        ghac.setOutput('date', frontmatter.date);
    }
    let md = await parserToMd(frontmatter,a,imgPathPrefix,imagePath)
    saveToMd(md,filePath)
}

const extractDescription = async (bvid:string):Promise<string> => {
    let url = `https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`
    let res =await fetch(url).then(res => res.json())
    frontmatter.bvid = bvid
    let description = res.data.dynamic
    return description
}

(async () => {
    
    const program = new Command();
    program.option('--bv <char>');
    program.option('--yt <char>');
    program.parse(process.argv);
    const options = program.opts();

    if (options.bv) {
        let bv = options.bv
        console.log(bv)
        if (isGitHubAction) {
            ghac.debug('bv: ' + bv);
        }
        try {
        frontmatter.description = await extractDescription(bv)
        frontmatter.bvid = bv
        } catch (e) {
            if (isGitHubAction) {
                ghac.debug('try get bv:' + bv + ' error');
            }
            console.log(e)
        }
    }
    if (options.yt) {
        let yt = options.yt
        if (isGitHubAction) {
            ghac.debug('ytid:' + yt);
        }
        if (yt.length == 11) {
            frontmatter.ytid = yt
        }
    }
    const res = await getArticle(1)    
    if (res == null) {
        throw new Error("获取文章失败")
    }
    get(res)
})();