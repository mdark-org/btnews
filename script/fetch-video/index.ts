
import { Command } from 'commander';
import * as ghac from '@actions/core';
import fs from 'fs'
const regex =/【(睡前消息|高见|讲点黑话)(\d{2,4})】(.+)/
const categoryMap = {
  '睡前消息': 'btnews',
  '高见': 'opinion',
  '讲点黑话': 'commercial'
}

const isGitHubAction = process.env.GITHUB_ACTIONS


const program = new Command();
function getOptions() {
  program
    .option('--bv [string]')
    .option('--category [string]', 'category');
  const options = program.opts();
  program.parse(process.argv);
  const bv = options.bv!==""?(typeof options.bv == "boolean" ?undefined:options.bv):undefined;
  const category = options.catagory!==""?(typeof options.bv == "boolean" ?undefined:options.catagory):undefined;
  return {
    bv,
    category
  }
}

export const options = getOptions()
console.log(options)

const categoryToBiliMap = {
  'btnews': {
    mid: '316568752',
    keywords: '睡前消息'
  },
  'opinion': {
    mid: '59104725',
    keywords: '高见'
  },
  'commercial': {
    mid: '64219557',
    keywords: '讲点黑话'
  }
} as const

async function getNewestVideoByCategory(category?: (keyof typeof categoryToBiliMap)) {
  let _category = category ?? 'btnews'
  const res = await fetch(`https://api.bilibili.com/x/series/recArchivesByKeywords?mid=${categoryToBiliMap[_category].mid}&keywords=${categoryToBiliMap[_category].keywords}`)
  const data = await res.json()
  const video = data.data.archives[0]
  const bvid = video.bvid
  return bvid
}

function getPathAndIndexByTitle(title:string) {
  const [, type, index ] = regex.exec(title)!
  const category = categoryMap[type as keyof typeof categoryMap]
  const intIdx = parseInt(index)
  const rest = intIdx%100 > 0 ? 0 : 1
  const start = (Math.floor(intIdx/100) * 100 + rest).toString().padStart(4, '0')
  const end = (Math.ceil(intIdx/100) * 100).toString().padStart(4, '0')
  const current = intIdx.toString().padStart(4, '0')
  const p =   `docs/btnews/${category}/${start}_${end}/${category}_${current}.md`
  return {
    p,
    index: intIdx,
    category
  }
}

async function main() {
  // options
  let bvid = options.bv

  if(!options.bv) {
    bvid = await getNewestVideoByCategory(options.category)
  }

  const detail = await fetch(`https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`).then(res => res.json())
  const title = detail.data.title
  const description = detail.data.desc
  const pubtime =  detail.data.pubdate // timestamp 10
  const {p, category, index} = getPathAndIndexByTitle(title)
  // const index 889
  let exist = false
  if(fs.existsSync(p)) {
    exist = true
  }
  ghac.setOutput('exist', exist);
  ghac.setOutput('filepath', p);
  ghac.setOutput('index', index);
  ghac.setOutput('title', title);
  ghac.setOutput('bvid', bvid);
  ghac.setOutput('date', pubtime);
  ghac.setOutput('description', description);
  ghac.setOutput('category', category);
}


main()