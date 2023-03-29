type categoryArchive = {
  category: string
  archiveList: Archive[]
}
type Archive = {
  name : string
  content: string[]
}



export const categoryArchiveList: categoryArchive[] = [{
  category: "btnews",
  archiveList:[
    {
      name: "社会化抚养",
      content: ["btnews_296.md","btnews_360.md","btnews_400.md"]
    },
    {
      name: "年度新闻合订本",
      content: ["btnews_215.md","btnews_216.md","btnews_386.md"]
    },
    {
      name: "老朋友以岭药业",
      content: ["btnews_288.md","btnews_0424.md"]
    },
    {
      name: "俄乌战争合订本",
      content: ["btnews_310.md","btnews_390.md"]
    },
    {
      name: "AI与新闻",
      content: ["btnews_374.md","btnews_184.md","btnews_233.md","btnews_363.md","btnews_378.md"]
    },
    {
      name: "集成电路国产化进程",
      content: ["btnews_167.md","btnews_184.md","btnews_233.md","btnews_233.md","btnews_363.md","btnews_378.md"]
    },
    {
      name: "智利新宪法改革历史",
      content: ["btnews_301.md"]
    },
    {
      name: "戈尔巴乔夫专题",
      content:["btnews_304.md","btnews_387.md"]
    }
  ]
},
{
  category:"refnews",
  archiveList:[]
}]
// 自定义合集
export const archiveNavbar = () => {
  let al = categoryArchiveList[0].archiveList
  let res = []
  for (let i = 0; i < al.length; i++) {
    res.push({
      text: al[i].name,
      link: `/btnews/archive/${al[i].name}/`
    })
  }
  return res
}