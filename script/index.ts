
import {getArticle} from "./article"
import {parserToMd} from "./parser";
import * as path from "path";
import {saveToMd} from "./saver";
import {SourceInfo} from "./type";
import { Command } from 'commander';

let frontmatter = {
    title: "",
    date: "",
    description: "",
    tags: [],
    cnt: "0001",
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
    frontmatter.cnt = "0"+g.slice(4,7)
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
    let md = await parserToMd(frontmatter,a,imgPathPrefix,imagePath)
    saveToMd(md,filePath)
}

const extractDescription = async (bvid:string):Promise<string> => {
    let url = `https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`
    console.log(url)
    let res =await fetch(url).then(res => res.json())
    let description = res.data.dynamic
    return description
}

(async () => {
    
    const program = new Command();
    program.option('--bv <char>');
    program.parse(process.argv);
    const options = program.opts();
    
    
    if (options.bv) {
        let bv = options.bv
        console.log(bv)
        frontmatter.description = await extractDescription(bv)
    }
    // let articles = [{
    //     msgid: "2247591077",
    //     title: "睡前消息651期文稿：维珍输给Spacex 辅仁输给以岭",
    //     url: "https://mp.weixin.qq.com/s?__biz=Mzk0MTIzNTc0NQ==&mid=2247491505&idx=1&sn=5073ef5b96ea68c07f0cd267d13f7029&chksm=c2d4d4fff5a35de9df2cfabec50b06945e4ef3ec8d92257d4137e67e8ce83d45e72ac83f362c&scene=178&cur_album_id=3119370632720400390#rd",
    //     date:"1696337760",
    // }]
    // for (let i = 0; i < articles.length; i++) {
    //     await get(articles[i])
    // }
    const res = await getArticle(1)
    
    if (res == null) {
        throw new Error("获取文章失败")
    }
    get(res)
    
})();



