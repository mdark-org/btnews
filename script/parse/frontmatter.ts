
import { BedtimeNewsFrontmatter } from '../interfaces';
import dayjs from "dayjs";
import {options, Options} from "..";
import fetchDescriptionByBV from "../utils/fetchDescriptionByBV";
import { LogToInfo } from "../utils";

export async function extractFrontMatter(source:cheerio.Root,option:Options):Promise<BedtimeNewsFrontmatter>{
  const $ = source
  const sourceTitle = option.title? option.title : $("#activity-name").text()
  let date:null|string = null

  try {
    date = option.date? dayjs(option.date).toISOString() : dayjs($("#publish_time").text()).toISOString()
  }catch (e){
    if (option.ghac) {
      LogToInfo(`无法提取日期，取当前日期`)
    }
    date = dayjs().toISOString()
  }
  let titlePattern = /(睡前消息|讲点黑话|参考信息|高见)第?\d{1,4}(\.5)?期?文稿[:：]/

  let ans = titlePattern.exec(sourceTitle)
  if(ans == null){
    if (option.ghac && !option.title) {
      LogToInfo(`标题格式错误:${sourceTitle}，无法匹配类型，取默认类型：other`)
    }
  }

  let title = sourceTitle.replace(titlePattern,"")
  let catagoryPattern = /(睡前消息|讲点黑话|参考信息|高见)/
  let catagory = catagoryPattern.exec(sourceTitle)?.["0"] as keyof typeof categoryToPath
  if(options.category) {
    catagory = options.category
  }
  let indexPattern = /\d{1,4}(\.5)?/
  let index= sourceTitle.match(indexPattern)?.["0"]
  if (!index) {
    index = options.index??"1"
    if (option.ghac && !option.title) {
      LogToInfo(`标题格式错误:${sourceTitle}，无法提取索引`)
    }
  }
  if(index?.includes(".5")) {
    index = parseInt(index.replace(".5","")).toString().padStart(4,'0') + "_5"
  }else {
    index = parseInt(index!).toString().padStart(4,'0')
  }

  title = option.title ? option.title : `【${catagory}${index}】${title.trim()}`
  let description = ""
  if (option.bv !== undefined) {
    description = await fetchDescriptionByBV(option.bv)
  }

  return {
    title: title,
    date: date,
    category: categoryToPath[catagory as keyof typeof categoryToPath]??catagory,
    description: description,
    tags: [],
    index: index!,
    bvid: option.bv??"",
    ytid: option.yt??"",
  }
}


const categoryToPath = {
  "睡前消息":"main",
  "讲点黑话":"commercial",
  "高见":"opinion",
  "参考信息":"reference",
}