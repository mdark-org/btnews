import {getArticle} from "./article"
import {parserToMd} from "./parser";
import * as path from "path";
import {saveToMd} from "./saver";
import {SourceInfo} from "./type";

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
    let imgPathPrefix = path.resolve(`${__dirname}/../docs/.vuepress/public/`)
    let imagePath = `/images/btnews/${getRangeById(id)}/${id}/`
    let filePath = path.resolve(`${__dirname}/../docs//btnews/${getRangeById(id)}/${filename}`)


    let md = await parserToMd(title,timestmapToStr(res.date),a,imgPathPrefix,imagePath)
    saveToMd(md,filePath)
}

(async () => {

    // let articles = [{
    //     msgid: "2247591077",
    //     title: "睡前消息576期文稿：新冠保险不赔钱 香港内地是一家",
    //     url: "https://mp.weixin.qq.com/s/CUHtqioAX0yD4LYCzu6xPw",
    //     date:"1681445700",
    // }]
    // for (let i = 0; i < articles.length; i++) {
    //     await get(articles[i])
    // }

    // 获取最新文章
    const res = await getArticle(1)
    if (res == null) {
        throw new Error("获取文章失败")
    }
    await get(res)
})();

