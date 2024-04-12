import { Options } from "..";
import { BedtimeNewsFrontmatter, SourceInfo } from "../interfaces"
import dayjs from "dayjs";
import { LogToInfo } from "./index";
import fetchDescriptionByBV from "./fetchDescriptionByBV";

export async function buildFrontmatter(source:SourceInfo,options:Options):Promise<BedtimeNewsFrontmatter>{
  let titlePattern = /(睡前消息|讲点黑话|参考信息)第?\d{1,4}期?文稿[:：]/
  let ans = titlePattern.exec(source.title)
  if(ans == null){
    if (options.ghac) {
      LogToInfo(`标题格式错误:${source.title}，无法匹配类型，取默认类型：other`)
    }
  }
  let title = source.title.replace(titlePattern,"")
  let catagoryPattern = /(睡前消息|讲点黑话|参考信息)/
  let catagory:string = catagoryPattern.exec(source.title)?.["0"] as keyof typeof categoryToPath
  if(options.category) {
    catagory = options.category
  }
  let indexPattern = /\d{1,4}/
  let index = source.title.match(indexPattern)?.["0"]
  if (!index) {
    index = options.index??"1"
    if (options.ghac) {
      LogToInfo(`标题格式错误:${source.title}，无法提取索引`)
    }
  }
  title = `【${catagory}${index}】${title}`
  let description = ""
  if (options.bv !== undefined) {
    description = await fetchDescriptionByBV(options.bv)
  }
  return {
    title: title,
    date: dayjs.unix(parseInt(source.date)).toISOString(),
    category: categoryToPath[catagory as keyof typeof categoryToPath]??catagory,
    description: description,
    tags: [],
    index: index,
    bvid: options.bv??"",
    ytid: options.yt??"",
  }
}

const categoryToPath = {
  "睡前消息":"btnews",
  "讲点黑话":"commercial",
  "高见":"opinion",
  "参考信息":"refnews",

}