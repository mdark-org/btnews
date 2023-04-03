import {getArticle} from "./article"
import {parserToMd} from "./parser";
import * as path from "path";
import {saveToMd} from "./saver";

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

(async () => {
    const res = await getArticle(2)
    if (res == undefined){
        console.log("error")
        return
    }
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
})();

